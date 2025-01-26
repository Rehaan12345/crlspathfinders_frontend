<script>
	import { onMount } from 'svelte';
	import HomeMainPage from './HomeMainPage.svelte';
	import { getLoggedIn, toggleLoggedIn } from '../lib/auth/login';
	import { user } from '../stores/auth';
	import { getUserDocData } from '../lib/user';
	import { retrieveUserInfo } from '$lib/cache';
	import { getCollection, getCollectionDoc, updateWholeWebsiteData } from '$lib/api';
	import { retrieveDemographics } from '$lib/mentor';

	let loggedIn = false;
	let email;
	let loggedInUser;
	let userInfo;
	let mentors;
	let users;
	let clubs;
	let opps;
	let allInfo;
	let demographics;
	let categories;

	onMount(async () => {
		if (getLoggedIn()) {
			loggedIn = true;
			await retrieveUserInfo();
			setTimeout(() => {
				toggleLoggedIn();
				loggedIn = false;
			}, 3000);
		}
		mentors = await getCollection('Mentors');
		users = await getCollection('Users');
		clubs = await getCollection('Clubs');
		opps = await getCollection('PeerMentorLinks');
		allInfo = await getCollection('AllInfo');
		demographics = await retrieveDemographics();
		categories = await getCollectionDoc('Demographics', 'PeerMentor');
		updateWholeWebsiteData('mentors', mentors);
		updateWholeWebsiteData('users', users);
		updateWholeWebsiteData('clubs', clubs);
		updateWholeWebsiteData('opps', opps);
		updateWholeWebsiteData('allinfo', allInfo);
		updateWholeWebsiteData('demographics', demographics);
		updateWholeWebsiteData('categories', categories);
		user.subscribe(async (value) => {
			if (value) {
				email = value.email;
				loggedInUser = await getUserDocData(email);
				updateWholeWebsiteData('loggedInUser', loggedInUser);
			} else {
				email = '';
			}
		});
	});
</script>

<div class="mainwrapper">
	<!-- <Home></Home> -->
	<HomeMainPage></HomeMainPage>
</div>

<style>
	@media (prefers-color-scheme: dark) {
		* {
			color-scheme: light;
			background-color: white;
		}
	}
</style>
