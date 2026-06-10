function SearchBar() {
    return (
        <div className="relative w-full max-w-xl mx-auto mb-10">
            <input
                type="text"
                placeholder="Search any player or team..."
                className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-full px-6 py-3 pr-12 outline-none border border-gray-700 focus:border-blue-400 transition-colors"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
            🔍
            </span>
        </div>
    )
}

export default SearchBar