<script>
	import '../app.css';
	import MainNav from './MainNav.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import {
		Alert,
		Footer,
		FooterBrand,
		FooterCopyright,
		FooterLink,
		FooterLinkGroup
	} from 'flowbite-svelte';
	import { getCollectionDoc } from '$lib/api';

	let alerts;

	// Adds dynamic title to each page, paired with svelte:head below
	const appName = 'CRLS PathFinders';
	$: title =
		appName +
		' | ' +
		[appName, ...$page.url.pathname.split('/').slice(1)]
			.filter(Boolean)
			.findLast(Boolean)
			.replace(/-/g, ' ')
			.replace(/\b\w/g, (l) => l.toUpperCase());

	onMount(async () => {
		alerts = await getCollectionDoc('AllInfo', 'alerts');
		console.log(alerts);
	});
</script>

<div class="mainlayoutwrapper bg-gray-100" style="height:100%;">
	<MainNav></MainNav>

	{#if alerts}
		{#if alerts.bad_announcements}
			{#each alerts.bad_announcements as abad}
				{#if abad.show}
					<center>
						<Alert color="red" border>
							<span class="font-medium">{abad.data}</span>
							<br />
						</Alert>
					</center>
				{/if}
			{/each}
		{/if}
		{#if alerts.good_announcements}
			{#each alerts.good_announcements as agood}
				{#if agood.show}
					<center>
						<Alert color="blue" border>
							<span class="font-medium">{agood.data}</span>
							<br />
						</Alert>
					</center>
				{/if}
			{/each}
		{/if}
	{/if}

	<slot></slot>

	<Footer footerType="logo">
		<div class="sm:flex sm:items-center sm:justify-between">
			<FooterBrand
				href="/"
				src="https://firebasestorage.googleapis.com/v0/b/crlspathfinders-82886.appspot.com/o/other-images%2Fpathfinderslogo_nobackground.png?alt=media&token=58a95374-adfd-4c0f-b724-a5bbd6ed7ea5"
				alt="PathFinders Logo"
				name="CRLS PathFinders"
			/>
			<FooterLinkGroup ulClass="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0">
				<FooterLink href="/findaclub">Clubs</FooterLink>
				<FooterLink href="/findamentor">Mentors</FooterLink>
				<FooterLink href="/opportunities">Opportunities</FooterLink>
				<FooterLink
					target="_blank"
					href="https://mail.google.com/mail/?view=cm&fs=1&to=crlspathfinders25@gmail.com&su=CRLS%20PathFinders%20Support"
					>Contact</FooterLink
				>
				<FooterLink target="_blank" href="https://github.com/Rehaan12345/crlspathfinders_frontend"
					>Frontend GitHub</FooterLink
				>
				<FooterLink target="_blank" href="https://github.com/Rehaan12345/crlspathfinders_backend"
					>Backend GitHub</FooterLink
				>
			</FooterLinkGroup>
		</div>
		<hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
		<FooterCopyright href="/" by="CRLS PathFinders™" />
	</Footer>
</div>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<style>
	/* @media (prefers-color-scheme: dark) {
		* {
			color-scheme: light;
			background-color: white;
		}
	} */
	/* 
    @media (prefers-color-scheme: dark) {
    .dark .bg-gray-900,
    .dark .bg-gray-800,
    .dark .bg-gray-700,
    .dark .bg-gray-600,
    .dark .text-white,
    .dark .text-gray-300 {
        background-color: var(--tw-bg-opacity) white !important;
        color: var(--tw-text-opacity) black !important;
    }
    } */
</style>
