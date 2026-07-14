import { brand } from "../lib/brand";

export const BrandLockup = ({
	subtitle,
	title = brand.app,
}: {
	subtitle?: string;
	title?: string;
}) => (
	<div className="flex items-center gap-4">
		<div className={`${brand.iconBox} size-14 text-3xl`}>{brand.logo}</div>
		<div>
			{subtitle && <p className={brand.kicker}>{subtitle}</p>}
			<h1 className="text-3xl font-semibold tracking-[-0.05em] text-[var(--color-text)] sm:text-4xl">
				{title}
			</h1>
		</div>
	</div>
);
