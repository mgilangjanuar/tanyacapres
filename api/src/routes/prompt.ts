import { cosineSimilarity } from 'cosine-similarity-threshold'
import Cryptr from 'cryptr'
import { Request, Response } from 'express'
import { readFileSync } from 'fs'

const crypt = new Cryptr(process.env.SECRET || '')

const aniesPrompt = async (messages: { role: string, content: string }[]) => {
  const query = messages
    .filter(msg => msg.role === 'user' || msg.role === 'assistant')
    .map(msg => `${msg.role === 'user' ? 'Q' : 'A'}: ${msg.content}`)
    .join('\n\n')
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

  const top3 = records.slice(0, 3)
  return [
    {
      role: 'system',
      content: crypt.encrypt(`You are a helpful assistant that helps people find information from the parsed PDFs using Bahasa Indonesia. You are only can answer the question based on the documents and you can ignore the question if there is no information from the PDFs. Here are the top 3 results:

${top3.map((record, i) => `---
${i + 1}. Page ${record.page}

${record.text}
---`).join('\n\n')}`)
    },
    ...messages
      .filter(msg => msg.role === 'user' || msg.role === 'assistant')
      .map(msg => ({ ...msg, content: crypt.encrypt(msg.content) }))
  ]
}

const ganjarPrompt = async (messages: { role: string, content: string }[]) => {
  const query = messages
    .filter(msg => msg.role === 'user' || msg.role === 'assistant')
    .map(msg => `${msg.role === 'user' ? 'Q' : 'A'}: ${msg.content}`)
    .join('\n\n')
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

  const top3 = records.slice(0, 3)
  return [
    {
      role: 'system',
      content: crypt.encrypt(`You are a helpful assistant that helps people find information from the parsed PDFs using Bahasa Indonesia. You are only can answer the question based on the documents and you can ignore the question if there is no information from the PDFs. Here are the top 3 results:

${top3.map((record, i) => `---
${i + 1}. Page ${record.page}

${record.text}
---`).join('\n\n')}`)
    },
    ...messages
      .filter(msg => msg.role === 'user' || msg.role === 'assistant')
      .map(msg => ({ ...msg, content: crypt.encrypt(msg.content) }))
  ]
}

export default async function handler(req: Request, res: Response) {
  const { candidate } = req.params
  const { messages: conv } = req.body as { messages: { role: string, content: string }[] }

  if (candidate === 'amin') {
    return res.json({
      messages: await aniesPrompt(conv),
      model: 'gpt-3.5-turbo-16k',
      temperature: 0.05
    })
  }

  if (candidate === 'gama') {
    return res.json({
      messages: await ganjarPrompt(conv),
      model: 'gpt-3.5-turbo-16k',
      temperature: 0.05
    })
  }

  return res.status(404).json({ error: 'Not found' })
}
