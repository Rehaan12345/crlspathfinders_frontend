<script>
	import { onMount } from 'svelte';
	import {
		Alert,
		Button,
		Hr,
		Input,
		Label,
		Modal,
		MultiSelect,
		P,
		Span,
		Spinner,
		Textarea
	} from 'flowbite-svelte';
	import { getCollection } from '$lib/api';
	import { createClub, editClub } from '../../lib/club';
	import { writable } from 'svelte/store';
	import { user } from '../../stores/auth';

	let isLoading = writable(false);
	let confirmRegisterModal = writable(false);
	let errorMessage = writable('');
	let successMessage = writable('');

	let clubDays = [];

	let selectedClubDays;

	let currDays = [];

	let loggedInEmail;

	let daysoftheweek = [
		{ value: 'Monday', name: 'Monday' },
		{ value: 'Tuesday', name: 'Tuesday' },
		{ value: 'Wednesday', name: 'Wednesday' },
		{ value: 'Thursday', name: 'Thursday' },
		{ value: 'Friday', name: 'Friday' }
	];

	function checkIsAdvisor(email) {
		console.log(email);
		console.log(typeof email.charAt(0));
		if (typeof email.charAt(0) == Number) {
			console.log('failed');
		}
	}

	const checkAllInfo = async () => {
		// const advisor_email = document.querySelector('#advisoremail').value;
		// const name = document.querySelector('#clubname').value;
		// const presEmail = document.querySelector('#presidentemail').value;
		let veepsEmails = [];
		for (let i = 1; i < 4; i++) {
			try {
				const veep = document.querySelector('#vicepresidentemail' + i).value;
				veepsEmails.push(veep);
			} catch {
				veepsEmails.push('');
			}
		}

		// Make sure advisor is already signed up with role "Advisor":
		// const advisor = await getUserDocData(advisor_email);
		// checkIsAdvisor(advisor_email);
		// console.log(advisor);
		// if (!advisor) {
		// 	errorMessage.set(
		// 		'Your advisor needs to have already made an account with CRLS PathFinders prior to registering your club.'
		// 	);
		// 	return false;
		// }

		try {
			console.log(advisor_email);
			if (!isNaN(advisor_email[0])) {
				errorMessage.set("Make sure to use your advisor's correct email!");
				return false;
			}

			// if (advisor_email.indexOf("@cpsd.us") === -1) {
			// 	errorMessage.set("Make sure to use your advisor's correct email (only cpsd.us allowed)!");
			// 	return false;
			// }
		} catch (error) {
			console.log("couldn't find advisor email.");
		}

		// Make sure this club name hasn't been taken:
		const allClubs = await getCollection('Clubs');
		for (let i = 0; i < allClubs.length; i++) {
			if (allClubs[i].club_name.localeCompare(name) === 0) {
				errorMessage.set('There is already a club registered as ' + name);
				return false;
			}
		}

		// Make sure presEmail == currLoggedIn.email
		console.log(loggedInEmail, presEmail);
		if (loggedInEmail.localeCompare(presEmail) !== 0) {
			errorMessage.set('Only the president of ' + name + ' can register.');
			return false;
		}

		return true;
	};

	let desc;
	let name;
	let advisor_email;
	let presEmail;
	let roomNum;
	let gClassLink;
	let startTime;

	const handleSubmit = async () => {
		isLoading.set(true);
		if ((await checkAllInfo()) || showVals) {
			try {
				const advisor_email = document.querySelector('#advisoremail').value;
				console.log(currClub.club_days);
				const desc = document.querySelector('#clubdescription').value;
				const name = document.querySelector('#clubname').value;
				const presEmail = document.querySelector('#presidentemail').value;
				const roomNum = document.querySelector('#roomnumber').value;
				const gClassLink = document.querySelector('#gclasslink').value;
				const startTime = document.querySelector('#clubstarttime').value;
				let status;
				if (showVals) {
					status = 'Approved';
				} else {
					status = 'Pending';
				}
				let veepsEmails = [];
				for (let i = 1; i < 4; i++) {
					try {
						const veep = document.querySelector('#vicepresidentemail' + i).value;
						veepsEmails.push(veep);
					} catch {
						veepsEmails.push('');
					}
				}
				console.log(veepsEmails);

				if (view.localeCompare('Register') === 0) {
					const res = await createClub(
						advisor_email,
						clubDays,
						desc,
						name,
						presEmail,
						roomNum,
						gClassLink,
						startTime,
						status,
						veepsEmails
					);
					console.log(res);
					if (res === -16) {
						errorMessage.set('Failed');
						return -1;
					}
				} else if (view.localeCompare('Edit') === 0) {
					const secretPassword = document.querySelector('#secret_password').value;
					await editClub(
						advisor_email,
						currDays,
						desc,
						name,
						presEmail,
						roomNum,
						gClassLink,
						startTime,
						status,
						veepsEmails,
						secretPassword
					);
				}
				errorMessage.set('');
				if (!showVals) {
					successMessage.set(
						name +
							' has been successfully registered. In order to view your club on the website, you and your advisor should have gotten an email with a code to verify the club. You can either input the verification code yourself or you can ask your advisor to make an account and verify for you. Once you do so, ' +
							name +
							' will be visible on the CRLS PathFinders website.'
					);
				} else {
					successMessage.set(
						'Successfully edited ' + name + '! Reload the page to see the changes.'
					);
				}
			} catch (error) {
				errorMessage.set('' + error);
				console.log('Failed to edit club: ' + error);
			} finally {
				advisor_email = '';

				isLoading.set(false);
			}
		} else {
			console.log('Club registration criteria not met!');
			isLoading.set(false);
		}
	};

	export let view = '';
	export let showVals = false;
	export let currClub = {};

	onMount(() => {
		console.log('onmount');
		if (showVals) {
			console.log('showvals');
			console.log(currClub);
			clubDays = currClub.club_days;
			console.log(clubDays);
			currDays = currClub.club_days;
		}
		user.subscribe((value) => {
			if (value) {
				loggedInEmail = value.email;
			} else {
				loggedInEmail = '';
			}
		});
	});

	const openConfirmRegisterModal = () => confirmRegisterModal.set(true);
	const closeConfirmRegisterModal = () => confirmRegisterModal.set(false);
