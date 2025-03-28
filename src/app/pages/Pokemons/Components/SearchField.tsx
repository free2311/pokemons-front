import { TextField } from "@mui/material";

type SearchFieldProps = {
	value: string;
	refetch: () => void;
	setInputValue: (value: string) => void;
};

const SearchField = ({ value, setInputValue, refetch }: SearchFieldProps) => {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		// Validar solo letras y espacios
		if (!/^[a-zA-Z\s]*$/.test(newValue)) return;
		if (newValue == "") {
			setInputValue("");
		}
		setInputValue(newValue);
	};

	const handleKeyPress = async (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Backspace" && value === "") {
			await refetch();
		}

		if (e.key === "Enter") {
			await refetch();
		}
	};

	return (
		<div className="w-full lg:w-4/5 max-w-[1200px] mx-auto block mb-5">
			<TextField
				label="Buscar Pokémon"
				variant="outlined"
				fullWidth
				margin="normal"
				value={value}
				onChange={handleChange}
				onKeyDown={handleKeyPress}
				className="bg-white"
			/>
		</div>
	);
};

export default SearchField;
