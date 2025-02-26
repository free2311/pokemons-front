import TablePokemons from "./Components/Table";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ApiService from "./Services/ApiService";
import { PokemonData, PokemonwithImage, Result } from "./Interfaces/PokeApiResponse";
import ProgressBar from "../../shared/LoadingBar";
import "../../../index.css";

export default function Pokemons() {
	const [pokemonsWithImages, setPokemonsWithImages] = useState<PokemonwithImage[] | null>(
		[]
	);
	const [count, setCount] = useState(0);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [progress, setProgress] = useState(0);

	const { data, isLoading, error } = useQuery({
		queryKey: ["pokemons", page, rowsPerPage],
		queryFn: async () => {
			setProgress(30);
			const response = await ApiService.getPokemons(
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

	useEffect(() => {
		if (!data) return;
		setCount(data.count);

		const fetchPokemonDetails = async () => {
			const pokemons = await Promise.all(
				data?.results.map(async (pokemon: Result) => {
					const details: PokemonData | null = await ApiService.getPokemonDetails(
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
		<div className="container-fluid px-10 pt-5 pb-0">
			{isLoading ? (
				<>
					<ProgressBar progress={progress} />
				</>
			) : error ? (
				<div className="card">Error loading data</div>
			) : pokemonsWithImages !== null && pokemonsWithImages?.length > 0 ? (
				<div className="">
					<TablePokemons
						data={pokemonsWithImages}
						page={page}
						rowsPerPage={rowsPerPage}
						onPageChange={setPage}
						onRowsPerPageChange={setRowsPerPage}
						count={count}
					/>
				</div>
			) : (
				<div className="card">No data</div>
			)}
		</div>
	);
}
