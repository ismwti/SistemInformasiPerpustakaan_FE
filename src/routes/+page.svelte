<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { authState, logout } from '$lib/auth.svelte.js';

    const logoUrl = "/logo.png";

    onMount(() => {
        if (authState.isAuthenticated) {
            goto('/buku');
        }
    });
</script>

<div class="landing-hero-wrapper">
    <!-- Dekorasi Background Elegan (Blob Gradasi Tema Cyan & Sky) -->
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>

    <main class="main-card-container">
        <!-- SEKSI LOGO & HEADER -->
        <header class="brand-header">
            <div class="logo-wrapper">
                {#if logoUrl}
                    <img src={logoUrl} alt="Logo Siperpus" class="app-logo-img" />
                {:else}
                    <!-- Placeholder Logo default bertema Cyan-Blue -->
                    <div class="default-logo-icon">
                        <span class="icon-layer layer-1">📚</span>
                        <span class="icon-layer layer-2">⚡</span>
                    </div>
                {/if}
            </div>
            
            <h1 class="app-title">Sistem Informasi Perpustakaan</h1>
            <span class="app-badge">SIPERPUS DIGITAL v2.0</span>
            
            <p class="app-subtitle">
              Selamat datang di Sistem Informasi Perpustakaan. Sistem ini membantu Anda mencari koleksi buku, melihat ketersediaan stok, dan mengetahui lokasi rak penyimpanan secara cepat dan mudah tanpa perlu login.
            </p>
        </header>

        <div class="divider-line"></div>

        <section class="navigation-menu-grid">
            <a href="/katalog" class="menu-nav-card">
                <div class="card-icon-box icon-search">
                    <span class="emoji-icon">🔍</span>
                </div>
                <div class="card-text-block">
                    <h3>Cari & Lihat Katalog</h3>
                    <p>Daftar koleksi buku, kategori, dan lokasi rak fisik real-time.</p>
                </div>
                <div class="arrow-indicator">➡️</div>
            </a>

            <a href="/login" class="menu-nav-card">
                <div class="card-icon-box icon-admin">
                    <span class="emoji-icon">🔐</span>
                </div>
                <div class="card-text-block">
                    <h3>Area Petugas</h3>
                    <p>Masuk ke sistem manajemen, pembaruan data, dan kelola rak.</p>
                </div>
                <div class="arrow-indicator">➡️</div>
            </a>
        </section>

        <footer class="app-footer">
            <p>© 2026 SIPERPUS — Dikembangkan untuk Kemudahan Akses Literasi</p>
        </footer>
    </main>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        background-color: #f4f8fa;
        overflow-x: hidden;
    }
    .landing-hero-wrapper {
        min-height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        background: radial-gradient(circle at 50% 50%, #f0f7fa 0%, #e2eff5 100%);
        padding: 40px 20px;
        box-sizing: border-box;
    }
    .bg-blob {
        position: absolute;
        width: 450px;
        height: 450px;
        border-radius: 50%;
        filter: blur(130px);
        opacity: 0.45;
        z-index: 1;
    }
    .blob-1 { background: #0ea5e9; top: -100px; left: -50px; } /* Sky Blue */
    .blob-2 { background: #06b6d4; bottom: -100px; right: -50px; } /* Cyan */

    .main-card-container {
        position: relative;
        z-index: 2;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.7);
        max-width: 700px;
        width: 100%;
        border-radius: 24px;
        padding: 48px;
        box-shadow: 0 20px 50px -12px rgba(14, 165, 233, 0.08);
        box-sizing: border-box;
        text-align: center;
    }

    .brand-header {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .logo-wrapper {
        margin-bottom: 24px;
    }
    
    .app-logo-img {
        height: 110px;
        object-fit: contain;
    }
    
    .default-logo-icon {
        position: relative;
        width: 96px;
        height: 96px;
        background: linear-gradient(135deg, #e0f2fe 0%, #cffafe 100%);
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 42px;
        box-shadow: 0 10px 20px -4px rgba(2, 132, 199, 0.15);
    }
    .icon-layer { transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .default-logo-icon:hover .icon-layer { transform: scale(1.1) rotate(8deg); }

    /* TEXT HEADER */
    .app-title {
        font-size: 38px;
        font-weight: 800;
        color: #0f172a;
        margin: 0 0 16px 0;
        letter-spacing: -1px;
        line-height: 1.2;
    }
    
    .app-badge {
        font-size: 13px;
        font-weight: 700;
        color: #0284c7;
        background: #e0f2fe;
        padding: 6px 18px;
        border-radius: 20px;
        letter-spacing: 0.5px;
        border: 1px solid #bae6fd;
    }
    
    .app-subtitle {
        font-size: 16px;
        color: #64748b;
        line-height: 1.6;
        max-width: 560px;
        margin: 24px 0 0 0;
    }

    .divider-line {
        height: 1px;
        background: linear-gradient(to right, rgba(226, 232, 240, 0), #e2e8f0 50%, rgba(226, 232, 240, 0));
        margin: 36px 0;
    }

    /* NAVIGATION CARDS */
    .navigation-menu-grid {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    .menu-nav-card {
        display: flex;
        align-items: center;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 18px;
        padding: 20px 24px;
        text-decoration: none;
        text-align: left;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
    }
    .menu-nav-card:hover {
        transform: translateY(-2px);
        border-color: #cbd5e1;
        box-shadow: 0 12px 24px -10px rgba(14, 165, 233, 0.1);
        background: #f8fafc;
    }

    /* CARD ICON HOVER EFFECT */
    .card-icon-box {
        width: 52px;
        height: 52px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20px;
        transition: transform 0.2s ease;
    }
    .icon-search { background: #ecfeff; border: 1px solid #cffafe; } /* Cyan */
    .icon-admin { background: #f0f9ff; border: 1px solid #e0f2fe; }  /* Sky Blue */
    .emoji-icon { font-size: 22px; }
    
    .menu-nav-card:hover .card-icon-box {
        transform: scale(1.05);
    }

    /* CARD TEXTS */
    .card-text-block {
        flex: 1;
    }
    .card-text-block h3 {
        margin: 0 0 4px 0;
        font-size: 16px;
        font-weight: 700;
        color: #0f172a;
    }
    .card-text-block p {
        margin: 0;
        font-size: 13px;
        color: #64748b;
        line-height: 1.4;
    }

    /* ARROW INDICATOR */
    .arrow-indicator {
        font-size: 14px;
        opacity: 0;
        transform: translateX(-10px);
        transition: all 0.2s ease;
        color: #94a3b8;
    }
    .menu-nav-card:hover .arrow-indicator {
        opacity: 1;
        transform: translateX(0);
        color: #0284c7;
    }

    /* FOOTER */
    .app-footer {
        margin-top: 44px;
        font-size: 12px;
        color: #94a3b8;
    }

    /* RESPONSIVE LAYOUT FOR MOBILE */
    @media (max-width: 640px) {
        .main-card-container { padding: 32px 20px; }
        .app-logo-img { height: 90px; }
        .default-logo-icon { width: 80px; height: 80px; font-size: 34px; }
        .app-title { font-size: 28px; }
        .app-subtitle { font-size: 14px; margin: 18px 0 0 0; }
        .menu-nav-card { padding: 16px; }
        .card-icon-box { width: 46px; height: 46px; margin-right: 14px; }
        .emoji-icon { font-size: 18px; }
    }
</style>