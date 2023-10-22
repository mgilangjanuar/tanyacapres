import express from 'express'
import decrypt from './routes/decrypt'
import prompt from './routes/prompt'

const app = express()
app.use(express.json())

app.post('/prompt/:candidate', prompt)
app.post('/decrypt', decrypt)

app.listen(3008, () => console.log('Listening on port 3008'))