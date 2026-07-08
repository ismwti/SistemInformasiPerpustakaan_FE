<script>
	import { authState, logout } from '$lib/auth.svelte.js';
	import { goto } from '$app/navigation';

	let { children } = $props();

	function keluar() {
		logout();
		goto('/login');
	}
</script>

<svelte:head>
	<title>SIPERPUS</title>
</svelte:head>

<header>
	<h2>SIPERPUS</h2>

	<nav>
		<a href="/home">Home</a>
		<a href="/buku">Buku</a>
		<a href="/kategori">Kategori</a>
		<a href="/rak">Rak</a>

		{#if authState.isAuthenticated}
			<button onclick={keluar}>
				Logout
			</button>
		{/if}
	</nav>
</header>

<main>
	{@render children()}
</main>

<style>
	header {
		background: #6d4c41;
		color: white;
		padding: 15px 40px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	h2 {
		margin: 0;
	}

	nav {
		display: flex;
		gap: 20px;
		align-items: center;
	}

	a {
		color: white;
		text-decoration: none;
		font-weight: bold;
	}

	a:hover {
		text-decoration: underline;
	}

	button {
		background: white;
		color: #6d4c41;
		border: none;
		padding: 8px 14px;
		border-radius: 5px;
		cursor: pointer;
	}

	main {
		padding: 30px;
	}
</style>