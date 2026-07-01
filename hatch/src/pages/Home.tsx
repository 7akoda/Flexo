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
						<div className="grid gap-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(17rem,0.55fr)] lg:items-end">
							<div className="space-y-8">
								<div className="space-y-4">
									<h2 className="editorial-display max-w-3xl text-6xl sm:text-7xl lg:text-[6.4rem]">
										Where's your head at?
									</h2>
									<p className={`editorial-copy max-w-xl ${brand.muted}`}>
										A calm workspace for keeping folders, files, and focus in
										the same place.
									</p>
								</div>
								<div className="flex flex-wrap gap-3 pt-2">
									<NavLink
										style={{ color: "#f8f4ed" }}
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
							<div className="space-y-4 border-t border-(--color-line) pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
								<p className={brand.kicker}>Why FLΣXO</p>
								{["Quiet interface", "Fast structure", "Zero ceremony"].map(
									(item) => (
										<div
											key={item}
											className={`${brand.surface} px-5 py-4 text-[1.02rem] font-medium tracking-[-0.03em] text-(--color-text)`}>
											{item}
										</div>
									),
								)}
							</div>
						</div>
					</section>
				</div>
			)}
		</div>
	);
};
