<!-- src/routes/login/+page.svelte -->
<script lang="ts">
    import { goto } from '$app/navigation';
    import { loginSuccess } from '$lib/auth.svelte.js';

    // Menggunakan Runes $state milikmu agar reaktif di Svelte 5
    let email = $state('');
    let password = $state('');
    let error = $state('');
    let loading = $state(false);

    async function login(e: Event) {
        e.preventDefault(); // Mencegah reload halaman saat submit
        error = '';
        loading = true;

        try {
            // Menggunakan endpoint asli milik backend kamu yang terbukti bisa
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
                error = data.message || 'Email atau password salah.';
                return;
            }

            // Menjalankan fungsi auth state bawaan project kamu
            loginSuccess(data.token);

            // Menuju halaman home petugas
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
    <!-- Dekorasi Background Elegan Gen-Z (Blob Gradasi Biru Muda Pastel) -->
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>

    <div class="login-card">
        <header class="login-header">
            <div class="login-icon">⚡</div>
            <h2>Akses Petugas <span>SIPERPUS</span></h2>
            <p>Silakan masuk menggunakan akun petugas yang terdaftar di database.</p>
        </header>

        {#if error}
            <div class="error-box">
                <span class="error-icon">⚠️</span> {error}
            </div>
        {/if}

        <form onsubmit={login} class="login-form">
            <div class="input-group">
                <label for="email">EMAIL ADMIN</label>
                <div class="input-wrapper-inner">
                    <span class="field-icon">👤</span>
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
                    <span class="field-icon">🔒</span>
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
                    Masuk ke Sistem Dashboard 🚀
                {/if}
            </button>
        </form>

        <a href="/" class="btn-back">
            <span>⬅️</span> Kembali ke Halaman Utama
        </a>
    </div>
</div>

<style>
    /* DESAIN PREMIUM GEN-Z LIGHT BLUE & CYAN MIX */
    .login-wrapper {
        min-height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f0f6fa; /* Latar abu-abu cerah dengan hint biru muda */
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
    .blob-1 { background: #38bdf8; top: -100px; left: -100px; } /* Sky blue */
    .blob-2 { background: #06b6d4; bottom: -100px; right: -100px; } /* Cyan */

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
        border-radius: 24px; /* Sudut membulat modern */
        box-shadow: 0 20px 40px -15px rgba(14, 165, 233, 0.12);
        box-sizing: border-box;
    }

    /* HEADER */
    .login-header { text-align: center; margin-bottom: 32px; }
    .login-icon { font-size: 32px; margin-bottom: 12px; }
    .login-header h2 { margin: 0 0 8px 0; color: #0f172a; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .login-header h2 span { color: #0284c7; } /* Aksen warna teks */
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
    .field-icon {
        position: absolute;
        left: 16px;
        font-size: 16px;
        color: #94a3b8;
    }

    input { 
        width: 100%;
        padding: 14px 16px 14px 44px; /* Space buat icon dalam input */
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

    /* BUTTON BACK OUTLINE */
    .btn-back { 
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        margin-top: 24px; 
        font-size: 13px; 
        color: #64748b; 
        text-decoration: none; 
        font-weight: 600; 
        transition: color 0.2s;
    }
    .btn-back:hover { color: #0284c7; }

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