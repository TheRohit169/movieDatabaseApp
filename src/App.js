import {useEffect, useState} from 'react'

const API_KEY = 'YOUR_API_KEY'
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500'

const App = () => {
  const [activePage, setActivePage] = useState('POPULAR')
  const [popular, setPopular] = useState([])
  const [topRated, setTopRated] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])

  // ✅ POPULAR
  useEffect(() => {
    const getPopular = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`,
      )
      const data = await response.json()
      setPopular(data.results)
    }
    getPopular()
  }, [])

  // ✅ TOP RATED
  useEffect(() => {
    const getTopRated = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`,
      )
      const data = await response.json()
      setTopRated(data.results)
    }
    getTopRated()
  }, [])

  // ✅ UPCOMING
  useEffect(() => {
    const getUpcoming = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`,
      )
      const data = await response.json()
      setUpcoming(data.results)
    }
    getUpcoming()
  }, [])

  // ✅ SEARCH
  const onSearch = async () => {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${search}&page=1`,
    )
    const data = await response.json()
    setSearchResults(data.results)
    setActivePage('SEARCH')
  }

  const renderMovies = movies => (
    <ul>
      {movies.map(movie => (
        <li key={movie.id}>
          <img src={`${IMAGE_URL}${movie.poster_path}`} alt={movie.title} />
          <p>{movie.title}</p>
          <p>{movie.vote_average}</p>
          <button>View Details</button>
        </li>
      ))}
    </ul>
  )

  return (
    <div>
      {/* ✅ NAVBAR */}
      <nav>
        <h1>movieDB</h1>

        <button onClick={() => setActivePage('POPULAR')}>Popular</button>
        <button onClick={() => setActivePage('TOP_RATED')}>Top Rated</button>
        <button onClick={() => setActivePage('UPCOMING')}>Upcoming</button>

        {/* ✅ MUST BE type="text" */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button onClick={onSearch}>Search</button>
      </nav>

      {/* ✅ PAGE HEADING */}
      {activePage === 'POPULAR' && <h1>Popular</h1>}
      {activePage === 'TOP_RATED' && <h1>Top Rated</h1>}
      {activePage === 'UPCOMING' && <h1>Upcoming</h1>}

      {/* ✅ PAGE CONTENT */}
      {activePage === 'POPULAR' && renderMovies(popular)}
      {activePage === 'TOP_RATED' && renderMovies(topRated)}
      {activePage === 'UPCOMING' && renderMovies(upcoming)}
      {activePage === 'SEARCH' && renderMovies(searchResults)}
    </div>
  )
}

export default App
