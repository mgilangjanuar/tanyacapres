import { Request, Response } from 'express'

export default async function handler(_: Request, res: Response) {
  const resp = await fetch(`https://www.nihbuatjajan.com/api/v1/user/balance?api_token=${process.env.NBJ_KEY}`, {
    headers: {
      'Content-Type': 'application/json',
      cookie: 'connect.sid=s%3AE644s7W_SKehq8Wx54O_tf2HZ9XqkQQv.3dtswD8avefezAdr8Dep8OLFvW5x%2FCg%2F1mSkM9%2Bc9qE; crisp-client%2Fsession%2Fa71f99e1-b834-41f2-acfd-a6128234d1ab=session_9288330f-6ead-4ba6-9a8c-4223b671baf8'
    }
  })

  if (!resp.ok) {
    return res.status(500).json({ error: await resp.text() })
  }

  const data = await resp.json()
  return res.send(data)
}