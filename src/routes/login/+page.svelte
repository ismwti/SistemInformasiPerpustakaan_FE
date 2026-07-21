<script lang="ts">
    import { goto } from '$app/navigation';
    import { loginSuccess } from '$lib/auth.svelte.js';

    let email = $state('');
    let password = $state('');
    let message = $state('');
    let messageType = $state<'error' | 'success'>('error'); // Bisa 'error' atau 'success'
    let loading = $state(false);
    let showPassword = $state(false); // State untuk kontrol lihat/sembunyi password

    function kembaliKeUtama(e: Event) {
        e.preventDefault();
        goto('/', { replaceState: true });
    }

    async function login(e: Event) {
        e.preventDefault(); 
        message = '';
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
                messageType = 'error';
                message = data.message || 'Email atau password salah.';
                return;
            }

            // Notifikasi Berhasil Login sebelum pindah halaman
            messageType = 'success';
            message = 'Login berhasil! Mengalihkan ke dashboard...';

            loginSuccess(data.token);
            
            // Beri jeda sedikit agar animasi/pesan sukses terlihat sebelum pindah
            setTimeout(() => {
                goto('/home');
            }, 1000);

        } catch (err) {
            console.error('Login error:', err);
            messageType = 'error';
            message = 'Server tidak dapat dihubungi. Pastikan API menyala.';
        } finally {
            if (messageType !== 'success') {
                loading = false;
            }
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

        <!-- KOTAK NOTIFIKASI DINAMIS (ERROR / SUCCESS) -->
        {#if message}
            <div class="alert-box {messageType}">
                {#if messageType === 'error'}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon-svg">
                        <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
                    </svg>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon-svg">
                        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
                    </svg>
                {/if}
                <span>{message}</span>
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
                    
                    <!-- Input tipe berubah dinamis (password / text) -->
                    <input 
                        type={showPassword ? 'text' : 'password'} 
                        id="password" 
                        bind:value={password} 
                        placeholder="Masukkan password rahasia..." 
                        required 
                    />

                    <!-- Tombol Ikon Mata untuk Toggle Tampil/Sembunyi Password -->
                    <button 
                        type="button" 
                        class="password-toggle-btn" 
                        onclick={() => showPassword = !showPassword}
                        title={showPassword ? "Sembunyikan password" : "Lihat password"}
                    >
                        {#if showPassword}
                            <!-- Ikon Mata Terbuka -->
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="toggle-icon">
                                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd" />
                            </svg>
                        {:else}
                            <!-- Ikon Mata Dicoret / Ditutup -->
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="toggle-icon">
                                <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.242 11.242 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.15 4.095a11.332 11.332 0 014.851-1.095c4.97 0 9.185 3.223 10.675 7.69.052.156.082.322.1.488z" />
                                <path d="M11.583 14.332l-2.915-2.915a3 3 0 004.162 4.162l-1.247-1.247z" />
                                <path d="M7.785 9.53l-3.35-3.35A11.286 11.286 0 001.323 11.447c-.12.362-.12.752 0 1.113 1.387 4.168 5.12 7.19 9.593 7.618l-1.52-1.52a8.27 8.27 0 01-1.611-7.128z" />
                            </svg>
                        {/if}
                    </button>
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
    .login-form { display: flex; flex-direction: column; gap: 20px; }
    .input-group { display: flex; flex-direction: column; gap: 6px; }
    label { font-size: 11px; font-weight: 700; color: #94a3b8; letter-spacing: 0.5px; }
    
    .input-wrapper-inner {
        position: relative;
        display: flex;
        align-items: center;
    }

    .field-icon-svg {
        position: absolute;
        left: 16px;
        width: 18px;
        height: 18px;
        color: #94a3b8;
        pointer-events: none;
        z-index: 2;
    }

    /* Style untuk tombol toggle lihat password */
    .password-toggle-btn {
        position: absolute;
        right: 16px;
        background: transparent;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 0;
        z-index: 2;
    }

    .toggle-icon {
        width: 18px;
        height: 18px;
        color: #94a3b8;
        transition: color 0.2s;
    }
    .password-toggle-btn:hover .toggle-icon {
        color: #0284c7;
    }

    input { 
        width: 100%;
        padding: 14px 46px 14px 46px; /* Padding kanan ditambah supaya teks tidak menabrak tombol mata */
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
    
    /* Perbaikan selector focus ikon supaya menggunakan operator ~ */
    input:focus ~ .field-icon-svg {
        color: #38bdf8;
    }
    input::placeholder { color: #cbd5e1; }
    
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

    /* Kotak Notifikasi / Alert Dinamis (Error atau Success) */
    .alert-box { 
        padding: 12px 16px; 
        border-radius: 12px; 
        font-size: 13px; 
        margin-bottom: 20px; 
        font-weight: 500; 
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .alert-box.error {
        background: #fef2f2; 
        border: 1px solid #fee2e2; 
        color: #ef4444; 
    }
    .alert-box.success {
        background: #f0fdf4;
        border: 1px solid #dcfce7;
        color: #16a34a;
    }
    
    .icon-svg {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
    }

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
        background: transparent;
        border: none;
        cursor: pointer;
        width: 100%;
    }
    .btn-back:hover { color: #0284c7; }
    .btn-back:hover .icon-svg { color: #0284c7; }

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