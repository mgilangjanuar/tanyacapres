import { Dispatch, Ref, SetStateAction } from 'react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import remarkGfm from 'remark-gfm'

export default function ChatBox({ refBox: ref, messages, setMessages, withClearBtn, candidate }: {
  refBox?: Ref<any>,
  messages: { role: string, content: string }[],
  setMessages?: Dispatch<SetStateAction<{ role: string, content: string }[]>>,
  withClearBtn?: boolean,
  candidate: string
}) {

  return <div className="mx-auto max-w-2xl">
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
            <h3 className="text-xl font-bold">{candidate === 'amin' ? 'AMIN' : candidate === 'gama' ? 'GAMA' : 'PRABU'}</h3>
            <p className="text-sm text-gray-400">Tanyakan visi misinya.</p>
          </div>
          {withClearBtn ? <div>
            <button onClick={() => setMessages?.([])} className="btn btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
              </svg>
            </button>
          </div> : <></>}
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
  </div>
}