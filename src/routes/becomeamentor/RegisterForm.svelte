<script>
	import { onMount } from 'svelte';
	import { updateCache } from '$lib/cache';
	import {
		Accordion,
		AccordionItem,
		Alert,
		Avatar,
		Button,
		Heading,
		Input,
		Label,
		Li,
		List,
		P,
		Popover,
		Skeleton,
		Span,
		Spinner,
		Textarea
	} from 'flowbite-svelte';
	import { getCollection, getCollectionDoc } from '$lib/api';
	import {
		createMentor,
		editMentor,
		listAcademics,
		listGenders,
		listLanguages,
		listRaces,
		listReligions,
		retrieveDemographics,
		sendMentorPitch,
		SetMentorImage,
		UploadMentorImage
	} from '../../lib/mentor';
	import { user } from '../../stores/auth';
	import { writable } from 'svelte/store';
	import { getUserDocData } from '../../lib/user';
	import MultiSelect from 'svelte-multiselect';

	let wholeReady = writable(false);
	let isLoading = writable(false);
	let imgLoading = writable(false);
	let showSubmitImage = writable(false);
	let errorMessage = writable('');
	let successMessage = writable('');
	let restReady = writable(false);

	let email = '';
	let loggedInUser;

	let firstname;
	let lastname;
	let bi_o;
	let racesSelected = [];
	let religionsSelected = [];
	let genderSelected = [];
	let languagesSelected = [];
	let academicsSelected = [];

	let newRaces = [];
	let newReligions = [];
	let newGender = [];
	let newLanguages = [];
	let newAcademics = [];

	let bio;

	let importRaces = [];

	let pitch = '';

	let applicationTypeCount = 0;

	const handleMentorPitch = async () => {
		if (pitch.length < 2) {
			successMessage.set('');
			errorMessage.set('Application is too short');
			return -1;
		}
		try {
			isLoading.set(true);
			email = loggedInUser.email;
			await sendMentorPitch(email, pitch);
			errorMessage.set('');
			successMessage.set('Your application has been sent. Expect a response in 1-2 days.');
			pitch = '';
		} catch (error) {
			console.log('Failed to handlementorpitch: ' + error);
			successMessage.set('');
			errorMessage.set('' + error);
		} finally {
			isLoading.set(false);
		}
	};

	// Add function that takes input of a string of the old filename and deletes that file (copy the format for handleSubmitImage)

	const handleSubmitImage = async (file) => {
		// First make sure it is the correct dimensions, type, etc.
		if (file.length < 1) {
			errorMessage.set('Please select a file.');
			return -1;
		}
		console.log(file);
		imgLoading.set(true);
		errorMessage.set('');
		successMessage.set('');
		try {
			const res = await UploadMentorImage(file, currMentor.profile_pic);
			console.log(res, currEmail);
			if (showVals) {
				const res2 = await SetMentorImage(res, currMentor.email);
				console.log(res2);
				successMessage.set('Successfully uploaded profile picture.');
			} else {
				const res2 = await SetMentorImage(res, currEmail);
				console.log(res2);
				successMessage.set('Successfully uploaded profile picture.');
			}
		} catch (error) {
			console.log('failure in handling submit img: ' + error);
			errorMessage.set('Image upload failure: ' + error);
		} finally {
			imgLoading.set(false);
		}
	};

	const handleSubmit = async () => {
		try {
			showSubmitImage.set(false);
			isLoading.set(true);
			const firstName = document.querySelector('#firstname').value;
			const lastName = document.querySelector('#lastname').value;
			const bio = document.querySelector('#bio').value;

			if (view.localeCompare('Register') === 0) {
				if (academicsSelected.length < 1) {
					errorMessage.set(
						'Please select at least one academic skill you are willing to teach others.'
					);
					showSubmitImage.set(false);
					isLoading.set(false);
					return -1;
				}
				const mes = await createMentor(
					firstName,
					lastName,
					bio,
					currEmail,
					racesSelected,
					religionsSelected,
					genderSelected,
					languagesSelected,
					academicsSelected
				);
				console.log(mes);
				errorMessage.set('');
				successMessage.set(
					'You are successfully registered as a mentor! Add a profile picture below:'
				);
				// Reset the inputs:
				firstname = '';
				lastname = '';
				bi_o = '';
				// racesSelected = [];
				// religionsSelected = [];
				// genderSelected = [];
				// languagesSelected = [];
				// academicsSelected = [];
				showSubmitImage.set(true);
			} else if (view.localeCompare('Edit') === 0) {
				await editMentor(
					firstName,
					lastName,
					bio,
					currMentor.email,
					newRaces,
					newReligions,
					newGender,
					newLanguages,
					newAcademics
				);
				errorMessage.set('');
				successMessage.set('Successfully edited. Reload the page to see the changes.');
			}
		} catch (error) {
			console.log('Failed to register / edit mentor: ' + error);
			errorMessage.set('' + error);
		} finally {
			const new_mentors = await getCollection('Mentors');
			updateCache('mentorsInfo', new_mentors);
			if (academicsSelected.length < 1) {
				showSubmitImage.set(false);
				isLoading.set(false);
			} else {
				isLoading.set(false);
				showSubmitImage.set(true);
			}
		}
	};

	let newImportRaces = [];

	function basicSetUp() {
		user.subscribe(async (value) => {
			if (value) {
				email = value.email;
				console.log(email);
				loggedInUser = await getUserDocData(email);
				console.log(loggedInUser);
			} else {
				email = '';
			}
		});
	}

	onMount(async () => {
		try {
			wholeReady.set(false);
			restReady.set(false);
			importRaces = await getCollectionDoc('Demographics', '9qHHDN65kY2yIfV4BnnK');
			importRaces = importRaces.races;
			console.log(importRaces);
			basicSetUp();
			await retrieveDemographics();

			for (let i = 0; i < importRaces.length; i++) {
				const temp = { value: importRaces[i], name: importRaces[i] };
				newImportRaces.push(temp);
			}

			console.log(newImportRaces);

			if (showVals) {
				console.log(currMentor);
				racesSelected = currMentor.races;
				religionsSelected = currMentor.religions;
				genderSelected = currMentor.gender;
				languagesSelected = currMentor.languages;
				academicsSelected = currMentor.academics;
				newRaces = currMentor.races;
				console.log(academicsSelected);
				newReligions = currMentor.religions;
				newGender = currMentor.gender;
				newLanguages = currMentor.languages;
				newAcademics = currMentor.academics;
				restReady.set(true);
			} else {
				restReady.set(true);
			}
			wholeReady.set(true);
		} catch (error) {
			console.log('Error loading: ' + error);
		}
	});

	export let view = '';
	export let showVals = false;
	export let currMentor = {};
	export let currEmail = '';

	let file = '';
