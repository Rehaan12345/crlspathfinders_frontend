import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { user } from '../stores/auth';
import { getCollection } from '$lib/api';

// A dictionary store variable for all of the cachedData (we will update it with more as we go along).
const cachedData = writable({
	userInfo: null,
	clubs: null
});

// Exports a function that updates the cache at a specific key and value.
export function updateCache(key, value) {
	return 0;
	console.log('Updating cache');
	cachedData.update((current) => ({ ...current, [key]: value }));
	console.log('Cache updated' + value);
	if (browser) {
		localStorage.setItem(key, JSON.stringify(value)); // Store in localStorage - JSON.stringify stores the JSON object as a string, which is why we have to use JSON.parse later on to turn it back into JSON format.
		console.log('Browser found');
	} else {
		console.log('No browser found');
	}
}
// Initialize the cache from localStorage on start up.
let storedUserInfo;
let storedClubs;

if (browser) {
	storedUserInfo = localStorage.getItem('userInfo');
	storedClubs = localStorage.getItem('clubs');
}

if (storedUserInfo) {
	try {
		console.log('Updating cache');
		updateCache('userInfo', JSON.parse(storedUserInfo));
	} catch (error) {
		console.log('Failed to update cache: ' + error);
	}
}

if (storedClubs) {
	updateCache('clubs', JSON.parse(storedClubs));
}

// Export functions for fetching and updating cached data.
export async function retrieveUserInfo() {
	return 0;
	let userInfo;
	console.log('starting function');
	let email = '';
	// user.subscribe is the built-in function that checks the user store variable, which essentially just checks to see if the user is currently logged in or not.
	user.subscribe((value) => {
		try {
			// If there is some value, that means the user is logged in currently.
			if (value) {
				// localStorage.clear();
				// The logged in value will have an email associated with it, but not any more useful information for us.
				email = value.email;
				// With that email we can find more information using the getUserDocData function from the "lib/user" file.
				// userInfo = await getUserDocData(email);
				console.log(email);
				// console.log(userInfo);
				// Updates the correct cache.
				// updateCache('userInfo', userInfo);
				// if (typeof cachedData.userInfo === null) {
				// 	console.log('email', email);
				// } else {
				// 	console.log('userInfo', userInfo);
				// 	console.log('Finished updateCache');
				// }
			} else {
				// let userInfo = cachedData.userInfo; // Access current store value.
				let userInfo = null;
				console.log('cached data', userInfo);
			}
		} catch (error) {
			console.log('Failed to retrieve user info: ' + error);
		}
	});
	return userInfo;
}

// This exports a function that allows us to create more localStorage variables for different variables. For example, when we want to store mentors and clubs, we shouldn't hard code those keys, instead this function dynamically creates them for us.
// BTW: This function isn't ready to be fully used yet, although you can see it in the commented out stuff in MentorCard.svelte, how it should be used.
export async function retrieveCollectionInfo(collection) {
	return 0;
	let collectionInfo;
	console.log('starting ' + collection + ' function');

	try {
		collectionInfo = await getCollection(collection);
		updateCache(collection.toLowerCase() + 'Info', collectionInfo);
	} catch (error) {
		console.log('Failed to get collectionInfo: ' + error);
	}

	return collectionInfo;
}
