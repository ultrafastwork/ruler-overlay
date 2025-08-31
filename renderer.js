// renderer.js

(() => {
	/** @type {HTMLElement | null} */
	const badge = document.getElementById("badge");

	const root = document.documentElement;

	/**
	 * Presets for quick keyboard changes.
	 * Use a string-indexed type so `sizes[event.key]` is allowed by TS/checkJS.
	 * @type {Readonly<Record<string, string>>}
	 */
	const sizes = Object.freeze({
		1: "10px",
		2: "20px",
		3: "50px",
	});

	/**
	 * Set the CSS variable for grid size and update UI + storage.
	 * @param {string} px - CSS pixel string like "10px"
	 */
	const setSize = (px) => {
		root.style.setProperty("--grid-size", px);
		if (badge) {
			badge.textContent = `Grid: ${px} • Ctrl+Alt+G show/hide • Ctrl+Alt+C click-through`;
		}
		localStorage.setItem("grid-size", px);
	};

	// Restore last-used size if it looks like a valid "NNpx"
	const saved = localStorage.getItem("grid-size");

	if (saved && /^\d+px$/.test(saved)) {
		setSize(saved);
	}

	/** @param {KeyboardEvent} e */
	const onKeyDown = (e) => {
		const k = e.key; // string

		// Exit app on Escape key
		if (k === "Escape") {
			const { ipcRenderer } = require("electron");
			ipcRenderer.send("quit-app");
			return;
		}

		// Narrow: check that sizes has this key before indexing.
		if (Object.prototype.hasOwnProperty.call(sizes, k)) {
			// sizes is Record<string,string>, so indexing with a string is allowed
			const size = sizes[k];
			if (size) setSize(size);
		}
	};

	/** @param {WheelEvent} e */
	const onWheel = (e) => {
		if (!e.ctrlKey) return;
		// we set passive: false below, so preventDefault is allowed
		e.preventDefault();

		const raw = getComputedStyle(root).getPropertyValue("--grid-size").trim();
		const parsed = parseInt(raw, 10);
		const curr = Number.isFinite(parsed) ? parsed : 20;

		const delta = e.deltaY > 0 ? 1 : -1;
		const next = Math.max(2, Math.min(200, curr + delta));
		setSize(`${next}px`);
	};

	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("wheel", onWheel, { passive: false });
})();
