import { useState } from 'react'
import {useEffect} from 'react'
import Search from './components/Search.jsx'
import MovieCard from './components/movieCard.jsx'

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

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = `${BASE_API_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&api_key=${API_KEY}`;
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
        console.log(data);
      }

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies();
  }, []);

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

        <section className='all-movies'>
          <h2 className="mt-[40px]"> All Movies </h2>
          
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

