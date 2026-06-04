import { useState } from "react";

export const Register = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();
		const data = { username: username, password: password };
		const response = await fetch("http://localhost:3000/users/register", {
			method: "POST",
			credentials: "include",

			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
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
