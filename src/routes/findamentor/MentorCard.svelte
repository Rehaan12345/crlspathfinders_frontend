<script>
	// Importing all of the functions, variables, and components to be used..
	import { onMount } from 'svelte';
	import {
		A,
		Alert,
		Avatar,
		Badge,
		Button,
		ButtonGroup,
		Card,
		CardPlaceholder,
		Checkbox,
		Dropdown,
		DropdownItem,
		Heading,
		Input,
		Label,
		Modal,
		P,
		Popover,
		Search,
		Span,
		Spinner,
		Textarea
	} from 'flowbite-svelte';
	import MultiSelect from 'svelte-multiselect';
	import { BookOpenOutline, ChevronRightOutline, PenOutline } from 'flowbite-svelte-icons';
	import { getCollection, sendOneEmail, updateWholeWebsiteData, wholeWebsiteData } from '$lib/api';
	import { user } from '../../stores/auth';
	import { getUserDocData } from '../../lib/user';
	import { writable } from 'svelte/store';
	import RegisterForm from '../becomeamentor/RegisterForm.svelte';
	import { TableHeader } from 'flowbite-svelte-blocks';
	import { retrieveDemographics, sendMentorMenteeLogs } from '../../lib/mentor';

	const SEND_URL = import.meta.env.VITE_URL;

	// Declaring variables to be used:
	let wholeReady = writable(false); // The "writable" syntax initialized the wholeReady boolean variable as a store. Stores allow us to make the site more dynamic, changing variables and states without having to reload the page.
	let showEditModal = writable(false); // boolean store
	let filters = writable([]); // list store
	let showLogsModal = writable(false);
	let showCatalogModal = writable(false);
	let hoursWorkedCatalog = writable([]);
	let showMenteeLogs = writable(false);

	let ready = false;
	let mentors = [];
	let selected_mentees = [];
	let email = '';
	let userInfo = {};
	let view = 'Edit';
	let showVals = true;
	let currMentor;
	let searching = '';
	let info;

	let listAcademics = [];
	let listRaces = [];
	let listReligions = [];
	let listGenders = [];
	let listLanguages = [];

	// Logging mentor-mentee work:
	let list_mentees = [];
	let log_mentee = [];
	let log_description = '';
	let log_hours;
	let logSuccessMessage = writable('');
	let logFailMessage = writable('');
	let logLoading = writable(false);

	let currUser;

	let openRow;
	let currI;

	function handleDesc(desc) {
		if (desc.length > 50) {
			return desc.substring(0, 50) + ' ... ';
		}
		return desc;
	}

	const toggleRow = (i, desc) => {
		currI = i;
		// findDescription(desc);
		openRow = openRow === i ? null : i;
	};

	const checkLogInfo = () => {
		if (log_mentee.length == 0) {
			logSuccessMessage.set('');
			logFailMessage.set('Select at least one mentee.');
			return false;
		}
		if (log_mentee.length > 1) {
			logSuccessMessage.set('');
			logFailMessage.set('Only select one mentee at a time.');
			return false;
		}
		if (log_description.length < 10) {
			logSuccessMessage.set('');
			logFailMessage.set('Description too short. Add more details.');
			return false;
		}
		if (!log_hours) {
			logSuccessMessage.set('');
			logFailMessage.set('Select hours worked');
			return false;
		}
		return true;
	};

	const handleLogMentors = async () => {
		console.log('started');
		logLoading.set(true);
		try {
			if (checkLogInfo()) {
				try {
					await sendMentorMenteeLogs(
						currMentor.email,
						log_mentee[0].email,
						log_description,
						log_hours
					);
					logFailMessage.set('');
					logSuccessMessage.set(
						'Your mentee has recieved an email to verify your hours. Once they confirm, your total hours will be updated. In the meantime, check your email from us (check spam), confirming the logging of your hours, and let us know if you have any questions.'
					);
					log_mentee = [];
					log_description = '';
					log_hours = null;
				} catch (error) {
					logSuccessMessage.set('');
					logFailMessage.set(error);
					console.log(error);
				}
			}
		} catch (error) {
			console.log(error);
			logSuccessMessage.set('');
			logFailMessage.set(error);
		} finally {
			mentors = await getCollection('Mentors');
			list_mentees = await setListMentees();
			currMentor = currMentor;
			for (let i = 0; i < mentors.length; i++) {
				if (mentors[i].email.localeCompare(currMentor.email) === 0) {
					console.log('Found currMentor');
					hoursWorkedCatalog.set(mentors[i].hours_worked_catalog);
					console.log('Set hwc');
				}
			}
			logLoading.set(false);
		}
		console.log('ended');
	};

	// Filter functionality
	function toggleFilters(item) {
		console.log(filters);
		filters.update((currentItems) => {
			// Check if the item exists in the array
			if (currentItems.includes(item)) {
				// Remove the item if it exists
				return currentItems.filter((i) => i !== item);
			} else {
				// Add the item if it doesn't exist
				return [...currentItems, item];
			}
		});
	}

	// Dollar sign ($:) syntax is used for reactivity. Whenever any variables that are used after the $:, the whole function is rerun. For example, whenever the mentors variable changes, the filteredMentors variable also changes its data based on the lines in the second return statement (the specifics for how this work isn't really too important).
	$: filteredMentors = mentors.filter((obj) => {
		// Only apply filters to fields that have values in the arrays
		return $filters.every((filter) => {
			return (
				(obj.academics.length > 0 && obj.academics.includes(filter)) ||
				(obj.races.length > 0 && obj.races.includes(filter)) ||
				(obj.languages.length > 0 && obj.languages.includes(filter)) ||
				(obj.religions.length > 0 && obj.religions.includes(filter)) ||
				(obj.gender.length > 0 && obj.gender.includes(filter))
			);
		});
	});

	// Checks if the searching term is in a defined label.
	function labelIncludesSearchTerm(label, searchTerm) {
		// Makes sure both are strings
		if (typeof label === 'string' && typeof searchTerm === 'string') {
			// Is not case-sensitive.
			return label.toLowerCase().includes(searchTerm.toLowerCase());
		}
		return false;
	}

	// This function isn't currently being used.
	function filtersIncluded(mentor) {
		console.log(mentor);
		let all_info = [];
		if (mentor.academics.length > 0) {
			all_info.push(mentor.academics);
		}
		if (mentor.gender.length > 0) {
			all_info.push(mentor.gender);
		}
		if (mentor.languages.length > 0) {
			all_info.push(mentor.languages);
		}
		if (mentor.races.length > 0) {
			all_info.push(mentor.races);
		}
		if (mentor.religions.length > 0) {
			all_info.push(mentor.religions);
		}
		console.log(all_info);
		console.log($filters.length);
		// if any of these are in filters, then return true.
		for (let i = 0; i < all_info.length; i++) {
			for (let j = 0; j < $filters.length; j++) {
				if (all_info[i].localeCompare($filters[j]) === 0) {
					return true;
				}
			}
		}
		return false;
	}

	async function setListMentees() {
		console.log('start set list mentees');
		let all_users = await getCollection('Users');
		for (let i = 0; i < all_users.length; i++) {
			const curr_mentee = all_users[i];
			try {
				if (
					curr_mentee['email'].localeCompare('25ranjaria@cpsd.us') === 0 ||
					curr_mentee['grade'].localeCompare('Freshman') === 0 ||
					curr_mentee['grade'].localeCompare('Sophomore') === 0
				) {
					curr_mentee['label'] = curr_mentee.email;
					list_mentees.push(curr_mentee);
				}
			} catch (error) {
				console.log('Advisor found');
			}
		}
		return list_mentees;
	}

	// onMount function run whenever the page reloads (is an async function because we call await functions in the function).
	onMount(async () => {
		// By default wholeReady is false, and therefore no data is rendered onto the page.
		wholeReady.set(false);
		// Whole thing in try-catch block:
		try {
			let loggedInUser;

			let targetId = wholeWebsiteData.findIndex((item) => item.id === 'mentors');
			if (targetId > -1) {
				mentors = wholeWebsiteData[targetId].info;
				list_mentees = await setListMentees();
			} else {
				mentors = await getCollection('Mentors');
				updateWholeWebsiteData('mentors', mentors);
				list_mentees = await setListMentees();
			}

			targetId = wholeWebsiteData.findIndex((item) => item.id === 'loggedInUser');
			if (targetId > -1) {
				loggedInUser = wholeWebsiteData[targetId].info;
				email = loggedInUser.email;
			} else {
				user.subscribe(async (value) => {
					if (value) {
						email = value.email;
						loggedInUser = await getUserDocData(email);
						updateWholeWebsiteData('loggedInUser', loggedInUser);
					} else {
						email = '';
					}
				});
			}

			let demographics;
			targetId = wholeWebsiteData.findIndex((item) => item.id === 'demographics');
			if (targetId > -1) {
				demographics = wholeWebsiteData[targetId].info;
			} else {
				demographics = await retrieveDemographics();
				updateWholeWebsiteData('demographics', demographics);
			}

			targetId = wholeWebsiteData.findIndex((item) => item.id === 'allinfo');
			if (targetId > -1) {
				const allInfo = wholeWebsiteData[targetId].info;
				for (let i = 0; i < allInfo.length; i++) {
					if (allInfo[i].id == 'findamentor') {
						info = allInfo[i].info;
					}
				}
			} else {
				const allInfo = await getCollection('AllInfo');
				for (let i = 0; i < allInfo.length; i++) {
					if (allInfo[i].id == 'findamentor') {
						info = allInfo[i].info;
					}
				}
				updateWholeWebsiteData('allinfo', allInfo);
			}

			// console.log(demographics);

			listReligions = demographics.religions;
			listAcademics = demographics.academics;
			listRaces = demographics.races;
			listLanguages = demographics.languages;
			listGenders = demographics.genders;

			// console.log(listReligions, listAcademics, listRaces, listLanguages, listGenders);
		} catch (error) {
			const sendMail = await sendOneEmail(
				'mentor card on mount error',
				error,
				'crlspathfinders25@gmail.com'
			);
			console.log(sendMail);
			console.log('Onmount failed: ' + error);
		} finally {
			// At the end, we will set wholeReady to true, indicating that the data can be rendered to the screen. We don't want to render data that hasn't been requested yet, because that will result in an error. This is also the loading screen that you see while we impatiently wait for the data to come in.
			wholeReady.set(true);
			localStorage.clear();
		}
	});

	// These functions (yes, functions, not variables, even though intializing with const!) determine if we can see or not see each modal. A modal is the popup. For example, when you become a mentor you can edit your profile, and a modal will show. These functions control that, but you don't have to worry about that now.
	const openshowEditModal = () => showEditModal.set(true);
	const closeshowEditModal = () => showEditModal.set(false);

	const openshowLogsModal = () => showLogsModal.set(true);
	const closeshowLogsModal = () => {
		showLogsModal.set(false);
		logSuccessMessage.set('');
		logFailMessage.set('');
	};

	const openShowCatalogModal = () => showCatalogModal.set(true);
	const closeShowCatalogModal = () => showCatalogModal.set(false);

	const openShowMenteeLogs = () => showMenteeLogs.set(true);
	const closeShowMenteeLogs = () => showMenteeLogs.set(false);
