import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect, useRef, useState } from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { Link, useParams } from 'react-router-dom'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import remarkGfm from 'remark-gfm'

dayjs.extend(relativeTime)

export default function Home() {
  const params = useParams()
  const [candidate, setCandidate] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)
  const ref = useRef<any>()
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([])

  useEffect(() => {
    setCandidate(params.candidate)
  }, [params.candidate])

  useEffect(() => {
    if (candidate) {
      window.scrollTo(0, document.body.scrollHeight)
    }
  }, [candidate])

  return <div className="container mx-auto py-2 relative">
    <div>
      {!candidate ? <div className="grid grid-cols-12 py-4">
        <div className="col-span-12 lg:col-span-8 lg:pr-6">
          <div className="fixed bottom-0 right-0 z-50 py-1 px-2 bg-neutral text-neutral-content rounded-tl-lg">
            <p className="text-xs">
              by <a href="https://x.com/mgilangjanuar" target="_blank" rel="noopener noreferrer" className="link-hover">@mgilangjanuar</a>
            </p>
          </div>
          <div className="hidden lg:block">
            <img src="/logo.png" className="w-full max-w-[236px] mx-auto" alt="" />
          </div>
          <div className="lg:card bg-base-100 lg:shadow-inner lg:mt-10">
            <div className="lg:card-body prose max-w-full text-gray-500">
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
              <ul className="md:mt-0">
                <li>
                  <a href="https://mmc.tirto.id/documents/2023/10/20/1241-amin-visi-misi-program.pdf?x=2676" target="_blank" rel="noopener noreferrer" className="text-gray-500 link-hover font-normal">
                    mmc.tirto.id/.../1241-amin-visi-misi-program.pdf
                  </a>
                </li>
                <li>
                  <a href="https://visimisiganjarmahfud.id/assets/docs/Visi-Misi-Ganjar-Pranowo-Mahfud-MD-v2.pdf" target="_blank" rel="noopener noreferrer" className="text-gray-500 link-hover font-normal">
                    visimisiganjarmahfud.id/.../Visi-Misi-Ganjar-Pranowo-Mahfud-MD-v2.pdf
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="card bg-base-100 shadow-md mt-8 lg:mt-0">
            <div className="card-body">
              <div className="text-center flex gap-4 justify-center mb-4">
                <Link className="hover:cursor-pointer tooltip tooltip-open" data-tip="Tanya AMIN" to={`/ask/amin`}>
                  <img src="/amin.png" alt="" className="w-full max-w-[128px] mask mask-circle" />
                </Link>
                <Link className="hover:cursor-pointer tooltip tooltip-open" data-tip="Tanya GAMA" to={`/ask/gama`}>
                  <img src="/gama.png" alt="" className="w-full max-w-[128px] mask mask-circle" />
                </Link>
              </div>
              <div className="flex flex-row gap-6">
                <div className="divider grow mt-1.5"></div>
                <div>
                  <p className="text-gray-300">atau</p>
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
            <h3 className="text-2xl font-bold">Donatur</h3>
            <p className="my-5 prose">
              Terima kasih untuk para donatur yang telah membantu kami dalam mengembangkan aplikasi ini.
            </p>
            <div className="flex flex-col gap-4">
              <div className="card card-compact shadow-md">
                <div className="card-body">
                  <div className="flex gap-4 items-center">
                    <div>
                      <img src="https://source.boringavatars.com/beam/50/6535eeaee52903003f57095a?colors=ff813f,ffdd02,ffa779,ffe74f,e1e1e1" className="mask mask-circle w-full max-w-[46px]" alt="" />
                    </div>
                    <div className="flex flex-col grow">
                      <h3 className="text-xl font-bold">Seseorang</h3>
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="text-sm text-gray-400">{dayjs('2023-10-23T09:03:00.000Z').fromNow()}</p>
                        </div>
                        <div>
                          <p className="text-md text-gray-400">Rp 1</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card card-compact shadow-md">
                <div className="card-body">
                  <div className="flex gap-4 items-center">
                    <div>
                      <img src="https://source.boringavatars.com/beam/50/6535eeaee52903003f57095a?colors=ff813f,ffdd02,ffa779,ffe74f,e1e1e1" className="mask mask-circle w-full max-w-[46px]" alt="" />
                    </div>
                    <div className="flex flex-col grow">
                      <h3 className="text-xl font-bold">Indra Zulfi</h3>
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="text-sm text-gray-400">{dayjs('2023-10-23T03:55:00.000Z').fromNow()}</p>
                        </div>
                        <div>
                          <p className="text-md text-gray-400">Rp 200,000</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg text-gray-500">
                      Keep it up mas!
                    </p>
                  </div>
                </div>
              </div>
              <div className="card card-compact shadow-md">
                <div className="card-body">
                  <div className="flex gap-4 items-center">
                    <div>
                      <img src="https://source.boringavatars.com/beam/50/6535d459e52903003f56c03e?colors=ff813f,ffdd02,ffa779,ffe74f,e1e1e1" className="mask mask-circle w-full max-w-[46px]" alt="" />
                    </div>
                    <div className="flex flex-col grow">
                      <h3 className="text-xl font-bold">Seseorang</h3>
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="text-sm text-gray-400">{dayjs('2023-10-23T02:03:00.000Z').fromNow()}</p>
                        </div>
                        <div>
                          <p className="text-md text-gray-400">Rp 30,000</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg text-gray-500">
                      Genjot terus bang!
                    </p>
                  </div>
                </div>
              </div>
              <div className="card card-compact shadow-md">
                <div className="card-body">
                  <div className="flex gap-4 items-center">
                    <div>
                      <img src="https://source.boringavatars.com/beam/50/6535cad9e52903003f56a1cf?colors=ff813f,ffdd02,ffa779,ffe74f,e1e1e1" className="mask mask-circle w-full max-w-[46px]" alt="" />
                    </div>
                    <div className="flex flex-col grow">
                      <h3 className="text-xl font-bold">Seseorang</h3>
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="text-sm text-gray-400">{dayjs('2023-10-23T01:22:00.000Z').fromNow()}</p>
                        </div>
                        <div>
                          <p className="text-md text-gray-400">Rp 30,000</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <a href="https://www.nihbuatjajan.com/mgilangjanuar" target="_blank"><img src="https://d4xyvrfd64gfm.cloudfront.net/buttons/default-cta.png" alt="Nih buat jajan" /></a>
              </div>
            </div>
          </div>
        </div>
      </div> : <div className="mx-auto max-w-2xl">
        <div className="hidden">
          <div className="chat chat-start">
            <div className="chat-bubble">It's over Anakin, <br/>I have the high ground.</div>
          </div>
          <div className="chat chat-end">
            <div className="chat-bubble bg-base-200 text-base-content">You underestimate my power!</div>
          </div>
        </div>
        <div className="card shadow-md lg:card-normal card-compact">
          <div className="card-body">
            <div className="flex gap-4 items-center">
              <div>
                <img src={`/${candidate}.png`} className="mask mask-circle w-full max-w-[52px]" alt="" />
              </div>
              <div className="flex flex-col grow">
                <h3 className="text-xl font-bold">{candidate === 'amin' ? 'AMIN' : candidate === 'gama' ? 'GAMA' : ''}</h3>
                <p className="text-sm text-gray-400">Tanyakan visi misinya.</p>
              </div>
              <div>
                <button onClick={() => setMessages([])} className="btn btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                    <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div ref={ref} className="lg:card card-compact overflow-y-auto lg:h-[calc(100svh-196px)] h-[calc(100svh-164px)] my-2 mb-0">
          <div className="lg:card-body">
            {messages.map((message, index) => <div key={index} className={`chat chat-${message.role !== 'user' ? 'start' : 'end'}`}>
              <div className={`chat-bubble prose max-w-full ${message.role !== 'user' ? 'bg-base-200 text-base-content' : 'bg-neutral'}`}>
                <ReactMarkdown
                  children={message.content.trim()}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline ? (
                        <SyntaxHighlighter
                          children={String(children).replace(/\n$/, '')}
                          style={dracula as any}
                          language={match?.[1]}
                          PreTag="div"
                          {...props}
                        />
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    }
                  }} />
              </div>
            </div>)}
          </div>
        </div>
        <div className="mx-auto py-1 max-w-7xl">
          <div>
            <form onSubmit={async e => {
              e.preventDefault()
              setLoading(true)
              const data = Object.fromEntries(new FormData(e.target as HTMLFormElement))
              const msgs: { role: string, content: string }[] = [...messages, { role: 'user', content: data.content as string }]
              const resp = await fetch(`${import.meta.env.VITE_API_URL}/prompt/${candidate}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  messages: msgs
                })
              })
              if (!resp.ok) {
                alert('Terjadi kesalahan, coba lagi nanti.')
                setLoading(false)
                return
              }

              setMessages(msgs)
              ;(e.target as HTMLFormElement).reset()
              const json = await resp.json()
              fetch('https://tanyacapres.vercel.app/api/stream', {
                method: 'POST',
                body: JSON.stringify(json),
                headers: {
                  'Content-Type': 'application/json'
                }
              }).then(async resp => {
                const data = resp.body
                if (!data) {
                  return
                }
                const reader = data.getReader()
                const decoder = new TextDecoder()
                let done = false

                // eslint-disable-next-line @typescript-eslint/no-inferrable-types
                let responseText: string = ''
                let responses: string[] = []

                while (!done) {
                  const { value, done: doneReading } = await reader.read()
                  done = doneReading
                  const chunkValue = decoder.decode(value)
                  if (!chunkValue) break

                  responseText += chunkValue
                  responses = responseText.split('\n\n')
                  const message: { role: string, content: string } = { role: '', content: '' }

                  for (const res of responses) {
                    const process = (append = '') => {
                      const c = JSON.parse(`${res}${append}`)
                      if (c.error) {
                        if (c.error === 'Unauthorized') {
                          (window as any).openLogin.showModal()
                        } else {
                          alert(c.error)
                        }
                        setLoading(false)
                        return null
                      }

                      message.role = c.choices[0].delta.role ?? message.role
                      message.content += c.choices[0].delta.content || ''

                      if (ref.current) {
                        ref.current.scrollTop = ref.current?.scrollHeight
                      }

                      if (c.choices[0].finish_reason === 'stop') {
                        if (messages?.length === 2 && !localStorage.getItem('isDonated')) {
                          (window as any).gotopricing.showModal()
                        }
                        setLoading(false)
                      }
                    }
                    try {
                      const c = process()
                      if (c === null) break
                    } catch (err) {
                      try {
                        const c = process('"}}]}')
                        if (c === null) break
                      } catch (error) {
                        try {
                          const c = process('}}]')
                          if (c === null) break
                        } catch (error) {
                          console.log(res)
                        }
                      }
                    }
                  }

                  if (message.content.trim()) {
                    setMessages([...msgs, message])
                  }
                }
              })

            }}>
              <div className="flex gap-2">
                <div className="grow">
                  <div className="form-control">
                    <input type="text" required name="content" className="input input-bordered" placeholder="Tanyakan apa saja..." readOnly={loading} />
                  </div>
                </div>
                <div>
                  <button type="submit" className="btn btn-ghost btn-outline border-gray-300" disabled={loading}>
                    {loading ? <span className="loading loading-spinner"></span> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M10 14l11 -11" />
                      <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                    </svg>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>}
    </div>
    <dialog id="gotopricing" className="modal modal-bottom sm:modal-middle">
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">
          Suka dengan aplikasi ini?
        </h3>
        <p className="py-4">
          Bantu kami untuk terus mengembangkan aplikasi ini dengan berdonasi 🎁 🥳
        </p>
        <div className="modal-action">
          <a href="https://www.nihbuatjajan.com/mgilangjanuar" target="_blank" className="btn btn-neutral" onClick={() => localStorage.setItem('isDonated', 'true')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M3 14c.83 .642 2.077 1.017 3.5 1c1.423 .017 2.67 -.358 3.5 -1c.83 -.642 2.077 -1.017 3.5 -1c1.423 -.017 2.67 .358 3.5 1" />
              <path d="M8 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
              <path d="M12 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
              <path d="M3 10h14v5a6 6 0 0 1 -6 6h-2a6 6 0 0 1 -6 -6v-5z" />
              <path d="M16.746 16.726a3 3 0 1 0 .252 -5.555" />
            </svg>
            Donate
          </a>
        </div>
      </form>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
}