import { Navigate, Outlet } from "react-router";

export const ProtectedLayout = () => {
	const isLoggedIn = localStorage.getItem("user");

	if (!isLoggedIn) {
		return <Navigate to="/auth/login" />;
	}

	return <Outlet />;
};
