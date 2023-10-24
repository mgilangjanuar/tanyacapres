import dayjs from 'dayjs'
import { Request, Response } from 'express'

export default async function handler(_: Request, res: Response) {
  const resp = await fetch(`https://api.openai.com/v1/usage?date=${dayjs().format('YYYY-MM-DD')}&user_public_id=${process.env.OPENAI_USER}`, {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${process.env.OPENAI_SESSION_KEY}`
    },
    method: 'GET'
  })

  if (!resp.ok) {
    return res.status(500).json({ error: await resp.text() })
  }

  const data = await resp.json()
  const summary = {
    'text-embedding-ada-002': {
      requests: data.data.filter(d => d.snapshot_id.startsWith('text-embedding-ada-002')).reduce((acc: number, curr: any) => acc + curr.n_requests, 0),
      prompts: data.data.filter(d => d.snapshot_id.startsWith('text-embedding-ada-002')).reduce((acc: number, curr: any) => acc + curr.n_context_tokens_total, 0),
      completions: data.data.filter(d => d.snapshot_id.startsWith('text-embedding-ada-002')).reduce((acc: number, curr: any) => acc + curr.n_generated_tokens_total, 0),
      total: data.data.filter(d => d.snapshot_id.startsWith('text-embedding-ada-002')).reduce((acc: number, curr: any) => acc + curr.n_requests + curr.n_context_tokens_total + curr.n_generated_tokens_total, 0),
      price: data.data.filter(d => d.snapshot_id.startsWith('text-embedding-ada-002')).reduce((acc: number, curr: any) => acc + curr.n_requests + curr.n_context_tokens_total + curr.n_generated_tokens_total, 0) * 0.0001
    },
    'gpt-3.5-turbo-16k': {
      requests: data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_requests, 0),
      prompts: data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_context_tokens_total, 0),
      completions: data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_generated_tokens_total, 0),
      total: data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_requests + curr.n_context_tokens_total + curr.n_generated_tokens_total, 0),
      price: data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_context_tokens_total, 0) * 0.003 + data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_generated_tokens_total, 0) * 0.004
    },
    'gpt-3.5-turbo': {
      requests: data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo') && !d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_requests, 0),
      prompts: data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo') && !d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_context_tokens_total, 0),
      completions: data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo') && !d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_generated_tokens_total, 0),
      total: data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo') && !d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_requests + curr.n_context_tokens_total + curr.n_generated_tokens_total, 0),
      price: data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo') && !d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_context_tokens_total, 0) * 0.0015 + data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_generated_tokens_total, 0) * 0.002
    },
  }
  return res.send({
    summary: {
      priceTotal: summary['text-embedding-ada-002'].price + summary['gpt-3.5-turbo-16k'].price + summary['gpt-3.5-turbo'].price,
      ...summary
    },
    details: data
  })
}