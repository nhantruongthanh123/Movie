import { useState } from 'react'
import {useEffect} from 'react'
import { useDebounce } from 'react-use'
import { updateSearchCount, getTrendingMovies } from './appwrite.js'

import Search from './components/Search.jsx'
import MovieCard from './components/MovieCard.jsx'
import MovieDetail from './components/MovieDetail.jsx'


const BASE_API_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method : 'GET',
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};


const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieLists, setMovieLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dbouncedSearchTerm, setDbouncedSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(() => {setDbouncedSearchTerm(searchTerm)}, 500, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query ? 
        `${BASE_API_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${BASE_API_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&api_key=${API_KEY}`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      if (data.Response === 'False') {
        setErrorMessage(data.error || 'Error fetching movies');
        setMovieLists([]);
        return;
      }
      else {
        setMovieLists(data.results);
        setErrorMessage('');
      }

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  const fetchTrendingMovies = async () => {
    try {
      const movie = await getTrendingMovies();
      setTrendingMovies(movie);
    }
    catch (error) {
      console.error('Error fetching trending movies:', error);
    }
  }

  useEffect(() => {
    fetchMovies(dbouncedSearchTerm);
  }, [dbouncedSearchTerm]);

  useEffect(() => {
    fetchTrendingMovies();
  }, [])


  return (
    <main>
      <div className="pattern">
      </div>

      <div className="wrapper">
        <header>
          <img src='./hero.png' alt="Hero Banner"></img>
          <h1> Find <span className="text-gradient"> Movie </span>Movie you will enjoy</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2> Trending Movies </h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p> {index + 1} </p>
                  <img src={movie.poster_url} alt={movie.title}></img>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className='all-movies'>
          <h2> All Movies </h2>
          
          {isLoading ? (
            <p className="text-white">Loading movies...</p>
          ) : errorMessage ? (
            <p className="text-white"> {errorMessage} </p>
          ) : (
            <ul>
              {movieLists.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}

        </section>
        

      </div>
    </main>
  )
}

export default App

