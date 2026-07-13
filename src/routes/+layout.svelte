<!-- src/routes/+layout.svelte -->
<script>
    import { authState } from '$lib/auth.svelte.js';
    let { children } = $props();
</script>

<svelte:head>
    <!-- Import font Google Plus Jakarta Sans agar serasi dengan komponen lainnya -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin=''>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <title>SIPERPUS</title>
</svelte:head>

<!-- Konten Utama langsung di-render tanpa Navbar cokelat atas yang mengganggu sidebar baru -->
<main class="app-main-wrapper">
    {@render children()}
</main>

<style>
    /* Reset CSS Global untuk konsistensi seluruh halaman */
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        background-color: #f4f8fa;
        color: #0f172a;
        min-height: 100vh;
    }

    .app-main-wrapper {
        min-height: 100vh;
        width: 100%;
        box-sizing: border-box;
    }
</style>