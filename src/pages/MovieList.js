import React, { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";
import { Card } from "../components";
import { useTitle } from "../hooks/useTitle";

export const MovieList = ({ apiPath, title }) => {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(2);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loadedMovies, setLoadedMovies] = useState([]);

    const { data: initialMovies } = useFetch(apiPath);

    console.log(initialMovies);
    const getUniqueIds = () => {
        initialMovies.map((movie) => {
            loadedMovies.push(movie.id);
        });
    };

    // Load initial movies
    useEffect(() => {
        setMovies(initialMovies);
        getUniqueIds();
    }, [initialMovies]);

    useTitle(title);

    const fetchMoreMovies = async () => {
        try {
            setLoading(true);
            const apiKey = process.env.REACT_APP_API_KEY;
            const response = await fetch(`https://api.themoviedb.org/3/${apiPath}?api_key=${apiKey}&page=${page}`);
            const data = await response.json();

            console.log("pages ", +page, data.results.id);
            if (data.results && Array.isArray(data.results)) {
                setMovies((prevMovies) => [...prevMovies, ...data.results]);

                getUniqueIds((initialMovies) => {
                    // Extract unique IDs from initialMovies
                    const uniqueIds = initialMovies.map((movie) => movie.id);

                    // Filter out duplicates from data.results
                    const newIds = data.results.filter((result) => !uniqueIds.includes(result.id));

                    // Combine unique IDs with new IDs
                    const combinedIds = [...uniqueIds, ...newIds.map((result) => result.id)];

                    // Now you have an array of unique IDs
                    console.log(combinedIds);

                    // If you want to update state with the combined IDs, use setUniqueIds(combinedIds);
                    // Assuming setUniqueIds is your state update function
                });
                console.log(initialMovies);
                console.log("test " + loadedMovies);
                if (page > 1) {
                    setPage((prevPage) => prevPage + 1);
                }
            }
            // setMovies((prevMovies) => [...prevMovies, ...data.results]);
            // setPage((prevPage) => prevPage + 1);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = () => {
        console.log("next");
        if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight && !loading) {
            fetchMoreMovies();
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

    return (
        <main>
            <section className="mx-auto max-w-7xl py-7">
                <div className="flex flex-wrap justify-start other:justify-evenly">{movies && movies.map((movie) => <Card key={movie.id} movie={movie} />)}</div>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
            </section>
        </main>
    );
};