</script>

<!-- Confirm register club: -->

{#if $confirmRegisterModal}
	<Modal title="Register New Club" open={$confirmRegisterModal} on:close={openConfirmRegisterModal}>
		<p class="text-base leading-relaxed text-gray-800">
			<center>
				rehaan
				<br />
			</center>
		</p>
	</Modal>
{/if}

<br />
<!-- <h2 class="mb-4 text-xl font-bold text-gray-900">{view} Your Club</h2> -->
<P size="4xl" weight="bold"
	><Span underline decorationClass="decoration-8 decoration-red-800 dark:decoration-red-600"
		>{view}</Span
	> Your Club</P
>
<P size="l">
	Need help registering your club? Please follow the steps <u
		><a
			target="_blank"
			href="https://docs.google.com/document/d/1KE2f7uTJbHAJTiiC_QR9EC_LPuOrgRl2xr2qtWoNaeo/edit?tab=t.0"
			>here</a
		></u
	>!
</P>
<Hr classHr="w-48 h-1 my-4 rounded md:my-3 bg-gray-500" />
<form
	on:submit={() => {
		handleSubmit();
		// checkAllInfo();
		// openConfirmRegisterModal();
	}}
>
	{#if !showVals}
		{#if $errorMessage.length > 1}
			<Alert color="red">
				<span class="font-medium">Registration failed:</span>
				{$errorMessage}
			</Alert>
		{:else if $successMessage.length > 1}
			<Alert color="blue">
				<span class="font-medium">Next steps:</span>
				{$successMessage}
			</Alert>
		{/if}
	{:else if $errorMessage.length > 1}
		<Alert color="red">
			<span class="font-medium">Club editing failed:</span>
			{$errorMessage}
		</Alert>
	{:else if $successMessage.length > 1}
		<Alert color="blue">
			<span class="font-medium">Success:</span>
			{$successMessage}
		</Alert>
	{/if}
	<!-- <br> -->
	<div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
		<div class="sm:col-span-2">
			<Label for="clubname" class="mb-2">Club Name <i style="color: red;">*</i></Label>
			{#if showVals}
				<Input type="text" id="clubname" placeholder="Type club name" value={currClub.club_name} />
			{:else}
				<Input type="text" id="clubname" placeholder="Type club name" required bind:value={name} />
			{/if}
		</div>
		<div class="w-full">
			<Label for="presidentemail" class="mb-2">President Email 1<i style="color: red;">*</i></Label>
			{#if showVals}
				<Input
					type="text"
					id="presidentemail"
					placeholder="President email 1"
					value={currClub.president_email}
				/>
			{:else}
				<Input
					type="text"
					id="presidentemail"
					placeholder="President email 1"
					required
					bind:value={presEmail}
				/>
			{/if}
		</div>
		<div class="w-full">
			<Label for="vicepresidentemail1" class="mb-2">President Email 2</Label>
			{#if showVals}
				<Input
					type="text"
					id="vicepresidentemail1"
					value={currClub.vice_presidents_emails[0]}
					placeholder="President email 2"
				/>
			{:else}
				<Input type="text" id="vicepresidentemail1" placeholder="President email 2" />
			{/if}
		</div>
		<div class="w-full">
			<Label for="vicepresidentemail2" class="mb-2">President Email 3</Label>
			{#if showVals}
				<Input
					type="text"
					id="vicepresidentemail2"
					value={currClub.vice_presidents_emails[1]}
					placeholder="President email 3"
				/>
			{:else}
				<Input type="text" id="vicepresidentemail2" placeholder="President email 3" />
			{/if}
		</div>
		<div class="w-full">
			<Label for="vicepresidentemail3" class="mb-2">President Email 4</Label>
			{#if showVals}
				<Input
					type="text"
					id="vicepresidentemail3"
					value={currClub.vice_presidents_emails[2]}
					placeholder="President email 4"
				/>
			{:else}
				<Input type="text" id="vicepresidentemail3" placeholder="President email 4" />
			{/if}
		</div>
		<div class="w-full">
			<Label for="advisoremail" class="mb-2">Advisor Email <i style="color: red;">*</i></Label>
			{#if showVals}
				<Input
					type="text"
					id="advisoremail"
					value={currClub.advisor_email}
					placeholder="Advisor Email"
				/>
			{:else}
				<Input
					type="text"
					id="advisoremail"
					placeholder="Advisor Email"
					required
					bind:value={advisor_email}
				/>
			{/if}
		</div>
		<div class="w-full">
			<Label for="roomnumber" class="mb-2">Room Number <i style="color: red;">*</i></Label>
			{#if showVals}
				<Input type="text" id="roomnumber" value={currClub.room_number} placeholder="Room Number" />
			{:else}
				<Input
					type="text"
					id="roomnumber"
					placeholder="Room Number"
					required
					bind:value={roomNum}
				/>
			{/if}
		</div>
		<div class="w-full">
			<Label for="gclasslink" class="mb-2">Google Classroom Link <i style="color: red;">*</i></Label
			>
			{#if showVals}
				<Input
					type="text"
					id="gclasslink"
					value={currClub.google_classroom_link}
					placeholder="Google Classroom Link"
				/>
			{:else}
				<Input
					type="text"
					id="gclasslink"
					placeholder="Google Classroom Link"
					required
					bind:value={gClassLink}
				/>
			{/if}
		</div>
		<div class="w-full">
			<Label>
				Days your club meets <i style="color: red;">*</i>
				{#if showVals}
					<MultiSelect
						class="mt-2"
						id="clubdays"
						placeholder="Select day(s)"
						items={daysoftheweek}
						bind:value={currDays}
					/>
				{:else}
					<MultiSelect
						class="mt-2"
						placeholder="Select day(s)"
						items={daysoftheweek}
						bind:value={clubDays}
						required
					/>
				{/if}
			</Label>
		</div>
		<div class="w-full">
			<Label for="clubstarttime" class="mb-2">Club Start Time <i style="color: red;">*</i></Label>
			{#if showVals}
				<Input type="time" id="clubstarttime" placeholder="12" value={currClub.start_time} />
			{:else}
				<Input type="time" id="clubstarttime" placeholder="12" bind:value={startTime} required />
			{/if}
		</div>
		<div class="sm:col-span-2">
			<Label for="description" class="mb-2">Description <i style="color: red;">*</i></Label>
			{#if showVals}
				<Textarea
					id="clubdescription"
					placeholder="Any additional information that club members should know before joining your club!"
					rows="4"
					name="description"
					value={currClub.club_description}
				/>
			{:else}
				<Textarea
					id="clubdescription"
					placeholder="Any additional information that club members should know before joining your club!"
					rows="4"
					name="description"
					required
					bind:value={desc}
				/>
			{/if}
		</div>
		{#if showVals}
			<input type="text" id="secret_password" value={currClub.secret_password} hidden readonly />
		{/if}
		{#if $isLoading}
			<Button disabled color="green" type="submit">
				Loading ... <Spinner size={4} color="green" />
			</Button>
		{:else}
			<Button color="green" type="submit">
				{view} Club
			</Button>
		{/if}
	</div>
	<br />
	<br /><br />
</form>
