import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PokeService from "./services/PokeService";
import ProgressBar from "../../shared/LoadingBar";
import "../../../index.css";
import SearchField from "./Components/SearchField";
import CardPokeDetail from "./Components/CardPokeDetail";
import { Pagination } from "@mui/material";
import { styled } from "@mui/material/styles";
import PaginationItem from "@mui/material/PaginationItem";

const CustomPagination = styled(Pagination)(({ theme }) => ({
	"& .MuiPaginationItem-root": {
		fontWeight: "bold",
		borderRadius: "8px",
		"&.Mui-selected": {
			backgroundColor: "white",
			color: "black",
		},
		"&:hover": {
			backgroundColor: "white",
		},
	},
}));

export default function Pokemons() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [progress, setProgress] = useState(0);

	const {
		data: { info: pokemonsWithImages, countTotal: count } = { info: [], countTotal: 0 },
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ["pokemons", page, rowsPerPage],
		queryFn: async () => {
			setProgress(30);
			const response = await PokeService.getPokemons(
				rowsPerPage.toString(),
				(page * rowsPerPage).toString(),
				search
			);
			setProgress(70);

			return response;
		},
	});

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<>
			{isLoading ? (
				<>
					<ProgressBar progress={progress} />
				</>
			) : (
				<div className="bg-red-500 p-10 min-h-screen">
					<SearchField value={search} setInputValue={setSearch} refetch={refetch} />

					<div className="grid sm:grid-cols-2 md:!grid-cols-3 lg:!grid-cols-4 gap-5">
						{!pokemonsWithImages || pokemonsWithImages.length == 0 ? (
							<h1>No se encontraron resultados </h1>
						) : (
							<>
								{pokemonsWithImages?.map((pokemon) => (
									<CardPokeDetail
										pokemon={pokemon}
										page={page}
										rowsPerPage={rowsPerPage}
										onPageChange={setPage}
										onRowsPerPageChange={setRowsPerPage}
										count={count}
									/>
								))}
							</>
						)}
					</div>

					<div className="flex flex-col items-center justify-center mt-5">
						<CustomPagination
							count={Math.ceil(count / rowsPerPage)}
							defaultPage={1}
							page={page + 1}
							onChange={(event, newPage) => handleChangePage(event, newPage - 1)}
							renderItem={(item) => <PaginationItem {...item} />}
						/>
					</div>
				</div>
			)}
		</>
	);
}
