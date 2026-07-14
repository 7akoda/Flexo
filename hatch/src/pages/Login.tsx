import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { BrandLockup } from "../components/BrandLockup";
import { brand } from "../lib/brand";
import { useAuth } from "../store/authStore";

export const Login = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [statusMessage, setStatusMessage] = useState("");
	const setAuth = useAuth((state) => state.setAuth);

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();
		const response = await fetch("http://localhost:3000/users/login", {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		});
		if (response.ok) {
			setAuth(username);
			setUsername("");
			setPassword("");
			return navigate("/");
		}
		const result = await response
			.json()
			.catch(() => ({ error: "Unable to log in." }));
		setStatusMessage(result.error);
		setTimeout(() => setStatusMessage(""), 5000);
	};

	return (
		<div className={brand.page}>
			<div className={brand.center}>
				<form
					onSubmit={handleSubmit}
					className={`${brand.panel} max-w-2xl space-y-8`}>
					<div className={brand.windowBar}>
						<span>Log in</span>
						<span>session.dll</span>
					</div>
					<div className="flex flex-col gap-4 border-b border-[var(--color-shadow)] pb-6 sm:flex-row sm:items-start sm:justify-between">
						<BrandLockup subtitle="Welcome back" />
						<div className="text-left sm:text-right">
							<p className={brand.muted}>No account?</p>
							<NavLink
								className={`${brand.accent} text-lg hover:underline`}
								to="/auth/register">
								Sign up
							</NavLink>
						</div>
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
							name="password"
							className={brand.input}
							type="password"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<button className={brand.button} type="submit">
						Log in
					</button>
					<p className="min-h-5 text-sm text-[var(--color-muted)]">
						{statusMessage}
					</p>
				</form>
			</div>
		</div>
	);
};
