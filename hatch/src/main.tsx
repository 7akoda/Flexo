import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import { App } from "./App";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AuthLayout } from "./layouts/AuthLayout";
import { ProtectedLayout } from "./layouts/ProtectedLayout";
import { Dashboard } from "./pages/Dashboard";
import { Profile } from "./pages/Profile";
const router = createBrowserRouter([
	{
		path: "/",
		Component: App,
		children: [
			{ index: true, Component: Home },
			{ path: "about", Component: About },
			{
				path: "auth",
				Component: AuthLayout,
				children: [
					{ path: "login", Component: Login },
					{ path: "register", Component: Register },
				],
			},
			{
				Component: ProtectedLayout,
				children: [
					{ path: "dashboard", Component: Dashboard },
					{ path: "profile", Component: Profile },
				],
			},
		],
		//add loader later?
	},
]);
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
