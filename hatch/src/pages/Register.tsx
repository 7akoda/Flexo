import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { BrandLockup } from "../components/BrandLockup";
import { brand } from "../lib/brand";

const rules = [
	{ key: "len", label: "8+ chars", test: (v: string) => v.length >= 8 },
	{ key: "upper", label: "Uppercase", test: (v: string) => /[A-Z]/.test(v) },
	{ key: "lower", label: "Lowercase", test: (v: string) => /[a-z]/.test(v) },
	{ key: "num", label: "Number", test: (v: string) => /\d/.test(v) },
	{
		key: "special",
		label: "Special char",
		test: (v: string) => /[!@#$%^&*(),.?":{}|<>]/.test(v),
	},
	{
		key: "comp",
		label: "Matching",
		test: (v: string, v2 = "") => v === v2 && !!v && !!v2,
	},
];

export const Register = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password1, setPassword1] = useState("");
	const [password2, setPassword2] = useState("");
	const [statusMessage, setStatusMessage] = useState("");
	const passwordReady = rules.every(({ test }) => test(password1, password2));

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();
		const response = await fetch("http://localhost:3000/users/register", {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password: password1 }),
		});
		if (response.ok) {
			setUsername("");
			setPassword1("");
			setPassword2("");
			return navigate("/auth/login");
		}
		const result = await response
			.json()
			.catch(() => ({ error: "Unable to register." }));
		setStatusMessage(result.error);
		setTimeout(() => setStatusMessage(""), 5000);
	};

	return (
		<div className={brand.page}>
			<div className={brand.center}>
				<form
					onSubmit={handleSubmit}
					className={`${brand.panel} max-w-2xl space-y-8`}>
					<div className="flex flex-col gap-4 border-b border-(--color-line) pb-6 sm:flex-row sm:items-start sm:justify-between">
						<BrandLockup subtitle="Create account" />
						<div className="text-left sm:text-right">
							<p className={brand.muted}>Already registered?</p>
							<NavLink
								className={`${brand.accent} text-lg transition-opacity hover:opacity-60`}
								to="/auth/login">
								Sign in
							</NavLink>
						</div>
					</div>
					<div className="space-y-3">
						<h2 className="editorial-title text-6xl sm:text-7xl">Sign up</h2>
						<p className={`editorial-copy max-w-lg ${brand.muted}`}>
							Set up your workspace in a few seconds.
						</p>
					</div>
					<div className="space-y-3">
						<input
							name="email"
							className={brand.input}
							type="email"
							placeholder="Email"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<input
							name="password1"
							className={brand.input}
							type="password"
							placeholder="Password"
							value={password1}
							onChange={(e) => setPassword1(e.target.value)}
						/>
						<input
							name="password2"
							className={brand.input}
							type="password"
							placeholder="Confirm password"
							value={password2}
							onChange={(e) => setPassword2(e.target.value)}
						/>
					</div>
					<div className="flex flex-wrap gap-2">
						{rules.map(({ key, label, test }) => {
							const ok = test(password1, password2);
							return (
								<span
									key={key}
									className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${ok ? brand.tag.on : brand.tag.off}`}>
									{ok ? "✓" : "✗"} {label}
								</span>
							);
						})}
					</div>
					<button
						disabled={!passwordReady}
						className={brand.button}
						type="submit">
						Sign up
					</button>
					<p className="min-h-5 text-sm text-(--color-muted)">
						{statusMessage}
					</p>
				</form>
			</div>
		</div>
	);
};
