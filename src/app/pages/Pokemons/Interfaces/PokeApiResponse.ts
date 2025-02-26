export interface PokeAPIResponse {
	count: number;
	next: string;
	previous: string;
	results: Result[];
}

export interface Ability {
	ability: Result;
	is_hidden: boolean;
	slot: number;
	description: string;
}

export interface PokemonData {
	types: TypePokemon[];
	weight: number;
	abilities: Ability[];
	name: string;
	sprites: {
		front_default: string;
	};
	count: number;
}

export interface PokemonWithImage {
	name: string;
	image?: string;
	types?: TypePokemon[] | [];
	weight?: number;
	abilities?: Ability[];
}

export interface Result {
	name: string;
	url: string;
}

export interface EffectEntry {
	effect: string;
	language: {
		name: string;
		url: string;
	};
	short_effect: string;
}

export interface TypePokemon {
	slot: number;
	type: {
		name: string;
		url: string;
	};
}
