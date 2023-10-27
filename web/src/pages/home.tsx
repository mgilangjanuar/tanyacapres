import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

dayjs.extend(relativeTime)

const PEOPLE: {
  imgUrl: string,
  name: string,
  message?: string,
  number: number,
  date: string
}[] = [
  {
    imgUrl: 'https://source.boringavatars.com/beam/50/653b0dfdf33d59003f58fc58?colors=ff813f,ffdd02,ffa779,ffe74f,e1e1e1',
    name: 'Han Sena',
    number: 50000,
    message: 'Great works!',
    date: '2023-10-27T01:11:00.000Z'
  },
  {
    imgUrl: 'https://source.boringavatars.com/beam/50/65375eb6850b79003fed1601?colors=ff813f,ffdd02,ffa779,ffe74f,e1e1e1',
    name: 'Boteng',
    number: 30000,
    date: '2023-10-24T06:07:00.000Z'
  },
  {
    imgUrl: 'https://source.boringavatars.com/beam/50/653756c449c643003f1d3692?colors=ff813f,ffdd02,ffa779,ffe74f,e1e1e1',
    name: 'Bryan',
    number: 10000,
    message: 'Gas',
    date: '2023-10-24T05:32:00.000Z'
  },
  {
    imgUrl: 'https://source.boringavatars.com/beam/50/65373a4749c643003f1ce947?colors=ff813f,ffdd02,ffa779,ffe74f,e1e1e1',
    name: 'Firdaus',
    number: 10000,
    message: 'Tinggal satu paslon lagi nih 🥰',
    date: '2023-10-24T03:31:00.000Z'
  },
  {
    imgUrl: 'https://source.boringavatars.com/beam/50/653636a6e52903003f57b74c?colors=ff813f,ffdd02,ffa779,ffe74f,e1e1e1',
    name: 'Seseorang',
    number: 1,
    date: '2023-10-23T09:03:00.000Z'
  },
  {
    imgUrl: 'https://source.boringavatars.com/beam/50/6535eeaee52903003f57095a?colors=ff813f,ffdd02,ffa779,ffe74f,e1e1e1',
    name: 'Indra Zulfi',
    message: 'Keep it up mas!',
    number: 200000,
    date: '2023-10-23T03:55:00.000Z'
  },
  {
    imgUrl: 'https://source.boringavatars.com/beam/50/6535d459e52903003f56c03e?colors=ff813f,ffdd02,ffa779,ffe74f,e1e1e1',
    name: 'Seseorang',
    message: 'Genjot terus bang!',
    number: 30000,
    date: '2023-10-23T02:03:00.000Z'
  },
  {
    imgUrl: 'https://source.boringavatars.com/beam/50/6535cad9e52903003f56a1cf?colors=ff813f,ffdd02,ffa779,ffe74f,e1e1e1',
    name: 'Seseorang',
    number: 30000,
    date: '2023-10-23T01:22:00.000Z'
  }
]

