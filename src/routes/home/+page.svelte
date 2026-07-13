<!-- src/routes/home/+page.svelte -->
<script lang="ts">
    import { goto } from '$app/navigation';
    import { logout } from '$lib/auth.svelte.js';

    // State reaktif untuk data petugas (bisa dihubungkan ke data JWT/Auth store kamu nanti)
    let namaPetugas = $state('Administrator'); 
    let rolePetugas = $state('Petugas Aktif');

    // Mengambil huruf pertama secara dinamis untuk inisial avatar
    let inisialAvatar = $derived(namaPetugas.charAt(0).toUpperCase());

    function handleLogout() {
        if (typeof logout === 'function') {
            logout();
        } else {
            localStorage.removeItem('token'); 
        }
        goto('/'); 
    }
</script>

<div class="app-layout">
    <aside class="sidebar">
        <div class="sidebar-brand">
            <img src="/logo.png" alt="Logo Siperpus" class="brand-logo" />
            <h2>SIPERPUS</h2>
        </div>
        
        <nav class="sidebar-menu">
            <button class="menu-item active">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="sidebar-svg">
                    <path d="M11.47 3.04a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 4.56l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z" />
                    <path d="M4.5 10.5a.75.75 0 00-1.75 0V19.5a3 3 0 003 3h12.5a3 3 0 003-3v-9a.75.75 0 00-1.75 0v9a1.5 1.5 0 01-1.5 1.5H5.75A1.5 1.5 0 014.5 19.5v-9z" />
                </svg>
                <span class="menu-text">Dashboard</span>
            </button>
            <button class="menu-item" onclick={() => goto('/buku')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="sidebar-svg">
                    <path fill-rule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zM12.75 12a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V18a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V12z" clip-rule="evenodd" />
                    <path d="M14.25 5.25a.75.75 0 01.75-.75h3.625a1.75 1.75 0 011.75 1.75V9a.75.75 0 01-1.5 0V6.75h-3.875a.75.75 0 01-.75-.75z" />
                </svg>
                <span class="menu-text">Kelola Buku</span>
            </button>
            <button class="menu-item" onclick={() => goto('/kategori')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="sidebar-svg">
                    <path fill-rule="evenodd" d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c9.208.749 9.853.749 10.364 0l4.318-4.318a3 3 0 000-4.242L13.82 3.129A3 3 0 0011.699 2.25H5.25zM6 6.75a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" clip-rule="evenodd" />
                </svg>
                <span class="menu-text">Kategori</span>
            </button>
            <button class="menu-item" onclick={() => goto('/rak')}>
                <!-- SVG Icon Lokasi Rak -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="sidebar-svg">
                    <path fill-rule="evenodd" d="M3 5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25v13.5A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75V5.25zm2.25-.75a.75.75 0 00-.75.75v3h15v-3a.75.75 0 00-.75-.75H5.25zm15 5.25H4.5v3.75h15V9.75zm0 5.25H4.5v3.75a.75.75 0 00.75.75h13.5a.75.75 0 00.75-.75V15zM7.5 6.75a.75.75 0 100 1.5.75.75 0 000-1.5zm0 5.25a.75.75 0 100 1.5.75.75 0 000-1.5zm0 5.25a.75.75 0 100 1.5.75.75 0 000-1.5z" clip-rule="evenodd" />
                </svg>
                <span class="menu-text">Lokasi Rak</span>
            </button>
        </nav>

        <div class="sidebar-footer">
            <button class="btn-logout" onclick={handleLogout}>
                <!-- SVG Icon Logout -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="logout-svg">
                    <path fill-rule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9a.75.75 0 01-1.5 0V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clip-rule="evenodd" />
                </svg>
                <span class="menu-text">Keluar Aplikasi</span>
            </button>
        </div>
    </aside>

    <!-- MAIN CONTENT AREA -->
    <main class="main-content">
        <!-- 2. TOP NAVBAR DENGAN PROFIL PETUGAS DINAMIS -->
        <header class="top-navbar">
            <div class="welcome-text">
                <h3>Selamat Datang, {namaPetugas}</h3>
                <p>Berikut ringkasan data sistem informasi perpustakaan hari ini.</p>
            </div>
            <div class="user-profile">
                <div class="avatar">{inisialAvatar}</div>
                <div class="user-info">
                    <span class="name">{namaPetugas}</span>
                    <span class="role">{rolePetugas}</span>
                </div>
            </div>
        </header>

        <!-- 3. DASHBOARD STATS & QUICK ACTIONS -->
        <section class="dashboard-grid">
            
            <!-- Card Buku -->
            <div class="stat-card">
                <div class="stat-header">
                    <div class="icon-wrapper book-icon">
                        <!-- SVG Icon Buku di dalam Card -->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="card-icon-svg">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                    </div>
                    <span class="badge badge-blue">Buku</span>
                </div>
                <div class="stat-body">
                    <h4>Data Buku</h4>
                    <p>Kelola seluruh koleksi pustaka, mulai dari judul, penulis, penerbit, hingga tahun terbit buku.</p>
                </div>
                <div class="stat-footer">
                    <button class="btn-action" onclick={() => goto('/buku')}>
                        Buka Manajemen Buku 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="arrow-svg"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </button>
                </div>
            </div>

            <!-- Card Kategori -->
            <div class="stat-card">
                <div class="stat-header">
                    <div class="icon-wrapper category-icon">
                        <!-- SVG Icon Kategori Tag -->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="card-icon-svg">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a2.25 2.25 0 003.182 0l4.318-4.318a2.25 2.25 0 000-3.182L11.16 3.659A2.25 2.25 0 009.568 3z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
                        </svg>
                    </div>
                    <span class="badge badge-cyan">Sistem</span>
                </div>
                <div class="stat-body">
                    <h4>Kategori & Klasifikasi</h4>
                    <p>Pengelompokan jenis bacaan untuk memudahkan pencarian berdasarkan fiksi, non-fiksi, maupun topik lainnya.</p>
                </div>
                <div class="stat-footer">
                    <button class="btn-action" onclick={() => goto('/kategori')}>
                        Buka Kategori 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="arrow-svg"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </button>
                </div>
            </div>

            <!-- Card Rak -->
            <div class="stat-card">
                <div class="stat-header">
                    <div class="icon-wrapper rak-icon">
                        <!-- SVG Icon Lemari Rak -->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="card-icon-svg">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6zM3.75 9h16.5M3.75 14.25h16.5M9 3.75v16.5M15 3.75v16.5" />
                        </svg>
                    </div>
                    <span class="badge badge-indigo">Fisik</span>
                </div>
                <div class="stat-body">
                    <h4>Lokasi Penempatan Rak</h4>
                    <p>Manajemen lokasi fisik buku di ruang perpustakaan berdasarkan kode baris dan nomor rak secara berkala.</p>
                </div>
                <div class="stat-footer">
                    <button class="btn-action" onclick={() => goto('/rak')}>
                        Atur Posisi Rak 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="arrow-svg"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </button>
                </div>
            </div>

        </section>
    </main>
</div>

<style>
    /* Reset & Variabel Warna Tema Light Blue / Cyan Modern */
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        background-color: #f4f8fa;
        color: #0f172a;
        overflow-x: hidden;
    }

    .app-layout {
        display: flex;
        min-height: 100vh;
    }

    /* ==================== 1. SIDEBAR LIGHT BLUE MODERN ==================== */
    .sidebar {
        width: 260px;
        background-color: #ffffff;
        border-right: 1px solid #e2e8f0;
        display: flex;
        flex-direction: column;
        padding: 24px;
        position: fixed;
        height: 100vh;
        box-sizing: border-box;
        z-index: 10;
    }

    .sidebar-brand {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 36px;
    }

    .brand-logo {
        height: 28px;
        width: 28px;
        object-fit: contain;
    }

    .sidebar-brand h2 {
        font-size: 18px;
        font-weight: 800;
        color: #0f172a;
        margin: 0;
        letter-spacing: -0.5px;
    }

    .sidebar-brand h2 span {
        font-size: 10px;
        background: #e0f2fe;
        color: #0284c7;
        padding: 2px 6px;
        border-radius: 6px;
        margin-left: 4px;
    }

    .sidebar-menu {
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex-grow: 1;
    }

    .menu-item {
        display: flex;
        align-items: center;
        gap: 12px;
        background: none;
        border: none;
        padding: 12px 16px;
        border-radius: 12px;
        color: #64748b;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        text-align: left;
        width: 100%;
        transition: all 0.2s ease;
    }

    /* SVG UNTUK SIDEBAR */
    .sidebar-svg {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        color: #94a3b8;
        transition: color 0.2s ease;
    }

    .menu-item:hover {
        background-color: #f0f6fa;
        color: #0284c7;
    }

    .menu-item:hover .sidebar-svg {
        color: #0284c7;
    }

    /* Tombol Menu Aktif - Soft Blue Cyan Highlight */
    .menu-item.active {
        background-color: #e0f2fe;
        color: #0284c7;
    }

    .menu-item.active .sidebar-svg {
        color: #0284c7;
    }

    .sidebar-footer {
        padding-top: 16px;
        border-top: 1px solid #f1f5f9;
    }

    .btn-logout {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        background: none;
        border: none;
        padding: 12px 16px;
        color: #ef4444;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        border-radius: 12px;
        transition: all 0.2s;
    }

    .logout-svg {
        width: 18px;
        height: 18px;
        color: #ef4444;
    }

    .btn-logout:hover {
        background-color: #fef2f2;
    }

    /* ==================== MAIN CONTENT AREA ==================== */
    .main-content {
        flex-grow: 1;
        margin-left: 260px;
        padding: 40px;
        box-sizing: border-box;
    }

    /* ==================== 2. TOP NAVBAR STYLES ==================== */
    .top-navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 36px;
        padding-bottom: 24px;
        border-bottom: 1px solid #e2e8f0;
    }

    .welcome-text h3 {
        margin: 0 0 4px 0;
        font-size: 24px;
        font-weight: 800;
        color: #0f172a;
        letter-spacing: -0.5px;
    }

    .welcome-text p {
        margin: 0;
        color: #64748b;
        font-size: 14px;
    }

    .user-profile {
        display: flex;
        align-items: center;
        gap: 12px;
        background: white;
        padding: 8px 16px;
        border-radius: 16px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 4px 10px rgba(15, 23, 42, 0.02);
    }

    .avatar {
        width: 36px;
        height: 36px;
        background-color: #0284c7; /* Avatar warna cerah Sky Blue */
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 14px;
    }

    .user-info {
        display: flex;
        flex-direction: column;
    }

    .user-info .name {
        font-size: 13px;
        font-weight: 700;
        color: #0f172a;
    }

    .user-info .role {
        font-size: 11px;
        color: #64748b;
        font-weight: 500;
    }

    /* ==================== 3. CARDS DASHBOARD ==================== */
    .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
    }

    .stat-card {
        background: #ffffff;
        border: 1px solid rgba(226, 232, 240, 0.8);
        border-radius: 20px;
        padding: 28px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: 0 10px 25px -15px rgba(14, 165, 233, 0.08);
        transition: all 0.25s ease;
    }

    .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 30px -10px rgba(14, 165, 233, 0.15);
        border-color: #38bdf8;
    }

    .stat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
    }

    .icon-wrapper {
        width: 48px;
        height: 48px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .card-icon-svg {
        width: 22px;
        height: 22px;
    }

    /* Set Icon Background & Stroke Mengikuti Nuansa Biru/Sian */
    .book-icon { background-color: #e0f2fe; color: #0369a1; }
    .category-icon { background-color: #ecfeff; color: #0e7490; }
    .rak-icon { background-color: #e0e7ff; color: #4338ca; }

    /* Badges */
    .badge {
        font-size: 11px;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .badge-blue { background-color: #e0f2fe; color: #0284c7; }
    .badge-cyan { background-color: #ecfeff; color: #0891b2; }
    .badge-indigo { background-color: #e0e7ff; color: #4f46e5; }

    .stat-body h4 {
        margin: 0 0 10px 0;
        font-size: 18px;
        font-weight: 800;
        color: #0f172a;
    }

    .stat-body p {
        margin: 0 0 28px 0;
        color: #64748b;
        font-size: 14px;
        line-height: 1.6;
    }

    /* Link Action Button Modern */
    .btn-action {
        background: none;
        border: none;
        padding: 0;
        color: #0284c7;
        font-weight: 700;
        font-size: 14px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s ease;
    }

    .arrow-svg {
        width: 14px;
        height: 14px;
        transition: transform 0.2s ease;
    }

    .btn-action:hover {
        color: #0369a1;
    }

    .stat-card:hover .btn-action .arrow-svg {
        transform: translateX(4px);
    }

    /* RESPONSIVITAS MOBILE & TABLET */
    @media (max-width: 768px) {
        .sidebar {
            width: 76px;
            padding: 20px 10px;
        }
        .sidebar-brand h2, .menu-text {
            display: none; 
        }
        .sidebar-brand {
            justify-content: center;
        }
        .main-content {
            margin-left: 76px;
            padding: 24px;
        }
        .top-navbar {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
        }
        .user-profile {
            align-self: flex-end;
        }
    }
</style>