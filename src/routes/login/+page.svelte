<script>
	import { goto } from '$app/navigation';
	import { loginSuccess } from '$lib/auth.svelte.js';

	let email = '';
	let password = '';
	let error = '';
	let loading = false;

	async function login() {
		error = '';
		loading = true;

		try {
			const response = await fetch('http://localhost:3000/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					password
				})
			});

			const data = await response.json();

			if (!response.ok) {
				error = data.message;
				return;
			}

			loginSuccess(data.token);

			goto('/home');
		} catch (err) {
			error = 'Server tidak dapat dihubungi';
		} finally {
			loading = false;
		}
	}
</script>

<div class="login-box">

	<h1>Login Petugas</h1>

	<input
		type="email"
		placeholder="Email"
		bind:value={email}
	/>

	<input
		type="password"
		placeholder="Password"
		bind:value={password}
	/>

	<button onclick={login} disabled={loading}>
		{loading ? 'Loading...' : 'Login'}
	</button>

	{#if error}
		<p class="error">{error}</p>
	{/if}

</div>

<style>

.login-box{

	width:350px;

	margin:80px auto;

	background:white;

	padding:30px;

	border-radius:10px;

	box-shadow:0 3px 8px rgba(0,0,0,.2);

}

h1{

	text-align:center;

	color:#6d4c41;

	margin-bottom:25px;

}

input{

	width:100%;

	padding:12px;

	margin-bottom:15px;

	border:1px solid #ccc;

	border-radius:6px;

	box-sizing:border-box;

}

button{

	width:100%;

	padding:12px;

	border:none;

	background:#6d4c41;

	color:white;

	border-radius:6px;

	cursor:pointer;

}

button:hover{

	background:#8d6e63;

}

.error{

	color:red;

	text-align:center;

	margin-top:15px;

}

</style>