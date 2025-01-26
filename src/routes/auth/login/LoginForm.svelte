<script>
	import { goto } from '$app/navigation';
	import { Register, Section } from 'flowbite-svelte-blocks';
	import { Alert, Button, Checkbox, Input, Label, Spinner } from 'flowbite-svelte';
	import { auth } from '../../../lib/auth/firebaseConfig';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { toggleLoggedIn } from '../../../lib/auth/login';
	import { writable } from 'svelte/store';
	import { googleSignUp } from '../../../lib/auth/googlesignup';
	import { retrieveUserInfo } from '$lib/cache';

	let email;
	let password;
	let errorMessage = writable('');
	let loginLoading = writable(false);
	let googleLoading = writable(false);

	const handleGoogleSignIn = () => {
		googleLoading.set(true);
		try {
			const res = googleSignUp();
			if (res.status.localeCompare('Success') === 0) {
				goto('/');
			} else {
				throw new Error(res.status);
			}
		} catch (error) {
			errorMessage.set('Google signin failed. Try a different way.');
		} finally {
			googleLoading.set(false);
		}
	};

	async function login() {
		loginLoading.set(true);
		try {
			const res = await signInWithEmailAndPassword(auth, email, password);
			if (res) {
				toggleLoggedIn();
				loginLoading.set(false);
				await retrieveUserInfo();
				goto('/');
			}
		} catch (error) {
			errorMessage.set('Incorrect email or password.');
			// console.error("Login failed", error);
			loginLoading.set(false);
		}
	}
</script>

<Section name="login">
	<Register>
		<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
			<form
				class="flex flex-col space-y-6"
				on:submit={() => {
					login();
				}}
			>
				<h3 class="text-xl font-medium text-gray-900 p-0">Login</h3>
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
				<Label class="space-y-2">
					<span>Your password</span>
					<Input
						bind:value={password}
						type="password"
						name="password"
						placeholder="Enter password"
						required
					/>
				</Label>
				<div class="flex items-start">
					<Checkbox>Remember me</Checkbox>
					<a href="/auth/login/forgotpassword" class="ml-auto text-sm text-blue-700 hover:underline"
						>Forgot password?</a
					>
				</div>
				<Button color="green" type="submit" class="w-full">
					Log in
					{#if $loginLoading}
						<Spinner color="green" />
					{/if}
				</Button>
				<!-- <Button outline color="blue" on:click={handleGoogleSignIn}>
            Log in with Google
            {#if $googleLoading}
              <Spinner size={5} color="blue"/>
            {/if}
          </Button> -->
				<p class="text-sm font-light text-gray-500">
					Don’t have an account yet? <a
						href="/auth/signup"
						class="font-medium text-primary-600 hover:underline">Sign up</a
					>
				</p>
			</form>
			{#if $errorMessage.length > 1}
				<Alert color="red">
					{$errorMessage}
				</Alert>
			{/if}
		</div>
	</Register>
</Section>
