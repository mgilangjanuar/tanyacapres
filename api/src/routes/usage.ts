import dayjs from 'dayjs'
import { Request, Response } from 'express'
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'fs'

export default async function handler(_: Request, res: Response) {
  let isNeedToFetch = true
  if (existsSync(`${__dirname}/../../usages/${dayjs().format('YYYY-MM-DD')}.json`)) {
    const date = JSON.parse(readFileSync(`${__dirname}/../../usages/${dayjs().format('YYYY-MM-DD')}.json`).toString()).summary.date
    if (dayjs().diff(dayjs(date), 'minute') < 15) {
      isNeedToFetch = false
    }
  }

  if (isNeedToFetch) {
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
        price: data.data.filter(d => d.snapshot_id.startsWith('text-embedding-ada-002')).reduce((acc: number, curr: any) => acc + curr.n_requests + curr.n_context_tokens_total + curr.n_generated_tokens_total, 0) * (0.0001 / 1000)
      },
      'gpt-3.5-turbo-16k': {
        requests: data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_requests, 0),
        prompts: data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_context_tokens_total, 0),
        completions: data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_generated_tokens_total, 0),
        total: data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_requests + curr.n_context_tokens_total + curr.n_generated_tokens_total, 0),
        price: data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_context_tokens_total, 0) * (0.003 / 1000)
          + data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_generated_tokens_total, 0) * 0.004 / 1000
      },
      'gpt-3.5-turbo': {
        requests: data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo') && !d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_requests, 0),
        prompts: data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo') && !d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_context_tokens_total, 0),
        completions: data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo') && !d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_generated_tokens_total, 0),
        total: data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo') && !d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_requests + curr.n_context_tokens_total + curr.n_generated_tokens_total, 0),
        price: data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo') && !d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_context_tokens_total, 0) * (0.0015 / 1000)
          + data.data.filter(d => d.snapshot_id.startsWith('gpt-3.5-turbo-16k')).reduce((acc: number, curr: any) => acc + curr.n_generated_tokens_total, 0) * (0.002 / 1000)
      },
    }
    const priceTotal = summary['text-embedding-ada-002'].price + summary['gpt-3.5-turbo-16k'].price + summary['gpt-3.5-turbo'].price
    const result = {
      summary: {
        date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        priceTotal,
        ...summary
      },
      details: data
    }

    if (existsSync(`${__dirname}/../../usages/${dayjs().format('YYYY-MM-DD')}.json`)) {
      rmSync(`${__dirname}/../../usages/${dayjs().format('YYYY-MM-DD')}.json`)
    }
    writeFileSync(`${__dirname}/../../usages/${dayjs().format('YYYY-MM-DD')}.json`, JSON.stringify(result, null, 2))
  }

  const usageFiles = readdirSync(`${__dirname}/../../usages`)
  const usages: { [date: string]: number } = usageFiles.filter(f => f.endsWith('.json')).reduce((acc, curr) => {
    return { ...acc, [curr.replace('.json', '')]: JSON.parse(readFileSync(`${__dirname}/../../usages/${curr}`).toString()).summary.priceTotal }
  }, {})
  return res.send({
    usages,
    total: Object.values(usages).reduce((acc: number, curr: number) => acc + curr, 0)
  })
}