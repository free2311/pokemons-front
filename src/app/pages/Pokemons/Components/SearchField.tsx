import { TextField } from "@mui/material";
import { useState, useCallback } from "react";
import debounce from "lodash.debounce";

const SearchField = (props: { value: string; onChange: (value: string) => void }) => {
	const { value, onChange } = props;
	const [inputValue, setInputValue] = useState(value);

	const debouncedOnChange = useCallback(
		debounce((val: string) => {
			onChange(val);
		}, 1000),
		[onChange]
	);
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;

		// Validar solo letras y espacios
		if (/^[a-zA-Z\s]*$/.test(newValue)) {
			setInputValue(newValue);
			debouncedOnChange(newValue);
		}
	};

	return (
		<TextField
			label="Buscar Pokémon"
			variant="outlined"
			fullWidth
			margin="normal"
			value={inputValue}
			onChange={handleChange}
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
