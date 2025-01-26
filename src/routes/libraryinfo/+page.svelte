<script>
	import { onMount } from 'svelte';
	import { getLibraryInfo } from '$lib/libraryinfo';
	import { writable } from 'svelte/store';
	import { Card, Spinner } from 'flowbite-svelte';

	let wholeReady = writable(false);

	let libraryInfo;
	let events;

	// UI components: https://flowbite-svelte.com/docs/components/card

	onMount(async () => {
		try {
			// Move all of this into +page.svelte later, etc.
			wholeReady.set(false);
			libraryInfo = await getLibraryInfo();
			events = libraryInfo.events;
			console.log(events);
		} catch (error) {
			console.log(error);
		} finally {
			wholeReady.set(true);
		}
	});
</script>

{#if $wholeReady}
	{#each events as e}
		<Card img={e.image} target="_blank" href={e._url} id={e.id}>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				{e.title}
			</h5>
			<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">{e.description}</p>
			<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">{e.location}</p>
			<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">{e.contact_name}</p>
			<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">{e.contact_phone}</p>
			<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">{e.content}</p>
		</Card>
	{/each}
{:else}
	Loading ... <Spinner color="purple" size={4} />
{/if}
