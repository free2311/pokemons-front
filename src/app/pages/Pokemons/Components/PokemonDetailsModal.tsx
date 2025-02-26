import { Modal, Box, Typography } from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { PokemonwithImage } from "../Interfaces/PokeApiResponse";
import ApiService from "../Services/ApiService";
import { useQuery } from "@tanstack/react-query";

const PokemonDetailsModal = (props: {
	open: boolean;
	onClose: () => void;
	pokemon: PokemonwithImage | null;
}) => {
	const { open, onClose, pokemon } = props;
	const { data } = useQuery({
		queryKey: ["abilities", pokemon],
		queryFn: async () => ApiService.getDescriptionAbilities(pokemon?.abilities),
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
						width: "400px",
						borderRadius: "8px",
						boxShadow: 24,
						outline: "none",
					}}
				>
					<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
						<Typography variant="body1" sx={{ cursor: "pointer" }} onClick={onClose}>
							X
						</Typography>
					</Box>
					<Typography variant="h6" id="parent-modal-title" sx={{ mb: 2 }}>
						Detalles del Pokémon
					</Typography>

					<Typography variant="body1" sx={{ mb: 1 }}>
						Tipo:
						<SimpleTreeView>
							{pokemon?.types?.map((type, index) => (
								<TreeItem
									itemId={String(type?.slot)}
									key={index}
									label={type.type.name ? type.type.name : ""}
									className="mb-10"
								></TreeItem>
							))}
						</SimpleTreeView>
					</Typography>

					<Typography variant="body1" sx={{ mb: 1 }}>
						Peso: {pokemon?.weight} Kg
					</Typography>
					<Typography variant="body1" sx={{ mb: 1 }}>
						Habilidades:
					</Typography>

					<SimpleTreeView>
						{pokemon?.abilities?.map((ability, index) => (
							<TreeItem
								itemId={String(ability?.slot)}
								key={index}
								label={ability.ability.name ? ability.ability.name : ""}
								className="mb-10"
							>
								{data && (
									<TreeItem
										itemId={`abilitypokemon-${index}`}
										key={index}
										label={data[index]?.effect}
									/>
								)}
							</TreeItem>
						))}
					</SimpleTreeView>
				</Box>
			</Box>
		</Modal>
	);
};

export default PokemonDetailsModal;
