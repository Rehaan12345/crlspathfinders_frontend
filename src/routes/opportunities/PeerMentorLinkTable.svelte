<script>
	import { onMount } from 'svelte';
	import {
		Badge,
		Button,
		Checkbox,
		Dropdown,
		DropdownItem,
		Input,
		Label,
		Modal,
		MultiSelect,
		Search,
		Skeleton,
		Spinner,
		Textarea
	} from 'flowbite-svelte';
	import { TableHeader } from 'flowbite-svelte-blocks';
	import {
		getCollection,
		getCollectionDoc,
		updateWholeWebsiteData,
		wholeWebsiteData
	} from '../../lib/api';
	import { writable } from 'svelte/store';
	import {
		addCategory,
		addLink,
		deleteCategory,
		deleteLink,
		editCategories,
		editLink,
		makeSelectCategoriesOk
	} from '../../lib/peermentor';

	let allReady = writable(false);
	let deleteLinkConfirmModal = writable(false);
	let isLoading = writable(false);
	let showCreateLinkModal = writable(false);
	let showEditLinkModal = writable(false);
	let showManageLinkCategories = writable(false);
	let addLoading = writable(false);
	let deleteLoading = writable(false);
	let filtersSelected = writable([]);

	let searching = '';
	let peerMentorLinks = [];
	let categories = [];
	let selectedCategories = [];
	let currCats = [];
	let currEditCat = '';
	let newCat = '';
	let deleteCat = '';

	let linkName = '';
	let linkUrl = '';

	let oldLinkName = '';
	let currLinkName = '';
	let currLinkUrl = '';

	let bio = '';
	let deadline = '';
	let currBio = '';
	let currDeadline = '';

	function toggleFilters(item) {
		filtersSelected.update((currentItems) => {
			// Check if the item exists in the array
			if (currentItems.includes(item)) {
				// Remove the item if it exists
				return currentItems.filter((i) => i !== item);
			} else {
				// Add the item if it doesn't exist
				return [...currentItems, item];
			}
		});
	}

	$: filteredLinks = peerMentorLinks.filter((obj) => {
		// Only apply filters to fields that have values in the arrays
		return $filtersSelected.every((filter) => {
			return obj.categories.length > 0 && obj.categories.includes(filter);
		});
	});

	function labelIncludesSearchTerm(label, searchTerm) {
		if (typeof label === 'string' && typeof searchTerm === 'string') {
			return label.toLowerCase().includes(searchTerm.toLowerCase());
		}
		return false;
	}

	const handleDeleteLink = async () => {
		isLoading.set(true);
		try {
			const res = await deleteLink(currLinkName);
			console.log(res);
			closedeleteLinkConfirmModal();
		} catch (error) {
			console.log('Failed to delete link: ' + error);
		} finally {
			// NEED CACHING - Done
			// peerMentorLinks = await updateCache('PeerMentorLinks');
			if (all_opportunities) {
				console.log('found opps');
				peerMentorLinks = all_opportunities;
			} else {
				console.log('not found opps');
				peerMentorLinks = await getCollection('PeerMentorLinks');
			}

			for (let i = 0; i < categories.length; i++) {
				if (categories[i].id == 'PeerMentor') {
					categories = categories[i].categories;
				}
			}
			categories = makeSelectCategoriesOk(categories);
			isLoading.set(false);
		}
	};

	const handleAddLink = async () => {
		isLoading.set(true);
		try {
			// const correctedCats = selectedCategories.join(", ");
			// console.log(correctedCats);
			await addLink(linkName, linkUrl, selectedCategories, bio, deadline);

			// UPDATE PML locstor - Done
			// await setDataInLocalStorage('PeerMentorLinks', peerMentorLinks);
			peerMentorLinks = await getCollection('PeerMentorLinks');

			console.log('Successfully added link');
			linkName = '';
			linkUrl = '';
			bio = '';
			deadline = '';
		} catch (error) {
			console.log('Failed to add link');
		} finally {
			isLoading.set(false);
			// NEED CACHE - Done
			// peerMentorLinks = await updateCache('PeerMentorLinks');
			peerMentorLinks = await getCollection('PeerMentorLinks');
		}
	};

	const handleEditLink = async () => {
		isLoading.set(true);
		try {
			await editLink(oldLinkName, currLinkName, currLinkUrl, currCats, currBio, currDeadline);
			// UPDATE locstor
			console.log('Successfully edited link');
			currLinkName = '';
			currLinkUrl = '';
			oldLinkName = '';
			selectedCategories = [];
			currBio = '';
			currDeadline = '';
		} catch (error) {
			console.log('Failed to edit link');
		} finally {
			isLoading.set(false);
			// NEED CACHE - Done
			// peerMentorLinks = await updateCache('PeerMentorLinks');
			peerMentorLinks = await getCollection('PeerMentorLinks');
			closeshowEditLinkModal();
		}
	};

	const handleEditCategory = async (newCatId, newCat) => {
		isLoading.set(true);
		let oldCat = '';
		try {
			oldCat = categories[newCatId].value;
			console.log('Old cat: ' + oldCat + '. New cat: ' + newCat);
			await editCategories(oldCat, newCat);
		} catch (error) {
			console.log('Failed to edit category: ' + error);
		} finally {
			// Update the demographics collection:
			// LEAVE FOR NOW
			categories = await getCollection('Demographics');
			for (let i = 0; i < categories.length; i++) {
				if (categories[i].id == 'PeerMentor') {
					categories = categories[i].categories;
				}
			}
			categories = makeSelectCategoriesOk(categories);
			// Update the peermentorlinks individual fields:
			// NEED CACHE - Done
			// peerMentorLinks = await updateCache('PeerMentorLinks');
			peerMentorLinks = await getCollection('PeerMentorLinks');

			let currPMLCats;
			for (let i = 0; i < peerMentorLinks.length; i++) {
				currPMLCats = peerMentorLinks[i].categories;
				for (let j = 0; j < currPMLCats.length; j++) {
					if (currPMLCats[i] == oldCat) {
						// If that pml has that category that has been changed:
						currPMLCats[i] = newCat;
						oldLinkName = peerMentorLinks[i].name;
						currLinkName = peerMentorLinks[i].name;
						currLinkUrl = peerMentorLinks[i].src;
						currCats = currPMLCats;
						currBio = peerMentorLinks[i].bio;
						currDeadline = peerMentorLinks[i].deadline;
						await handleEditLink();
					}
				}
			}
			isLoading.set(false);
		}
	};

	const handleAddCategory = async () => {
		addLoading.set(true);
		try {
			await addCategory(newCat);
			newCat = '';
		} catch (error) {
			console.log('Failed to create category: ' + error);
		} finally {
			categories = await getCollection('Demographics');
			for (let i = 0; i < categories.length; i++) {
				if (categories[i].id == 'PeerMentor') {
					categories = categories[i].categories;
				}
			}
			categories = makeSelectCategoriesOk(categories);
			addLoading.set(false);
		}
	};

	const handleDeleteCategory = async () => {
		deleteLoading.set(true);
		try {
			await deleteCategory(deleteCat);
			newCat = '';
		} catch (error) {
			console.log('Failed to delete category: ' + error);
		} finally {
			categories = await getCollection('Demographics');
			for (let i = 0; i < categories.length; i++) {
				if (categories[i].id == 'PeerMentor') {
					categories = categories[i].categories;
				}
			}
			categories = makeSelectCategoriesOk(categories);
			deleteLoading.set(false);
		}
	};

	onMount(async () => {
		allReady.set(false);
		let targetId = wholeWebsiteData.findIndex((item) => item.id === 'opportunities');
		if (targetId > -1) {
			peerMentorLinks = wholeWebsiteData[targetId].info;
		} else {
			peerMentorLinks = await getCollection('PeerMentorLinks');
			updateWholeWebsiteData('opportunities', peerMentorLinks);
		}

		targetId = wholeWebsiteData.findIndex((item) => item.id === 'categories');
		if (targetId > -1) {
			categories = wholeWebsiteData[targetId].info;
		} else {
			categories = await getCollectionDoc('Demographics', 'PeerMentor');
			updateWholeWebsiteData('categories', categories);
		}

		categories = categories.categories;

		categories = makeSelectCategoriesOk(categories);
		console.log(categories);
		allReady.set(true);
	});

	export let view = 'View';

	const opendeleteLinkConfirmModal = () => deleteLinkConfirmModal.set(true);
	const closedeleteLinkConfirmModal = () => deleteLinkConfirmModal.set(false);

	const openShowCreateLinkModal = () => showCreateLinkModal.set(true);
	const closeShowCreateLinkModal = () => showCreateLinkModal.set(false);

	const openShowEditLinkModal = () => showEditLinkModal.set(true);
	const closeshowEditLinkModal = () => showEditLinkModal.set(false);

	const openShowManageLinkCategories = () => showManageLinkCategories.set(true);
	const closeShowManageLinkCategories = () => showManageLinkCategories.set(false);
