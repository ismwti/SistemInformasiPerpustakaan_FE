<script>
	let { title, subtitle = '' } = $props();
</script>

<div class="page-header">
	<h1>{title}</h1>

	{#if subtitle}
		<p>{subtitle}</p>
	{/if}
</div>