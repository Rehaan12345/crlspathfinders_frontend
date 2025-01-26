<script>
	import { onMount } from 'svelte';
	import {
		Button,
		Input,
		Label,
		ListPlaceholder,
		Modal,
		Search,
		Spinner,
		Table,
		TableBodyCell,
		TableBodyRow,
		Textarea
	} from 'flowbite-svelte';
	import { TableHeader } from 'flowbite-svelte-blocks';
	// import paginationData from '../utils/advancedTable.json'
	import { getCollection, sendMassEmail } from '../../../lib/api';
	import EditClub from './EditClub.svelte';
	import { writable } from 'svelte/store';
	import { changeStatus, deleteClub } from '../../../lib/club';
	import { toggleClub } from '../../../lib/user';

	let wholeReady = writable(false);
	let isLoading = writable(false);
	let modalOpen = writable(false);
	let status = writable(null);
	let showToast = writable(false);
	let removeLoading = writable(false);
	let deleteConfirmModal = writable(false);
	let deleteCLUBConfirmModal = writable(false);
	let showSendMassEmail = writable(false);

	let clubMembers = [];

	let currI;

	let message = '';

	let emailSubject = '';
	let emailBody = '';

	const handleSendEmail = () => {
		try {
			isLoading.set(true);
			sendMassEmail('Users', emailSubject, emailBody);
			errorMessage.set('');
			successMessage.set('Sent email');
		} catch (error) {
			successMessage.set('');
			errorMessage.set(error);
		} finally {
			isLoading.set(false);
		}
	};

	function labelIncludesSearchTerm(label, searchTerm) {
		if (typeof label === 'string' && typeof searchTerm === 'string') {
			return label.toLowerCase().includes(searchTerm.toLowerCase());
		}
		return false;
	}

	const findClubMembers = (club) => {
		clubMembers = club.members;
		return clubMembers;
	};

	const handleStatus = async (secPass, status) => {
		isLoading.set(true);
		try {
			message = await changeStatus(secPass, status);
			console.log(message);
		} catch (error) {
			console.log('Failed to change status: ' + error);
		} finally {
			// status.set(currClub.status);
			closeModal();
			isLoading.set(false);
			clubs = await getCollection('Clubs');
			setTimeout(() => {
				showToast.set(false);
			}, 6000);
			showToast.set(true);
		}
	};

	const handleClick = async (email, clubId) => {
		removeLoading.set(true);
		try {
			const res = await toggleClub(email, clubId);
		} catch (error) {
			console.log('Failed to toggle club! ' + error);
		} finally {
			clubs = await getCollection('Clubs');
			for (let i = 0; i < clubs.length; i++) {
				if (clubs[i].id.localeCompare(clubId) === 0) {
					console.log(clubs[i]);
					currClub = clubs[i];
					clubMembers = currClub.members;
				}
			}
			// toggleRow(currI, currClub);
			removeLoading.set(false);
			closeDeleteConfirmModal();
			setTimeout(() => {
				showToast.set(false);
			}, 3000);
			// clubMembers.set()
			showToast.set(true);
		}
	};

	const handleDelete = async (clubId) => {
		removeLoading.set(true);
		try {
			const res = await deleteClub(clubId);
			console.log(res);
		} catch (error) {
			console.log('Failed to delete club: ' + error);
		} finally {
			clubs = await getCollection('Clubs');
			removeLoading.set(false);
			closedeleteCLUBConfirmModal();
		}
	};

	function handleDescription(desc) {
		if (desc.length > 100) {
			return desc.substring(0, 100) + ' ... ';
		}
		return desc;
	}

	let clubs = [];

	let searching = '';

	let editOn = false;

	let currClub;

	let statusOn = false;

	let openRow;
	let details;

	let currId;
	let currName;

	let currClick;

	const toggleRow = (i, club) => {
		currI = i;
		findClubMembers(club);
		openRow = openRow === i ? null : i;
	};

	onMount(async () => {
		// TODO: if local storage is empty: pull from database - if its full, take from local storage
		wholeReady.set(false);
		try {
			clubs = await getCollection('Clubs');
			console.log(clubs);
		} catch (error) {
			console.log('Onmount failed: ' + error);
		} finally {
			wholeReady.set(true);
		}
	});

	const openModal = () => modalOpen.set(true);
	const closeModal = () => modalOpen.set(false);

	const openDeleteConfirmModal = () => deleteConfirmModal.set(true);
	const closeDeleteConfirmModal = () => deleteConfirmModal.set(false);

	const opendeleteCLUBConfirmModal = () => deleteCLUBConfirmModal.set(true);
	const closedeleteCLUBConfirmModal = () => deleteCLUBConfirmModal.set(false);

	const openShowSendMassEmail = () => showSendMassEmail.set(true);
	const closeShowSendMassEmail = () => showSendMassEmail.set(false);
