import { NavLink } from "react-router";

import { Workspace } from "../components/Workspace";
import { brand } from "../lib/brand";
import { useAuth } from "../store/authStore";

export const Home = () => {
	const authorizedUser = useAuth((state) => state.auth);

	return (
		<div className={brand.page}>
			{authorizedUser ? (
				<Workspace />
			) : (
				<div className={brand.center}>
					<section className={`${brand.panel} max-w-6xl`}>
						<div className={brand.windowBar}>
							<span>Welcome</span>
							<span>Flexo.exe</span>
						</div>
						<div className="grid gap-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(17rem,0.55fr)] lg:items-end">
							<div className="space-y-8">
								<div className="space-y-4">
									<p className={brand.kicker}>Personal file manager</p>

									<h2 className="editorial-display max-w-3xl text-6xl sm:text-7xl lg:text-[6.1rem]"></h2>
								</div>
								<div className="flex flex-wrap gap-3 pt-2">
									<NavLink
										className={`${brand.buttonInline} min-w-40`}
										to="/auth/register">
										Get started
									</NavLink>
									<NavLink
										className={`${brand.subtleButton} h-12 min-w-40`}
										to="/auth/login">
										Sign in
									</NavLink>
								</div>
							</div>
						</div>
					</section>
				</div>
			)}
		</div>
	);
};
