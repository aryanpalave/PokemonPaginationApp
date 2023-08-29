import React, { useState, useEffect } from 'react';
import PokemonList from './PokemonList';
import axios from 'axios';
import Pagination from './Pagination';

function App() {
  const [pokemon, setPokemon] = useState(["bulbasaur", "charmander"]);
  const [currentPageUrl, setCurrentPageUrl] = useState("https://pokeapi.co/api/v2/pokemon?limit=807");
  const [nextPageUrl, setNextPageUrl] = useState();
  const [prevPageUrl, setPrevPageUrl] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const source = axios.CancelToken.source(); // Create a cancel token source

    axios.get(currentPageUrl, {
      cancelToken: source.token // Use the token from the source
    }).then(res => {
      setLoading(false);
      setNextPageUrl(res.data.next);
      setPrevPageUrl(res.data.previous);
      setPokemon(res.data.results.map(p => p.name));
    }).catch(err => {
      if (axios.isCancel(err)) {
        // Request was canceled
        console.log('Request canceled', err.message);
      } else {
        // Handle other errors
      }
    });

    return () => {
      source.cancel(); // Cancel the request when the component unmounts
    };
  }, [currentPageUrl]);

  function goToNextPage() {
    setCurrentPageUrl(nextPageUrl);
  }

  function goToPrevPage() {
    setCurrentPageUrl(prevPageUrl);
  }


  if (loading) return "Loading...";

  return (
    <div>
      <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
        <PokemonList pokemon={pokemon} />
      </div>
      <Pagination
        goToNextPage={nextPageUrl ? goToNextPage : null}
        goToPrevPage={prevPageUrl ? goToPrevPage : null}
      />
    </div>
  );
}

export default App;
