import { PokemonWithImage } from "../interfaces/PokeApiResponse";
import { useState } from "react";
import PokemonDetailsModal from "./PokemonDetailsModal";

export default function CardPokeDetail({
	pokemon,
	page,
	rowsPerPage,
	onPageChange,
	onRowsPerPageChange,
	count,
}: {
	pokemon: PokemonWithImage;
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

	return (
		<>
			<div className="card text-center pb-5">
				<div className="flex justify-center">
					<img
						src={pokemon?.image}
						alt={pokemon?.name}
						onClick={() => handleClick(pokemon)}
						onDoubleClick={() => handleImageDoubleClick(pokemon)}
					/>
				</div>

				<h2>{pokemon?.name?.toUpperCase()}</h2>
			</div>

			<PokemonDetailsModal
				open={selectedPokemon != null}
				onClose={handleCloseModal}
				pokemon={selectedPokemon ? selectedPokemon : null}
			/>
		</>
	);
}
