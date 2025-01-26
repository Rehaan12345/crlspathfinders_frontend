<script>
	import PeerMentorLinkTable from './PeerMentorLinkTable.svelte';
	import { Heading, P, Span } from 'flowbite-svelte';
</script>

<div class="infowrapper" style="margin-left:3rem;margin-right:3rem;margin-top:1rem;">
	<Heading tag="h4" customSize="text-4xl font-extrabold" class="dark:text-gray-100"
		><Span underline decorationClass="decoration-8 decoration-red-800 dark:decoration-red-600"
			>Opportunities</Span
		></Heading
	>
	<br />
	<P class="mb-2" weight="light" color="text-gray-600 dark:text-gray-200">
		Looking for internships, summer programs, scholarships or more?
		<br />Below you can search for and filter to find any opportunity within the Cambridge area and
		CRLS.
		<br />Looking for something that isn't here? Want to add something else to the list? Send us an
		email at
		<u
			><a
				target="_blank"
				href="https://mail.google.com/mail/?view=cm&fs=1&to=crlspathfinders25@gmail.com&su=CRLS%20PathFinders%20Support"
				>crlspathfinders25@gmail.com</a
			></u
		>.
	</P>
</div>

<PeerMentorLinkTable></PeerMentorLinkTable>
