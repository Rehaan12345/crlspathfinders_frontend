<script>
	import Register from './Register.svelte';
	import { user } from '../../stores/auth';
	import { Button, Heading } from 'flowbite-svelte';
</script>

{#if $user}
	<Register></Register>
{:else}
	<div class="bg-gray-100" style="height: 100vh;">
		<center>
			<Heading>Make an account to access this page!</Heading>
			<p class="mb-4 text-lg font-light text-gray-500">
				To become a mentor you first need to make an account.
			</p>
			<Button outline href="/auth/signup" size="lg" color="blue">Sign Up</Button>
			<Button outline href="/auth/login" size="lg" color="green">Log In</Button>
			<img
				src="https://firebasestorage.googleapis.com/v0/b/crlspathfinders-82886.appspot.com/o/other-images%2Fimsorryemoji-removebg-preview.png?alt=media&token=e288835c-de37-4d30-9be6-9eeb76f798d4"
				alt="I'm sorry"
			/>
		</center>
	</div>
{/if}
