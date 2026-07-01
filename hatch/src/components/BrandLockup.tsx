import { brand } from "../lib/brand";

export const BrandLockup = ({
	subtitle,
	title = brand.app,
}: {
	subtitle?: string;
	title?: string;
}) => (
	<div className="flex items-center gap-4">
		<div className="grid size-14 place-items-center rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] text-3xl text-[var(--color-text)]">
			{brand.logo}
		</div>
		<div>
			{subtitle && <p className={brand.kicker}>{subtitle}</p>}
			<h1 className="text-3xl font-semibold tracking-[-0.06em] text-[var(--color-text)] sm:text-4xl">
				{title}
			</h1>
		</div>
	</div>
);
