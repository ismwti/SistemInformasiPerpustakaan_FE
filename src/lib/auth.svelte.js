// src/lib/auth.svelte.js
import { browser } from '$app/environment';

// Ambil token dari localStorage jika ada
const token = browser ? localStorage.getItem('token') : null;

// State autentikasi
export const authState = $state({
	token,
	isAuthenticated: !!token
});

// Login berhasil
export function loginSuccess(token) {
	authState.token = token;
	authState.isAuthenticated = true;

	if (browser) {
		localStorage.setItem('token', token);
	}
}

// Logout
export function logout() {
	authState.token = null;
	authState.isAuthenticated = false;

	if (browser) {
		localStorage.removeItem('token');
	}
}

// Mengambil token
export function getToken() {
	return authState.token;
}