<script>
	import { onMount } from 'svelte';
	import { Button, ListPlaceholder, Spinner, TabItem, Tabs } from 'flowbite-svelte';
	import AdminClub from './clubs/AdminClub.svelte';
	import AdminMentor from './mentors/AdminMentor.svelte';
	import AdminUser from './users/AdminUser.svelte';
	import AdminAllInfo from './allinfo/AdminAllInfo.svelte';
	import AdminPeerMentor from './peermentor/AdminPeerMentor.svelte';
	import { user } from '../../stores/auth';
	import { getUserDocData } from '../../lib/user';
	import { writable } from 'svelte/store';
	import NoAccessPage from '../NoAccessPage.svelte';
	import { Page404, Section } from 'flowbite-svelte-blocks';

	let wholeReady = writable(false);

	let email = '';
	let userInfo;

	onMount(async () => {
		wholeReady.set(false);
		user.subscribe(async (value) => {
			if (value) {
				email = value.email;
				console.log(email);
				userInfo = await getUserDocData(email);
			} else {
				email = '';
			}
		});
		wholeReady.set(true);
	});
</script>

{#if $user}
	{#if $wholeReady}
		{#if userInfo}
			{#if userInfo.role == 'Super Admin' || userInfo.role == 'Admin'}
				<div style="margin:3rem; margin-top:0; height:100vh" class="admincontainer">
					<p class="text-xl">Admin Dashboard</p>

					<Tabs tabStyle="underline">
						<TabItem open title="Users">
							<AdminUser></AdminUser>
						</TabItem>
						<TabItem title="Mentors">
							<AdminMentor></AdminMentor>
						</TabItem>
						<TabItem title="Clubs">
							<AdminClub></AdminClub>
						</TabItem>
						<TabItem title="Opportunities">
							<AdminPeerMentor></AdminPeerMentor>
						</TabItem>
						<TabItem title="All Info">
							<AdminAllInfo></AdminAllInfo>
						</TabItem>
					</Tabs>
				</div>
			{:else}
				<NoAccessPage></NoAccessPage>
			{/if}
		{:else}
			<center>
				Gathering Data ... <Spinner color="green" />
				<ListPlaceholder></ListPlaceholder>
			</center>
		{/if}
	{/if}
{:else}
	<Section name="page404">
		<Page404>
			<svelte:fragment slot="paragraph">
				<p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">
					You do not have access to this page!
				</p>
				<p class="mb-4 text-lg font-light text-gray-500">Please go away.</p>
				<Button outline href="/" size="lg" color="blue">OK</Button>
			</svelte:fragment>
		</Page404>
		<center>
			<img
				src="https://firebasestorage.googleapis.com/v0/b/crlspathfinders-82886.appspot.com/o/other-images%2Fimsorryemoji.jpg?alt=media&token=d4eb6c40-4098-4a11-a4a5-9cf1103ff527"
				alt="I'm sorry"
			/>
		</center>
	</Section>
{/if}
