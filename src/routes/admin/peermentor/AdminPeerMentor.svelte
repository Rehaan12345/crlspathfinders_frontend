<script>
	import { onMount } from 'svelte';
	import { ListPlaceholder, Spinner } from 'flowbite-svelte';
	// import paginationData from '../utils/advancedTable.json'
	import { getCollection } from '../../../lib/api';
	// import EditMentor from "./EditMentor.svelte";
	import { writable } from 'svelte/store';
	import { deleteMentor } from '../../../lib/mentor';
	import PeerMentorLinkTable from '../../opportunities/PeerMentorLinkTable.svelte';

	let wholeReady = writable(false);
	let deleteMentorConfirmModal = writable(false);
	let removeLoading = writable(false);
	let showCreateLinkModal = writable(false);

	let mentors = [];

	let searching = '';

	let editOn = false;

	let currMentor;

	let statusOn = false;

	let currEmail;

	function handleBio(bio) {
		if (bio.length > 50) {
			return bio.substring(0, 50) + ' ... ';
		}
		return bio;
	}

	function labelIncludesSearchTerm(label, searchTerm) {
		if (typeof label === 'string' && typeof searchTerm === 'string') {
			return label.toLowerCase().includes(searchTerm.toLowerCase());
		}
		return false;
	}

	const handleDelete = async (email) => {
		removeLoading.set(true);
		try {
			const res = await deleteMentor(email);
			console.log(res);
		} catch (error) {
			console.log('Failed to delete mentor: ' + error);
		} finally {
			mentors = await getCollection('Mentors');
			removeLoading.set(false);
			closedeleteMentorConfirmModal();
		}
	};

	onMount(async () => {
		wholeReady.set(false);
		try {
			mentors = await getCollection('Mentors');
			console.log(mentors);
		} catch (error) {
			console.log('Onmount failed: ' + error);
		} finally {
			wholeReady.set(true);
		}
	});

	const opendeleteMentorConfirmModal = () => deleteMentorConfirmModal.set(true);
	const closedeleteMentorConfirmModal = () => deleteMentorConfirmModal.set(false);
</script>

{#if $wholeReady}
	<PeerMentorLinkTable view={'Edit'}></PeerMentorLinkTable>
{:else}
	<center>
		Gathering Data ... <Spinner color="green" />
		<ListPlaceholder></ListPlaceholder>
	</center>
{/if}
