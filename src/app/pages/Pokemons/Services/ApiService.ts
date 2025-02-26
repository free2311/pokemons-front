import { Ability, PokeAPIResponse, PokemonData } from "../Interfaces/PokeApiResponse";
import "react-toastify/dist/ReactToastify.css";

class ApiService {
	private baseUrl: string;

	constructor() {
		if (!import.meta.env.VITE_URL_API) {
			throw new Error("API URL not found");
		}
		this.baseUrl = import.meta.env.VITE_URL_API;
	}

	async getPokemons(limit: string, offset: string) {
		try {
			const response = await fetch(
				`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`
			);
			if (!response.ok) {
				throw new Error("Error fetching Pokemon data");
			}
			const data: PokeAPIResponse = await response.json();

			// devolver results y count
			return { results: data.results, count: data.count };
		} catch (error) {
			console.error("Error fetching Pokemon data:", error);
			throw error;
		}
	}

	async getPokemonDetails(name: string): Promise<PokemonData | null> {
		try {
			const response = await fetch(`${this.baseUrl}/pokemon/${name}`);
			if (!response.ok) {
				return null;
			}
			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Error fetching Pokemon details:", error);
			return null;
		}
	}

	async getDescriptionAbilities(abilities: Ability[] | undefined) {
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

export default new ApiService();
