import { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
} from "@mui/material";
import { PokemonData, PokemonwithImage } from "../Interfaces/PokeApiResponse";
import SearchField from "./SearchField";
import PokemonDetailsModal from "./PokemonDetailsModal";
import ApiService from "../Services/ApiService";
import { toast } from "react-toastify";

export default function TablePokemons({
	data,
	page,
	rowsPerPage,
	onPageChange,
	onRowsPerPageChange,
	count,
}: {
	data: PokemonwithImage[];
	page: number;
	rowsPerPage: number;
	onPageChange: (newPage: number) => void;
	onRowsPerPageChange: (newRowsPerPage: number) => void;
	count: number;
}) {
	const [filteredData, setFilteredData] = useState<PokemonwithImage[] | null>(data);
	const [search, setSearch] = useState("");
	const [selectedPokemon, setSelectedPokemon] = useState<PokemonwithImage | null>(null);

	useEffect(() => {
		setFilteredData(data);
	}, [data]);

	const handleChangePage = (event: unknown, newPage: number) => {
		onPageChange(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		onRowsPerPageChange(parseInt(event.target.value, 10));
		onPageChange(0);
	};

	const handleSearchChange = async (value: string) => {
		setSearch(value);

		if (value === "") {
			setFilteredData(data);
			return;
		}

		const pokemon: PokemonData | null = await ApiService.getPokemonDetails(value);

		if (pokemon == null) {
			toast.error("No se encontraron resultados", {
				position: "top-center",
				autoClose: 2000,
			});
			setFilteredData(data);
			return;
		}
		const filter_pokemon: PokemonwithImage = {
			name: pokemon.name,
			image: pokemon.sprites.front_default,
			types: pokemon.types,
			weight: pokemon.weight,
			abilities: pokemon.abilities,
		};

		if (pokemon) {
			setFilteredData([filter_pokemon]);
		}
	};

	const handleImageDoubleClick = (pokemon: PokemonwithImage) => {
		setSelectedPokemon(pokemon);
	};

	const handleCloseModal = () => {
		setSelectedPokemon(null);
	};

	const rows = ["Nombre", "Imagen Pokemón"];

	return (
		<div className="">
			{filteredData != null && filteredData?.length > 0 ? (
				<>
					<SearchField value={search} onChange={handleSearchChange} />
					<TableContainer
						sx={{
							width: { sx: "100%", sm: "100%", md: "100%", lg: "80%" },
							margin: { sx: "auto", md: "auto", lg: "auto" },
						}}
						className="table-container border border-gray-200 card"
					>
						<Table size="small" aria-label="simple table">
							<TableHead>
								<TableRow className="">
									{rows.map((row, index) => (
										<TableCell
											key={index}
											align="center"
											className="border border-gray-200"
										>
											{row}
										</TableCell>
									))}
								</TableRow>
							</TableHead>

							<TableBody>
								{filteredData?.map((item: PokemonwithImage) => (
									<TableRow key={item?.name} className="align-center">
										<TableCell align="center" className="border border-gray-200">
											<h6>{item?.name}</h6>{" "}
										</TableCell>
										<TableCell align="center" className="border border-gray-200">
											<img
												src={item?.image}
												alt={item?.name}
												className="block mx-auto"
												onDoubleClick={() => handleImageDoubleClick(item)}
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>

					<div className="flex justify-center mt-2">
						<TablePagination
							rowsPerPageOptions={[10, 25, 50]}
							component="div"
							count={count}
							page={page}
							onPageChange={handleChangePage}
							rowsPerPage={rowsPerPage}
							onRowsPerPageChange={handleChangeRowsPerPage}
							labelRowsPerPage="Registros"
						/>
					</div>

					<PokemonDetailsModal
						open={selectedPokemon != null}
						onClose={handleCloseModal}
						pokemon={selectedPokemon ? selectedPokemon : null}
					/>
				</>
			) : (
				<div className="text-center">No se encontraron resultados</div>
			)}
		</div>
	);
}
