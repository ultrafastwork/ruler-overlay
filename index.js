// index.js
import { app, BrowserWindow, globalShortcut, screen, ipcMain } from "electron";

let win = null;
let clickThrough = false;
let isVisible = false; // Start hidden, so first Ctrl+Alt+G shows the overlay

const createWindow = () => {
	const { width, height } = screen.getPrimaryDisplay().size;
	console.log("Creating window with dimensions:", width, "x", height);

	win = new BrowserWindow({
		x: 0,
		y: 0,
		width,
		height,
		frame: false,
		transparent: true,
		resizable: true,
		alwaysOnTop: true,
		skipTaskbar: true,
		hasShadow: false,
		backgroundColor: "#00000000",
		focusable: true,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	// Keep above taskbar (Windows)
	win.setAlwaysOnTop(true, "screen-saver");

	win.loadFile("index.html");

	// Start maximized (not fullscreen, so still resizable)
	win.setBounds({ x: 0, y: 0, width, height });

	// Hide window on startup - user will press Ctrl+Alt+G to show it
	win.hide();

	console.log("Window created and hidden - press Ctrl+Alt+G to show");
};

const registerShortcuts = () => {
	// Toggle overlay visibility
	globalShortcut.register("Control+Alt+G", () => {
		console.log("Ctrl+Alt+G pressed! Current isVisible:", isVisible);
		if (!win) {
			console.log("No window found!");
			return;
		}
		isVisible = !isVisible;
		console.log("Toggling visibility to:", isVisible);

		if (isVisible) {
			win.show();
			if (!clickThrough) win.setFocusable(true);
			win.setAlwaysOnTop(true, "screen-saver");
			console.log("Window shown");
		} else {
			win.hide();
			console.log("Window hidden");
		}
	});

	// Toggle click-through mode
	globalShortcut.register("Control+Alt+C", () => {
		if (!win) return;
		clickThrough = !clickThrough;

		if (clickThrough) {
			win.setIgnoreMouseEvents(true, { forward: true });
			win.setFocusable(false);
		} else {
			win.setIgnoreMouseEvents(false);
			win.setFocusable(true);
			win.setAlwaysOnTop(true, "screen-saver");
			win.focus();
		}
	});
};

app.whenReady().then(() => {
	createWindow();
	registerShortcuts();

	// Handle quit request from renderer
	ipcMain.on("quit-app", () => {
		app.quit();
	});

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("will-quit", () => {
	globalShortcut.unregisterAll();
});
