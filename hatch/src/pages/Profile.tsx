import { brand } from "../lib/brand";

export const Profile = () => {
	return (
		<div className={brand.page}>
			<div className={brand.center}>
				<section className={`${brand.panel} max-w-2xl`}>
					<p className={brand.kicker}>Profile</p>
					<h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-(--color-text)">
						Profile page
					</h2>
				</section>
			</div>
		</div>
	);
};
