import { useState, useEffect, type MouseEvent } from "react";

export function useContextMenu() {
	const [menu, setMenu] = useState<object | null>(null);

	const handleContextMenu = (e: MouseEvent) => {
		e.preventDefault();
		setMenu({ x: e.clientX, y: e.clientY });
	};

	const closeMenu = () => setMenu(null);

	useEffect(() => {
		const handler = () => closeMenu();
		window.addEventListener("click", handler);
		window.addEventListener("scroll", handler);
		return () => {
			window.removeEventListener("click", handler);
			window.removeEventListener("scroll", handler);
		};
	}, []);

	return { menu, handleContextMenu, closeMenu };
}
