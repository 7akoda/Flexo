import { Outlet } from "react-router";
import "./App.css";
import { Header } from "./components/Header";

export const App = () => {
	return (
		<div>
			<Header />
			<Outlet />
		</div>
	);
};
