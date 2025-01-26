<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getCollectionDoc } from '$lib/api';
	import { HeroBody, HeroHeader, Section } from 'flowbite-svelte-blocks';
	import {
		Button,
		ButtonGroup,
		DescriptionList,
		List,
		Modal,
		Popover,
		Spinner,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { ImageOutline, PenOutline } from 'flowbite-svelte-icons';
	import { user } from '../../../stores/auth';
	import { writable } from 'svelte/store';
	import { getUserDocData, toggleClub } from '../../../lib/user';
	import RegisterForm from '../../registeryourclub/RegisterForm.svelte';
	import { setClubImg, UploadClubImage } from '../../../lib/club';

	let isLoading = writable(false);
	let showToast = writable(false);
	let showEditModal = writable(false);
	let showImageModal = writable(false);

	let ready = false;

	const clubId = $page.params.clubId;

	console.log(clubId);

	let clubInfo;

	let email;

	let userInfo;

	let userClubs = [];

	let vice_presidents;

	let members = [];

	let openRow;

	let view = 'Edit';
	let showVals = true;
	let currClub;

	let editOn = false;

	const toggleRow = (i) => {
		openRow = openRow === i ? null : i;
	};

	const handleClick = async (email, clubId) => {
		isLoading.set(true);
		try {
			const res = await toggleClub(email, clubId);
		} catch (error) {
			console.log('Failed to toggle club! ' + error);
		} finally {
			isLoading.set(false);
			userInfo = await getUserDocData(email);
			userClubs = userInfo.joined_clubs;
			clubInfo = await getCollectionDoc('Clubs', clubId);
			currClub = clubInfo;
			members = clubInfo.members;
			setTimeout(() => {
				showToast.set(false);
			}, 3000);
			showToast.set(true);
		}
	};

	const handleSubmitImage = async (file) => {
		// First make sure it is the correct dimensions, type, etc.
		console.log(file);
		isLoading.set(true);
		try {
			const res = await UploadClubImage(file);
			console.log(res);
			const res2 = await setClubImg(res, clubId, currClub.club_img);
			console.log(res2);
		} catch (error) {
			console.log('failure in handling submit img: ' + error);
		} finally {
			clubInfo = await getCollectionDoc('Clubs', clubId);
			currClub = clubInfo;
			vice_presidents = clubInfo.vice_presidents_emails;
			members = clubInfo.members;
			isLoading.set(false);
			closeshowImageModal();
		}
	};

	onMount(async () => {
		clubInfo = await getCollectionDoc('Clubs', clubId);
		currClub = clubInfo;
		vice_presidents = clubInfo.vice_presidents_emails;
		members = clubInfo.members;
		console.log(vice_presidents);
		ready = true;
		console.log(clubInfo);
		user.subscribe(async (value) => {
			if (value) {
				email = value.email;
				userInfo = await getUserDocData(email);
				console.log(userInfo);
				userClubs = userInfo.joined_clubs;
				console.log(userClubs);
			}
		});
	});

	const openshowEditModal = () => showEditModal.set(true);
	const closeshowEditModal = () => showEditModal.set(false);

	const openshowImageModal = () => showImageModal.set(true);
	const closeshowImageModal = () => showImageModal.set(false);

	let file = '';
</script>

<!-- Edit club: -->
{#if $showEditModal}
	<Modal class="min-w-full" open={$showEditModal} on:close={closeshowEditModal}>
		<RegisterForm {view} {currClub} {showVals}></RegisterForm>
	</Modal>
{/if}

<!-- Upload img: -->
{#if $showImageModal}
	<Modal title="Upload image" open={$showImageModal} on:close={closeshowImageModal}>
		<p class="text-base leading-relaxed text-gray-800">Upload a photo of your club</p>
		<input type="file" accept="image/*" on:change={(e) => (file = e.target.files[0])} />
		<br />
		<Button
			outline
			color="purple"
			on:click={async () => {
				await handleSubmitImage(file);
			}}
		>
			Upload
			{#if $isLoading}
				<Spinner color="purple" />
			{/if}
		</Button>
	</Modal>
{/if}

<!-- {#if $showToast}

    <div class="toastwrapper" style="z-index:10;">
        <Toast transition={fly} params={{ x: 200 }} position="bottom-right" color="green" class="mb-4">
            Successfully joined / left club
        </Toast>
    </div>

{/if} -->

{#if ready}
	<Section name="heroDefault">
		<HeroHeader>
			<svelte:fragment slot="h1">{clubInfo.club_name}</svelte:fragment>
			<p class="text-gray-800">
				{clubInfo.club_description}
			</p>
			<br />
		</HeroHeader>

		<div
			class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4"
		>
			{#if $user}
				{#if userClubs.includes(clubId)}
					<center>
						<ButtonGroup>
							<Button
								pill
								color="red"
								on:click={() => {
									// currClick = club.id;
									handleClick(email, clubId);
								}}
							>
								Leave Club
								{#if $isLoading}
									<Spinner size={4} color="red" />
								{/if}
							</Button>
							{#if clubInfo.president_email == userInfo.email || clubInfo.vice_presidents_emails.includes(userInfo.email) || clubInfo.advisor_email == userInfo.emai}
								<Button pill color="blue" on:click={openshowEditModal}>
									Edit <PenOutline></PenOutline>
								</Button>
								<Button pill color="purple" on:click={openshowImageModal}>
									Upload Image <ImageOutline></ImageOutline>
								</Button>
							{/if}
						</ButtonGroup>
					</center>
				{:else}
					<Button
						pill
						color="green"
						on:click={() => {
							// currClick = club.id;
							handleClick(email, clubId);
						}}
					>
						Join Club
						{#if $isLoading}
							<Spinner size={4} color="green" />
						{/if}
					</Button>
				{/if}
			{:else}
				<Button disabled pill color="green" id="disabledjoinclubbutton">Join Club</Button>

				<Popover
					class="w-64 text-sm font-light "
					title="Make an account first!"
					triggeredBy="#disabledjoinclubbutton"
				>
					<p class="text-gray-800">
						You can only join clubs when you have an account!
						<br /><br />
						<u><a href="/auth/login">Log in</a></u> or <u><a href="/auth/signup">Sign up</a></u>
					</p>
				</Popover>
			{/if}

			<!-- Join the google classroom: -->
			<Button pill color="blue">
				<a target="_blank" href={clubInfo.google_classroom_link}>Join our Google Classroom!</a>
			</Button>
		</div>
		<center
			><img
				height="300rem;"
				width="600rem;"
				style="margin-bottom:3rem;border-radius:10px;"
				src={clubInfo.club_img}
				alt={clubInfo.club_name}
			/></center
		>
		<HeroBody>
			<div class="clubinfolistwrapper" style="text-align:left;">
				<List tag="dl" class="text-gray-900 divide-y divide-gray-200">
					<div class="flex flex-col pb-3">
						<DescriptionList tag="dt" class="mb-1">Presidents:</DescriptionList>
						<DescriptionList tag="dd">
							<a target="_blank" href="mailto:{clubInfo.president_email}"
								><u>{clubInfo.president_email}</u></a
							>
							{#each vice_presidents as vp, i}
								{#if vp.length > 0}
									<!-- <div class="flex flex-col pb-3"> -->
									| <a target="_blank" href="mailto:{vp}"><u>{vp}</u></a>
									<!-- </div> -->
								{/if}
							{/each}
						</DescriptionList>
					</div>

					<div class="flex flex-col pb-3">
						<DescriptionList tag="dt" class="mb-1">Room</DescriptionList>
						<DescriptionList tag="dd">{clubInfo.room_number}</DescriptionList>
					</div>
					<div class="flex flex-col pb-3">
						<DescriptionList tag="dt" class="mb-1">Start Time</DescriptionList>
						<DescriptionList tag="dd">{clubInfo.start_time}</DescriptionList>
					</div>
					<div class="flex flex-col pb-3">
						<DescriptionList tag="dt" class="mb-1">Advisor</DescriptionList>
						<DescriptionList tag="dd"
							><a target="_blank" href="mailto:{clubInfo.advisor_email}"
								><u>{clubInfo.advisor_email}</u></a
							></DescriptionList
						>
					</div>
				</List>
			</div>
		</HeroBody>

		<Table>
			<caption class="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
				Members
				<p class="mt-1 text-sm font-normal text-gray-500">
					See who else is in {clubInfo.club_name}
				</p>
			</caption>
			<TableHead>
				<!-- <TableHeadCell>Name</TableHeadCell> -->
				<TableHeadCell>Email</TableHeadCell>
				<!-- <TableHeadCell>Role</TableHeadCell> -->
				{#if userInfo && (clubInfo.president_email == userInfo.email || clubInfo.vice_presidents_emails.includes(userInfo.email))}
					<TableHeadCell>
						<span class="sr-only">Remove Member</span>
					</TableHeadCell>
				{/if}
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each members as mem, i}
					<TableBodyRow>
						<!-- <TableBodyCell>Apple MacBook Pro 17"</TableBodyCell> -->
						<TableBodyCell>{i + 1} | {mem}</TableBodyCell>
						<!-- <TableBodyCell>Laptop</TableBodyCell> -->
						{#if userInfo && (clubInfo.president_email == userInfo.email || clubInfo.vice_presidents_emails.includes(userInfo.email))}
							<TableBodyCell>
								<Button
									color="red"
									on:click={() => {
										handleClick(mem, clubId);
									}}>Remove</Button
								>
							</TableBodyCell>
						{/if}
					</TableBodyRow>
				{/each}
			</TableBody>
			<br /><br />
		</Table>
	</Section>
{/if}
