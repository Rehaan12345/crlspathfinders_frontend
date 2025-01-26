<script>
	import { page } from '$app/stores';
	import { confirmMentorMenteeHours } from '$lib/user';
	import { Alert, Button, Input, Label, Spinner } from 'flowbite-svelte';
	import { writable } from 'svelte/store';

	let loading = writable(false);
	let confirmed = writable(false);
	let errorMessage = writable('');
	let successMessage = writable('');

	// Extract route parameters from the `page` store
	let { confirm, category_id, mentee_email, mentor_email, mentee_hours, mentee_description } =
		$page.params;
	mentee_description = '';

	const handleConfirm = async () => {
		loading.set(true);
		confirm = 0;
		try {
			let status = await confirmMentorMenteeHours(
				confirm,
				category_id,
				mentee_email,
				mentor_email,
				mentee_hours,
				mentee_description
			);
			console.log(status);
			if (status['status'] == 0) {
				// All set
				confirmed.set(true);
				mentor_email = '';
				mentee_hours = '';
				mentee_description = '';
				successMessage.set('Confirmed hours. You can now close this page.');
				loading.set(false);
				return 0;
			}
			if (status['status'] == -1) {
				// Some random error
				errorMessage.set(
					'Error confirming hours. Please reload the page or contact support (crlspathfinders25@gmail.com): ' +
						status['error_message']
				);
				confirmed.set(false);
				loading.set(false);
				return -1;
			}
			if (status['status'] == -2) {
				// Hours mismatched
				errorMessage.set(
					'You have reported different hours than your mentor reported. If you think your mentee made a mistake please email us ASAP at crlspathfinders25@gmail.com. Otherwise, reload the page and resubmit.'
				);
				confirmed.set(false);
				loading.set(false);
				return -2;
			}
		} catch (error) {
			errorMessage.set(
				'Error confirming hours. Please reload the page or contact support: ' + error
			);
			confirmed.set(false);
			loading.set(false);
			return -1;
		}
	};

	// onMount(async () => {
	//     await confirmMentorMenteeHours( confirm, category_id, mentee_email, mentor_email, mentee_hours, mentee_description )
	// })
</script>

<!-- {confirm}
{category_id}
{mentee_email}
{mentor_email}
{mentee_hours}
{mentee_description} -->

<!-- {#if !$confirmed} -->

<div class="p-6 space-y-4 md:space-y-6 sm:p-8" style="height: 100vh;">
	<form on:submit={handleConfirm} class="flex flex-col space-y-6">
		<h4 class="text-xl font-medium text-gray-900 p-0">Confirm Mentoring Hours</h4>
		<p class="text-gray-600">
			Confirm that your mentor's email and hours worked are accurate. If they are not, simply change
			the values and submit the form.
			<br />
			At the bottom of the form, tell us what went on. How did it go, how could the program be improved,
			etc. PathFinders is a new program at CRLS, so we would love to hear your feedback on ways to improve!
			<br />
			Email us at
			<u
				><a
					target="_blank"
					href="https://mail.google.com/mail/?view=cm&fs=1&to=crlspathfinders25@gmail.com&su=CRLS%20PathFinders%20Support"
					>crlspathfinders25@gmail.com</a
				></u
			> if you have any specific questions.
		</p>
		<Label class="space-y-2">
			<span>Mentor</span>
			<Input
				type="mentoremail"
				name="mentoremail"
				id="mentoremail"
				placeholder="Mentor Email"
				required
				bind:value={mentor_email}
			/>
		</Label>
		<Label class="space-y-2">
			<span>Hours Worked</span>
			<Input
				type="number"
				name="hours"
				id="hours"
				placeholder="Hours worked"
				required
				bind:value={mentee_hours}
			/>
		</Label>
		<Label class="space-y-2">
			<span>How did it go?</span>
			<Input
				type="menteedescription"
				name="menteedescription"
				placeholder="We worked on ... It could have been better if ..."
				required
				bind:value={mentee_description}
			/>
		</Label>
		<Button color="green" type="submit" class="w-full1">
			Confirm Hours
			{#if $loading}
				<Spinner color="green" />
			{/if}
		</Button>
		{#if $errorMessage.length > 1}
			<Alert color="red">
				<span class="font-medium">Failed:</span>
				{$errorMessage}
			</Alert>
		{:else if $successMessage.length > 1}
			<Alert color="green">
				<span class="font-medium">Success:</span>
				{$successMessage}
			</Alert>
		{/if}
	</form>
</div>
<!-- 
{:else}

    <h1 class="text-gray-900">Done!</h1>

{/if} -->
