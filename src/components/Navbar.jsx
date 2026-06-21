import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'

function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold text-white tracking-tight shrink-0">
          Stat<span className="text-blue-400">Context</span>
        </Link>
        <SearchBar />
      </div>
    </nav>
  )
}

export default Navbar
