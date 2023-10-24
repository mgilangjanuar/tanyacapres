import cors from 'cors'
import express from 'express'
import decrypt from './routes/decrypt'
import prompt from './routes/prompt'
import usage from './routes/usage'

const app = express()
app.use(cors())
app.use(express.json())

app.post('/prompt/:candidate', prompt)
app.post('/decrypt', decrypt)
app.get('/usage', usage)

app.listen(3008, () => console.log('Listening on port 3008'))