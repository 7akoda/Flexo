import { NavLink } from "react-router";
import { brand } from "../lib/brand";
import { useAuth } from "../store/authStore";

const navLink = ({ isActive }: { isActive: boolean }) =>
	`${brand.subtleButton} h-10 px-4 ${isActive ? "is-active" : ""}`;

export const Header = () => {
	const authorizedUser = useAuth((state) => state.auth);

	return (
		<header className="px-4 py-4 sm:px-6 lg:px-8">
			<nav className="win98-panel mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-5">
				<NavLink
					to="/"
					className="flex items-center gap-3 transition-opacity hover:opacity-80">
					<div className={`${brand.iconBox} size-12 text-3xl`}>
						{brand.logo}
					</div>
					<div>
						<p className={brand.kicker}>Desktop</p>
						<p className="text-lg font-semibold tracking-[-0.04em] text-[--color-text]">
							{brand.app}
						</p>
					</div>
				</NavLink>
				<div className="flex items-center gap-2 sm:gap-3">
					{authorizedUser && (
						<>
							<NavLink className={navLink} to="/profile">
								Profile
							</NavLink>
						</>
					)}
				</div>
			</nav>
		</header>
	);
};
