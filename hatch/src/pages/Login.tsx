import { useState } from "react";
import { useAuth } from "../store/authStore";
export const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const setAuth = useAuth((state) => state.setAuth);

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();
		const data = { username, password };
		const response = await fetch("http://localhost:3000/users/login", {
			method: "POST",
			credentials: "include",

			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		if (response.ok) {
			setAuth(username);
		}
		setUsername("");
		setPassword("");
		const result = await response.json();
		console.log(result);
		return result;
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<input
					type="email"
					placeholder="email"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					type="password"
					placeholder="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button className="cursor-pointer bg-cyan-400" type="submit">
					submit
				</button>
			</form>
		</>
	);
};
