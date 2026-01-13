import {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BASE_API_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method : 'GET',
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const MovieDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`${BASE_API_URL}/movie/${id}`, API_OPTIONS);
                if (!response.ok) {
                    console.error('Movie not found');
                }
                const data = await response.json();
                setMovie(data);
                console.log(data);
            }
            catch (error) {
                console.error('Error fetching movie details:', error);
            }   
            finally {
                setIsLoading(false);
            }     
        }

        fetchMovieDetails();
    }, [id])

    if (isLoading) {
        return (
            <div>Loading...</div>
        );
    }

    if (!movie) {
        return (
            <div>Movie Not Found</div>
        );
    }

    return (
        <main>
            <div className="pattern"></div>
            <div className="wrapper">
                <div className="movie-detail">
                    <button 
                        onClick={() => navigate(-1)}
                        className="back-button"
                    >
                        ← Quay lại
                    </button>

                    <div className="movie-info">
                        <img 
                            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'no-movie.png'}
                            alt={movie.title}
                            className="poster-img"
                        />

                        <div className="movie-data">
                            <h2>{movie.title}</h2>
                            <p><strong> Released day:</strong> {movie.release_date}</p>
                            <p><strong>Rating:</strong> {movie.vote_average} / 10 ({movie.vote_count} ratings)</p>
                            <p><strong>Genres:</strong> {movie.genres.map(genre => genre.name).join(', ')}</p>
                            <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
                            <p><strong> Revenue: </strong>{movie.revenue.toLocaleString('en-US')} USD</p>
                            <p><strong>Overview:</strong> {movie.overview}</p>
                        </div>

                    </div>
                    
                </div>
            </div>
                
        </main>
    );
}

export default MovieDetail;