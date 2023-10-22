import express from 'express'
import cors from 'cors'
import decrypt from './routes/decrypt'
import prompt from './routes/prompt'

const app = express()
app.use(cors())
app.use(express.json())

app.post('/prompt/:candidate', prompt)
app.post('/decrypt', decrypt)

app.listen(3008, () => console.log('Listening on port 3008'))