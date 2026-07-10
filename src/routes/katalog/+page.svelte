<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    // State Data
    let daftarBuku = $state<any[]>([]);
    let loading = $state<boolean>(true);
    let errorMsg = $state<string>('');
    
    // State Pencarian & Filter
    let kataKunci = $state<string>('');
    let filterKategori = $state<string>('');

    const API_URL = 'http://localhost:3000';

    async function muatKatalog() {
        loading = true;
        errorMsg = '';
        try {
            const respon = await fetch(`${API_URL}/buku`);
            if (!respon.ok) throw new Error('Gagal memuat data katalog.');
            const dataJson = await respon.json();
            daftarBuku = dataJson.rows || [];
        } catch (err: any) {
            errorMsg = err.message || 'Gagal terhubung ke server.';
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        muatKatalog();
    });

    let listKategoriUnik = $derived.by(() => {
        const kategoriSet = new Set<string>();
        daftarBuku.forEach(buku => {
            const namaKat = buku.kategori?.namaKategori || 'Umum';
            kategoriSet.add(namaKat);
        });
        return Array.from(kategoriSet);
    });

    let katalogDifilter = $derived.by(() => {
        return daftarBuku.filter(buku => {
            const cocokKataKunci = 
                buku.judul.toLowerCase().includes(kataKunci.toLowerCase()) ||
                buku.penulis.toLowerCase().includes(kataKunci.toLowerCase());
            
            const namaKat = buku.kategori?.namaKategori || 'Umum';
            const cocokKategori = filterKategori === '' || namaKat === filterKategori;

            return cocokKataKunci && cocokKategori;
        });
    });
</script>

