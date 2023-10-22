import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser'

export const config = {
  runtime: 'edge'
}

export default async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(
      null,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
          'Access-Control-Allow-Credentials': 'true'
        }
      }
    )
  }

  const { messages, model, temperature, apiKey } = await req.json() as {
    messages: { role: string, content: string }[],
    model: string,
    temperature: number,
    file: string,
    vacancy?: any,
    coverLetter?: string,
    apiKey?: string
  }
  if (!messages?.length) return new Response(JSON.stringify({
    error: 'Missing messages'
  }), { status: 400 })

  const decrypt = await fetch('https://tanyacapres-api.appledore.dev/decrypt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: process.env.DECRYPT_KEY,
    },
    body: JSON.stringify({
      messages
    }),
  })
  if (!decrypt.ok) return new Response(JSON.stringify({
    error: 'Wrong messages'
  }), { status: 400 })

  const { messages: decryptedMessages } = await decrypt.json()

  const payload = {
    model: model,
    stream: true,
    temperature,
    messages: decryptedMessages,
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey || process.env.OPENAI_API_KEY || ''}`,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  })

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const customReadable = new ReadableStream({
    async start(controller) {
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === 'event') {
          const data = event.data
          if (data === '[DONE]') {
            // Signal the end of the stream
            controller.enqueue(encoder.encode('[DONE]'))
          }
          controller.enqueue(encoder.encode(data))
        }
      }
      const parser = createParser(onParse)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for await (const chunk of res.body as unknown as AsyncIterable<Uint8Array>) {
        parser.feed(decoder.decode(chunk))
      }
    },
  })
  const transformStream = new TransformStream({
    async transform(chunk, controller) {
      const content = decoder.decode(chunk)
      if (content === '[DONE]') {
        console.log('done, closing stream...')
        controller.terminate()
        return
      }
      const results = `${content}\n\n`
      controller.enqueue(encoder.encode(results))
    },
  })
  return new Response(customReadable.pipeThrough(transformStream))
}