export default function Home() {
  const [cost, setCost] = useState<{ fund: number, usage: number }>()

  useEffect(() => {
    (async () => {
      const calculateCost = async () => {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/usage`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (!resp.ok) {
          return
        }
        const json = await resp.json()
        return json.total
      }
      const calculateFund = async () => {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/donate`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (!resp.ok) {
          return
        }
        const json = await resp.json()
        return json.data.amount
      }
      setCost({
        fund: await calculateFund(),
        usage: await calculateCost()
      })
    })()
  }, [])

  return <div className="container mx-auto py-2 relative">
    <div className="fixed bottom-0 right-0 z-50 py-1 px-2 bg-neutral text-neutral-content rounded-tl-lg">
      <p className="text-xs">
        <a href="https://x.com/mgilangjanuar" target="_blank" rel="noopener noreferrer" className="link-hover">@mgilangjanuar</a>
      </p>
    </div>
    <div>
      <div className="grid grid-cols-12 py-4">
        <div className="col-span-12 lg:col-span-8 lg:pr-6">
          <div className="hidden lg:block">
            <img src="/logo.png" className="w-full max-w-[236px] mx-auto" alt="" />
          </div>
          <div className="lg:card bg-base-100 lg:shadow-inner lg:mt-10">
            <div className="lg:card-body prose max-w-full">
              <h2 className="card-title text-warning">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 stroke-2" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M12 9v4" />
                  <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" />
                  <path d="M12 16h.01" />
                </svg>
                Perhatian!
              </h2>
              <p className="mb-0">
                Aplikasi ini menggunakan AI yang dibuat untuk membantu masyarakat dalam mengetahui visi dan misi dari para calon presiden dan wakil presiden Indonesia tahun 2024. Selalu lakukan pengecekan ulang terhadap informasi yang diberikan pada rujukan utamanya.
              </p>
              <ul className="md:mt-0 italic">
                <li>
                  <a href="https://mmc.tirto.id/documents/2023/10/20/1241-amin-visi-misi-program.pdf?x=2676" target="_blank" rel="noopener noreferrer" className="link-hover font-normal">
                    Visi Misi Anies - Muhaimin
                  </a>
                </li>
                <li>
                  <a href="https://drive.google.com/file/d/1-olOvmrwXLJjjlE9B_oTnCMMRVQYSuse/view" target="_blank" rel="noopener noreferrer" className="link-hover font-normal">
                    Visi Misi Ganjar - Mahfud
                  </a>
                </li>
                <li>
                  <a href="https://drive.google.com/file/d/1V7N74FEblhyJhTSi4f1YLhV_aeqZ2LFk/view" target="_blank" rel="noopener noreferrer" className="link-hover font-normal">
                    Visi Misi Prabowo - Gibran
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="card bg-base-100 shadow-md mt-10 lg:mt-4">
            <div className="card-body">
              <div className="text-center flex gap-4 justify-center mb-4">
                <Link className="hover:cursor-pointer tooltip tooltip-open" data-tip="Tanya AMIN" to={`/ask/amin`}>
                  <img src="/amin.png" alt="" className="w-full max-w-[128px] mask mask-circle" />
                </Link>
                <Link className="hover:cursor-pointer tooltip tooltip-open" data-tip="Tanya GAMA" to={`/ask/gama`}>
                  <img src="/gama.png" alt="" className="w-full max-w-[128px] mask mask-circle" />
                </Link>
                <Link className="hover:cursor-pointer tooltip tooltip-open" data-tip="Tanya PRABU" to={`/ask/prabu`}>
                  <img src="/prabu.png" alt="" className="w-full max-w-[128px] mask mask-circle" />
                </Link>
              </div>
              <div className="flex flex-row gap-4">
                <div className="divider grow mt-1.5"></div>
                <div>
                  <p className="text-gray-400">atau</p>
                </div>
                <div className="divider grow mt-1.5"></div>
              </div>
              <div className="mt-2 text-center flex gap-4 justify-center">
                <div className="indicator">
                  <span className="indicator-item badge badge-secondary">new</span>
                  <Link className="btn btn-primary btn-neutral btn-block lg:btn-wide" to="/compare">
                    Bandingkan Jawaban
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 lg:pl-6 mt-16 lg:mt-0">
          <div>
            <h3 className="text-2xl font-bold">Crowdfunding</h3>
            <p className="my-5 prose">
              Aplikasi ini dibuat secara gratis dan <a className="font-normal link-hover" href="https://github.com/mgilangjanuar/tanyacapres" target="_blank" rel="noopener noreferrer"><em>open source</em></a>. Seluruh donasi yang diterima akan digunakan untuk membiayai server, penggunaan API, dan biaya operasional lainnya.
            </p>
            <p className="my-5 prose">
              Dana terkumpul: <span className="font-bold">{cost?.fund ? `Rp ${cost.fund.toLocaleString()}` : 'Rp 0'}</span>
            </p>
            <p className="my-5 prose">
              Dana terpakai: <span className="font-bold">{cost?.usage ? `Rp ${(cost.usage * 15_000).toLocaleString()}` : 'Rp 0'}</span> (estimasi dari ${Number(cost?.usage.toFixed(2)).toLocaleString()})
            </p>
            <p className="my-5 prose">
              Terima kasih untuk para donatur yang telah membantu kami dalam mengembangkan aplikasi ini.
            </p>
            <div className="flex flex-col gap-4">
              {PEOPLE.map((person, index) => <div key={index} className="card card-compact shadow-md">
                <div className="card-body">
                  <div className="flex gap-4 items-center">
                    <div>
                      <img src={person.imgUrl} className="mask mask-circle w-full max-w-[46px]" alt="" />
                    </div>
                    <div className="flex flex-col grow">
                      <h3 className="text-xl font-bold">{person.name}</h3>
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="text-sm text-gray-400">{dayjs(person.date).fromNow()}</p>
                        </div>
                        <div>
                          <p className="text-md text-gray-400">Rp {person.number.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>)}
              <div>
                <a href="https://www.nihbuatjajan.com/mgilangjanuar" target="_blank"><img src="https://d4xyvrfd64gfm.cloudfront.net/buttons/default-cta.png" alt="Nih buat jajan" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}