import { Navigate, Outlet } from "react-router";
import { useAuth } from "../store/authStore";

export const AuthLayout = () => {
	const authorizedUser = useAuth((state) => state.auth);
	if (!authorizedUser) {
		return <Navigate to="/auth/login" />;
	}

	return <Outlet />;
};
