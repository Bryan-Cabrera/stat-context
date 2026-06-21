import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PlayerProfile from './pages/PlayerProfile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player/:playerId" element={<PlayerProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App