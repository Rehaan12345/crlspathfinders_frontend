<script>
	import { Page404, Section } from 'flowbite-svelte-blocks';
	import { Button } from 'flowbite-svelte';
</script>

<Section name="page404">
	<Page404>
		<svelte:fragment slot="h1">404</svelte:fragment>
		<svelte:fragment slot="paragraph">
			<p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">
				Something's missing.
			</p>
			<p class="mb-4 text-lg font-light text-gray-500">Sorry, we can't find that page.</p>
			<Button href="/" size="lg" color="red">Back to Homepage</Button>
		</svelte:fragment>
	</Page404>
	<center>
		<img
			src="https://firebasestorage.googleapis.com/v0/b/crlspathfinders-82886.appspot.com/o/other-images%2Fimsorryemoji.jpg?alt=media&token=d4eb6c40-4098-4a11-a4a5-9cf1103ff527"
			alt="I'm sorry"
		/>
	</center>
</Section>
