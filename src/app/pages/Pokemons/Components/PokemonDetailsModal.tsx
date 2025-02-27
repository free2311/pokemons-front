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
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: "100vh",
				}}
			>
				<Box
					sx={{
						p: 4,
						bgcolor: "background.paper",
						minWidth: { xs: "300px", sm: "400px", md: "35%", lg: "30%" },
						maxWidth: "400px",
						borderRadius: "8px",
						boxShadow: 24,
						outline: "none",
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							mb: 2,
						}}
					>
						<Box sx={{ flexGrow: 1, textAlign: "center" }}>
							<Typography variant="h6" id="parent-modal-title">
								Detalles del Pokémon
							</Typography>
						</Box>
						<Typography variant="body1" sx={{ cursor: "pointer" }} onClick={onClose}>
							X
						</Typography>
					</Box>

					<SimpleTreeView>
						<Typography variant="body1" sx={{ mb: 1 }}>
							Tipo:
						</Typography>
						{pokemon?.types?.map((type, index) => (
							<TreeItem
								itemId={String(type?.slot)}
								key={index}
								label={type.type.name ? "- " + capitalize(type.type.name) : ""}
								className="mb-10"
								sx={{
									pointerEvents: "none",
								}}
							></TreeItem>
						))}
					</SimpleTreeView>

					<Typography variant="body1" sx={{ mb: 1 }}>
						Peso: {pokemon?.weight} Kg
					</Typography>

					<Typography variant="body1" sx={{ mb: 1 }}>
						Habilidades:
					</Typography>

					<SimpleTreeView>
						{pokemon?.abilities?.map((ability, index) => (
							/* Este elemento */
							<TreeItem
								itemId={String(ability?.slot)}
								key={index}
								label={ability.ability.name ? capitalize(ability.ability.name) : ""}
								className="mb-10"
							>
								{data && <Box key={index}>{data[index]?.effect}</Box>}
							</TreeItem>
						))}
					</SimpleTreeView>
				</Box>
			</Box>
		</Modal>
	);
};

export default PokemonDetailsModal;
