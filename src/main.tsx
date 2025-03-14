import ReactDOM from "react-dom/client";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Pokemons from "./app/pages/Pokemons/Pokemons";
import { ToastContainer } from "react-toastify";
import QueryProvider from "./providers/QueryProvider";
import React from "react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<Router>
			<QueryProvider>
				<Routes>
					{/* Rutas */}
					<Route path="/pokemons" element={<Pokemons />} />
					<Route path="*" element={<Navigate to={"/pokemons"} />} />
				</Routes>
				<ToastContainer />
			</QueryProvider>
		</Router>
	</React.StrictMode>
);
