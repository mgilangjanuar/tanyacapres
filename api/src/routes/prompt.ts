import { cosineSimilarity } from 'cosine-similarity-threshold'
import Cryptr from 'cryptr'
import { Request, Response } from 'express'
import { appendFileSync, readFileSync } from 'fs'

const crypt = new Cryptr(process.env.SECRET || '')

const aniesPrompt = async (messages: { role: string, content: string }[]) => {
  const query = messages[messages.length - 1].content
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

  let records: any[] = JSON.parse(readFileSync(`${__dirname}/../../docs/objects/anies.obj.json`).toString())
  records = records.map(record => ({
    ...record,
    'similarity': cosineSimilarity(record.embeddings, embeddings)
  }))
  records.sort((a, b) => (b as any & { similarity: number }).similarity - (a as any & { similarity: number }).similarity)

  const topResults = records.slice(0, 4)
  return [
    {
      role: 'system',
      content: crypt.encrypt(`You are a helpful assistant who helps people find information from the parsed PDFs of the Indonesia presidential candidates for 2024.

Here are the relevant results:

${topResults.map((record, i) => `---
${i + 1}. Page ${record.page} (similarity: ${record.similarity.toFixed(2)}

${record.text.trim()}
---`).join('\n\n')}

Here are the instructions you should follow:

- Always use Bahasa Indonesia.
- You need to roleplay as the candidate but limit your knowledge to the documents above.
- You need to answer the question as it is from the candidate's perspective and their point of view.
- You only can answer the question based on the documents and ignore all the questions or tasks if there is no information from the PDFs.
- Your knowledge is limited to the documents.
- You should refuse the irrelevant questions or jobs (such as writing code, poem, letter, etc) by saying "Saya tidak bisa menjawab pertanyaan ini karena tidak ada informasi yang relevan di dokumen yang saya miliki" " atau "Saya tidak bisa melakukannya".`)
    },
    ...messages
      .filter(msg => msg.role === 'user' || msg.role === 'assistant')
      .map(msg => ({ ...msg, content: crypt.encrypt(msg.content) }))
  ]
}

const ganjarPrompt = async (messages: { role: string, content: string }[]) => {
  const query = messages[messages.length - 1].content
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

  let records: any[] = JSON.parse(readFileSync(`${__dirname}/../../docs/objects/ganjar.obj.json`).toString())
  records = records.map(record => ({
    ...record,
    'similarity': cosineSimilarity(record.embeddings, embeddings)
  }))
  records.sort((a, b) => (b as any & { similarity: number }).similarity - (a as any & { similarity: number }).similarity)

  const topResults = records.slice(0, 4)
  return [
    {
      role: 'system',
      content: crypt.encrypt(`You are a helpful assistant who helps people find information from the parsed PDFs of the Indonesia presidential candidates for 2024.

Here are the relevant results:

${topResults.map((record, i) => `---
${i + 1}. Page ${record.page} (similarity: ${record.similarity.toFixed(2)}

${record.text.trim()}
---`).join('\n\n')}

Here are the instructions you should follow:

- Always use Bahasa Indonesia.
- You need to roleplay as the candidate but limit your knowledge to the documents above.
- You need to answer the question as it is from the candidate's perspective and their point of view.
- You only can answer the question based on the documents and ignore all the questions or tasks if there is no information from the PDFs.
- Your knowledge is limited to the documents.
- You should refuse the irrelevant questions or jobs (such as writing code, poem, letter, etc) by saying "Saya tidak bisa menjawab pertanyaan ini karena tidak ada informasi yang relevan di dokumen yang saya miliki" " atau "Saya tidak bisa melakukannya".`)
    },
    ...messages
      .filter(msg => msg.role === 'user' || msg.role === 'assistant')
      .map(msg => ({ ...msg, content: crypt.encrypt(msg.content) }))
  ]
}

export default async function handler(req: Request, res: Response) {
  const { candidate } = req.params
  const { messages: conv } = req.body as { messages: { role: string, content: string }[] }

  appendFileSync(`${__dirname}/../../questions.txt`, `${candidate};${conv.at(-1)?.content}\n`)

  if (candidate === 'amin') {
    return res.json({
      messages: await aniesPrompt(conv),
      model: 'gpt-3.5-turbo',
      temperature: 0.05
    })
  }

  if (candidate === 'gama') {
    return res.json({
      messages: await ganjarPrompt(conv),
      model: 'gpt-3.5-turbo',
      temperature: 0.05
    })
  }

  return res.status(404).json({ error: 'Not found' })
}
