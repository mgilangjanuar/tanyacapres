import Cryptr from 'cryptr'
import { Request, Response } from 'express'

const crypt = new Cryptr(process.env.SECRET || '')

export default async function handler(req: Request, res: Response) {
  const { authorization } = req.headers
  if (authorization !== process.env.DECRYPT_KEY) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { messages } = req.body as { messages: { role: string, content: string }[] }
  return res.send({
    messages: messages.map(msg => ({
      ...msg,
      content: crypt.decrypt(msg.content)
    })),
  })
}
