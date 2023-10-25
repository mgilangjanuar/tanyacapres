import { readFileSync, writeFileSync } from 'fs'
import PdfParse from 'pdf-parse'

const _getEmbeddingsAnies = async () => {
  for (let i = 0; i < 148; i++) {
    const file = `./docs/splitted/anies/1241-amin-visi-misi-program-${i + 1}.pdf`
    const { text } = await PdfParse(Buffer.from(readFileSync(file)))

    const emresp = await fetch('https://api.openai.com/v1/embeddings', {
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: text
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
    writeFileSync(`./docs/vectors/anies/1241-amin-visi-misi-program-${i + 1}.pdf`, embeddings.toString())
  }
}

const _getEmbeddingsGanjar = async () => {
  for (let i = 0; i < 33; i++) {
    const file = `./docs/splitted/ganjar/Visi-Misi-Ganjar-Pranowo-Mahfud-MD-v2-${i + 1}.pdf`
    const { text } = await PdfParse(Buffer.from(readFileSync(file)))

    const emresp = await fetch('https://api.openai.com/v1/embeddings', {
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: text
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
    writeFileSync(`./docs/vectors/ganjar/Visi-Misi-Ganjar-Pranowo-Mahfud-MD-v2-${i + 1}.pdf`, embeddings.toString())
  }
}

const _getEmbeddingsPrabowo = async () => {
  for (let i = 0; i < 88; i++) {
    const file = `./docs/splitted/prabowo/VISI_MISI_INDONESIA_MAJU_2024_FINAL-${i + 1}.pdf`
    const { text } = await PdfParse(Buffer.from(readFileSync(file)))

    const emresp = await fetch('https://api.openai.com/v1/embeddings', {
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: text
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
    writeFileSync(`./docs/vectors/prabowo/VISI_MISI_INDONESIA_MAJU_2024_FINAL-${i + 1}.pdf`, embeddings.toString())
  }
}

const _aniesObj = async () => {
  const records: any[] = []
  for (let i = 0; i < 148; i++) {
    const file = `./docs/splitted/anies/1241-amin-visi-misi-program-${i + 1}.pdf`
    const { text } = await PdfParse(Buffer.from(readFileSync(file)))
    records.push({
      page: i + 1,
      text,
      embeddings: JSON.parse(`[${readFileSync(`./docs/vectors/anies/1241-amin-visi-misi-program-${i + 1}.pdf`).toString()}]`)
    })
  }

  writeFileSync('./docs/objects/anies.obj.json', JSON.stringify(records))
}

const _ganjarObj = async () => {
  const records: any[] = []
  for (let i = 0; i < 33; i++) {
    const file = `./docs/splitted/ganjar/Visi-Misi-Ganjar-Pranowo-Mahfud-MD-v2-${i + 1}.pdf`
    const { text } = await PdfParse(Buffer.from(readFileSync(file)))
    records.push({
      page: i + 1,
      text,
      embeddings: JSON.parse(`[${readFileSync(`./docs/vectors/ganjar/Visi-Misi-Ganjar-Pranowo-Mahfud-MD-v2-${i + 1}.pdf`).toString()}]`)
    })
  }

  writeFileSync('./docs/objects/ganjar.obj.json', JSON.stringify(records))
}

const _prabowoObj = async () => {
  const records: any[] = []
  for (let i = 0; i < 88; i++) {
    const file = `./docs/splitted/prabowo/VISI_MISI_INDONESIA_MAJU_2024_FINAL-${i + 1}.pdf`
    const { text } = await PdfParse(Buffer.from(readFileSync(file)))
    records.push({
      page: i + 1,
      text,
      embeddings: JSON.parse(`[${readFileSync(`./docs/vectors/prabowo/VISI_MISI_INDONESIA_MAJU_2024_FINAL-${i + 1}.pdf`).toString()}]`)
    })
  }

  writeFileSync('./docs/objects/prabowo.obj.json', JSON.stringify(records))
}

(async () => {
  // await _prabowoObj()
})()