</script>

<br />

<div class="wholebecomeamentorwrapper bg-gray-100" style="height:100%;">
	{#if $wholeReady}
		{#if loggedInUser}
			{#if !showVals && !loggedInUser.mentor_eligible}
				<Heading tag="h2" customSize="text-4xl font-extrabold "
					><Span underline decorationClass="decoration-8 decoration-red-800 dark:decoration-red-600"
						>Become</Span
					> a mentor</Heading
				>

				<div class="mentoreligibilewrapper" style="border-radius:10px;margin-top:1rem;">
					<P class="mb-3" weight="light" color="text-gray-600">
						By becoming a mentor, you agree to work one-on-one with freshmen or sophomores in one or
						more specialized areas of study. It is up to you and your mentee to decide what to
						study, where, and for how long.
					</P>
					<Accordion flush>
						<AccordionItem>
							<span slot="header" class="text-gray-600">Why should I become a mentor?</span>
							<p class="mb-2 text-gray-500">
								<List tag="ul" class="space-y-1 text-gray-500">
									<Li>Earn community service hours for your work.</Li>
									<Li>Strengthen your skills in a subject by teaching it to others.</Li>
									<Li>Get valuable experience helping others learn and grow.</Li>
									<Li>Help younger students with guidance as they enter high school.</Li>
								</List>
							</p>
						</AccordionItem>
						<AccordionItem>
							<span slot="header" class="text-gray-600">Who can become a mentor?</span>
							<p class="mb-2 text-gray-500">
								<List tag="ul" class="space-y-1 text-gray-500">
									<Li>Juniors & seniors.</Li>
									<List tag="ul" class="ps-10 mt-2 space-y-1 text-gray-500">
										<Li
											>If you are not a junior or senior but are still interested in becoming a
											mentor, you can still fill out the below application and we will get back to
											you.</Li
										>
									</List>
									<Li
										>Upperclassmen interested in tutoring / mentoring younger students, helping them
										navigate a new school.</Li
									>
								</List>
							</p>
						</AccordionItem>
						<AccordionItem>
							<span slot="header" class="text-gray-600">Become involved</span>
							<p class="mb-2 text-gray-500">
								<List tag="ul" class="space-y-1 text-gray-500">
									<Li
										>If you are interested in partnering with PathFinders through a separate or
										related program, send us an <a
											target="_blank"
											href="https://mail.google.com/mail/?view=cm&fs=1&to=crlspathfinders25@gmail.com&su=CRLS%20PathFinders%20Partnership"
											><u>email</u></a
										></Li
									>
								</List>
							</p>
						</AccordionItem>
					</Accordion>
					<br />
					<P class="mb-3" weight="light" color="text-gray-600">
						Write a response in the box below answering the following questions:
						<List tag="ul" class="space-y-1 text-gray-600">
							<Li>Why do you want to become a mentor?</Li>
							<Li>What do you bring to the table that sets you apart from other mentors?</Li>
							<Li
								>If you could go back to freshman year what would have made your transition to high
								school easier?</Li
							>
						</List>
					</P>
					<br />
					<form>
						<Textarea
							id="mentorpitch"
							rows="10"
							placeholder="I want to become a mentor because ..."
							bind:value={pitch}
							on:keypress={() => {
								applicationTypeCount++;
							}}
						></Textarea>
						<P class="mb-3" weight="light" color="text-gray-600">
							Thank you and send us an <a
								target="_blank"
								href="https://mail.google.com/mail/?view=cm&fs=1&to=crlspathfinders25@gmail.com&su=CRLS%20PathFinders%20Question"
								><u>email</u></a
							> if you have any questions!
						</P>
						{#if $errorMessage.length > 1}
							<Alert color="red">
								<span class="font-medium">Application failed:</span>
								{$errorMessage}
							</Alert>
							<br />
						{:else if $successMessage.length > 1}
							<Alert color="blue">
								<span class="font-medium">Success:</span>
								{$successMessage}
							</Alert>
							<br />
						{/if}
						<Button color="dark" class="w-full" on:click={handleMentorPitch}>
							Submit
							{#if $isLoading}
								<Spinner size={5} color="blue" />
							{/if}
						</Button>
						<br /><br />
					</form>
				</div>
			{:else if $restReady}
				<Heading tag="h2" customSize="text-4xl font-extrabold "
					><Span underline decorationClass="decoration-8 decoration-red-800 dark:decoration-red-600"
						>{view}</Span
					> Mentor</Heading
				>
				<br />
				<form on:submit={handleSubmit}>
					<div class="grid gap-4 sm:grid-cols-2 sm:gap-6 bg-gray-100" style="height: 100%;">
						<div class="w-full">
							<Label for="firstname" class="mb-2">First Name <i style="color: red;">*</i></Label>
							{#if showVals}
								<Input
									type="text"
									id="firstname"
									placeholder="First Name"
									value={currMentor.firstname}
								/>
							{:else}
								<Input
									type="text"
									id="firstname"
									placeholder="First Name"
									bind:value={firstname}
									required
								/>
							{/if}
						</div>
						<div class="w-full">
							<Label for="lastname" class="mb-2">Last Name <i style="color: red;">*</i></Label>
							{#if showVals}
								<Input
									type="text"
									id="lastname"
									placeholder="Last Name"
									value={currMentor.lastname}
								/>
							{:else}
								<Input
									type="text"
									id="lastname"
									placeholder="Last Name"
									bind:value={lastname}
									required
								/>
							{/if}
						</div>
						<div class="w-full">
							<Label>
								Races
								{#if showVals}
									<MultiSelect
										id="races"
										options={listRaces}
										placeholder="Select your race(s)"
										bind:value={newRaces}
										selected={currMentor.races}
									></MultiSelect>
								{:else}
									<MultiSelect
										id="races"
										options={listRaces}
										placeholder="Select your race(s)"
										bind:value={racesSelected}
									></MultiSelect>
								{/if}
							</Label>
						</div>
						<div class="w-full">
							<Label>
								Religions
								{#if showVals}
									<MultiSelect
										id="religions"
										options={listReligions}
										placeholder="Select your religions(s)"
										bind:value={newReligions}
										selected={currMentor.religions}
									></MultiSelect>
								{:else}
									<MultiSelect
										id="religions"
										options={listReligions}
										placeholder="Select your religions(s)"
										bind:value={religionsSelected}
									></MultiSelect>
								{/if}
							</Label>
						</div>
						<div class="w-full">
							<Label>
								Gender
								{#if showVals}
									<MultiSelect
										id="gender"
										options={listGenders}
										placeholder="Select your gender(s)"
										bind:value={newGender}
										selected={currMentor.gender}
									></MultiSelect>
								{:else}
									<MultiSelect
										id="gender"
										options={listGenders}
										placeholder="Select your gender(s)"
										bind:value={genderSelected}
									></MultiSelect>
								{/if}
							</Label>
						</div>
						<div class="w-full">
							<Label>
								Languages
								{#if showVals}
									<MultiSelect
										id="languages"
										options={listLanguages}
										placeholder="Select your languages(s)"
										bind:value={newLanguages}
										selected={currMentor.languages}
									></MultiSelect>
								{:else}
									<MultiSelect
										id="languages"
										options={listLanguages}
										placeholder="Select your languages(s)"
										bind:value={languagesSelected}
									></MultiSelect>
								{/if}
							</Label>
						</div>
						<div class="w-full">
							<Label>
								Academics <i style="color: red;">*</i>
								{#if showVals}
									<MultiSelect
										id="academics"
										options={listAcademics}
										placeholder="Select your academics(s)"
										bind:value={newAcademics}
										selected={currMentor.academics}
									></MultiSelect>
								{:else}
									<MultiSelect
										id="academics"
										options={listAcademics}
										placeholder="Select your academics(s)"
										bind:value={academicsSelected}
									></MultiSelect>
								{/if}
							</Label>
						</div>
						<div class="sm:col-span-2">
							<Label id="b1">
								Bio <i style="color: red;">*</i>
								<Popover class="w-64 text-sm font-light text-gray-700" triggeredBy="#b1"
									>If you identify with anything that is not listed above, feel free to include it
									here.</Popover
								>
								{#if showVals}
									<Textarea
										id="bio"
										placeholder="Leave a short bio so mentees can get to know you."
										rows="4"
										name="bio"
										bind:value={currMentor.bio}
									/>
								{:else}
									<Textarea
										id="bio"
										placeholder="Leave a short bio so mentees can get to know you."
										rows="4"
										name="bio"
										bind:value={bi_o}
										required
									/>
								{/if}
							</Label>
						</div>
						<Button color="green" type="submit">
							{view}
							{#if $isLoading}
								<Spinner size={5} color="green" />
							{/if}
						</Button>
					</div>
				</form>

				<br />
				{#if !showVals}
					{#if $errorMessage.length > 1}
						<Alert color="red">
							<span class="font-medium">Registration failed:</span>
							{$errorMessage}
						</Alert>
					{:else if $successMessage.length > 1}
						<Alert color="blue">
							<span class="font-medium">Success:</span>
							{$successMessage}
						</Alert>
					{/if}
				{:else if $errorMessage.length > 1}
					<Alert color="red">
						<span class="font-medium">Mentor editing failed:</span>
						{$errorMessage}
					</Alert>
				{:else if $successMessage.length > 1}
					<Alert color="blue">
						<span class="font-medium">Success:</span>
						{$successMessage}
					</Alert>
				{/if}

				{#if $showSubmitImage || showVals}
					<Avatar size="xl" src={currMentor.profile_pic} border />

					<div class="w-full" style="margin-top:2rem;margin-bottom:2rem;">
						<Label>Upload profile picture</Label>
						<input
							style="border:1px solid black;border-radius:5px;"
							type="file"
							accept="image/*"
							required
							on:change={(e) => (file = e.target.files[0])}
						/>
						<!-- <br> -->
						<Button
							size="md"
							outline
							color="blue"
							on:click={async () => {
								console.log(file);
								await handleSubmitImage(file);
								// another function that deletes the image (old img)
							}}
						>
							Upload
							{#if $imgLoading}
								<Spinner size={5} color="blue" />
							{/if}
						</Button>
					</div>
				{/if}
			{/if}
		{/if}
	{:else}
		<center>
			<div class="loadingwrapper" style="font-size:large; margin-top:1rem;">
				Loading ... <Spinner color="blue" />
			</div>
		</center>

		<Skeleton></Skeleton>
	{/if}
</div>
