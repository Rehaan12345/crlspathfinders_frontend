<script>
	import { Register, Section } from 'flowbite-svelte-blocks';
	import { Alert, Button, Input, Label, Spinner } from 'flowbite-svelte';
	import { auth } from '../../../lib/auth/firebaseConfig';
	import { createUserWithEmailAndPassword } from 'firebase/auth';
	import { user } from '../../../stores/auth';
	import { makeUser } from '../../../lib/auth/signup';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { getUserDocData, setCurrEmail } from '../../../lib/user';

	// Send email confirmation:
	// const actionCodeSettings = {
	// 	// URL you want to redirect back to. The domain (www.example.com) for this
	// 	// URL must be in the authorized domains list in the Firebase Console.
	// 	url: 'https://www.crlspathfinders.com/finishSignUp?cartId=1234',
	// 	// This must be true.
	// 	handleCodeInApp: true
	// };

	// const ok_auth = getAuth();
	// sendSignInLinkToEmail(ok_auth, email, actionCodeSettings)
	// 	.then(() => {
	// 		// The link was successfully sent. Inform the user.
	// 		// Save the email locally so you don't need to ask the user for it again
	// 		// if they open the link on the same device.
	// 		window.localStorage.setItem('emailForSignIn', email);
	// 		// ...
	// 	})
	// 	.catch((error) => {
	// 		const errorCode = error.code;
	// 		const errorMessage = error.message;
	// 		// ...
	// 	});

	const SEND_URL = import.meta.env.VITE_URL;

	let email;
	let password;
	let confirmPassword;
	let role;
	let signupLoading = writable(false);
	let errorMessage = writable('');

	// let email;
	let loggedInUser;

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

	function checkInfo() {
		if (/^\d{2}/.test(email)) {
			role = 'Member';
		} else {
			role = 'Advisor';
		}
		if (email.indexOf('@cpsd.us') < 0) {
			errorMessage.set('Email has to be your cpsd.us email');
			return false;
		}
		if (password.localeCompare(confirmPassword) !== 0) {
			errorMessage.set('Passwords do not match');
			return false;
		}
		if (password.length < 6) {
			errorMessage.set('Password has to be more than 6 characters');
			return false;
		}
		return true;
	}

	async function signup() {
		signupLoading.set(true);
		try {
			if (checkInfo()) {
				const userCredential = await createUserWithEmailAndPassword(auth, email, password);
				const token = await userCredential.user.getIdToken();
				const url = SEND_URL + 'create-user';
				await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ token })
				});

				// Now sign up the user with more info (two empty strings for leading and joined_clubs):
				const tryMakeUser = await makeUser(email, false, role, [], []);

				// const status = await tryMakeUser.JSON();
				setCurrEmail(email);
				goto('/');
				return tryMakeUser;
			} else {
				signupLoading.set(false);
				return "All info didn't pass";
			}
		} catch (error) {
			signupLoading.set(false);
			errorMessage.set('' + error);
			console.error('Signup failed', error);
		}
	}
</script>

<Section name="login">
	<Register>
		<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
			<form
				on:submit={() => {
					signup();
				}}
				class="flex flex-col space-y-6"
			>
				<h3 class="text-xl font-medium text-gray-900 p-0">Sign up</h3>
				<Label class="space-y-2">
					<span>Your email</span>
					<Input
						bind:value={email}
						name="email"
						id="email"
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
						id="password"
						placeholder="Enter password"
						required
					/>
				</Label>
				<Label class="space-y-2">
					<span>Confirm password</span>
					<Input
						bind:value={confirmPassword}
						type="password"
						name="confirmpassword"
						placeholder="Enter password"
						required
					/>
				</Label>
				<Button color="green" type="submit" class="w-full1">
					Sign Up
					{#if $signupLoading}
						<Spinner color="green" />
					{/if}
				</Button>
			</form>
			{#if $errorMessage.length > 1}
				<Alert color="red">
					{$errorMessage}
				</Alert>
			{/if}
		</div>
	</Register>
</Section>
