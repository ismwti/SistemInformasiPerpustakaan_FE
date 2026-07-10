<!-- src/routes/home/+page.svelte -->
<script>
    import { goto } from '$app/navigation';
    import { logout } from '$lib/auth.svelte.js';

    function handleLogout() {
        if (typeof logout === 'function') {
            logout();
        } else {
            localStorage.removeItem('token'); 
        }
        goto('/login'); 
    }
</script>

<div class="app-layout">
    <!-- 1. SIDEBAR NAVIGATION (TEMA BIRU MUDA RESIK) -->
    <aside class="sidebar">
        <div class="sidebar-brand">
            <span class="brand-icon">⚡</span>
            <h2>SIPERPUS <span>PRO</span></h2>
        </div>
        
        <nav class="sidebar-menu">
            <button class="menu-item active">
                <span class="icon">📊</span> <span class="menu-text">Dashboard</span>
            </button>
            <button class="menu-item" onclick={() => goto('/buku')}>
                <span class="icon">📖</span> <span class="menu-text">Kelola Buku</span>
            </button>
            <button class="menu-item" onclick={() => goto('/kategori')}>
                <span class="icon">🏷️</span> <span class="menu-text">Kategori</span>
            </button>
            <button class="menu-item" onclick={() => goto('/rak')}>
                <span class="icon">🗄️</span> <span class="menu-text">Lokasi Rak</span>
            </button>
        </nav>

        <div class="sidebar-footer">
            <button class="btn-logout" onclick={handleLogout}>
                <span class="icon">🚪</span> <span class="menu-text">Keluar Aplikasi</span>
            </button>
        </div>
    </aside>

    <!-- MAIN CONTENT AREA -->
    <main class="main-content">
        <!-- 2. TOP NAVBAR -->
        <header class="top-navbar">
            <div class="welcome-text">
                <h3>Selamat Datang, Petugas 👋</h3>
                <p>Berikut ringkasan data sistem informasi perpustakaan hari ini.</p>
            </div>
            <div class="user-profile">
                <div class="avatar">A</div>
                <div class="user-info">
                    <span class="name">Administrator</span>
                    <span class="role">Petugas Aktif</span>
                </div>
            </div>
        </header>

        <!-- 3. DASHBOARD STATS & QUICK ACTIONS -->
        <section class="dashboard-grid">
            
            <!-- Card Buku -->
            <div class="stat-card">
                <div class="stat-header">
                    <div class="icon-wrapper book-icon">📚</div>
                    <span class="badge badge-blue">Katalog</span>
                </div>
                <div class="stat-body">
                    <h4>Katalog Data Buku</h4>
                    <p>Kelola seluruh koleksi pustaka, mulai dari judul, penulis, penerbit, hingga tahun terbit buku.</p>
                </div>
                <div class="stat-footer">
                    <button class="btn-action" onclick={() => goto('/buku')}>
                        Buka Manajemen Buku <span class="arrow">→</span>
                    </button>
                </div>
            </div>

            <!-- Card Kategori -->
            <div class="stat-card">
                <div class="stat-header">
                    <div class="icon-wrapper category-icon">🏷️</div>
                    <span class="badge badge-cyan">Sistem</span>
                </div>
                <div class="stat-body">
                    <h4>Kategori & Klasifikasi</h4>
                    <p>Pengelompokan jenis bacaan untuk memudahkan pencarian berdasarkan fiksi, non-fiksi, maupun topik lainnya.</p>
                </div>
                <div class="stat-footer">
                    <button class="btn-action" onclick={() => goto('/kategori')}>
                        Buka Kategori <span class="arrow">→</span>
                    </button>
                </div>
            </div>

            <!-- Card Rak -->
            <div class="stat-card">
                <div class="stat-header">
                    <div class="icon-wrapper rak-icon">🗄️</div>
                    <span class="badge badge-indigo">Fisik</span>
                </div>
                <div class="stat-body">
                    <h4>Lokasi Penempatan Rak</h4>
                    <p>Manajemen lokasi fisik buku di ruang perpustakaan berdasarkan kode baris dan nomor rak secara berkala.</p>
                </div>
                <div class="stat-footer">
                    <button class="btn-action" onclick={() => goto('/rak')}>
                        Atur Posisi Rak <span class="arrow">→</span>
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
        background-color: #f4f8fa; /* Soft blue-gray light background */
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
        gap: 10px;
        margin-bottom: 36px;
    }

    .brand-icon {
        font-size: 22px;
    }

    .sidebar-brand h2 {
        font-size: 20px;
        font-weight: 800;
        color: #0f172a;
        margin: 0;
        letter-spacing: -0.5px;
    }

    .sidebar-brand h2 span {
        font-size: 11px;
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

    .menu-item .icon {
        font-size: 16px;
    }

    .menu-item:hover {
        background-color: #f0f6fa;
        color: #0284c7;
    }

    /* Tombol Menu Aktif - Soft Blue Cyan Highlight */
    .menu-item.active {
        background-color: #e0f2fe;
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
        background-color: #38bdf8; /* Avatar warna cerah Sky Blue */
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 15px;
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
        color: #94a3b8;
    }

    /* ==================== 3. CARDS DASHBOARD (SOFT GRADIENT GLOW) ==================== */
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
        font-size: 20px;
    }

    /* Set Icon Background Mengikuti Nuansa Biru/Sian */
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

    .btn-action .arrow {
        transition: transform 0.2s ease;
    }

    .btn-action:hover {
        color: #0369a1;
    }

    .stat-card:hover .btn-action .arrow {
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