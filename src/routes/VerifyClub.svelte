<script>
	import { Alert, Button, Input, Modal, Spinner } from 'flowbite-svelte';
	import { writable } from 'svelte/store';
	import { verifyClub } from '../lib/club';

	let isLoading = writable(false);
	let errorMessage = writable('');
	let successMessage = writable('');

	let secretPassword;

	function checkInput() {
		if (secretPassword < 0 || !secretPassword) {
			errorMessage.set('No matching passwords.');
			isLoading.set(false);
			return false;
		}
		return true;
	}

	const handleVerify = async () => {
		isLoading.set(true);
		if (checkInput()) {
			try {
				const res = await verifyClub(secretPassword);
				console.log(res);
				if (res['status'] === 0) {
					errorMessage.set('');
					successMessage.set('Club successfully approved.');
				} else if (res['status'].localeCompare('Success') === 0) {
					errorMessage.set('No matching passwords.');
				} else {
					errorMessage.set('' + res['status']);
				}
			} catch (error) {
				// isLoading.set(false);
				console.log('Failed: ' + error);
				errorMessage.set('No matching passwords.');
			} finally {
				isLoading.set(false);
			}
		}
	};
</script>

<Modal title="Verify Club" open>
	<div class="mb-6">
		<p class="text-base text-gray-800">
			In order to allow students to join your club, please enter the code that was emailed to you
			below:
		</p>

		<br />
		<Input
			bind:value={secretPassword}
			id="large-input"
			type="number"
			size="lg"
			placeholder="12345"
		/>
		<br />
		<Button outline color="green" on:click={handleVerify}>
			Confirm
			{#if $isLoading}
				<Spinner size={4} color="green" />
			{/if}
		</Button>
		<br /><br />
		{#if $errorMessage.length > 0}
			<Alert color="red">
				<span class="font-medium">Verification failed:</span>
				{$errorMessage}
			</Alert>
		{/if}
		{#if $successMessage.length > 0}
			<Alert color="green">
				<span class="font-medium">Verification successfull:</span>
				{$successMessage}
			</Alert>
		{/if}
	</div>
</Modal>
