import { Outlet } from "react-router";

export const AuthLayout = () => {
	return (
		<>
			<p>im in the authlayout! AND</p>
			<Outlet />
		</>
	);
};
