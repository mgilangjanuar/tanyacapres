import { Route, Routes, useLocation } from 'react-router-dom'
import Compare from './pages/compare'
import Home from './pages/home'

import './App.css'

function App() {
  const { pathname: path } = useLocation()

  return <div className="min-h-screen" data-theme="light">
    {path === '/' ? <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl" href="/">
          <img src="/icon.png" className="w-full max-w-[28px]" alt="" />
          TanyaCapres
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="https://github.com/mgilangjanuar/tanyacapres" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
              </svg>
              <span className="hidden md:inline">GitHub</span>
            </a>
          </li>
          <li>
            <a href="https://www.nihbuatjajan.com/mgilangjanuar" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M3 14c.83 .642 2.077 1.017 3.5 1c1.423 .017 2.67 -.358 3.5 -1c.83 -.642 2.077 -1.017 3.5 -1c1.423 -.017 2.67 .358 3.5 1" />
                <path d="M8 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
                <path d="M12 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2" />
                <path d="M3 10h14v5a6 6 0 0 1 -6 6h-2a6 6 0 0 1 -6 -6v-5z" />
                <path d="M16.746 16.726a3 3 0 1 0 .252 -5.555" />
              </svg>
              <span className="hidden md:inline">Donate</span>
            </a>
          </li>
        </ul>
      </div>
    </div> : <></>}
    <Routes>
      <Route index element={<Home />} />
      <Route path="/ask/:candidate" element={<Home />} />
      <Route path="/compare" element={<Compare />} />
    </Routes>
  </div>
}

export default App
