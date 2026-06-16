export const pokemonData = fetch("https://pokeapi.co/api/v2/pokemon?limit=1500")
    .then((response) => response.json())
    .then((data) => {
        console.log("PokemonData.js: Fetched Pokemon data:", data.results);
        return data.results;
    });
export default pokemonData;
