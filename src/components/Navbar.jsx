import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-white tracking-tight">
                    Stat<span className="text-blue-400">Context</span>
                </Link>   
                <button className="text-gray-400 hover:text-white transition-colors">
                    🔍
                </button>
            </div>
        </nav>
    )
}

export default Navbar