import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Backup from "../assets/images/backup.png";
import { useTitle } from "../hooks/useTitle";
import { useFetch } from "../hooks/useFetch";
import PulseLoading from "../assets/pulse.svg";
export const MovieDetail = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState({});
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const image = movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : Backup;
    console.log(movie);

    async function getVideos(movieId) {
        const videosUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.REACT_APP_API_KEY}`;
        const response = await fetch(videosUrl);
        const json = await response.json();
        setVideos(json.results);
        console.log(videos);
    }

    useTitle(movie.title);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${params.id}?api_key=${process.env.REACT_APP_API_KEY}`);
                const movieJson = await movieResponse.json();
                setMovie(movieJson);

                const videosResponse = await fetch(`https://api.themoviedb.org/3/movie/${params.id}/videos?api_key=${process.env.REACT_APP_API_KEY}`);
                const videosJson = await videosResponse.json();
                setVideos(videosJson.results);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [params.id]);

    return (
        <main>
            <section className="flex flex-wrap justify-around py-5">
                <div className="max-w-sm">
                    <img src={image} alt={movie.title} className="rounded" />
                </div>
                <div className="max-w-2xl text-lg text-gray-700 dark:text-white">
                    <h1 className="my-3 text-4xl font-bold text-center lg:text-left">{movie.title}</h1>
                    <p className="my-4">{movie.overview}</p>

                    {movie.genres ? (
                        <p className="flex flex-wrap gap-2 my-7">
                            {movie.genres.map((genre) => (
                                <span key={genre.id} className="p-2 mr-2 border border-gray-200 rounded dark:border-gray-600">
                                    {genre.name}
                                </span>
                            ))}
                        </p>
                    ) : (
                        ""
                    )}

                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-yellow-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                        <p className="ml-2 text-gray-900 dark:text-white">{movie.vote_average}</p>
                        <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                        <span className="text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white">{movie.vote_count} reviews</span>
                    </div>

                    <p className="my-4">
                        <span className="mr-2 font-bold">Runtime:</span>
                        <span>{movie.runtime} min.</span>
                    </p>
                    <p className="my-4">
                        <span className="mr-2 font-bold">Budget:</span>
                        <span>{movie.budget === 0 ? "No data" : movie.budget}</span>
                    </p>
                    <p className="my-4">
                        <span className="mr-2 font-bold">Revenue: </span>
                        <span>{movie.revenue}</span>
                    </p>
                    <p className="my-4">
                        <span className="mr-2 font-bold">Release Date: </span>
                        <span>{movie.release_date}</span>
                    </p>
                    <p className="my-4">
                        <span className="mr-2 font-bold">IMDB Code:</span>
                        <a href={`https://www.imdb.com/title/${movie.imdb_id}`} target="_blank" rel="noreferrer">
                            {movie.imdb_id}
                        </a>
                    </p>

                    <button className="w-64 text-xl text-white rounded-lg bg-gradient-to-r from-indigo-500 px-5 py-2.5 mr-2 mb-2 font-medium hover:bg-gradient-to-br" onClick={() => navigate(-1)}>
                        Go back
                    </button>
                </div>
            </section>
            <div className="videos">
                <h3>Video Trailers:</h3>
                {loading ? (
                    <img src={PulseLoading} alt="Loading..." />
                ) : error ? (
                    <p className="text-red-500">Error loading data: {error}</p>
                ) : (
                    <div className="videos-grid">
                        {videos &&
                            videos.map((video) => (
                                <div key={video.id}>
                                    <iframe
                                        width="560"
                                        height="315"
                                        src={`https://www.youtube.com/embed/${video.key}`}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                    <span>{video.name}</span>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </main>
    );
};
