<script lang="ts">
    import { goto } from '$app/navigation';
    import { loginSuccess } from '$lib/auth.svelte.js';

    let email = $state('');
    let password = $state('');
    let error = $state('');
    let loading = $state(false);

    // Fungsi untuk memaksa navigasi keluar dari grup routing login ke halaman root absolute
    function kembaliKeUtama(e: Event) {
        e.preventDefault();
        goto('/', { replaceState: true });
    }

    async function login(e: Event) {
        e.preventDefault(); 
        error = '';
        loading = true;

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                error = data.message || 'Email atau password salah.';
                return;
            }

            loginSuccess(data.token);
            goto('/home');
        } catch (err) {
            console.error('Login error:', err);
            error = 'Server tidak dapat dihubungi. Pastikan API menyala.';
        } finally {
            loading = false;
        }
    }
</script>

<div class="login-wrapper">
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>

    <div class="login-card">
        <header class="login-header">
            <div class="login-logo-container">
                <img src="/logo.png" alt="Logo Siperpus" class="login-logo" />
            </div>
            <h2>Akses Petugas <span>SIPERPUS</span></h2>
            <p>Silakan login menggunakan akun petugas untuk mengakses fitur pengelolaan data perpustakaan.</p>
        </header>

        {#if error}
            <div class="error-box">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon-svg error-icon">
                    <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
                </svg>
                {error}
            </div>
        {/if}

        <form onsubmit={login} class="login-form">
            <div class="input-group">
                <label for="email">EMAIL ADMIN</label>
                <div class="input-wrapper-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="field-icon-svg">
                        <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" />
                    </svg>
                    <input 
                        type="email" 
                        id="email" 
                        bind:value={email} 
                        placeholder="Masukkan email petugas..." 
                        required 
                    />
                </div>
            </div>

            <div class="input-group">
                <label for="password">PASSWORD</label>
                <div class="input-wrapper-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="field-icon-svg">
                        <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
                    </svg>
                    <input 
                        type="password" 
                        id="password" 
                        bind:value={password} 
                        placeholder="Masukkan password rahasia..." 
                        required 
                    />
                </div>
            </div>

            <button type="submit" class="btn-login" disabled={loading}>
                {#if loading}
                    <span class="mini-spinner"></span> Memverifikasi data...
                {:else}
                    Masuk ke Sistem Dashboard
                {/if}
            </button>
        </form>

        <button type="button" onclick={kembaliKeUtama} class="btn-back">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon-svg">
                <path fill-rule="evenodd" d="M9.53 4.47a.75.75 0 010 1.06L4.81 10.25H21a.75.75 0 010 1.5H4.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z" clip-rule="evenodd" />
            </svg>
            Kembali ke Halaman Utama
        </button>
    </div>
</div>

<style>
    .login-wrapper {
        min-height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f0f6fa;
        padding: 20px;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }

    /* DEKORASI BACKDROP PASTEL BLURRY */
    .bg-blob {
        position: absolute;
        width: 450px;
        height: 450px;
        border-radius: 50%;
        filter: blur(120px);
        opacity: 0.4;
        z-index: 1;
    }
    .blob-1 { background: #38bdf8; top: -100px; left: -100px; }
    .blob-2 { background: #06b6d4; bottom: -100px; right: -100px; }

    /* CARD LOGIN SMOOTH CORNER */
    .login-card {
        position: relative;
        z-index: 2;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(226, 232, 240, 0.8);
        padding: 40px;
        max-width: 440px;
        width: 100%;
        border-radius: 24px;
        box-shadow: 0 20px 40px -15px rgba(14, 165, 233, 0.12);
        box-sizing: border-box;
    }

    /* HEADER */
    .login-header { text-align: center; margin-bottom: 32px; }
    .login-logo-container {
        display: flex;
        justify-content: center;
        margin-bottom: 16px;
    }
    .login-logo {
        height: 48px;
        width: 48px;
        object-fit: contain;
    }
    .login-header h2 { margin: 0 0 8px 0; color: #0f172a; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .login-header h2 span { color: #0284c7; }
    .login-header p { margin: 0; color: #64748b; font-size: 14px; line-height: 1.5; }
    
    /* INPUT COMPONENT */
    .login-form { display: flex; flex-direction: column; gap: 20px; }
    .input-group { display: flex; flex-direction: column; gap: 6px; }
    label { font-size: 11px; font-weight: 700; color: #94a3b8; letter-spacing: 0.5px; }
    
    .input-wrapper-inner {
        position: relative;
        display: flex;
        align-items: center;
    }
    
    /* STYLE UNTUK ICON SVG DI DALAM INPUT */
    .field-icon-svg {
        position: absolute;
        left: 16px;
        width: 18px;
        height: 18px;
        color: #94a3b8;
        pointer-events: none;
    }

    input { 
        width: 100%;
        padding: 14px 16px 14px 46px; 
        border: 1px solid #e2e8f0; 
        background: #f8fafc;
        border-radius: 12px; 
        font-size: 14px; 
        color: #334155;
        outline: none; 
        box-sizing: border-box;
        transition: all 0.2s ease; 
    }
    input:focus { 
        border-color: #38bdf8; 
        background: #ffffff;
        box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.15); 
    }
    input:focus + .field-icon-svg {
        color: #38bdf8;
    }
    input::placeholder { color: #cbd5e1; }
    
    /* TOMBOL LOGIN SKY BLUE */
    .btn-login { 
        width: 100%;
        background: #0284c7; 
        color: white; 
        border: none; 
        padding: 14px; 
        border-radius: 12px; 
        font-weight: 600; 
        font-size: 14px; 
        cursor: pointer; 
        margin-top: 10px; 
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.2s ease; 
        box-shadow: 0 4px 12px rgba(2, 132, 199, 0.2);
    }
    .btn-login:hover { 
        background: #0369a1; 
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(2, 132, 199, 0.3);
    }
    .btn-login:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; }

    /* ERROR FEEDBACK BAR */
    .error-box { 
        background: #fef2f2; 
        border: 1px solid #fee2e2; 
        color: #ef4444; 
        padding: 12px 16px; 
        border-radius: 12px; 
        font-size: 13px; 
        margin-bottom: 20px; 
        font-weight: 500; 
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    /* GENERAL SVG UTILITY ICON */
    .icon-svg {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
    }
    .error-icon {
        color: #ef4444;
    }

    /* BUTTON BACK OUTLINE (SUDAH DI-RESET DARI TAG <a> KE <button>) */
    .btn-back { 
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 24px; 
        font-size: 13px; 
        color: #64748b; 
        text-decoration: none; 
        font-weight: 600; 
        transition: color 0.2s;
        /* Reset bawaan button */
        background: transparent;
        border: none;
        cursor: pointer;
        width: 100%;
    }
    .btn-back:hover { color: #0284c7; }
    .btn-back:hover .icon-svg { color: #0284c7; }

    /* MINI LOADING SPINNER */
    .mini-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
</style>