</script>

{#if $deleteLinkConfirmModal}
	<Modal title="Delete link" open={$deleteLinkConfirmModal} on:close={closedeleteLinkConfirmModal}>
		<p class="text-base leading-relaxed text-gray-800">
			Are you sure you want to permanently remove <b></b>? You cannot undo this action.
		</p>
		<Button outline color="red" on:click={handleDeleteLink}>
			Delete
			{#if $isLoading}
				<Spinner size={4} color="red" />
			{/if}
		</Button>
	</Modal>
{/if}

<!-- Create link: -->
{#if $showCreateLinkModal}
	<Modal title="Add a link" open={$showCreateLinkModal} on:close={closeShowCreateLinkModal}>
		<form on:submit={handleAddLink}>
			<div class="w-full">
				<Label for="category" class="mb-2">Category</Label>
				<MultiSelect
					placeholder="Select a category"
					items={categories}
					bind:value={selectedCategories}
				/>
			</div>
			<div class="w-full">
				<Label for="name" class="mb-2">Name</Label>
				<Input type="text" id="name" placeholder="Name123" bind:value={linkName} required />
			</div>
			<div class="w-full">
				<Label for="linkurl" class="mb-2">Link url</Label>
				<Input
					type="text"
					id="linkurl"
					placeholder="https://name123link.com"
					bind:value={linkUrl}
					required
				/>
			</div>
			<div class="w-full">
				<Label for="linkurl" class="mb-2">Deadline</Label>
				<Input
					type="text"
					id="deadline"
					placeholder="May 10, 2025"
					bind:value={deadline}
					required
				/>
			</div>
			<div class="w-full">
				<Label for="linkbio" class="mb-2">Bio</Label>
				<Textarea id="linkbio" rows="10" placeholder="Link Bio" bind:value={bio} required
				></Textarea>
			</div>
			<br />
			<Button outline color="purple" type="submit" class="w-32">
				Add link
				{#if $isLoading}
					<Spinner size={5} color="purple" />
				{/if}
			</Button>
		</form>
	</Modal>
{/if}

<!-- Edit link: -->
{#if $showEditLinkModal}
	<Modal title="Add a link!" open={$showEditLinkModal} on:close={closeshowEditLinkModal}>
		<form on:submit={handleEditLink}>
			<div class="w-full">
				<Label for="category" class="mb-2">Category</Label>
				<MultiSelect placeholder="Select a category" items={categories} bind:value={currCats} />
			</div>
			<div class="w-full">
				<Label for="name" class="mb-2">Name</Label>
				<Input type="text" id="name" placeholder="Name123" bind:value={currLinkName} required />
			</div>
			<div class="w-full">
				<Label for="linkurl" class="mb-2">Link url</Label>
				<Input
					type="text"
					id="linkurl"
					placeholder="https://name123link.com"
					bind:value={currLinkUrl}
					required
				/>
			</div>
			<div class="w-full">
				<Label for="linkurl" class="mb-2">Deadline</Label>
				<Input
					type="text"
					id="deadline"
					placeholder="May 10, 2025"
					bind:value={currDeadline}
					required
				/>
			</div>
			<div class="w-full">
				<Label for="linkbio" class="mb-2">Bio</Label>
				<Textarea id="linkbio" rows="10" placeholder="Link Bio" bind:value={currBio} required
				></Textarea>
			</div>
			<br />
			<Button outline color="purple" type="submit" class="w-32">
				Edit link
				{#if $isLoading}
					<Spinner size={5} color="purple" />
				{/if}
			</Button>
		</form>
	</Modal>
{/if}

<!-- Manage link categories: -->
{#if $showManageLinkCategories}
	<Modal
		title="Manage categories"
		open={$showManageLinkCategories}
		on:close={closeShowManageLinkCategories}
	>
		<table class="w-full text-sm text-left text-gray-500">
			<tbody>
				<tr class="border-b" style="padding:2rem;">
					<td class="px-2 py-1">
						<form on:submit={handleAddCategory}>
							<div class="editcatsformwrapper" style="display:flex;gap:.5rem;">
								<Input placeholder="Add new category" bind:value={newCat} />
								<Button outline color="green" type="submit"
									>Add
									{#if $addLoading}
										<Spinner color="blue" size={4} />
									{/if}
								</Button>
							</div>
						</form>
					</td>
				</tr>
				{#each categories as cat}
					<tr class="border-b" style="padding:2rem;">
						<td class="px-2 py-1">
							<form
								on:submit={() => {
									currEditCat = cat.name;
									handleEditCategory(cat.catId, currEditCat);
								}}
							>
								<div class="editcatsformwrapper" style="display:flex;gap:.5rem;">
									<Input bind:value={cat.name} />
									{#if $isLoading}
										<Button disabled outline color="blue" type="submit"
											>Update
											{#if $isLoading && cat.name == currEditCat}
												<Spinner color="blue" size={4} />
											{/if}
										</Button>
									{:else}
										<Button outline color="blue" type="submit"
											>Update
											{#if $isLoading && cat.name == currEditCat}
												<Spinner color="blue" size={4} />
											{/if}
										</Button>
									{/if}
								</div>
							</form>
						</td>
						<td class="px-2 py-1">
							<Button
								outline
								color="red"
								on:click={() => {
									deleteCat = cat.name;
									handleDeleteCategory();
								}}
							>
								Delete
								{#if $deleteLoading && deleteCat == cat.name}
									<Spinner color="red" size={4} />
								{/if}
							</Button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</Modal>
{/if}

<div class="peermentorwrapper" style="height:100vh;">
	{#if $allReady}
		<section class="bg-gray-50 p-3 sm:p-5">
			<div>
				<TableHeader headerType="search">
					<Search bind:value={searching} slot="search" placeholder="Search" size="md" />
					<div class=""></div>
					{#if view == 'Edit'}
						<Button
							outline
							color="purple"
							on:click={() => {
								openShowCreateLinkModal();
							}}
						>
							Create link
						</Button>
						<Button
							outline
							color="purple"
							on:click={() => {
								openShowManageLinkCategories();
							}}
						>
							Manage categories
						</Button>
					{/if}
					<Button outline color="purple">Filters</Button>
					<Dropdown class="w-48 p-3 space-y-2 text-sm">
						{#each categories as cat}
							<DropdownItem class="flex items-center justify-between">
								{#if $filtersSelected.includes(cat.name)}
									<Checkbox
										checked
										on:change={() => {
											toggleFilters(cat.name);
										}}
										><li>{cat.name}</li>
									</Checkbox>
								{:else}
									<Checkbox
										on:change={() => {
											toggleFilters(cat.name);
											console.log($filtersSelected);
										}}
										><li>{cat.name}</li>
									</Checkbox>
								{/if}
							</DropdownItem>
						{/each}
					</Dropdown>
					<Button
						outline
						color="dark"
						on:click={() => {
							filtersSelected.set([]);
						}}>Reset filters</Button
					>
				</TableHeader>
				{#if $filtersSelected.length > 0}
					<br />
					{#if $filtersSelected.length > 0}
						{#each $filtersSelected as f}
							<Badge color="purple" style="margin-right:1rem;">{f}</Badge>
						{/each}
					{/if}
				{/if}
			</div>
			<br />
			<div>
				<div class="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
					<div class="overflow-x-auto">
						<table class="w-full text-sm text-left text-gray-500">
							<thead class="text-xs text-gray-700 uppercase bg-gray-50">
								<tr>
									{#if view == 'Edit'}
										<th scope="col" class="px-4 py-3">Edit</th>
										<th scope="col" class="px-4 py-3">Delete</th>
									{/if}

									<th scope="col" class="px-4 py-3">Name</th>
									<th scope="col" class="px-4 py-3">Bio</th>
									<th scope="col" class="px-4 py-3">Link</th>
									<th scope="col" class="px-4 py-3">Categories</th>
									<th scope="col" class="px-4 py-3">Deadline</th>
								</tr>
							</thead>
							<tbody>
								{#each filteredLinks as pml}
									{#if labelIncludesSearchTerm(pml.name, searching)}
										{#if pml.id != 'Categories'}
											<tr class="border-b" style="padding:2rem;">
												{#if view == 'Edit'}
													<td>
														<Button
															style="margin-left:1rem; margin-top:1rem;"
															outline
															color="dark"
															size="xs"
															on:click={() => {
																currLinkName = pml.name;
																currLinkUrl = pml.src;
																oldLinkName = currLinkName;
																currBio = pml.bio;
																currDeadline = pml.deadline;
																openShowEditLinkModal();
																currCats = pml.categories;
															}}>Edit</Button
														>
													</td>
													<td class="px-2 py-1">
														<Button
															style="margin-left:1rem; margin-top:1rem;"
															outline
															color="red"
															size="xs"
															on:click={() => {
																currLinkName = pml.name;
																opendeleteLinkConfirmModal();
															}}
														>
															Delete
														</Button>
													</td>
												{/if}

												<td class="px-2 py-1 text-gray-700" style="font-size:medium;padding:1rem;">
													<b>{pml.name}</b>
												</td>
												<td class="px-2 py-1 text-gray-700">
													{pml.bio}
												</td>
												<td class="px-2 py-1 text-gray-700">
													<u><a target="_blank" href={pml.src}>{pml.src}</a></u>
												</td>
												<td class="px-2 py-1">
													<div class="catbadgewrapper">
														{#each pml.categories as cat}
															<div class="catbadge" style="margin-top:1rem;">
																<Badge color="purple">{cat}</Badge>
															</div>
														{/each}
													</div>
												</td>
												<td class="px-2 py-1 text-gray-700">
													<b>{pml.deadline}</b>
												</td>
											</tr>
										{/if}
									{/if}
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</section>
	{:else}
		<center>
			<div class="loadingwrapper" style="font-size:large; margin-top:1rem;">
				Loading Peer Mentor Links ... <Spinner color="blue" />
			</div>
		</center>

		<Skeleton size="sm" class="my-8" />
	{/if}
</div>
