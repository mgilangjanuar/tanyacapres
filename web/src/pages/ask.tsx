import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import ChatBox from '../components/chatbox'

dayjs.extend(relativeTime)

export default function Ask() {
  const params = useParams()
  const [loading, setLoading] = useState<boolean>(false)
  const ref = useRef<any>()
  const [messages, setMessages] = useState<{ role: string, content: string }[]>(JSON.parse(localStorage.getItem(`ask:${params.candidate}`) || '[]'))

  useEffect(() => {
    if (messages) {
      localStorage.setItem(`ask:${params.candidate}`, JSON.stringify(messages))
    }
  }, [messages, params.candidate])

  return <div className="container mx-auto py-2 relative">
    <div>
      <div className="mx-auto max-w-2xl">
        <ChatBox refBox={ref} messages={messages} setMessages={setMessages} withClearBtn candidate={params.candidate as string} />
        <div className="mx-auto py-1 max-w-7xl">
          <div>
            <form onSubmit={async e => {
              e.preventDefault()
              setLoading(true)
              const data = Object.fromEntries(new FormData(e.target as HTMLFormElement))
              const msgs: { role: string, content: string }[] = [...messages, { role: 'user', content: data.content as string }]
              const resp = await fetch(`${import.meta.env.VITE_API_URL}/prompt/${params.candidate}`, {
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
                  <button type="submit" className="btn btn-ghost btn-outline border-gray-400" disabled={loading}>
                    {loading ? <span className="loading loading-spinner"></span> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
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
