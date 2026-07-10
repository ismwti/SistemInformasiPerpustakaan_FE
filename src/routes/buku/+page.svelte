<!-- src/routes/buku/+page.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    // State Manajemen Data Buku (Menggunakan Runes Svelte 5)
    let daftarBuku = $state<any[]>([]);
    let daftarKategori = $state<any[]>([]);
    let daftarRak = $state<any[]>([]);
    let loading = $state<boolean>(true);
    let errorMsg = $state<string>('');

    // State Kontrol Tampilan Form Drawer (Buka/Tutup)
    let isFormOpen = $state<boolean>(false);

    // State untuk Form Input
    let idBukuTerpilih = $state<number | null>(null);
    let judul = $state<string>('');
    let penulis = $state<string>('');
    let penerbit = $state<string>('');
    let tahun_terbit = $state<number>(2026);
    let stok = $state<number>(1);
    let id_kategori = $state<string>('');
    let id_rak = $state<string>('');

    const API_URL = 'http://localhost:3000';

    async function muatDataSistem() {
        loading = true;
        errorMsg = '';
        try {
            const [resBuku, resKat, resRak] = await Promise.all([
                fetch(`${API_URL}/buku`),
                fetch(`${API_URL}/kategori`), 
                fetch(`${API_URL}/rak`)       
            ]);

            if (!resBuku.ok || !resKat.ok || !resRak.ok) {
                throw new Error('Gagal sync data dengan server.');
            }

            const dataBukuJson = await resBuku.json();
            daftarBuku = dataBukuJson.rows || []; 

            const dataKatJson = await resKat.json();
            daftarKategori = dataKatJson.rows || dataKatJson || [];

            const dataRakJson = await resRak.json();
            daftarRak = dataRakJson.rows || dataRakJson || [];
        } catch (err: any) {
            errorMsg = err.message || 'Koneksi database putus. Nyalain API-nya dulu bro!';
            console.error(err);
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        muatDataSistem();
    });

    function bukaFormTambah() {
        resetForm();
        isFormOpen = true;
    }

    function editBuku(buku: any) {
        idBukuTerpilih = buku.id; 
        judul = buku.judul;
        penulis = buku.penulis;
        penerbit = buku.penerbit || '';
        tahun_terbit = buku.tahunTerbit || buku.tahun_terbit || 2026;
        stok = buku.stok;
        id_kategori = buku.kategori?.id?.toString() || buku.idKategori?.toString() || '';
        id_rak = buku.rak?.id?.toString() || buku.idRak?.toString() || '';
        isFormOpen = true; 
    }

    async function simpanBuku(e: Event) {
        e.preventDefault();
        
        const payload = {
            judul,
            penulis,
            penerbit,
            tahunTerbit: Number(tahun_terbit),
            stok: Number(stok),
            idKategori: Number(id_kategori),
            idRak: Number(id_rak)
        };

        try {
            let respon;
            if (idBukuTerpilih) {
                respon = await fetch(`${API_URL}/buku/${idBukuTerpilih}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                respon = await fetch(`${API_URL}/buku`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (respon.ok) {
                isFormOpen = false;
                resetForm();
                muatDataSistem();
            } else {
                const errorData = await respon.json();
                alert(`Gagal nyimpen: ${errorData.message || 'Check inputannya lagi.'}`);
            }
        } catch (err) {
            alert('Aduhh, skena jaringan lagi error nih.');
        }
    }

    async function hapusBuku(id: number) {
        if (!confirm('Serius mau delete buku ini? Anggap aja ilang dari peradaban.')) return;

        try {
            const respon = await fetch(`${API_URL}/buku/${id}`, {
                method: 'DELETE'
            });

            if (respon.ok) {
                muatDataSistem();
            } else {
                alert('Gagal ngehapus data.');
            }
        } catch (err) {
            alert('Gagal kontak server.');
        }
    }

    function resetForm() {
        idBukuTerpilih = null;
        judul = '';
        penulis = '';
        penerbit = '';
        tahun_terbit = 2026;
        stok = 1;
        id_kategori = '';
        id_rak = '';
    }

    function handleLogout() {
        localStorage.removeItem('token'); 
        goto('/login'); 
    }
</script>

<div class="app-layout">
    <!-- SIDEBAR NAVIGATION (KONSISTEN DENGAN HALAMAN HOME) -->
    <aside class="sidebar">
        <div class="sidebar-brand">
            <span class="brand-icon">⚡</span>
            <h2>SIPERPUS <span>PRO</span></h2>
        </div>
        
        <nav class="sidebar-menu">
            <button class="menu-item" onclick={() => goto('/home')}>
                <span class="icon">📊</span> <span class="menu-text">Dashboard</span>
            </button>
            <button class="menu-item active">
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

    <!-- CONTENT AREA UTAMA -->
    <main class="main-content">
        <!-- TOP BAR DENGAN TOMBOL TRIGGER -->
        <header class="app-header">
            <div class="brand">
                <h1>Katalog Koleksi Buku</h1>
                <p>Kelola seluruh pustaka sistem informasi perpustakaan secara real-time.</p>
            </div>
            <button class="btn-primary-trigger" onclick={bukaFormTambah}>
                <span class="icon">✨</span> Tambah Buku Baru
            </button>
        </header>

        <!-- BALUTAN TABEL YANG DIBIKIN CARD MINIMALIS LIGHT THEME -->
        <div class="card-table-wrapper">
            <div class="card-header">
                <h2>Daftar Koleksi Buku</h2>
                <span class="count-badge">{daftarBuku.length} Items</span>
            </div>

            {#if loading}
                <div class="loader-zone">
                    <div class="spinner"></div>
                    <p>Syncing database data...</p>
                </div>
            {:else if errorMsg}
                <div class="alert-zone error">
                    <p>🚨 {errorMsg}</p>
                </div>
            {:else if daftarBuku.length === 0}
                <div class="alert-zone empty">
                    <p>Catalog kosong melongpong. Klik tombol di atas buat nambahin.</p>
                </div>
            {:else}
                <div class="table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>Judul Buku</th>
                                <th>Penulis / Vendor</th>
                                <th>Kategori</th>
                                <th>Lokasi Rak</th>
                                <th>Stok</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each daftarBuku as item}
                                <tr>
                                    <td class="primary-text">{item.judul}</td>
                                    <td class="secondary-text">{item.penulis}</td>
                                    <td><span class="tag-badge color-1">{item.kategori?.namaKategori || item.kategori?.nama_kategori || 'Umum'}</span></td>
                                    <td><span class="tag-badge color-2">{item.rak?.kodeRak || item.rak?.kode_rak || '-'}</span></td>
                                    <td>
                                        <span class="stok-indicator" class:empty={item.stok <= 0}>
                                            {item.stok <= 0 ? 'Abis' : `${item.stok} Pcs`}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="action-flex">
                                            <button class="action-btn edit" onclick={() => editBuku(item)} title="Edit">
                                                📝
                                            </button>
                                            <button class="action-btn delete" onclick={() => hapusBuku(item.id)} title="Delete">
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
        </div>
    </main>

    <!-- SIDE DRAWER MODAL FORM -->
    {#if isFormOpen}
        <div class="drawer-overlay" onclick={() => isFormOpen = false} role="presentation"></div>
        <div class="drawer-container">
            <div class="drawer-header">
                <h3>{idBukuTerpilih ? '⚡ Update Data Buku' : '✨ Tambah Koleksi'}</h3>
                <button class="close-drawer" onclick={() => isFormOpen = false}>×</button>
            </div>

            <form onsubmit={simpanBuku} class="drawer-form">
                <div class="group-field">
                    <label for="judul">JUDUL UTAMA</label>
                    <input type="text" id="judul" bind:value={judul} required placeholder="e.g. Clean Code 101" />
                </div>

                <div class="row-fields">
                    <div class="group-field">
                        <label for="penulis">PENULIS</label>
                        <input type="text" id="penulis" bind:value={penulis} required placeholder="Nama pembuat" />
                    </div>
                    <div class="group-field">
                        <label for="penerbit">PENERBIT</label>
                        <input type="text" id="penerbit" bind:value={penerbit} placeholder="PT Publishing" />
                    </div>
                </div>

                <div class="row-fields">
                    <div class="group-field">
                        <label for="tahun">TAHUN</label>
                        <input type="number" id="tahun" bind:value={tahun_terbit} required min="1900" max="2027" />
                    </div>
                    <div class="group-field">
                        <label for="stok">STOK</label>
                        <input type="number" id="stok" bind:value={stok} required min="0" />
                    </div>
                </div>

                <div class="group-field">
                    <label for="kategori">KATEGORI GENRE</label>
                    <select id="kategori" bind:value={id_kategori} required>
                        <option value="">-- Pilih Kategori --</option>
                        {#each daftarKategori as kat}
                            <option value={kat.id}>{kat.namaKategori || kat.nama_kategori}</option>
                        {/each}
                    </select>
                </div>

                <div class="group-field">
                    <label for="rak">TEMPAT RAK</label>
                    <select id="rak" bind:value={id_rak} required>
                        <option value="">-- Pilih Kode Rak --</option>
                        {#each daftarRak as r}
                            <option value={r.id}>{r.kodeRak || r.kode_rak} {r.lokasi ? `(${r.lokasi})` : ''}</option>
                        {/each}
                    </select>
                </div>

                <div class="drawer-actions">
                    <button type="submit" class="btn-submit-form">
                        {idBukuTerpilih ? '💾 Simpan Perubahan' : '🚀 Publish Buku'}
                    </button>
                    {#if idBukuTerpilih}
                        <button type="button" class="btn-abort" onclick={resetForm}>Reset Form</button>
                    {/if}
                </div>
            </form>
        </div>
    {/if}
</div>

<style>
    /* ==================== LAYOUT UTAMA & VARIABEL TEMA LIGHT CYAN ==================== */
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        background-color: #f4f8fa;
        color: #0f172a;
    }

    .app-layout {
        display: flex;
        min-height: 100vh;
    }

    /* ==================== SIDEBAR LIGHT BLUE NAVIGATION ==================== */
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

    /* ==================== CONTENT WORKSPACE ==================== */
    .main-content {
        flex-grow: 1;
        margin-left: 260px;
        padding: 40px;
        box-sizing: border-box;
    }

    /* HEADER STYLE */
    .app-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 36px;
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 24px;
    }
    .brand h1 {
        font-size: 24px;
        font-weight: 800;
        letter-spacing: -0.5px;
        margin: 0;
        color: #0f172a; 
    }
    .brand p {
        color: #64748b;
        margin: 4px 0 0 0;
        font-size: 14px;
    }

    /* TRIGGER BUTTON BUTTON */
    .btn-primary-trigger {
        background: #0284c7;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 50px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 12px rgba(2, 132, 199, 0.2);
        transition: all 0.2s ease;
    }
    .btn-primary-trigger:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(2, 132, 199, 0.35);
    }

    /* CARD DESIGN FOR TABLE (LIGHT) */
    .card-table-wrapper {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        padding: 24px;
        box-shadow: 0 10px 25px -15px rgba(14, 165, 233, 0.08);
    }
    .card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;
    }
    .card-header h2 {
        font-size: 18px;
        font-weight: 700;
        margin: 0;
        color: #0f172a;
    }
    .count-badge {
        background: #e0f2fe;
        color: #0284c7;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
    }

    /* MODERN TABLE LIGHT COMPONENT */
    .table-scroll { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; }
    th {
        padding: 16px;
        color: #64748b;
        font-weight: 700;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 2px solid #f1f5f9;
    }
    td { padding: 16px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    tr:hover td { background: #f8fafc; }

    .primary-text { font-weight: 600; color: #0f172a; }
    .secondary-text { color: #64748b; }

    /* BADGES */
    .tag-badge {
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        display: inline-block;
    }
    .tag-badge.color-1 { background: #e0f2fe; color: #0284c7; }
    .tag-badge.color-2 { background: #ecfeff; color: #0891b2; }

    .stok-indicator { font-weight: 700; color: #0284c7; }
    .stok-indicator.empty { color: #ef4444; }

    /* CIRCLE ACTION BUTTONS */
    .action-flex { display: flex; gap: 8px; }
    .action-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1px solid #e2e8f0;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;
    }
    .action-btn:hover { background: #f1f5f9; transform: scale(1.05); }

    /* SIDE DRAWER MODAL SLIDE MECHANISM (LIGHT & SHADOW BLUR) */
    .drawer-overlay {
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(15, 23, 42, 0.3);
        backdrop-filter: blur(4px);
        z-index: 100;
    }
    .drawer-container {
        position: fixed;
        top: 0; right: 0; width: 420px; height: 100vh;
        background: #ffffff;
        border-left: 1px solid #e2e8f0;
        box-shadow: -10px 0 40px rgba(0,0,0,0.05);
        z-index: 101;
        padding: 32px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }
    .drawer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 32px;
    }
    .drawer-header h3 { font-size: 20px; font-weight: 800; margin: 0; color: #0f172a; }
    .close-drawer {
        background: transparent; border: none; color: #64748b;
        font-size: 28px; cursor: pointer; line-height: 1;
    }

    /* INPUTS & SELECTS FORM LIGHT */
    .drawer-form { display: flex; flex-direction: column; gap: 20px; height: 100%; }
    .group-field { display: flex; flex-direction: column; gap: 6px; }
    .row-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

    label { font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; }
    input, select {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 12px 16px;
        color: #0f172a;
        font-size: 14px;
        outline: none;
        transition: all 0.2s ease;
    }
    input:focus, select:focus { border-color: #0284c7; background: #fff; box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1); }

    /* ACTION BUTTONS IN DRAWER */
    .drawer-actions { display: flex; flex-direction: column; gap: 12px; margin-top: auto; }
    .btn-submit-form {
        background: #0284c7; color: white; border: none;
        padding: 14px; font-weight: 700; font-size: 14px;
        border-radius: 10px; cursor: pointer; transition: background 0.2s;
    }
    .btn-submit-form:hover { background: #0369a1; }
    .btn-abort {
        background: transparent; border: 1px solid #e2e8f0; color: #64748b;
        padding: 10px; font-size: 12px; border-radius: 10px; cursor: pointer;
    }
    .btn-abort:hover { background: #f8fafc; }

    /* UTILS LOADER */
    .loader-zone, .alert-zone { text-align: center; padding: 40px 0; color: #64748b; }
    .spinner {
        width: 24px; height: 24px; border: 3px solid #e2e8f0;
        border-top-color: #0284c7; border-radius: 50%;
        margin: 0 auto 12px auto; animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* RESPONSIVITAS */
    @media (max-width: 768px) {
        .sidebar { width: 76px; padding: 20px 10px; }
        .sidebar-brand h2, .menu-text { display: none; }
        .main-content { margin-left: 76px; padding: 24px; }
        .drawer-container { width: 100%; }
    }
</style>