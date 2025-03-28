<script>
	import { onMount } from 'svelte';
	import { getCollection, wholeWebsiteData, updateWholeWebsiteData } from "$lib/api";
	import { writable } from 'svelte/store';
	import {
		Card,
		Button,
		ButtonGroup,
		Spinner,
		Toast,
		P,
		CardPlaceholder,
		Search,
		Popover,
		Heading,
		Span
	} from 'flowbite-svelte';
	import { TableHeader } from 'flowbite-svelte-blocks';

	let wholeReady = writable(false);
	let windowWidth;
	let columns;
	let searching = '';

	function labelIncludesSearchTerm(label, searchTerm) {
		if (typeof label === 'string' && typeof searchTerm === 'string') {
			return label.toLowerCase().includes(searchTerm.toLowerCase());
		}
		return false;
	}

	if (typeof window !== 'undefined') {
		windowWidth = Math.min(screen.width, window.innerWidth);
		console.log(windowWidth);
		columns = Math.max(1, Math.floor((windowWidth - 100) / 384));

		window.addEventListener('resize', () => {
			windowWidth = Math.min(screen.width, window.innerWidth);
			console.log(windowWidth);
			columns = Math.max(1, Math.floor((windowWidth - 100) / 384));
		});
	}

	let libraryInfo;
	let events;

	let info;

	onMount(async () => {
		try {
			wholeReady.set(false);
			let targetId = wholeWebsiteData.findIndex((item) => item.id === 'libraryinfo');
			console.log('target id: ', targetId);
			if (targetId > -1) {
				libraryInfo = wholeWebsiteData[targetId].info;
			} else {
				libraryInfo = await getCollection("LibraryInfo");
				updateWholeWebsiteData('libraryinfo', libraryInfo);
			}
			targetId = wholeWebsiteData.findIndex(item => item.id === "allinfo");
			if (targetId > -1) {
				const allInfo = wholeWebsiteData[targetId].info;
				for (let i = 0; i < allInfo.length; i++) {
					if (allInfo[i].id == "events") { info = allInfo[i].info; }
				}
			} else {
				const allInfo = await getCollection("AllInfo");
				for (let i = 0; i < allInfo.length; i++) {
					if (allInfo[i].id == "events") { info = allInfo[i].info; }
				}
				updateWholeWebsiteData("allinfo", allInfo);
			}
			events = libraryInfo;
		} catch (error) {
			console.log(error);
		} finally {
			wholeReady.set(true);
		}
	});
</script>

{#if $wholeReady}
	<div class="outer-container">
		<div class="wholeclubwrapper bg-gray-100" style="height:100%;">
			<div class="titleinfowrapper" style="margin-left: 3rem;">
				<br />
				<Heading
					><Span underline decorationClass="decoration-8 decoration-red-800 dark:decoration-red-600"
						>Events in Cambridge</Span
					></Heading
				>
				<br>
				{#each info as inf, i}
					{#if i == 0}
						<P size="xl">{inf}</P>
					{:else if i == 1}
						<P size="lg">{inf}</P>
					{:else}
						<P size="sm">{inf}</P>
					{/if}
				{/each}
			</div>

			<div class="searchwrapper" style="margin-right:3rem;margin-left:3rem;margin-top:1rem;">
				<TableHeader headerType="search">
					<Search
						bind:value={searching}
						slot="search"
						placeholder="Search {events.length} events"
						size="md"
					/>
					<div></div>
				</TableHeader>
			</div>

			<div class="card-container">
				{#each Array(columns) as _, colIndex}
					{#if events
						.filter((e) => labelIncludesSearchTerm(e.title, searching))
						.filter((_, i) => i % columns === colIndex).length > 0}
						<div class="masonry-column" style="flex: 1;">
							{#each events
								.filter((e) => labelIncludesSearchTerm(e.title, searching))
								.filter((_, i) => i % columns === colIndex) as e}
								<Card img={e.image} target="_blank" href={e._url} id={e.id} class="masonry-item">
									<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
										{e.title}
									</h5>
									<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
										{e.description}
									</p>
									<br />
									<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
										<strong>Location:</strong>
										{e.location}
									</p>
									<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
										<strong>Contact Name:</strong>
										{e.contact_name}
									</p>
									<p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
										<strong>Contact Phone:</strong>
										{e.contact_phone}
									</p>
									{#if e.content}
										<br />
										<div class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
											{@html e.content}
										</div>
									{/if}
								</Card>
							{/each}
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>

	<style>
		.outer-container {
			display: flex;
			justify-content: center;
		}

		.wholeclubwrapper {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			padding-bottom: 3rem;
			width: fit-content;
			min-width: 800px;
		}

		.masonry-column {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			align-items: center;
			width: 1fr;
		}

		.card-container {
			display: flex;
			padding: 0 3rem;
			overflow: hidden;
			width: fit-content;
			gap: 1rem;
			align-self: center;
		}

		@media (max-width: 767px) {
			.masonry-column,
			.card-container {
				width: 100%;
			}
			.wholeclubwrapper {
				min-width: 400px;
				width: 100%;
				padding: 1rem;
			}
		}

		@media (max-width: 500px) {
			.titleinfowrapper {
				margin-left: 1rem !important;
			}
			.searchwrapper {
				margin-right: 1rem !important;
				margin-left: 1rem !important;
			}
			.card-container {
				padding: 0 1rem;
				width: 100%;
			}
			.masonry-item {
				max-width: 100%;
			}
		}
		
		.placeholder-card-container {
			display: flex;
			gap: 1rem;
		}
	</style>
{:else}
<div class="outer-container">
	<div class="wholeclubwrapper bg-gray-100" style="height:100%;">
		<center>
			<div class="loadingwrapper" style="font-size:large; margin-top:1rem;">
				Loading Events ... <Spinner color="blue" />
			</div>
		</center>

		<div class="placeholder-card-container">
			<CardPlaceholder />
			<CardPlaceholder />
			<CardPlaceholder />
			<CardPlaceholder />
			<CardPlaceholder />
		</div>
	</div>
</div>

<style>
			.outer-container {
			display: flex;
			justify-content: center;
		}
		.placeholder-card-container {
			margin: 3rem;
			display: flex;
			gap: 3rem;
			align-self: center;
		}
</style>
{/if}