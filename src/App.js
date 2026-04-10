// App.js
import {useEffect, useState} from 'react'
import './App.css'

const API_KEY = 'YOUR_API_KEY'
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500'

// MOVIE CARD
const MovieCard = ({movie, onViewDetails}) => (
  <li className="movie-card">
    <img
      src={
        movie.poster_path
          ? `${IMAGE_URL}${movie.poster_path}`
          : 'https://via.placeholder.com/150x225?text=No+Image'
      }
      alt={movie.title}
    />
    <div className="movie-info">
      <p className="movie-title">{movie.title}</p>
      <p className="movie-rating">⭐ {movie.vote_average}</p>
      <button
        type="button"
        className="view-btn"
        onClick={() => onViewDetails(movie.id)}
      >
        View Details
      </button>
    </div>
  </li>
)

// MOVIE GRID
const MovieGrid = ({movies, onViewDetails, page, totalPages, onPageChange}) => (
  <div>
    <ul className="movies-grid">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} onViewDetails={onViewDetails} />
      ))}
    </ul>
    <div className="pagination">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  </div>
)

// MOVIE DETAILS
const MovieDetails = ({movieId, onBack}) => {
  const [details, setDetails] = useState(null)
  const [cast, setCast] = useState([])

  useEffect(() => {
    const getDetails = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`,
      )
      const data = await res.json()
      setDetails(data)
    }

    const getCast = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`,
      )
      const data = await res.json()
      setCast(data.cast.slice(0, 12))
    }

    getDetails()
    getCast()
  }, [movieId])

  if (!details) return <p className="loading">Loading...</p>

  return (
    <div className="details-container">
      <button type="button" className="back-btn" onClick={onBack}>
        ← Back
      </button>

      <div className="details-top">
        <img
          src={
            details.poster_path
              ? `${IMAGE_URL}${details.poster_path}`
              : 'https://via.placeholder.com/300x450?text=No+Image'
          }
          alt={details.title}
          className="details-poster"
        />
        <div className="details-info">
          <h1>{details.title}</h1>
          <p>⭐ {details.vote_average} / 10</p>
          <p>
            🕐 {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
          </p>
          <p>
            🎭{' '}
            {details.genres
              ? details.genres.map(g => g.name).join(', ')
              : 'N/A'}
          </p>
          <p>📅 {details.release_date}</p>
          <p className="overview">{details.overview}</p>
        </div>
      </div>

      <h2>Cast</h2>
      <ul className="cast-grid">
        {cast.map(member => (
          <li key={member.id} className="cast-card">
            <img
              src={
                member.profile_path
                  ? `${IMAGE_URL}${member.profile_path}`
                  : 'https://via.placeholder.com/150x225?text=No+Image'
              }
              alt={member.name}
            />
            <p className="cast-name">{member.name}</p>
            <p className="cast-character">as {member.character}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

// MAIN APP
const App = () => {
  const [activePage, setActivePage] = useState('POPULAR')
  const [popular, setPopular] = useState([])
  const [topRated, setTopRated] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedMovieId, setSelectedMovieId] = useState(null)

  const [popularPage, setPopularPage] = useState(1)
  const [topRatedPage, setTopRatedPage] = useState(1)
  const [upcomingPage, setUpcomingPage] = useState(1)
  const [searchPage, setSearchPage] = useState(1)

  const [popularTotal, setPopularTotal] = useState(1)
  const [topRatedTotal, setTopRatedTotal] = useState(1)
  const [upcomingTotal, setUpcomingTotal] = useState(1)
  const [searchTotal, setSearchTotal] = useState(1)

  useEffect(() => {
    const getPopular = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${popularPage}`,
      )
      const data = await res.json()
      setPopular(data.results)
      setPopularTotal(data.total_pages > 500 ? 500 : data.total_pages)
    }
    getPopular()
  }, [popularPage])

  useEffect(() => {
    const getTopRated = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${topRatedPage}`,
      )
      const data = await res.json()
      setTopRated(data.results)
      setTopRatedTotal(data.total_pages > 500 ? 500 : data.total_pages)
    }
    getTopRated()
  }, [topRatedPage])

  useEffect(() => {
    const getUpcoming = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${upcomingPage}`,
      )
      const data = await res.json()
      setUpcoming(data.results)
      setUpcomingTotal(data.total_pages > 500 ? 500 : data.total_pages)
    }
    getUpcoming()
  }, [upcomingPage])

  const onSearch = async (pageNum = 1) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${search}&page=${pageNum}`,
    )
    const data = await res.json()
    setSearchResults(data.results)
    setSearchTotal(data.total_pages > 500 ? 500 : data.total_pages)
    setSearchPage(pageNum)
    setActivePage('SEARCH')
  }

  const onViewDetails = id => {
    setSelectedMovieId(id)
    setActivePage('DETAILS')
  }

  const onBack = () => {
    setSelectedMovieId(null)
    setActivePage('POPULAR')
  }

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <h1 className="logo">movieDB</h1>
        <div className="nav-links">
          <button
            type="button"
            data-testid="popular-nav"
            className={`nav-btn ${activePage === 'POPULAR' ? 'active' : ''}`}
            onClick={() => setActivePage('POPULAR')}
          >
            Popular
          </button>
          <button
            type="button"
            data-testid="top-rated-nav"
            className={`nav-btn ${activePage === 'TOP_RATED' ? 'active' : ''}`}
            onClick={() => setActivePage('TOP_RATED')}
          >
            Top Rated
          </button>
          <button
            type="button"
            data-testid="upcoming-nav"
            className={`nav-btn ${activePage === 'UPCOMING' ? 'active' : ''}`}
            onClick={() => setActivePage('UPCOMING')}
          >
            Upcoming
          </button>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch()}
          />
          <button type="button" onClick={() => onSearch()}>
            Search
          </button>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className="content">
        {activePage === 'DETAILS' && selectedMovieId && (
          <MovieDetails movieId={selectedMovieId} onBack={onBack} />
        )}

        {activePage === 'POPULAR' && (
          <>
            <h1 className="page-title">Popular</h1>
            <MovieGrid
              movies={popular}
              onViewDetails={onViewDetails}
              page={popularPage}
              totalPages={popularTotal}
              onPageChange={setPopularPage}
            />
          </>
        )}

        {activePage === 'TOP_RATED' && (
          <>
            <h1 className="page-title">Top Rated</h1>
            <MovieGrid
              movies={topRated}
              onViewDetails={onViewDetails}
              page={topRatedPage}
              totalPages={topRatedTotal}
              onPageChange={setTopRatedPage}
            />
          </>
        )}

        {activePage === 'UPCOMING' && (
          <>
            <h1 className="page-title">Upcoming</h1>
            <MovieGrid
              movies={upcoming}
              onViewDetails={onViewDetails}
              page={upcomingPage}
              totalPages={upcomingTotal}
              onPageChange={setUpcomingPage}
            />
          </>
        )}

        {activePage === 'SEARCH' && (
          <>
            <h1 className="page-title">Search Results</h1>
            <MovieGrid
              movies={searchResults}
              onViewDetails={onViewDetails}
              page={searchPage}
              totalPages={searchTotal}
              onPageChange={p => onSearch(p)}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default App
