<script lang="js">
	import { onMount } from 'svelte';
	import { Faq, FaqItem, HeroBody, HeroHeader, Section } from 'flowbite-svelte-blocks';
	import { Button } from 'flowbite-svelte';
	import { user } from '../stores/auth';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';

	let email = '';

	onMount(async () => {
		user.subscribe((value) => {
			if (value) {
				email = value.email;
			} else {
				email = '';
			}
		});
		// const userInfo = await fetchUserInfo();
		// if (userInfo["uid"] !== null) { console.log(userInfo["uid"]); }
	});
</script>

<div class="wholecontentwrapper bg-gray-100" style="height:100%;">
	<Section name="heroDefault">
		<div class="sectioncontent bg-gray-100" style="height:100%;">
			<div style="margin-top:1rem;"></div>
			<HeroHeader>
				<svelte:fragment slot="h1">CRLS PathFinders</svelte:fragment>
				<svelte:fragment slot="paragraph">
					Bringing autonomy back to students, PathFinders seeks to provide 9th and 10th grade
					students with all of the resources that CRLS and Cambridge have to offer.
				</svelte:fragment>
			</HeroHeader>

			<div
				class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4 bg-gray-100"
			>
				{#if $user}
					<a href="/findaclub">
						<Button size="xl" color="green" class="inline-flex items-center justify-center mr-3">
							Find a club<ArrowRightOutline size="md" class="ml-2 -mr-1" />
						</Button>
					</a>
					<a href="/findamentor">
						<Button size="xl" color="blue" class="inline-flex items-center justify-center mr-3">
							Find a mentor<ArrowRightOutline size="md" class="ml-2 -mr-1" />
						</Button>
					</a>
					<a href="/becomeamentor">
						<Button size="xl" color="yellow" class="inline-flex items-center justify-center mr-3">
							Become a mentor<ArrowRightOutline size="md" class="ml-2 -mr-1" />
						</Button>
					</a>
				{:else}
					<a href="/findaclub">
						<Button size="xl" color="yellow" class="inline-flex items-center justify-center mr-3">
							Find a club<ArrowRightOutline size="md" class="ml-2 -mr-1" />
						</Button>
					</a>
					<a href="/findamentor">
						<Button size="xl" color="purple" class="inline-flex items-center justify-center mr-3">
							Find a mentor<ArrowRightOutline size="md" class="ml-2 -mr-1" />
						</Button>
					</a>
					<!-- <a href="/becomeamentor">
						<Button size="xl" color="yellow" class="inline-flex items-center justify-center mr-3">
							Become a mentor<ArrowRightOutline size="md" class="ml-2 -mr-1" />
						</Button>
					</a> -->
					<a href="/auth/signup">
						<Button size="xl" color="green" class="inline-flex items-center justify-center mr-3">
							Sign Up<ArrowRightOutline size="md" class="ml-2 -mr-1" />
						</Button>
					</a>
					<a href="/auth/login">
						<Button size="xl" color="blue" class="inline-flex items-center justify-center mr-3">
							Log In<ArrowRightOutline size="md" class="ml-2 -mr-1" />
						</Button>
					</a>
				{/if}
			</div>
			<div class="herobody bg-gray-100" style="height:100%;">
				<HeroBody>
					<svelte:fragment slot="head">About us</svelte:fragment>
					<Faq>
						<div>
							<FaqItem>
								<svelte:fragment slot="h3"
									><div class="bg-gray-100">What does PathFinders do?</div></svelte:fragment
								>
								<p class="text-gray-600 bg-gray-100">
									Our goal with PathFinders is to create one place within CRLS where all students
									can access all the help and resources that they need to succeed both in school and
									out.
								</p>
							</FaqItem>
							<FaqItem>
								<svelte:fragment slot="h3">What can I do?</svelte:fragment>
								<p class="text-gray-600 bg-gray-100">
									Feel free to explore the website. We are still adding new features, but feel free
									to check out all the <u><a href="/findaclub">clubs</a></u> and
									<u><a href="/findamentor">mentors</a></u>.
								</p>
							</FaqItem>
							<FaqItem>
								<svelte:fragment slot="h3">How can I get involved?</svelte:fragment>
								<p class="text-gray-600 bg-gray-100">
									If you are interested in helping us out on our project, send us an <u
										><a
											target="_blank"
											href="https://mail.google.com/mail/?view=cm&fs=1&to=crlspathfinders25@gmail.com&su=CRLS%20PathFinders%20Mentee"
											>email</a
										></u
									> and we will get back to you!
								</p>
							</FaqItem>
						</div>
					</Faq>
				</HeroBody>
			</div>
		</div>
	</Section>
</div>

<style>
	@media (prefers-color-scheme: dark) {
		* {
			color-scheme: light;
			background-color: white;
		}
	}
	/* 
@media (prefers-color-scheme: dark) {
  .dark .bg-gray-900,
  .dark .bg-gray-800,
  .dark .bg-gray-700,
  .dark .bg-gray-600,
  .dark .text-white,
  .dark .text-gray-300 {
    background-color: var(--tw-bg-opacity) white !important;
    color: var(--tw-text-opacity) black !important;
  }
} */
</style>
