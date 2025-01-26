<script>
	import { auth } from '$lib/auth/firebaseConfig';
	import { sendPasswordResetEmail } from 'firebase/auth';
	import { Register, Section } from 'flowbite-svelte-blocks';
	import { Alert, Button, Input, Label, Spinner } from 'flowbite-svelte';
	import { writable } from 'svelte/store';

	let email = '';
	let successMessage = writable('');
	let errorMessage = writable('');
	let resetLoading = writable(false);

	async function handleForgotPassword() {
		resetLoading.set(true);
		try {
			await sendPasswordResetEmail(auth, email);
			errorMessage.set('');
			successMessage.set('Password reset email successfully sent.');
		} catch (error) {
			successMessage.set('');
			errorMessage.set(error.message);
		} finally {
			resetLoading.set(false);
		}
	}
</script>

<!-- <form on:submit|preventDefault={handleForgotPassword}>
    <div>
        <label for="email">Email:</label>
        <input id="email" type="email" bind:value={email} required />
    </div>
    <button type="submit">Send Password Reset Email</button>
</form> -->

<Section name="login">
	<Register>
		<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
			<form class="flex flex-col space-y-6" on:submit={handleForgotPassword}>
				<h3 class="text-xl font-medium text-gray-900 p-0">Password Reset</h3>
				<Label class="space-y-2">
					<span>Your email</span>
					<Input
						bind:value={email}
						type="email"
						name="email"
						placeholder="Enter @cpsd.us email"
						required
					/>
				</Label>
				<Button color="green" type="submit" class="w-full1">
					Submit
					{#if $resetLoading}
						<Spinner size={5} color="green" />
					{/if}
				</Button>
			</form>
			{#if $errorMessage.length > 1}
				<Alert color="red">
					{$errorMessage}
				</Alert>
			{/if}
			{#if $successMessage.length > 1}
				<Alert color="green">
					<span class="font-medium">Success:</span>
					{$successMessage}
				</Alert>
				<Button color="blue" class="w-full1">
					<a href="/auth/login">Log in</a>
				</Button>
			{/if}
		</div>
	</Register>
</Section>
