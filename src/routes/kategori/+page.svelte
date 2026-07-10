<!-- src/routes/kategori/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    // State Manajemen Kategori (Menggunakan Runes Svelte 5)
    let daftarKategori = $state<any[]>([]);
    let loading = $state<boolean>(true);
    let errorMsg = $state<string>('');

    // State untuk Form Input (Tambah / Edit Kategori)
    let idKategoriTerpilih = $state<number | null>(null);
    let namaKategori = $state<string>('');

    // URL API Backend
    const API_URL = 'http://localhost:3000';

    // Ambil data kategori dari database
    async function muatKategori() {
        loading = true;
        errorMsg = '';
        try {
            const respon = await fetch(`${API_URL}/kategori`);
            if (!respon.ok) throw new Error('Gagal mengambil data kategori.');
            
            const dataJson = await respon.json();
            daftarKategori = dataJson.rows || dataJson || [];
        } catch (err: any) {
            errorMsg = err.message || 'Gagal terhubung ke backend server.';
            console.error(err);
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        muatKategori();
    });

    // Fungsi Tambah / Update Kategori ke Database
    async function simpanKategori(e: Event) {
        e.preventDefault();
        
        const payload = {
            namaKategori: namaKategori 
        };

        try {
            let respon;
            if (idKategoriTerpilih) {
                respon = await fetch(`${API_URL}/kategori/${idKategoriTerpilih}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                respon = await fetch(`${API_URL}/kategori`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (respon.ok) {
                resetForm();
                muatKategori();
            } else {
                alert('Gagal menyimpan kategori. Silakan periksa kembali.');
            }
        } catch (err) {
            alert('Terjadi kesalahan jaringan.');
        }
    }

    // Fungsi Hapus Kategori
    async function hapusKategori(id: number) {
        if (!confirm('Hapus kategori ini? Buku dengan kategori ini mungkin akan kehilangan relasinya.')) return;

        try {
            const respon = await fetch(`${API_URL}/kategori/${id}`, {
                method: 'DELETE'
            });

            if (respon.ok) {
                muatKategori();
            } else {
                alert('Gagal menghapus kategori dari database.');
            }
        } catch (err) {
            alert('Gagal terhubung ke server.');
        }
    }

    function editKategori(kat: any) {
        idKategoriTerpilih = kat.id;
        namaKategori = kat.namaKategori || kat.nama_kategori || '';
    }

    function resetForm() {
        idKategoriTerpilih = null;
        namaKategori = '';
    }

    function handleLogout() {
        localStorage.removeItem('token'); 
        goto('/login'); 
    }
</script>

<div class="app-layout">
    <!-- SIDEBAR NAVIGATION (KONSISTEN DENGAN HOME & BUKU) -->
    <aside class="sidebar">
        <div class="sidebar-brand">
            <span class="brand-icon">⚡</span>
            <h2>SIPERPUS <span>PRO</span></h2>
        </div>
        
        <nav class="sidebar-menu">
            <button class="menu-item" onclick={() => goto('/home')}>
                <span class="icon">📊</span> <span class="menu-text">Dashboard</span>
            </button>
            <button class="menu-item" onclick={() => goto('/buku')}>
                <span class="icon">📖</span> <span class="menu-text">Kelola Buku</span>
            </button>
            <button class="menu-item" onclick={() => goto('/katalog')}>
                <span class="icon">🔍</span> <span class="menu-text">Katalog</span>
            </button>
            <button class="menu-item active">
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

    <!-- CONTENT AREA UTAMA -->
    <main class="main-content">
        <header class="section-header">
            <h2>🏷️ Manajemen Kategori Buku</h2>
            <p>Kelola daftar pengelompokan jenis buku untuk mempermudah pengarsipan perpustakaan.</p>
        </header>

        <div class="workspace-grid">
            <!-- FORM INPUT KATEGORI (KIRI) -->
            <section class="form-section">
                <h3>{idKategoriTerpilih ? '✏️ Edit Nama Kategori' : '✨ Tambah Kategori Baru'}</h3>
                <form onsubmit={simpanKategori} class="kategori-form">
                    <div class="input-group">
                        <label for="nama_kategori">NAMA KATEGORI</label>
                        <input 
                            type="text" 
                            id="nama_kategori" 
                            bind:value={namaKategori} 
                            required 
                            placeholder="e.g. Fiksi, Pemrograman, Sejarah..." 
                        />
                    </div>

                    <div class="form-actions">
                        {#if idKategoriTerpilih}
                            <button type="submit" class="btn-update">💾 Perbarui</button>
                            <button type="button" class="btn-cancel" onclick={resetForm}>Batal</button>
                        {:else}
                            <button type="submit" class="btn-save">🚀 Tambahkan</button>
                        {/if}
                    </div>
                </form>
            </section>

            <!-- TABEL DATA KATEGORI (KANAN) -->
            <section class="table-section">
                <div class="card-table-header">
                    <h3>Daftar Kategori Saat Ini</h3>
                    <span class="count-badge">{daftarKategori.length} Kategori</span>
                </div>

                {#if loading}
                    <div class="status-msg">
                        <div class="spinner"></div>
                        <p>Memuat data dari database...</p>
                    </div>
                {:else if errorMsg}
                    <div class="status-msg error-box">❌ {errorMsg}</div>
                {:else if daftarKategori.length === 0}
                    <div class="status-msg empty-box">Belum ada kategori terdaftar di database. 📄</div>
                {:else}
                    <div class="responsive-table">
                        <table>
                            <thead>
                                <tr>
                                    <th style="width: 80px;">ID</th>
                                    <th>Nama Kategori Buku</th>
                                    <th style="width: 120px; text-align: center;">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each daftarKategori as kat}
                                    <tr>
                                        <td><code>#{kat.id}</code></td>
                                        <td class="kat-name"><strong>{kat.namaKategori || kat.nama_kategori}</strong></td>
                                        <td>
                                            <div class="action-buttons">
                                                <button class="action-btn edit" onclick={() => editKategori(kat)} title="Edit Kategori">
                                                    📝
                                                </button>
                                                <button class="action-btn delete" onclick={() => hapusKategori(kat.id)} title="Hapus Kategori">
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                {/if}
            </section>
        </div>
    </main>
</div>

<style>
    /* ==================== LAYOUT & THEMING ==================== */
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        background-color: #f4f8fa;
        color: #0f172a;
    }

    .app-layout {
        display: flex;
        min-height: 100vh;
    }

    /* ==================== SIDEBAR STYLING ==================== */
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

    .brand-icon { font-size: 22px; }

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

    .menu-item:hover {
        background-color: #f0f6fa;
        color: #0284c7;
    }

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
    .btn-logout:hover { background-color: #fef2f2; }

    /* ==================== MAIN CONTENT AREA ==================== */
    .main-content {
        flex-grow: 1;
        margin-left: 260px;
        padding: 40px;
        box-sizing: border-box;
    }

    .section-header h2 { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; letter-spacing: -0.5px; }
    .section-header p { color: #64748b; margin: 0 0 36px 0; font-size: 14px; }
    
    /* Grid Pembagi Layout Kiri & Kanan */
    .workspace-grid {
        display: grid;
        grid-template-columns: 320px 1fr;
        gap: 30px;
        align-items: start;
    }

    .form-section, .table-section { 
        background: white; 
        border: 1px solid #e2e8f0; 
        border-radius: 16px; 
        padding: 24px; 
        box-shadow: 0 10px 25px -15px rgba(14, 165, 233, 0.05);
    }
    
    .form-section h3, .card-table-header h3 { font-size: 16px; font-weight: 800; margin: 0; color: #0f172a; }
    
    /* INPUT & FORM STYLING */
    .kategori-form { display: flex; flex-direction: column; gap: 20px; margin-top: 20px; }
    .input-group { display: flex; flex-direction: column; gap: 6px; }
    label { font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; }
    input { 
        background: #f8fafc;
        border: 1px solid #e2e8f0; 
        border-radius: 10px; 
        padding: 12px 14px; 
        font-size: 14px; 
        color: #0f172a;
        outline: none; 
        transition: all 0.2s ease;
    }
    input:focus { border-color: #0284c7; background: #fff; box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1); }
    
    /* BUTTON ACTIONS TEMA CYAN BLUE */
    .form-actions { display: flex; flex-direction: column; gap: 10px; }
    .btn-save, .btn-update { background: #0284c7; color: white; border: none; padding: 12px; font-weight: 700; border-radius: 10px; cursor: pointer; transition: background 0.2s; font-size: 14px; }
    .btn-save:hover, .btn-update:hover { background: #0369a1; }
    .btn-cancel { background: transparent; color: #64748b; border: 1px solid #e2e8f0; padding: 10px; font-weight: 600; border-radius: 10px; cursor: pointer; font-size: 13px; }
    .btn-cancel:hover { background: #f8fafc; }

    /* MODERN TABLE LIGHT STYLE */
    .card-table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .count-badge { background: #e0f2fe; color: #0284c7; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }

    .responsive-table { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; }
    th { padding: 14px 16px; font-weight: 700; font-size: 12px; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; letter-spacing: 0.5px; }
    td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    tr:hover td { background: #f8fafc; }
    
    td code { background: #f1f5f9; color: #475569; padding: 3px 6px; border-radius: 6px; font-family: monospace; font-size: 12px; }
    .kat-name strong { color: #0f172a; font-size: 15px; font-weight: 600; }
    
    /* CIRCULAR ACTION BUTTONS */
    .action-buttons { display: flex; gap: 8px; justify-content: center; }
    .action-btn {
        width: 34px; height: 34px; border-radius: 50%; border: 1px solid #e2e8f0;
        background: white; display: flex; align-items: center; justify-content: center;
        cursor: pointer; font-size: 14px; transition: all 0.2s ease;
    }
    .action-btn:hover { background: #f1f5f9; transform: scale(1.05); }
    
    /* LOADER STATUS */
    .status-msg { text-align: center; padding: 40px 0; color: #64748b; font-size: 14px; }
    .spinner { width: 24px; height: 24px; border: 3px solid #e2e8f0; border-top-color: #0284c7; border-radius: 50%; margin: 0 auto 12px auto; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-box { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; border-radius: 12px; }
    .empty-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }

    /* RESPONSIVE BREAKPOINT */
    @media (max-width: 992px) {
        .workspace-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
        .sidebar { width: 76px; padding: 20px 10px; }
        .sidebar-brand h2, .menu-text { display: none; }
        .main-content { margin-left: 76px; padding: 24px; }
    }
</style>