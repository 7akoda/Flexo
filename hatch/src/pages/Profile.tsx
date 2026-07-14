import { brand } from "../lib/brand";

export const Profile = () => {
	return (
		<div className={brand.page}>
			<div className={brand.center}>
				<section className={`${brand.panel} max-w-2xl`}>
					<div className={brand.windowBar}>
						<span>Profile</span>
						<span>user.ini</span>
					</div>
					<p className={brand.kicker}>Profile</p>
					<h2 className="mt-3 editorial-title text-4xl text-[var(--color-text)]">
						Profile page
					</h2>
				</section>
			</div>
		</div>
	);
};