<div class="app-layout">
    <!-- SIDEBAR MINIMALIS KHUSUS PENGUNJUNG (TANPA MENU ADMIN) -->
    <aside class="sidebar">
        <div class="sidebar-brand">
            <span class="brand-icon">⚡</span>
            <h2>SIPERPUS <span>GUEST</span></h2>
        </div>
        
        <nav class="sidebar-menu">
            <button class="menu-item active">
                <span class="icon">🔍</span> <span class="menu-text">Lihat Katalog</span>
            </button>
        </nav>

        <div class="sidebar-footer">
            <!-- Tombol kembali ke Login jika admin ingin masuk -->
            <button class="btn-login-back" onclick={() => goto('/login')}>
                <span class="icon">🔑</span> <span class="menu-text">Login Admin</span>
            </button>
        </div>
    </aside>

    <!-- CONTENT AREA -->
    <main class="main-content">
        <header class="katalog-header">
            <h2>🔍 Katalog Pencarian Buku</h2>
            <p>Cari koleksi buku, cek sisa stok, dan lihat posisi rak perpustakaan secara real-time.</p>
        </header>

        <!-- BAR PENCARIAN -->
        <div class="search-filter-bar">
            <div class="search-input-box">
                <span class="search-icon">🔍</span>
                <input 
                    type="text" 
                    bind:value={kataKunci} 
                    placeholder="Ketik judul buku atau nama penulis di sini..." 
                />
            </div>
            
            <div class="filter-box">
                <select bind:value={filterKategori}>
                    <option value="">-- Semua Kategori --</option>
                    {#each listKategoriUnik as kat}
                        <option value={kat}>{kat}</option>
                    {/each}
                </select>
            </div>
        </div>

        <!-- LIST GRID UTAMA -->
        {#if loading}
            <div class="status-msg">
                <div class="spinner"></div>
                <p>Membuka katalog perpustakaan...</p>
            </div>
        {:else if errorMsg}
            <div class="status-msg error-box">❌ {errorMsg}</div>
        {:else if katalogDifilter.length === 0}
            <div class="status-msg empty-box">Buku tidak ditemukan. Coba cari dengan kata kunci lain ya! 📭</div>
        {:else}
            <div class="katalog-grid">
                {#each katalogDifilter as buku}
                    <div class="katalog-card">
                        <div class="card-info">
                            <!-- Header Kartu: Judul & Tag Kategori -->
                            <div class="card-title-row">
                                <h3 class="buku-judul">{buku.judul}</h3>
                                <span class="badge-kategori">{buku.kategori?.namaKategori || 'Umum'}</span>
                            </div>
                            
                            <p class="buku-penulis">Oleh: <strong>{buku.penulis}</strong></p>
                            
                            <div class="info-divider"></div>

                            <!-- Info Lokasi & Ketersediaan -->
                            <div class="info-row">
                                <span class="info-label">📍 Posisi Lokasi Rak:</span>
                                <span class="info-value rak-highlight">{buku.rak?.kodeRak || 'Belum Diatur'}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">📦 Ketersediaan Stok:</span>
                                <span class="info-value interstate-stok" class:habis={buku.stok <= 0}>
                                    {buku.stok > 0 ? `${buku.stok} Eks` : 'Sedang Dipinjam'}
                                </span>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </main>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        background-color: #f4f8fa;
        color: #0f172a;
    }

    .app-layout { display: flex; min-height: 100vh; }

    /* SIDEBAR PENGUNJUNG STYLE */
    .sidebar {
        width: 260px; background: white; border-right: 1px solid #e2e8f0;
        display: flex; flex-direction: column; padding: 24px; position: fixed; height: 100vh; box-sizing: border-box;
    }
    .sidebar-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 36px; }
    .sidebar-brand h2 { font-size: 20px; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
    .sidebar-brand h2 span { font-size: 11px; background: #e0f2fe; color: #0284c7; padding: 2px 6px; border-radius: 6px; margin-left: 4px; }
    .sidebar-menu { display: flex; flex-direction: column; gap: 6px; flex-grow: 1; }
    
    .menu-item {
        display: flex; align-items: center; gap: 12px; background: none; border: none;
        padding: 12px 16px; border-radius: 12px; color: #64748b; font-size: 14px; font-weight: 600; text-align: left; width: 100%;
    }
    .menu-item.active { background-color: #e0f2fe; color: #0284c7; }

    .sidebar-footer { padding-top: 16px; border-top: 1px solid #f1f5f9; }
    .btn-login-back {
        display: flex; align-items: center; gap: 12px; width: 100%; background: none; border: 1px solid #e2e8f0;
        padding: 12px 16px; color: #0284c7; font-weight: 600; font-size: 14px; cursor: pointer; border-radius: 12px; transition: background 0.2s;
    }
    .btn-login-back:hover { background-color: #f0f6fa; }

    /* CONTENT STYLE */
    .main-content { flex-grow: 1; margin-left: 260px; padding: 40px; box-sizing: border-box; }
    .katalog-header h2 { font-size: 24px; font-weight: 800; margin: 0 0 4px 0; }
    .katalog-header p { color: #64748b; margin: 0 0 36px 0; font-size: 14px; }

    /* SEARCH BAR */
    .search-filter-bar { display: flex; gap: 16px; margin-bottom: 30px; }
    .search-input-box { flex: 1; display: flex; align-items: center; background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0 16px; }
    .search-icon { margin-right: 12px; color: #94a3b8; }
    .search-input-box input { border: none; width: 100%; padding: 14px 0; outline: none; font-size: 14px; background: transparent; }
    .filter-box select { padding: 14px 16px; border: 1px solid #e2e8f0; border-radius: 12px; background: white; outline: none; font-size: 14px; cursor: pointer; color: #0f172a; }

    /* GRID TANPA GAMBAR (LEBIH COMPACT DAN PENDEK) */
    .katalog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .katalog-card { 
        background: white; border: 1px solid #e2e8f0; border-radius: 14px; 
        box-shadow: 0 4px 15px -3px rgba(14, 165, 233, 0.04); display: flex; flex-direction: column; transition: all 0.2s ease;
    }
    .katalog-card:hover { transform: translateY(-2px); border-color: #38bdf8; box-shadow: 0 10px 20px -5px rgba(14, 165, 233, 0.1); }

    .card-info { padding: 20px; display: flex; flex-direction: column; justify-content: space-between; height: 100%; }
    
    .card-title-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 6px; }
    .buku-judul { font-size: 16px; font-weight: 800; color: #0f172a; margin: 0; line-height: 1.3; flex: 1; }
    .badge-kategori { background: #f0f6fa; color: #0284c7; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; white-space: nowrap; }
    
    .buku-penulis { font-size: 13px; color: #64748b; margin: 0; }
    .info-divider { border-top: 1px dashed #e2e8f0; margin: 14px 0; }
    
    .info-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; margin-bottom: 8px; }
    .info-row:last-child { margin-bottom: 0; }
    .info-label { color: #64748b; }
    .info-value { font-weight: 700; color: #0f172a; }
    
    .rak-highlight { color: #0891b2; background: #ecfeff; padding: 3px 8px; border-radius: 6px; font-family: monospace; font-size: 12px; }
    .interstate-stok { color: #16a34a; }
    .interstate-stok.habis { color: #ef4444; }

    /* LOADER */
    .status-msg { text-align: center; padding: 50px; color: #64748b; font-size: 14px; }
    .spinner { width: 24px; height: 24px; border: 3px solid #e2e8f0; border-top-color: #0284c7; border-radius: 50%; margin: 0 auto 12px auto; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-box { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; border-radius: 12px; }
    .empty-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
</style>