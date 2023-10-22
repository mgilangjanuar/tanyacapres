import { useRef, useState } from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import remarkGfm from 'remark-gfm'

export default function Compare() {
  const [loading, setLoading] = useState<boolean>(false)
  const refAmin = useRef<any>()
  const refGama = useRef<any>()
  const [messagesAmin, setMessagesAmin] = useState<{ role: string, content: string }[]>([])
  const [messagesGama, setMessagesGama] = useState<{ role: string, content: string }[]>([])

  return <div className="container mx-auto py-2">
    <div className="overflow-x-auto">
      <div className="grid grid-cols-12 gap-8 min-w-[700px]">
        <div className="col-span-6">
          <div>
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
                    <img src="/amin.png" className="mask mask-circle w-full max-w-[52px]" alt="" />
                  </div>
                  <div className="flex flex-col grow">
                    <h3 className="text-xl font-bold">AMIN</h3>
                    <p className="text-sm text-gray-400">Tanyakan visi misinya.</p>
                  </div>
                </div>
              </div>
            </div>
            <div ref={refAmin} className="lg:card overflow-y-auto lg:h-[calc(100svh-280px)] h-[calc(100svh-250px)] my-2">
              <div className="lg:card-body">
                {messagesAmin.map((message, index) => <div key={index} className={`chat chat-${message.role !== 'user' ? 'start' : 'end'}`}>
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
          </div>
        </div>
        <div className="col-span-6">
          <div>
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
                    <img src="/gama.png" className="mask mask-circle w-full max-w-[52px]" alt="" />
                  </div>
                  <div className="flex flex-col grow">
                    <h3 className="text-xl font-bold">GAMA</h3>
                    <p className="text-sm text-gray-400">Tanyakan visi misinya.</p>
                  </div>
                </div>
              </div>
            </div>
            <div ref={refGama} className="lg:card overflow-y-auto lg:h-[calc(100svh-280px)] h-[calc(100svh-250px)] my-2">
              <div className="lg:card-body">
                {messagesGama.map((message, index) => <div key={index} className={`chat chat-${message.role !== 'user' ? 'start' : 'end'}`}>
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
          </div>
        </div>
      </div>
    </div>
    <div className="mx-auto py-2 max-w-7xl">
      <div>
        <form onSubmit={async e => {
          e.preventDefault()
          setLoading(true)
          const data = Object.fromEntries(new FormData(e.target as HTMLFormElement))
          const amin = async () => {
            const msgs: { role: string, content: string }[] = [...messagesAmin, { role: 'user', content: data.content as string }]
            const resp = await fetch('https://tanyacapres-api.appledore.dev/prompt/amin', {
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

            setMessagesAmin(msgs)
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

                    if (refAmin.current) {
                      refAmin.current.scrollTop = refAmin.current?.scrollHeight
                    }

                    if (c.choices[0].finish_reason === 'stop') {
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
                  setMessagesAmin([...msgs, message])
                }
              }
            })
          }

          const gama = async () => {
            const msgs: { role: string, content: string }[] = [...messagesGama, { role: 'user', content: data.content as string }]
            const resp = await fetch('https://tanyacapres-api.appledore.dev/prompt/gama', {
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

            setMessagesGama(msgs)
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

                    if (refGama.current) {
                      refGama.current.scrollTop = refGama.current?.scrollHeight
                    }

                    if (c.choices[0].finish_reason === 'stop') {
                      if (messagesAmin?.length > 1 && !localStorage.getItem('isDonated')) {
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
                  setMessagesGama([...msgs, message])
                }
              }
            })
          }

          await Promise.allSettled([amin(), gama()])
        }}>
          <div className="flex gap-2">
            <div className="grow">
              <div className="form-control">
                <input type="text" required name="content" className="input input-bordered" placeholder="Tanyakan pertanyaan untuk semua calon..." readOnly={loading} />
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
            <div>
              <button type="button" onClick={() => {
                setMessagesAmin([])
                setMessagesGama([])
              }} className="btn btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>
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