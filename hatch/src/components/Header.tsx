import { NavLink } from "react-router";
import { brand } from "../lib/brand";
import { useAuth } from "../store/authStore";

const navLink = ({ isActive }: { isActive: boolean }) =>
	`${brand.subtleButton} h-10 px-4 ${isActive ? "border-[var(--color-text)] bg-[var(--color-text)] text-[#f8f4ed]" : ""}`;

export const Header = () => {
	const authorizedUser = useAuth((state) => state.auth);

	return (
		<header className="border-b border-(--color-line) bg-(--color-bg)/95 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8">
			<nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
				{authorizedUser ? (
					<NavLink
						to="/"
						className="flex items-center gap-3 transition-opacity hover:opacity-70">
						<div className="grid size-12 place-items-center  border border-(--color-line) bg-(--color-panel) text-4xl text-(--color-text)">
							{brand.logo}
						</div>
						<div>
							<p className={brand.kicker}>File tree</p>
							<p className="text-lg font-semibold tracking-tighter text-(--color-text)">
								{brand.app}
							</p>
						</div>
					</NavLink>
				) : (
					<>
						<div className=" flex flex-1" />
						<div className="flex items-center gap-2 sm:gap-3 ">
							<NavLink className={navLink} to="/auth/login">
								Log in
							</NavLink>
							<NavLink
								style={{ color: "#f8f4ed" }}
								className={`${brand.buttonInline} px-4 `}
								to="/auth/register">
								Sign up
							</NavLink>
						</div>
					</>
				)}
			</nav>
		</header>
	);
};
