<script>
	import '$lib/assets/buku.css';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { getToken } from '$lib/auth.svelte.js';

	const API = 'http://localhost:3000';

	let buku = $state([]);
	let kategori = $state([]);
	let rak = $state([]);

	let keyword = $state('');

	let showModal = $state(false);
	let editMode = $state(false);
	let selectedId = $state(null);

	let form = $state({
		judul: '',
		penulis: '',
		penerbit: '',
		tahunTerbit: '',
		stok: '',
		idKategori: '',
		idRak: ''
	});

	async function loadBuku() {

		const res = await fetch(
			`${API}/buku?q=${keyword}&page=1&limit=100`,
			{
				headers: {
					Authorization: `Bearer ${getToken()}`
				}
			}
		);

		const data = await res.json();

		buku = data.rows;
	}

	async function loadKategori() {

		const res = await fetch(
			`${API}/kategori?page=1&limit=100`,
			{
				headers: {
					Authorization: `Bearer ${getToken()}`
				}
			}
		);

		const data = await res.json();

		kategori = data.rows;
	}

	async function loadRak() {

		const res = await fetch(
			`${API}/rak?page=1&limit=100`,
			{
				headers: {
					Authorization: `Bearer ${getToken()}`
				}
			}
		);

		const data = await res.json();

		rak = data.rows;
	}

	function resetForm() {

		form = {
			judul: '',
			penulis: '',
			penerbit: '',
			tahunTerbit: '',
			stok: '',
			idKategori: '',
			idRak: ''
		};

		selectedId = null;
		editMode = false;
	}

	async function tambahData() {

		resetForm();

		showModal = true;

	}

	loadBuku();
	loadKategori();
	loadRak();
</script>