</script>

<!-- Send Mass Email Modal: -->
<Modal title="Send Mass Email" open={$showSendMassEmail} on:close={closeShowSendMassEmail}>
	<form on:submit={handleSendEmail}>
		<Label>Subject</Label>
		<Input type="text" bind:value={emailSubject} required></Input>
		<Label>Body</Label>
		<Textarea bind:value={emailBody} required></Textarea>
		{#if $isLoading}
			<Button type="submit" outline color="green" class="w-full" disabled
				>Loading <Spinner color="green" size="xs" /></Button
			>
		{:else}
			<Button type="submit" outline color="green" class="w-full">Submit</Button>
		{/if}
	</form>
</Modal>

{#if $deleteCLUBConfirmModal}
	<Modal
		title="Delete {currName}"
		open={$deleteCLUBConfirmModal}
		on:close={closedeleteCLUBConfirmModal}
	>
		<p class="text-base leading-relaxed text-gray-800">
			Are you sure you want to permanently remove <b>{currName}</b>? You cannot undo this action.
		</p>
		<Button
			outline
			color="red"
			on:click={() => {
				handleDelete(currId);
			}}
		>
			Delete
			{#if $removeLoading}
				<Spinner size={4} color="red" />
			{/if}
		</Button>
	</Modal>
{/if}

{#if $deleteConfirmModal}
	<Modal title="Remove Member" open={$deleteConfirmModal} on:close={closeDeleteConfirmModal}>
		<p class="text-base leading-relaxed text-gray-800">
			Removing <b>{currClick}</b> from <b>{currName}</b> will permanently remove them from this club.
			They will have to join back themselves. You cannot undo this action.
		</p>
		<Button outline color="red" on:click={() => handleClick(currClick, currId)}>
			Remove
			{#if $removeLoading}
				<Spinner size={4} color="red" />
			{/if}
		</Button>
	</Modal>
{/if}

{#if $modalOpen}
	<Modal title="Change {currClub.club_name} status" open={$modalOpen} on:close={closeModal}>
		<p class="text-base leading-relaxed text-gray-800">
			<center>
				<!-- Status: <b>{$status}</b> -->
				Status: <b>{currClub.status}</b>
				<br />
				{#if currClub.status == 'Pending'}
					<Button
						on:click={() => {
							handleStatus(currClub.secret_password, currClub.status);
						}}
						color="green"
					>
						{#if $isLoading}
							Loading ... <Spinner color="green" />
						{:else}
							Approve {currClub.club_name}
						{/if}
					</Button>
				{:else}
					<Button
						on:click={() => {
							handleStatus(currClub.secret_password, currClub.status);
						}}
						color="red"
					>
						{#if $isLoading}
							Loading ... <Spinner color="green" />
						{:else}
							Revoke {currClub.club_name} approval
						{/if}
					</Button>
				{/if}

				<br />
			</center>
		</p>
	</Modal>
{/if}

{#if $wholeReady}
	<EditClub {editOn} {currClub}></EditClub>

	<section class="bg-gray-50 p-3 sm:p-5">
		<div>
			<TableHeader headerType="search">
				<Search
					bind:value={searching}
					slot="search"
					placeholder="Search {clubs.length} clubs"
					size="md"
				/>
				<div class=""></div>
				<Button outline color="dark" on:click={openShowSendMassEmail}>Send Mass Email</Button>
			</TableHeader>
		</div>
		<br />
		<div>
			<div class="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
				<div class="overflow-x-auto">
					<table class="w-full text-sm text-left text-gray-500">
						<thead class="text-xs text-gray-700 uppercase bg-gray-50">
							<tr>
								<th scope="col" class="px-4 py-3">Edit</th>
								<th scope="col" class="px-4 py-3">Status</th>
								<th scope="col" class="px-4 py-3">Delete</th>
								<th scope="col" class="px-4 py-3">Name</th>
								<th scope="col" class="px-4 py-3">Members</th>
								<th scope="col" class="px-4 py-3">President</th>
								<th scope="col" class="px-4 py-3">Vice Presidents</th>
								<th scope="col" class="px-4 py-3">Advisor</th>
								<th scope="col" class="px-4 py-3">Days</th>
								<th scope="col" class="px-4 py-3">Description</th>
								<th scope="col" class="px-4 py-3">Room</th>
								<th scope="col" class="px-4 py-3">Google Classroom</th>
								<th scope="col" class="px-4 py-3">Password</th>
								<th scope="col" class="px-4 py-3">Start Time</th>
							</tr>
						</thead>
						<tbody>
							{#each clubs as club, i}
								{#if labelIncludesSearchTerm(club.club_name, searching) || labelIncludesSearchTerm(club.status, searching)}
									<tr class="border-b">
										<td>
											<Button
												style="margin-left:1rem; margin-top:1rem;"
												outline
												color="dark"
												size="xs"
												on:click={() => {
													currClub = club;
													console.log(club);
													editOn = !editOn;
												}}>Edit</Button
											>
										</td>
										<td class="px-2 py-1">
											{#if club.status == 'Approved'}
												<Button
													style="margin-right:1rem; margin-top:1rem;"
													outline
													color="green"
													size="xs"
													on:click={() => {
														// statusOn = !statusOn;
														currClub = club;
														// console.log(club);
														// clubs = await getCollection("Clubs");
														openModal();
													}}>{club.status}</Button
												>
											{:else}
												<Button
													style="margin-right:1rem; margin-top:1rem;"
													outline
													color="red"
													size="xs"
													on:click={async () => {
														currClub = club;
														openModal();
													}}
												>
													{club.status}
												</Button>
											{/if}
										</td>
										<td class="px-2 py-1">
											<Button
												style="margin-right:1rem; margin-top:1rem;"
												outline
												color="red"
												size="xs"
												on:click={() => {
													currId = club.id;
													currName = club.club_name;
													opendeleteCLUBConfirmModal();
												}}
											>
												Delete
											</Button>
										</td>
										<th scope="row" class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap"
											>{i + 1} |
											<b><u><a href="/findaclub/{club.id}">{club.club_name}</a></u></b></th
										>
										<td
											class="px-4 py-3"
											style="cursor:pointer;"
											id="members"
											on:click={() => toggleRow(i, club)}><u>{club.members.length}</u></td
										>
										<td class="px-4 py-3">{club.president_email}</td>
										<td class="px-4 py-3">{club.vice_presidents_emails}</td>
										<td class="px-4 py-3">{club.advisor_email}</td>
										<td class="px-4 py-3">{club.club_days}</td>
										<td class="px-4 py-3">{handleDescription(club.club_description)}</td>
										<td class="px-4 py-3">{club.room_number}</td>
										<td class="px-4 py-3"
											><u
												><a target="_blank" href={club.google_classroom_link}
													>{club.google_classroom_link}</a
												></u
											></td
										>
										<td class="px-4 py-3">{club.secret_password}</td>
										<td class="px-4 py-3">{club.start_time}</td>
									</tr>
								{/if}

								{#if openRow === i}
									<td class="px-4 py-3">
										<Table>
											{#each clubMembers as mem, i}
												<TableBodyRow>
													<TableBodyCell>
														<Button
															outline
															color="red"
															size="xs"
															on:click={() => {
																currClick = mem;
																currId = club.id;
																currName = club.club_name;
																openDeleteConfirmModal();
															}}
														>
															Remove
														</Button>
													</TableBodyCell>
													<TableBodyCell>{i + 1} | {mem}</TableBodyCell>
												</TableBodyRow>
											{/each}
										</Table>
									</td>
								{/if}
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</section>
{:else}
	<center>
		Gathering Data ... <Spinner color="green" />
		<ListPlaceholder></ListPlaceholder>
	</center>
{/if}
