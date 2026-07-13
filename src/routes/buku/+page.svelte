<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { logout } from '$lib/auth.svelte.js';

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
        

        id_kategori = buku.kategori?.id ? String(buku.kategori.id) : (buku.idKategori ? String(buku.idKategori) : '');
        id_rak = buku.rak?.id ? String(buku.rak.id) : (buku.idRak ? String(buku.idRak) : '');
        
        isFormOpen = true; 
    }

    async function simpanBuku(e: Event) {
        e.preventDefault();
        
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Sesi Anda habis atau token tidak ditemukan. Silakan login ulang.');
            goto('/login');
            return;
        }

        const pesanKonfirmasi = idBukuTerpilih 
            ? 'Yakin mau update data buku ini?' 
            : 'Yakin mau menambahkan buku baru ini ke koleksi?';
            
        if (!confirm(pesanKonfirmasi)) return;
        
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
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
            } else {
                respon = await fetch(`${API_URL}/buku`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
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

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Token tidak ditemukan. Silakan login ulang.');
            goto('/login');
            return;
        }

        try {
            const respon = await fetch(`${API_URL}/buku/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
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
            <button class="menu-item" onclick={() => goto('/home')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="sidebar-svg"><path d="M11.47 3.04a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 4.56l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z" /><path d="M4.5 10.5a.75.75 0 00-1.75 0V19.5a3 3 0 003 3h12.5a3 3 0 003-3v-9a.75.75 0 00-1.75 0v9a1.5 1.5 0 01-1.5 1.5H5.75A1.5 1.5 0 014.5 19.5v-9z" /></svg>
                <span class="menu-text">Dashboard</span>
            </button>
            <button class="menu-item active">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="sidebar-svg"><path fill-rule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zM12.75 12a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V18a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V12z" clip-rule="evenodd" /><path d="M14.25 5.25a.75.75 0 01.75-.75h3.625a1.75 1.75 0 011.75 1.75V9a.75.75 0 01-1.5 0V6.75h-3.875a.75.75 0 01-.75-.75z" /></svg>
                <span class="menu-text">Kelola Buku</span>
            </button>
            <button class="menu-item" onclick={() => goto('/kategori')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="sidebar-svg"><path fill-rule="evenodd" d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c9.208.749 9.853.749 10.364 0l4.318-4.318a3 3 0 000-4.242L13.82 3.129A3 3 0 0011.699 2.25H5.25zM6 6.75a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" clip-rule="evenodd" /></svg>
                <span class="menu-text">Kategori</span>
            </button>
            <button class="menu-item" onclick={() => goto('/rak')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="sidebar-svg"><path fill-rule="evenodd" d="M3 5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25v13.5A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75V5.25zm2.25-.75a.75.75 0 00-.75.75v3h15v-3a.75.75 0 00-.75-.75H5.25zm15 5.25H4.5v3.75h15V9.75zm0 5.25H4.5v3.75a.75.75 0 00.75.75h13.5a.75.75 0 00.75-.75V15zM7.5 6.75a.75.75 0 100 1.5.75.75 0 000-1.5zm0 5.25a.75.75 0 100 1.5.75.75 0 000-1.5zm0 5.25a.75.75 0 100 1.5.75.75 0 000-1.5z" clip-rule="evenodd" /></svg>
                <span class="menu-text">Lokasi Rak</span>
            </button>
        </nav>
        <div class="sidebar-footer">
            <button class="btn-logout" onclick={handleLogout}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="logout-svg"><path fill-rule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9a.75.75 0 01-1.5 0V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clip-rule="evenodd" /></svg>
                <span class="menu-text">Keluar Aplikasi</span>
            </button>
        </div>
    </aside>

    <main class="main-content">
        <header class="app-header">
            <div class="brand">
                <h1>Katalog Koleksi Buku</h1>
                <p>Kelola seluruh pustaka sistem informasi perpustakaan secara real-time.</p>
            </div>
            <button class="btn-primary-trigger" onclick={bukaFormTambah}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="btn-icon-svg"><path fill-rule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clip-rule="evenodd" /></svg>
                Tambah Buku Baru
            </button>
        </header>

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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="alert-icon-svg"><path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" /></svg>
                    <p>{errorMsg}</p>
                </div>
            {:else if daftarBuku.length === 0}
                <div class="alert-zone empty">
                    <p>Catalog kosong melompong. Klik tombol di atas buat nambahin.</p>
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
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="action-icon"><path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" /></svg>
                                            </button>
                                            <button class="action-btn delete" onclick={() => hapusBuku(item.id)} title="Delete">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="action-icon"><path fill-rule="evenodd" d="M16.5 4.478v-.227a3.322 3.322 0 00-3.478-3.478h-.043a3.322 3.322 0 00-3.478 3.478v.227H6.151c-1.18 0-2.14.945-2.164 2.124l-.071 3.497a1.81 1.81 0 001.216 1.724L5.35 19.34a3.375 3.375 0 003.364 3.16h6.572a3.375 3.375 0 003.364-3.16l.23-8.52a1.81 1.81 0 001.216-1.724l-.071-3.497a2.167 2.167 0 00-2.164-2.124H16.5zM10.5 8.25a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V8.25zm3 0a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V8.25z" clip-rule="evenodd" /></svg>
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

    {#if isFormOpen}
        <div class="drawer-overlay" onclick={() => isFormOpen = false} role="presentation"></div>
        <div class="drawer-container">
            <div class="drawer-header">
                <h3>{idBukuTerpilih ? 'Update Data Buku' : 'Tambah Koleksi Baru'}</h3>
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
                            <option value={String(kat.id)}>{kat.namaKategori || kat.nama_kategori}</option>
                        {/each}
                    </select>
                </div>

                <div class="group-field">
                    <label for="rak">TEMPAT RAK</label>
                    <select id="rak" bind:value={id_rak} required>
                        <option value="">-- Pilih Kode Rak --</option>
                        {#each daftarRak as r}
                            <option value={String(r.id)}>{r.kodeRak || r.kode_rak} {r.lokasi ? `(${r.lokasi})` : ''}</option>
                        {/each}
                    </select>
                </div>

                <div class="drawer-actions">
                    <button type="submit" class="btn-submit-form">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="btn-icon-form"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" /></svg>
                        {idBukuTerpilih ? 'Simpan Perubahan' : 'Publish Buku'}
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
    :global(body) { margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; background-color: #f4f8fa; color: #0f172a; }
    .app-layout { display: flex; min-height: 100vh; }
    .sidebar { width: 260px; background-color: #ffffff; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; padding: 24px; position: fixed; height: 100vh; box-sizing: border-box; z-index: 10; }
    .sidebar-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 36px; }
    .brand-logo { height: 28px; width: 28px; object-fit: contain; }
    .sidebar-brand h2 { font-size: 18px; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.5px; }
    .sidebar-brand h2 span { font-size: 10px; background: #e0f2fe; color: #0284c7; padding: 2px 6px; border-radius: 6px; margin-left: 4px; }
    .sidebar-menu { display: flex; flex-direction: column; gap: 6px; flex-grow: 1; }
    .menu-item { display: flex; align-items: center; gap: 12px; background: none; border: none; padding: 12px 16px; border-radius: 12px; color: #64748b; font-size: 14px; font-weight: 600; cursor: pointer; text-align: left; width: 100%; transition: all 0.2s ease; }
    .sidebar-svg { width: 18px; height: 18px; flex-shrink: 0; color: #94a3b8; transition: color 0.2s ease; }
    .menu-item:hover { background-color: #f0f6fa; color: #0284c7; }
    .menu-item:hover .sidebar-svg { color: #0284c7; }
    .menu-item.active { background-color: #e0f2fe; color: #0284c7; }
    .menu-item.active .sidebar-svg { color: #0284c7; }
    .sidebar-footer { padding-top: 16px; border-top: 1px solid #f1f5f9; }
    .btn-logout { display: flex; align-items: center; gap: 12px; width: 100%; background: none; border: none; padding: 12px 16px; color: #ef4444; font-weight: 600; font-size: 14px; cursor: pointer; border-radius: 12px; transition: all 0.2s; }
    .logout-svg { width: 18px; height: 18px; color: #ef4444; }
    .btn-logout:hover { background-color: #fef2f2; }
    .main-content { flex-grow: 1; margin-left: 260px; padding: 40px; box-sizing: border-box; }
    .app-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 36px; border-bottom: 1px solid #e2e8f0; padding-bottom: 24px; }
    .brand h1 { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin: 0; color: #0f172a; }
    .brand p { color: #64748b; margin: 4px 0 0 0; font-size: 14px; }
    .btn-primary-trigger { background: #0284c7; color: white; border: none; padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.2); transition: all 0.2s ease; }
    .btn-primary-trigger:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(2, 132, 199, 0.35); }
    .btn-icon-svg { width: 16px; height: 16px; }
    .card-table-wrapper { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; box-shadow: 0 10px 25px -15px rgba(14, 165, 233, 0.08); }
    .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
    .card-header h2 { font-size: 18px; font-weight: 700; margin: 0; color: #0f172a; }
    .count-badge { background: #e0f2fe; color: #0284c7; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .table-scroll { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; }
    th { padding: 16px; color: #64748b; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #f1f5f9; }
    td { padding: 16px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    tr:hover td { background: #f8fafc; }
    .primary-text { font-weight: 600; color: #0f172a; }
    .secondary-text { color: #64748b; }
    .tag-badge { padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; display: inline-block; }
    .tag-badge.color-1 { background: #e0f2fe; color: #0284c7; }
    .tag-badge.color-2 { background: #ecfeff; color: #0891b2; }
    .stok-indicator { font-weight: 700; color: #0284c7; }
    .stok-indicator.empty { color: #ef4444; }
    .action-flex { display: flex; gap: 8px; }
    .action-btn { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #e2e8f0; background: #ffffff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; }
    .action-icon { width: 16px; height: 16px; }
    .action-btn.edit { color: #64748b; }
    .action-btn.edit:hover { background: #f1f5f9; color: #0284c7; border-color: #38bdf8; }
    .action-btn.delete { color: #ef4444; }
    .action-btn.delete:hover { background: #fef2f2; border-color: #fca5a5; }
    .loader-zone, .alert-zone { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 40px 0; color: #64748b; }
    .alert-zone.error { color: #ef4444; }
    .alert-icon-svg { width: 32px; height: 32px; color: #ef4444; }
    .spinner { width: 24px; height: 24px; border: 3px solid #e2e8f0; border-top-color: #0284c7; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .drawer-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.3); backdrop-filter: blur(4px); z-index: 100; }
    .drawer-container { position: fixed; top: 0; right: 0; width: 420px; height: 100vh; background: #ffffff; border-left: 1px solid #e2e8f0; box-shadow: -10px 0 40px rgba(0,0,0,0.05); z-index: 101; padding: 32px; box-sizing: border-box; display: flex; flex-direction: column; }
    .drawer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .drawer-header h3 { font-size: 20px; font-weight: 800; margin: 0; color: #0f172a; letter-spacing: -0.5px; }
    .close-drawer { background: transparent; border: none; color: #64748b; font-size: 28px; cursor: pointer; line-height: 1; }
    .drawer-form { display: flex; flex-direction: column; gap: 20px; height: 100%; }
    .group-field { display: flex; flex-direction: column; gap: 6px; }
    .row-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    label { font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 0.5px; }
    input, select { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; color: #0f172a; font-size: 14px; outline: none; transition: all 0.2s ease; }
    input:focus, select:focus { border-color: #0284c7; background: #fff; box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1); }
    .drawer-actions { display: flex; flex-direction: column; gap: 12px; margin-top: auto; }
    .btn-submit-form { background: #0284c7; color: white; border: none; padding: 14px; font-weight: 700; font-size: 14px; border-radius: 10px; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
    .btn-submit-form:hover { background: #0369a1; }
    .btn-icon-form { width: 16px; height: 16px; }
    .btn-abort { background: transparent; border: 1px solid #e2e8f0; color: #64748b; padding: 10px; font-size: 12px; border-radius: 10px; cursor: pointer; }
    .btn-abort:hover { background: #f8fafc; }
    @media (max-width: 768px) { .sidebar { width: 76px; padding: 20px 10px; } .sidebar-brand h2, .menu-text { display: none; } .sidebar-brand { justify-content: center; } .main-content { margin-left: 76px; padding: 24px; } .drawer-container { width: 100%; } }
</style>