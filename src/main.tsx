import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Pokemons from "./app/pages/Pokemons/Pokemons";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<Router>
		<QueryClientProvider client={queryClient}>
			<Routes>
				{/* Rutas */}
				<Route path="*" element={<Pokemons />} />
				<Route path="/" element={<Pokemons />} />
				<Route path="/pokemons" element={<Pokemons />} />
			</Routes>
			<ToastContainer />
		</QueryClientProvider>
	</Router>
);