</script>

<!-- This is the modal that edits each mentor's profile. -->
<Modal class="min-w-full" open={$showEditModal} on:close={closeshowEditModal}>
	<!-- The <RegisterForm> is a component (components in Svelte are files, so you can see the code for this components in the becomeamentor folder!) that controls the editing view. The {data} in brackets are parameters that I pass to indicate *editing*, and not *creating* a mentor. -->
	<RegisterForm {view} {currMentor} {showVals}></RegisterForm>
	<br /><br /><br />
</Modal>

<!-- Mentor Logging Modal: -->
<Modal open={$showLogsModal} on:close={closeshowLogsModal} size="lg">
	<P size="xl">Log Hours</P>
	<form on:submit={handleLogMentors}>
		<Label>
			Select mentee
			<MultiSelect
				id="logmentee"
				options={list_mentees}
				bind:value={log_mentee}
				placeholder="Select mentee"
			></MultiSelect>
		</Label>
		<br />
		<Label>Brief description of what went on</Label>
		<Textarea
			id="logdescription"
			rows="10"
			placeholder="We talked about ...
They asked me for help in ...
We met at the library and worked on ..."
			bind:value={log_description}
		></Textarea>
		<br />
		<Label>How many hours did you work?</Label>
		<Input type="number" id="loghours" placeholder="10" bind:value={log_hours} />
		<br />
		{#if $logLoading}
			<Button disabled type="submit" color="green" outline class="w-full">
				Loading <Spinner color="green" size="6" />
			</Button>
		{:else}
			<Button type="submit" color="green" class="w-full">Submit</Button>
		{/if}
		<br /><br />
		{#if $logFailMessage.length > 1}
			<Alert color="red">
				<span class="font-medium">Failed:</span>
				{$logFailMessage}
			</Alert>
		{:else if $logSuccessMessage.length > 1}
			<Alert color="green">
				<span class="font-medium">Success:</span>
				{$logSuccessMessage}
			</Alert>
		{/if}
	</form>
	<hr />
	<P size="xl">Completed Hours</P>
	<P size="md">
		In order for your hours to count towards your total, your mentee needs to confirm their hours.
		Please remind them to check their email or send us an <u
			><a
				target="_blank"
				href="https://mail.google.com/mail/?view=cm&fs=1&to=crlspathfinders25@gmail.com&su=CRLS%20PathFinders%20Support"
				>email</a
			></u
		>
		if they have any problems.
		<br />
		Something doesn't look right? Let us know at
		<u
			><a
				target="_blank"
				href="https://mail.google.com/mail/?view=cm&fs=1&to=crlspathfinders25@gmail.com&su=CRLS%20PathFinders%20Support"
				>crlspathfinders25@gmail.com</a
			></u
		>
	</P>
	<div>
		<div class="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-left text-gray-500">
					<thead class="text-xs text-gray-700 uppercase bg-gray-50">
						<tr>
							<th scope="col" class="px-4 py-3">Mentee</th>
							<th scope="col" class="px-4 py-3">Description</th>
							<th scope="col" class="px-4 py-3">Hours</th>
							<th scope="col" class="px-4 py-3">Date</th>
							<th scope="col" class="px-4 py-3">Status</th>
						</tr>
					</thead>
					<tbody>
						{#each currMentor.hours_worked_catalog as c, i}
							<tr class="border-b">
								<td class="px-4 py-3 text-gray-800">{i + 1} | {c.mentee}</td>
								{#if openRow === i}
									<td
										class="px-4 py-3 text-gray-700"
										style="cursor:pointer; height:10rem;max-width:20rem; word-wrap:break-word"
										on:click={() => toggleRow(i, c)}
									>
										<div class="mentordescription">
											{c.description}
										</div>
									</td>
								{:else if c.description.length > 50}
									<td
										class="px-4 py-3 text-gray-700"
										style="cursor:pointer;"
										on:click={() => toggleRow(i, c)}
									>
										<div class="mentordescription">
											{handleDesc(c.description)}
										</div>
									</td>
								{:else}
									<td class="px-4 py-3 text-gray-700">
										<div class="mentordescription">
											{handleDesc(c.description)}
										</div>
									</td>
								{/if}

								<td class="px-4 py-3 text-gray-700">{c.hours}</td>
								<td class="px-4 py-3 text-gray-700">{c.date}</td>
								{#if c.status == -1}
									<td class="px-4 py-3">
										<Badge color="yellow">Waiting for mentee confirmation</Badge>
									</td>
								{:else if c.status == 0}
									<td class="px-4 py-3">
										<Badge color="green">Confirmed</Badge>
									</td>
								{/if}
							</tr>
						{/each}
						<tr class="border-b">
							<td class="px-4 py-3 text-gray-800">
								<Badge color="green"
									>Total hours worked: <b> {currMentor.total_hours_worked}</b></Badge
								>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
	<Button color="dark" outline>
		<a target="_blank" href="https://secure1.cpsd.us/forms/Community_Service_Form.pdf"
			>Get your community service hours here</a
		>
	</Button>
</Modal>

<!-- Mentee Logs Modal: -->
<Modal title="Mentee Logs" open={$showMenteeLogs} on:close={closeShowMenteeLogs} size="lg">
	<div>
		<div class="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-left text-gray-500">
					<thead class="text-xs text-gray-700 uppercase bg-gray-50">
						<tr>
							<th scope="col" class="px-4 py-3">Mentor</th>
							<th scope="col" class="px-4 py-3">Hours</th>
							<th scope="col" class="px-4 py-3">Description</th>
							<th scope="col" class="px-4 py-3">Date Confirmed</th>
							<th scope="col" class="px-4 py-3">Date Met</th>
						</tr>
					</thead>
					<tbody>
						{#each currUser.mentee_logs as c, i}
							<tr class="border-b">
								<td class="px-4 py-3 text-gray-800">{i + 1} | {c.mentor}</td>
								<td class="px-4 py-3 text-gray-700">{c.hours}</td>
								<!-- <td class="px-4 py-3 text-gray-700">{c.description}</td> -->
								{#if openRow === i}
									<td
										class="px-4 py-3 text-gray-700"
										style="cursor:pointer; height:10rem;max-width:20rem; word-wrap:break-word"
										on:click={() => toggleRow(i, c)}
									>
										<div class="mentordescription">
											{c.description}
										</div>
									</td>
								{:else if c.description.length > 50}
									<td
										class="px-4 py-3 text-gray-700"
										style="cursor:pointer;"
										on:click={() => toggleRow(i, c)}
									>
										<div class="mentordescription">
											{handleDesc(c.description)}
										</div>
									</td>
								{:else}
									<td class="px-4 py-3 text-gray-700">
										<div class="mentordescription">
											{handleDesc(c.description)}
										</div>
									</td>
								{/if}
								<td class="px-4 py-3 text-gray-700">{c.date_confirmed}</td>
								<td class="px-4 py-3 text-gray-700">{c.date_met}</td>
								<!-- {#if c.status == -1}
									<td class="px-4 py-3">
										<Badge color="yellow">Waiting for mentee confirmation</Badge>
									</td>
								{:else if c.status == 0}
									<td class="px-4 py-3">
										<Badge color="green">Confirmed</Badge>
									</td>
								{/if} -->
							</tr>
						{/each}
						<!-- <tr class="border-b">
							<td class="px-4 py-3 text-gray-800">Total hours worked: <b>{currMentor.total_hours_worked}</b></td>
						</tr> -->
					</tbody>
				</table>
			</div>
		</div>
	</div>
</Modal>

<!-- Mentor Catalog Modal: (not being used ATM) -->
<Modal class="min-w-full" open={$showCatalogModal} on:close={closeShowCatalogModal}>
	<P size="xl">Mentor Hours</P>
	<P size="md"
		>Something doesn't look right? Let us know at <u
			><a
				target="_blank"
				href="https://mail.google.com/mail/?view=cm&fs=1&to=crlspathfinders25@gmail.com&su=CRLS%20PathFinders%20Support"
				>crlspathfinders25@gmail.com</a
			></u
		></P
	>
	<div>
		<div class="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full text-sm text-left text-gray-500">
					<thead class="text-xs text-gray-700 uppercase bg-gray-50">
						<tr>
							<th scope="col" class="px-4 py-3">Mentee</th>
							<th scope="col" class="px-4 py-3">Description</th>
							<th scope="col" class="px-4 py-3">Hours</th>
							<th scope="col" class="px-4 py-3">Status</th>
						</tr>
					</thead>
					<tbody>
						{#each $hoursWorkedCatalog as c, i}
							<tr class="border-b">
								<td class="px-4 py-3">{i + 1} | {c.mentee}</td>
								<td class="px-4 py-3">{c.description}</td>
								{#if c.status == -1}
									<td class="px-4 py-3 text-gray-500">{c.hours}</td>
									<td class="px-4 py-3">
										<div class="badge" style="margin-right:.2rem;">
											<Badge color="yellow">Waiting for mentee confirmation</Badge>
										</div>
									</td>
								{:else}
									<td class="px-4 py-3"><b>{c.hours}</b></td>
									<td class="px-4 py-3">
										<div class="badge" style="margin-right:.2rem;">
											<Badge color="green">Confirmed</Badge>
										</div>
									</td>
								{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</Modal>

{#if $wholeReady}
	<!-- This div holds all of the information. -->
	<div class="wholementorwrapper bg-gray-100" style="height:100%;">
		<!-- The data is only shown when wholeReady is true (which means all of the data has been successfully requested). Remember that the wholeReady is a boolean store variable. To access the value of a store variable, we put the dollar sign $ before the name of the variable, indicating reactivity. -->
		<div class="infowrapper" style="margin-left:3rem;margin-right:3rem;margin-top:1rem;">
			<!-- This is all data that should NOT be hard-coded, but we will fix this later once the more pressing issues are solved. -->
			<Heading tag="h4" customSize="text-4xl font-extrabold" class="dark:text-red-900">
				<Span underline decorationClass="decoration-8 decoration-red-800 dark:decoration-red-600"
					>Find</Span
				> a Mentor
			</Heading>
			<br />
			{#each info as inf, i}
				{#if i == 0}
					<P size="xl">{inf}</P>
				{:else if i == 1}
					<P size="lg">{inf}</P>
				{:else}
					<P size="sm">{inf}</P>
				{/if}
			{/each}
			<!-- <P class="mb-2" weight="light" color="text-gray-600 dark:text-gray-200">
				Below you can search for and filter juniors and seniors who you believe can best support your academic interests.
			</P>
			<P class="mb-2" weight="light" color="text-gray-600 dark:text-gray-200">
				Through one-on-one support, you can learn about opportunities in Cambridge and CRLS, which classes to take, and how to best find success in highschool.
			</P>
			<P class="mb-2" weight="light" color="text-gray-600 dark:text-gray-200">
				Simply click "message" for whichever mentor you believe can best help you achieve your goals. Then, send them an email and find your path today!
			</P> -->
			<P class="mb-2" weight="light" color="text-gray-600 dark:text-gray-200">
				Interested in becoming a mentor?
				{#if $user}
					<u><a href="/becomeamentor">Register here</a></u>
				{:else}
					<u><a href="/auth/login">Login first</a></u>
				{/if}
			</P>
			{#each mentors as m}
				{#if m.email == email}
					<ButtonGroup>
						<Button
							outline
							size="md"
							color="green"
							on:click={() => {
								console.log('clicked');
								currMentor = m;
								console.log(currMentor);
								openshowEditModal();
							}}>Edit Mentor Profile<PenOutline size="md"></PenOutline></Button
						>
						<Button
							outline
							size="md"
							color="blue"
							on:click={() => {
								openshowLogsModal();
								currMentor = m;
								hoursWorkedCatalog.set(m.hours_worked_catalog);
							}}
						>
							Log Mentor Hours <BookOpenOutline size="md"></BookOpenOutline>
						</Button>
						<!-- <Button size="md" pill color="green" on:click={() => {openShowCatalogModal(); currMentor = m;}}>
							Mentor Catalog <BookOpenOutline size="md"></BookOpenOutline>
						</Button> -->
					</ButtonGroup>
				{/if}
			{/each}
			{#if userInfo && userInfo.is_mentee}
				<Button
					color="purple"
					outline
					size="md"
					on:click={() => {
						currUser = userInfo;
						openShowMenteeLogs();
					}}
				>
					View Mentee Logs
				</Button>
			{/if}
		</div>

		<!-- This is the search box - All of the components here are imported from the Flowbite Svelte UI Library, which you can find links to in the doc I emailed you. -->
		<div class="searchwrapper" style="margin-right:3rem;margin-left:3rem;margin-top:1rem;">
			<TableHeader headerType="search">
				<!-- The syntax bin:value={searching} is unique to svelte. It tells svelte to update the variable searching (that we declared above) everything the <Search> input component changes. -->
				<Search bind:value={searching} slot="search" placeholder="Search mentors" size="md" />
				<div class=""></div>
				<Button outline color="blue">Filters</Button>
				<Dropdown class="w-48 p-3 space-y-2 text-sm">
					<DropdownItem class="flex items-center justify-between">
						<!-- This shouldn't be hard-coded -->
						Academics<ChevronRightOutline class="w-6 h-6 ms-2 text-primary-700 dark:text-white" />
					</DropdownItem>
					<Dropdown placement="right-start">
						<!-- Loops through the list of available academics. The {#each} syntax in Svelte is the same as < for (int i, i < listAcademics.length; i++) {} >, etc. This list of academics is also hard coded in the api/mentor.js file, but again we will fix this later on. -->
						{#each listAcademics as r}
							<DropdownItem>
								<!-- Notice the user of $ before filters, because filters is a store variable. -->
								<!-- $fiters.includes(r) checks if the current academic is in the filters array. -->
								{#if $filters.includes(r)}
									<!-- on:change={()} means everytime you select or deselect this checkbox input, it calls the toggleFilters function that we defined above, which just updates the contents of the filters array. -->
									<Checkbox
										checked
										on:change={() => {
											toggleFilters(r);
											console.log($filters);
										}}><li>{r}</li></Checkbox
									>
								{:else}
									<Checkbox
										on:change={() => {
											toggleFilters(r);
											console.log($filters);
										}}><li>{r}</li></Checkbox
									>
								{/if}
								<!-- The only different between the two check boxes is that it is "checked," meaning the checkbox input is selected if the item is in the filters array, and not checked if it is not. -->
							</DropdownItem>
						{/each}
					</Dropdown>
					<!-- We repeat the same for all the rest of the demographic info: -->
					<DropdownItem class="flex items-center justify-between">
						Races<ChevronRightOutline class="w-6 h-6 ms-2 text-primary-700 dark:text-white" />
					</DropdownItem>
					<Dropdown placement="right-start">
						{#each listRaces as r}
							<DropdownItem>
								{#if $filters.includes(r)}
									<Checkbox
										checked
										on:change={() => {
											toggleFilters(r);
											console.log($filters);
										}}><li>{r}</li></Checkbox
									>
								{:else}
									<Checkbox
										on:change={() => {
											toggleFilters(r);
											console.log($filters);
										}}><li>{r}</li></Checkbox
									>
								{/if}
							</DropdownItem>
						{/each}
					</Dropdown>
					<DropdownItem class="flex items-center justify-between">
						Religion<ChevronRightOutline class="w-6 h-6 ms-2 text-primary-700 dark:text-white" />
					</DropdownItem>
					<Dropdown placement="right-start">
						{#each listReligions as r}
							<DropdownItem>
								{#if $filters.includes(r)}
									<Checkbox
										checked
										on:change={() => {
											toggleFilters(r);
											console.log($filters);
										}}><li>{r}</li></Checkbox
									>
								{:else}
									<Checkbox
										on:change={() => {
											toggleFilters(r);
											console.log($filters);
										}}><li>{r}</li></Checkbox
									>
								{/if}
							</DropdownItem>
						{/each}
					</Dropdown>
					<DropdownItem class="flex items-center justify-between">
						Language<ChevronRightOutline class="w-6 h-6 ms-2 text-primary-700 dark:text-white" />
					</DropdownItem>
					<Dropdown placement="right-start">
						{#each listLanguages as r}
							<DropdownItem>
								{#if $filters.includes(r)}
									<Checkbox
										checked
										on:change={() => {
											toggleFilters(r);
											console.log($filters);
										}}><li>{r}</li></Checkbox
									>
								{:else}
									<Checkbox
										on:change={() => {
											toggleFilters(r);
											console.log($filters);
										}}><li>{r}</li></Checkbox
									>
								{/if}
							</DropdownItem>
						{/each}
					</Dropdown>
					<DropdownItem class="flex items-center justify-between">
						Genders<ChevronRightOutline class="w-6 h-6 ms-2 text-primary-700 dark:text-white" />
					</DropdownItem>
					<Dropdown placement="right-start">
						{#each listGenders as r}
							<DropdownItem>
								{#if $filters.includes(r)}
									<Checkbox
										checked
										on:change={() => {
											toggleFilters(r);
											console.log($filters);
										}}><li>{r}</li></Checkbox
									>
								{:else}
									<Checkbox
										on:change={() => {
											toggleFilters(r);
											console.log($filters);
										}}><li>{r}</li></Checkbox
									>
								{/if}
							</DropdownItem>
						{/each}
					</Dropdown>
				</Dropdown>
				<Button
					outline
					color="dark"
					on:click={() => {
						filters.set([]);
					}}>Reset filters</Button
				>
			</TableHeader>
			<!-- This just lists out the different filters that are currently selected: -->
			{#if $filters.length > 0}
				<br />
				{#if $filters.length > 0}
					{#each $filters as f}
						<Badge color="blue" style="margin-right:.2rem;">{f}</Badge>
					{/each}
				{/if}
			{/if}
		</div>

		<!-- This div holds all of the mentor cards. Each mentor is its own card, with their own informatino, etc. -->
		<div class="card-container">
			<!-- Iterates over the filteredMentors array, which we had defined up above with the $: syntax. -->
			{#each filteredMentors as m}
				{#if m.show}
					<!-- Checks first if either the mentor's first name, last name, anything in bio, is what is in the search box. The search box is "" by default, and every mentor has that string, so every mentor is listed out first. -->
					{#if labelIncludesSearchTerm(m.firstname, searching) || labelIncludesSearchTerm(m.lastname, searching) || labelIncludesSearchTerm(m.bio, searching) || labelIncludesSearchTerm(m.firstname + ' ' + m.lastname, searching)}
						<!-- The <Card> component is another component defined by the Flowbite Svelte UI Library that we use for convenience. -->
						<Card padding="md">
							<div class="flex flex-col items-center pb-4">
								<!-- The profile pic of each mentor shown first. -->
								{#if m.email == email}
									<Avatar size="xl" src={m.profile_pic} border class="ring-yellow-400" />
								{:else}
									<Avatar size="xl" src={m.profile_pic} border class="ring-blue-400" />
								{/if}
								<h5 class="mb-1 text-xl font-medium text-gray-900">
									<!-- The information of each mentor listed out. -->
									<!-- To show the value of a mentor in svelte, you enclose the variable in {brackets}. -->
									{#if m.email == email}
										<Button
											size="xs"
											pill
											outline
											color="blue"
											on:click={() => {
												openshowLogsModal();
												currMentor = m;
											}}
										>
											<BookOpenOutline size="md"></BookOpenOutline>
										</Button>
									{/if}
									{m.firstname}
									{m.lastname}
									<!-- <br> -->
									<!-- This checks if this mentor is the current logged in user. If it is, it adds the pencil icon, which when clicked allows the user to edit or change their information. -->
									{#if m.email == email}
										<Button
											size="md"
											pill
											outline
											color="dark"
											on:click={() => {
												console.log('clicked');
												currMentor = m;
												console.log(currMentor);
												openshowEditModal();
											}}><PenOutline size="xs"></PenOutline></Button
										>
									{/if}
									<br />
									{#if m.email == email}
										<center
											><Badge color="yellow">{m.total_hours_worked} hours worked</Badge></center
										>
									{:else}
										<center><Badge color="blue">{m.total_hours_worked} hours worked</Badge></center>
									{/if}
								</h5>
								<span class="text-sm text-gray-700">
									<!-- the .join(", ") function takes the list and turns it into a string separated by ", ". -->
									<center>Academic Interests: <b>{m.academics.join(', ')}</b></center>
								</span>
								<span class="text-sm text-gray-500">
									{#if m.languages.length > 0}
										<center><i>Language I Speak:</i> {m.languages.join(', ')}</center>
									{/if}
								</span>
								<!-- Displays the rest of the information: -->
								<span class="text-sm text-gray-500">
									<center>{m.races}</center>
								</span>
								<span class="text-sm text-gray-500">
									<center>{m.religions}</center>
								</span>
								<span class="text-sm text-gray-500">
									<center>{m.gender}</center>
								</span>
								<span style="border-top: 1px solid black;" class="text-sm text-gray-800">
									<center>{m.bio}</center>
								</span>
								<div class="flex mt-4 space-x-3 rtl:space-x-reverse lg:mt-6">
									<!-- < if $user > checks if the current user is logged in. If they are, then they can message any mentor.-->
									{#if $user}
										<Button outline color="blue" class="">
											<A
												target="_blank"
												href="https://mail.google.com/mail/?view=cm&fs=1&to={m.email}&su=CRLS%20PathFinders%20Mentee"
												class="font-medium hover:underline">Message</A
											>
										</Button>
										<!-- If the current user is not logged in, they will not be able to message anyone, and instead will be prompted to make an account or sign in when they try to click on "Message." -->
									{:else}
										<Button disabled outline color="blue" id="disabledmessagebutton" class="">
											Message
										</Button>
										<Popover
											class="w-64 text-sm font-light "
											title="Make an account first!"
											triggeredBy="#disabledmessagebutton"
										>
											<p class="text-gray-800">
												You can only message mentors when you have an account!
												<br /><br />
												<u><a href="/auth/login">Log in</a></u> or
												<u><a href="/auth/signup">Sign up</a></u>
											</p>
										</Popover>
									{/if}
								</div>
							</div>
						</Card>
					{/if}
				{/if}
			{/each}
		</div>
	</div>
{:else}
	<!-- This else refers to if $wholeReady is false, in which case a loading message will show. -->
	<center>
		<div class="loadingwrapper" style="font-size:large; margin-top:1rem;">
			Loading Mentors ... <Spinner color="blue" />
		</div>
	</center>

	<div class="card-container">
		<CardPlaceholder />
		<CardPlaceholder />
		<CardPlaceholder />
		<CardPlaceholder />
		<CardPlaceholder />
	</div>
{/if}

<style>
	/* Here are some styling. */
	.card-container {
		padding: 3rem;
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(3, minmax(100px, 1fr));
	}

	/* .mentorcard:hover {
    transform: scale(1.02);
    transition: all ease-in-out .08s;
    box-shadow: inset;
   } */

	/* Making each mentor card dynamic to the width of the screen or page. */

	@media (max-width: 1200px) {
		.card-container {
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		}
	}

	@media (max-width: 800px) {
		.card-container {
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		}
	}

	@media (max-width: 500px) {
		.card-container {
			grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		}
	}
</style>
