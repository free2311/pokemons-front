import { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
} from "@mui/material";
import { PokemonWithImage } from "../interfaces/PokeApiResponse";
import PokemonDetailsModal from "./PokemonDetailsModal";

const capitalize = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function TablePokemons({
	data,
	page,
	rowsPerPage,
	onPageChange,
	onRowsPerPageChange,
	count,
}: {
	data: PokemonWithImage[];
	page: number;
	rowsPerPage: number;
	onPageChange: (newPage: number) => void;
	onRowsPerPageChange: (newRowsPerPage: number) => void;
	count: number;
}) {
	const [selectedPokemon, setSelectedPokemon] = useState<PokemonWithImage | null>(null);

	const handleChangePage = (event: unknown, newPage: number) => {
		onPageChange(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		onRowsPerPageChange(parseInt(event.target.value, 10));
		onPageChange(0);
	};

	const handleImageDoubleClick = (pokemon: PokemonWithImage) => {
		setSelectedPokemon(pokemon);
	};

	const handleClick = (pokemon: PokemonWithImage) => {
		if (window.innerWidth <= 1024) {
			setSelectedPokemon(pokemon);
		}
	};

	const handleCloseModal = () => {
		setSelectedPokemon(null);
	};

	const rows = ["Nombre", "Imagen Pokemón"];

	return (
		<div className="">
			<>
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
							{data?.length === 0 ? (
								<TableRow>
									<TableCell colSpan={2} align="center">
										<h6>No se encontraron resultados</h6>
									</TableCell>
								</TableRow>
							) : (
								data?.map((item: PokemonWithImage, index: number) => (
									<TableRow key={index} className="align-center">
										<TableCell align="center" className="border border-gray-200">
											<h6>{item?.name ? capitalize(item.name) : "Sin Información"}</h6>{" "}
										</TableCell>
										<TableCell align="center" className="border border-gray-200">
											<img
												src={item?.image}
												alt={item?.name}
												className="block mx-auto"
												onClick={() => handleClick(item)}
												onDoubleClick={() => handleImageDoubleClick(item)}
											/>
										</TableCell>
									</TableRow>
								))
							)}
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
		</div>
	);
}
