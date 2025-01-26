<script>
	import {
		Dropdown,
		DropdownItem,
		Navbar,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl
	} from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	import { logout, user } from '../stores/auth';
	import { onMount } from 'svelte';
	import { getCurrEmail, getUserDocData } from '../lib/user';
	import VerifyClub from './VerifyClub.svelte';
	import { writable } from 'svelte/store';

	let openVerify = writable(false);
	let wholeReady = writable(false);

	$: activeUrl = $page.url.pathname;
	let activeClass = 'text-white bg-gray-700 md:bg-transparent md:text-gray-700';
	let nonActiveClass =
		'text-gray-400 hover:bg-gray-500 md:hover:bg-transparent md:border-0 md:hover:text-gray-500';

	$: email = getCurrEmail();

	let email;
	let loggedInUser;

	function basicSetUp() {
		user.subscribe(async (value) => {
			if (value) {
				email = value.email;
				console.log(email);
				loggedInUser = await getUserDocData(email);
				console.log(loggedInUser);
				wholeReady.set(true);
			} else {
				email = '';
			}
		});
	}

	onMount(() => {
		wholeReady.set(false);
		basicSetUp();
	});
</script>

{#if $openVerify}
	<VerifyClub></VerifyClub>
{/if}

<!-- {#if $wholeReady} -->

<Navbar let:NavContainer color="black">
	<NavBrand href="/">
		<img
			src="https://firebasestorage.googleapis.com/v0/b/crlspathfinders-82886.appspot.com/o/other-images%2Fpathfinderslogo_nobackground.png?alt=media&token=58a95374-adfd-4c0f-b724-a5bbd6ed7ea5"
			class="me-3 h-6 sm:h-9"
			alt="PathFinders Logo"
		/>
		<span class="self-center whitespace-nowrap text-xl font-semibold text-black"
			>CRLS PathFinders</span
		>
	</NavBrand>
	<NavHamburger />
	<NavUl {activeUrl} {activeClass} {nonActiveClass}>
		{#if $user}
			<NavLi href="/">Home</NavLi>
			<NavLi href="/findaclub">Find a Club</NavLi>
			<NavLi href="/findamentor">Find a Mentor</NavLi>
			<NavLi href="/opportunities">Opportunities</NavLi>
			<NavLi target="_blank" href="https://www.cycheadspace.org/">Mental Health</NavLi>
			<NavLi class="cursor-pointer">
				{email}<ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 inline" />
			</NavLi>
			<Dropdown class="w-44 z-20 text-gray-500" {activeUrl} {activeClass} {nonActiveClass}>
				<!-- <DropdownItem href="/account">Account</DropdownItem> -->
				{#if loggedInUser}
					{#if loggedInUser.role != 'Advisor'}
						<DropdownItem href="/registeryourclub">Register Your Club</DropdownItem>
						{#if loggedInUser.role != 'Mentor'}
							<DropdownItem href="/becomeamentor">Become a Mentor</DropdownItem>
						{/if}
					{/if}
					{#if loggedInUser.role == 'Admin' || loggedInUser.role == 'Super Admin'}
						<DropdownItem href="/admin">Admin</DropdownItem>
					{/if}
					{#if loggedInUser.role == 'Advisor' || loggedInUser.role == 'Super Admin' || loggedInUser.is_leader}
						<DropdownItem
							href="#"
							on:click={() => {
								openVerify.set(true);
							}}>Verify Club</DropdownItem
						>
					{/if}
				{/if}
				<DropdownItem on:click={logout} href="/">Sign Out</DropdownItem>
			</Dropdown>
		{:else}
			<NavLi href="/">Home</NavLi>
			<NavLi href="/findaclub">Find a Club</NavLi>
			<NavLi href="/findamentor">Find a Mentor</NavLi>
			<NavLi href="/opportunities">Opportunities</NavLi>
			<NavLi target="_blank" href="https://www.cycheadspace.org/">Mental Health</NavLi>
			<NavLi href="/auth/login">Log In</NavLi>
			<NavLi href="/auth/signup">Sign Up</NavLi>
		{/if}
	</NavUl>
</Navbar>

<!-- {/if} -->
