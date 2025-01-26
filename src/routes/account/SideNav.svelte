<script>
	import { TabItem, Tabs } from 'flowbite-svelte';
	import AccountItem from './Items/AccountItem.svelte';
	import { onMount } from 'svelte';
	import { getUserDocData } from '../../lib/user';
	import { user } from '../../stores/auth';
	import ClubItem from './Items/ClubItem.svelte';

	let email = '';

	let userInfo;

	let clubs;

	// $: {
	//   user.subscribe(value => {
	//     if (value) {
	//       email = value.email;
	//     } else {
	//       email = '';
	//     }
	//   });
	// }

	onMount(async () => {
		// userInfo = await fetchUserInfo();
		// if (userInfo["uid"] !== null) { console.log(userInfo["uid"]); }
		// console.log(userInfo);
		user.subscribe(async (value) => {
			if (value) {
				email = value.email;
				userInfo = await getUserDocData(email);
				console.log(userInfo);
				clubs = userInfo.joined_clubs;
			} else {
				email = '';
			}
		});
	});
</script>

<Tabs
	tabStyle="full"
	defaultClass="flex rounded-lg divide-x rtl:divide-x-reverse divide-gray-200 shadow"
>
	<TabItem class="w-full" open>
		<span slot="title">Account</span>
		<AccountItem {userInfo}></AccountItem>
	</TabItem>
	<TabItem class="w-full">
		<span slot="title">My Clubs</span>
		<ClubItem {clubs}></ClubItem>
	</TabItem>
	<TabItem class="w-full">
		<span slot="title">Settings</span>
		<p class="text-sm text-gray-500">
			<b>Settings:</b>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
			et dolore magna aliqua.
		</p>
	</TabItem>
	<TabItem class="w-full">
		<span slot="title">Users</span>
		<p class="text-sm text-gray-500">
			<b>Users:</b>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
			et dolore magna aliqua.
		</p>
	</TabItem>
</Tabs>
