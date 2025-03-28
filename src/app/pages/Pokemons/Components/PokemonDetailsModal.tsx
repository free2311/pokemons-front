import { Modal, Box, Typography } from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { PokemonWithImage } from "../interfaces/PokeApiResponse";
import PokeService from "../services/PokeService";
import { useQuery } from "@tanstack/react-query";

const capitalize = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const PokemonDetailsModal = (props: {
	open: boolean;
	onClose: () => void;
	pokemon: PokemonWithImage | null;
}) => {
	const { open, onClose, pokemon } = props;
	const { data } = useQuery({
		queryKey: ["abilities", pokemon],
		queryFn: async () => PokeService.getDescriptionAbilities(pokemon?.abilities),
		staleTime: 1000 * 60 * 5,
		retry: 0,
		refetchOnWindowFocus: false,
		enabled: !!pokemon?.abilities,
	});

	return (
		<Modal
			open={open}
			onClose={onClose}
			aria-labelledby="parent-modal-title"
			aria-describedby="parent-modal-description"
		>
			<div className="flex items-center justify-center h-screen">
				<Box className="p-10 bg-white w-max sm:w-40 md:w-90 lg:w-100 radius-8 shadow-24 outline-none">
					<Box className="flex items-center justify-between mb-2">
						<Box sx={{ flexGrow: 1, textAlign: "center" }}>
							<Typography variant="h6" id="parent-modal-title">
								Detalles del Pokémon
							</Typography>
						</Box>
						<Typography variant="body1" className="cursor-pointer" onClick={onClose}>
							X
						</Typography>
					</Box>

					<SimpleTreeView>
						<Typography variant="body1" className="!mb-2">
							Tipo:
						</Typography>
						{pokemon?.types?.map((type, index) => (
							<TreeItem
								itemId={String(type?.slot)}
								key={index}
								label={type.type.name ? "- " + capitalize(type.type.name) : ""}
								className="!mb-2 pointer-events-none"
							></TreeItem>
						))}
					</SimpleTreeView>

					<Typography variant="body1" className="!mb-2">
						Peso: {pokemon?.weight} Kg
					</Typography>

					<Typography variant="body1" className="!mb-2">
						Habilidades:
					</Typography>

					<SimpleTreeView>
						{pokemon?.abilities?.map((ability, index) => (
							/* Este elemento */
							<TreeItem
								itemId={String(ability?.slot)}
								key={index}
								label={ability.ability.name ? capitalize(ability.ability.name) : ""}
								className="!mb-2"
							>
								{data && <Box key={index}>{data[index]?.effect}</Box>}
							</TreeItem>
						))}
					</SimpleTreeView>
				</Box>
			</div>
		</Modal>
	);
};

export default PokemonDetailsModal;
