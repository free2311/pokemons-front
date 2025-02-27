import TablePokemons from "./components/Table";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PokeService from "./services/PokeService";
import ProgressBar from "../../shared/LoadingBar";
import "../../../index.css";
import SearchField from "./components/SearchField";

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
						<SearchField value={search} setInputValue={setSearch} refetch={refetch} />
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
