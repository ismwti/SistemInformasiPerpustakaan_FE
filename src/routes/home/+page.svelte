<script>
	import { goto } from '$app/navigation';
</script>

<h1>SIPERPUS</h1>

<p class="subtitle">
	Sistem Informasi Perpustakaan
</p>

<div class="container">

	<div class="card">
		<div class="icon">📚</div>

		<h2>Buku</h2>

		<p>
			Kelola data buku perpustakaan
		</p>

		<button onclick={() => goto('/buku')}>
			Lihat Buku
		</button>

	</div>

	<div class="card">

		<div class="icon">
			🏷️
		</div>

		<h2>Kategori</h2>

		<p>
			Kelola kategori buku
		</p>

		<button onclick={() => goto('/kategori')}>
			Lihat Kategori
		</button>

	</div>

	<div class="card">

		<div class="icon">
			🗄️
		</div>

		<h2>Rak</h2>

		<p>
			Kelola lokasi penyimpanan buku
		</p>

		<button onclick={() => goto('/rak')}>
			Lihat Rak
		</button>

	</div>

</div>

<style>

h1{
	text-align:center;
	color:#6d4c41;
	margin-top:20px;
}

.subtitle{
	text-align:center;
	color:gray;
	margin-bottom:40px;
}

.container{

	display:grid;

	grid-template-columns:
	repeat(auto-fit,minmax(250px,1fr));

	gap:25px;
}

.card{

	background:white;

	border-radius:10px;

	padding:25px;

	text-align:center;

	box-shadow:0 3px 8px rgba(0,0,0,.15);

}

.icon{

	font-size:55px;

	margin-bottom:15px;

}

button{

	background:#6d4c41;

	color:white;

	border:none;

	padding:10px 18px;

	border-radius:6px;

	cursor:pointer;

	margin-top:15px;

}

button:hover{

	background:#8d6e63;

}

</style>