import TablePokemons from "./components/Table";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PokeService from "./services/PokeService";
import { PokemonData, PokemonWithImage, Result } from "./interfaces/PokeApiResponse";
import ProgressBar from "../../shared/LoadingBar";
import "../../../index.css";
import { toast } from "react-toastify";
import SearchField from "./components/SearchField";

export default function Pokemons() {
	const [pokemonsWithImages, setPokemonsWithImages] = useState<PokemonWithImage[]>([]);
	const [search, setSearch] = useState("");
	const [count, setCount] = useState(0);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [progress, setProgress] = useState(0);

	const { data, isLoading, error } = useQuery({
		queryKey: ["pokemons", page, rowsPerPage],
		queryFn: async () => {
			setProgress(30);
			const response = await PokeService.getPokemons(
				rowsPerPage.toString(),
				(page * rowsPerPage).toString()
			);

			setProgress(70);
			return response;
		},
		staleTime: 1000 * 60 * 5,
		retry: 0,
		refetchOnWindowFocus: false,
	});

	useQuery({
		queryKey: ["search", search],
		queryFn: async () => {
			if (search === "") return null;
			const pokemon: PokemonData | null = await PokeService.getPokemonDetails(search);
			if (pokemon === null) {
				setPokemonsWithImages([]);
				setCount(0);
				toast.error("No se encontro información del pokemón", {
					position: "top-center",
					autoClose: 2000,
				});
				return null;
			}
			return pokemon;
		},
		enabled: search !== "",
		staleTime: 1000 * 60 * 5,
		retry: 0,
		refetchOnWindowFocus: false,
		onSuccess: (data: {
			name: any;
			sprites: { front_default: any };
			types: any;
			weight: any;
			abilities: any;
		}) => {
			if (data) {
				const filter_pokemon: PokemonWithImage = {
					name: data.name,
					image: data.sprites.front_default,
					types: data.types,
					weight: data.weight,
					abilities: data.abilities,
				};
				setPokemonsWithImages([filter_pokemon]);
				setCount(1);
			}
		},
		onError: () => {
			setPokemonsWithImages([]);
			setCount(0);
		},
	});

	const handleSearchChange = async (value: string) => {
		setSearch(value);
	};

	useEffect(() => {
		if (!data) return;

		setCount(data.count);

		const fetchPokemonDetails = async () => {
			const pokemons = await Promise.all(
				data?.results.map(async (pokemon: Result) => {
					const details: PokemonData | null = await PokeService.getPokemonDetails(
						pokemon.name
					);
					if (details === null) {
						return {
							...pokemon,
							image: "",
							types: [],
							weight: 0,
							abilities: [],
						};
					}

					return {
						...pokemon,
						image: details.sprites.front_default,
						types: details.types,
						weight: details.weight,
						abilities: details.abilities,
					};
				})
			);

			setPokemonsWithImages(pokemons);
		};

		fetchPokemonDetails();
	}, [data]);

	return (
		<>
			<div className="container-fluid px-10 pt-5 pb-0">
				{isLoading ? (
					<>
						<ProgressBar progress={progress} />
					</>
				) : error ? (
					<div className="card">Error loading data</div>
				) : (
					<div className="">
						<SearchField value={search} onChange={handleSearchChange} />
						<TablePokemons
							data={pokemonsWithImages}
							page={page}
							rowsPerPage={rowsPerPage}
							onPageChange={setPage}
							onRowsPerPageChange={setRowsPerPage}
							count={count}
						/>
					</div>
				)}
			</div>
		</>
	);
}
