// index.js
import { app, BrowserWindow, globalShortcut, screen, ipcMain } from "electron";

let win = null;
let clickThrough = false;
let isVisible = true;

const createWindow = () => {
	const { width, height } = screen.getPrimaryDisplay().size;

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
};

const registerShortcuts = () => {
	// Toggle overlay visibility
	globalShortcut.register("Control+Alt+G", () => {
		if (!win) return;
		isVisible = !isVisible;

		if (isVisible) {
			win.show();
			if (!clickThrough) win.setFocusable(true);
			win.setAlwaysOnTop(true, "screen-saver");
		} else {
			win.hide();
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
