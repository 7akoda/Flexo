import { NavLink } from "react-router";

export const Header = () => {
	return (
		<header>
			<nav>
				<ul>
					<li>
						<NavLink
							className={({ isActive }) =>
								isActive ? "bg-amber-300" : "bg-red-900"
							}
							to="/">
							home
						</NavLink>
					</li>
					<li>
						<NavLink
							className={({ isActive }) =>
								isActive ? "bg-amber-300" : "bg-red-900"
							}
							to="/about">
							about
						</NavLink>
					</li>
					<li>
						<NavLink
							className={({ isActive }) =>
								isActive ? "bg-amber-300" : "bg-red-900"
							}
							to="/auth/register">
							register
						</NavLink>
					</li>
					<li>
						<NavLink
							className={({ isActive }) =>
								isActive ? "bg-amber-300" : "bg-red-900"
							}
							to="/auth/login">
							login
						</NavLink>
					</li>
				</ul>
			</nav>
		</header>
	);
};
