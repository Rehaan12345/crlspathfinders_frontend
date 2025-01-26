<script>
	import Register from './Register.svelte';
	import { user } from '../../stores/auth';
	import { Page404, Section } from 'flowbite-svelte-blocks';
	import { Button } from 'flowbite-svelte';
</script>

{#if $user}
	<Register></Register>
{:else}
	<Section name="page404">
		<Page404>
			<svelte:fragment slot="paragraph">
				<p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">
					Make an account to access this page!
				</p>
				<p class="mb-4 text-lg font-light text-gray-500">
					To register your club you first need to make an account.
				</p>
				<Button outline href="/auth/signup" size="lg" color="blue">Sign Up</Button>
				<Button outline href="/auth/login" size="lg" color="green">Log In</Button>
			</svelte:fragment>
		</Page404>
		<center>
			<img
				src="https://firebasestorage.googleapis.com/v0/b/crlspathfinders-82886.appspot.com/o/other-images%2Fimsorryemoji-removebg-preview.png?alt=media&token=e288835c-de37-4d30-9be6-9eeb76f798d4"
				alt="I'm sorry"
			/>
		</center>
	</Section>
{/if}
