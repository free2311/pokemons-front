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
		<TextField
			label="Buscar Pokémon"
			variant="outlined"
			fullWidth
			margin="normal"
			value={value}
			onChange={handleChange}
			onKeyDown={handleKeyPress}
			sx={{
				width: { xs: "100%", sm: "100%", lg: "80%" },
				maxWidth: "1200px",
				margin: "auto",
				display: "block",
				marginBottom: "20px",
			}}
		/>
	);
};

export default SearchField;
