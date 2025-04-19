import {
	Ability,
	PokemonData,
	PokemonWithImage,
	Result,
} from "../interfaces/PokeApiResponse";
import "react-toastify/dist/ReactToastify.css";

class PokeService {
	private baseUrl: string;

	constructor() {
		if (!import.meta.env.VITE_URL_API) {
			throw new Error("API URL not found");
		}
		this.baseUrl = import.meta.env.VITE_URL_API;
	}

	async getPokemons(limit: string, offset: string, search: string = "") {
		try {
			if (search !== "") {
				const detailPokemon = await this.getPokemonDetails(search);

				if (!detailPokemon) {
					return { info: [], countTotal: 0 };
				}
				const { pokemon, count } = detailPokemon || { pokemon: null, count: 0 };
				return { info: [pokemon], countTotal: count };
			}

			const response = await fetch(
				`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`
			);
			if (!response.ok) {
				throw new Error("Error fetching Pokemon data");
			}
			const data = await response.json();
			const pokemons = await Promise.all(
				data?.results?.map(
					async (pokemon: Result) => await this.getPokemonDetails(pokemon.name)
				)
			);

			const PokeResult = pokemons.map((pokemon: any) => ({ ...pokemon.pokemon }));

			// hacer logica de traer informacion de cada pokemon

			return { info: PokeResult, countTotal: data.count };
		} catch (error) {
			console.error("Error fetching Pokemon data:", error);
			return { info: [], countTotal: 0 };
		}
	}

	async getPokemonDetails(
		name: string
	): Promise<{ pokemon: PokemonWithImage; count: number } | null> {
		try {
			const response = await fetch(`${this.baseUrl}pokemon/${name}`);
			if (!response.ok) {
				return null
			}
			const pokemon: PokemonData = await response.json();

			const pokemonwithImage: PokemonWithImage = {
				name: pokemon.name,
				image: pokemon?.sprites?.front_default,
				types: pokemon.types,
				weight: pokemon.weight,
				abilities: pokemon.abilities,
			};

			return { pokemon: pokemonwithImage, count: 1 };
		} catch (error) {
			console.error("Error fetching Pokemon details:", error);
			return null;
		}
	}

	async getDescriptionAbilities(abilities: Ability[] | any[]) {
		try {
			if (!abilities) return [];

			// Obtener detalles de las habilidades en paralelo
			const abilitiesDescription = await Promise.all(
				abilities.map(async (ability: Ability) => {
					const response = await fetch(ability.ability.url);
					if (!response.ok) throw new Error("Error fetching ability details");

					const result = await response.json();
					const [data_filtered] = result.effect_entries.filter(
						(entry: { language: { name: string } }) => entry.language.name === "en"
					);
					return data_filtered; // Retornar solo los efectos
				})
			);

			return abilitiesDescription;
		} catch (error) {
			console.error("Error fetching Pokemon details:", error);
			return [];
		}
	}
}

export default new PokeService();
