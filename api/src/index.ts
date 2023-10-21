import { cosineSimilarity } from 'cosine-similarity-threshold'
import Cryptr from 'cryptr'
import express from 'express'
import { readFileSync } from 'fs'

const crypt = new Cryptr(process.env.SECRET || '')

const aniesPrompt = async (query: string) => {
  const emresp = await fetch('https://api.openai.com/v1/embeddings', {
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: query,
    }),
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    method: 'POST'
  })
  if (!emresp.ok) {
    throw new Error(await emresp.text())
  }

  const emrespOpenai = await emresp.json()
  const embeddings = emrespOpenai.data[0].embedding

  let records: any[] = JSON.parse(readFileSync('./docs/objects/anies.obj.json').toString())
  records = records.map(record => ({
    ...record,
    'similarity': cosineSimilarity(record.embeddings, embeddings)
  }))
  records.sort((a, b) => (b as any & { similarity: number }).similarity - (a as any & { similarity: number }).similarity)

  const top3 = records.slice(0, 3)
  return [
    {
      role: 'system',
      content: crypt.encrypt(`You are a helpful assistant that helps people find information from the parsed PDFs. Here are the top 3 results:

${top3.map((record, i) => `---
${i + 1}. Page ${record.page}

${record.text}
---`).join('\n\n')}`)
    },
    {
      role: 'user',
      content: crypt.encrypt(query)
    }
  ]
}

const ganjarPrompt = async (query: string) => {
  const emresp = await fetch('https://api.openai.com/v1/embeddings', {
    body: JSON.stringify({
      model: 'text-embedding-ada-002',
      input: query,
    }),
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    method: 'POST'
  })
  if (!emresp.ok) {
    throw new Error(await emresp.text())
  }

  const emrespOpenai = await emresp.json()
  const embeddings = emrespOpenai.data[0].embedding

  let records: any[] = JSON.parse(readFileSync('./docs/objects/ganjar.obj.json').toString())
  records = records.map(record => ({
    ...record,
    'similarity': cosineSimilarity(record.embeddings, embeddings)
  }))
  records.sort((a, b) => (b as any & { similarity: number }).similarity - (a as any & { similarity: number }).similarity)

  const top3 = records.slice(0, 3)
  return [
    {
      role: 'system',
      content: crypt.encrypt(`You are a helpful assistant that helps people find information from the parsed PDFs. Here are the top 3 results:

${top3.map((record, i) => `---
${i + 1}. Page ${record.page}

${record.text}
---`).join('\n\n')}`)
    },
    {
      role: 'user',
      content: crypt.encrypt(query)
    }
  ]
}

const app = express()
app.use(express.json())

app.post('/prompt/:candidate', async (req, res) => {
  const { candidate } = req.params
  const { encMessages, prompt } = req.body as { encMessages: { role: string, content: string }[], prompt: string }

  if (candidate === 'anies') {
    const messages = !encMessages?.length ? await aniesPrompt(req.body.content) : [...encMessages, {
      role: 'user',
      content: crypt.encrypt(prompt)
    }]
    return res.json({ messages })
  }

  if (candidate === 'ganjar') {
    const messages = !encMessages?.length ? await ganjarPrompt(req.body.content) : [...encMessages, {
      role: 'user',
      content: crypt.encrypt(prompt)
    }]
    return res.json({ messages })
  }

  return res.status(404).json({ message: 'Candidate not found' })
})

app.post('/decrypt', async (req, res) => {
  const { key } = req.query
  if (key !== process.env.DECRYPT_KEY) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { messages } = req.body as { messages: { role: string, content: string }[] }
  return res.send({
    messages: messages.map(msg => ({
      ...msg,
      content: crypt.decrypt(msg.content)
    })),
    model: 'gpt-3.5-turbo-16k',
    temperature: 0.15
  })
})

app.listen(3008, () => console.log('Listening on port 3008'))