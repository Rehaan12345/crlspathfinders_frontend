const username = import.meta.env.VITE_AUTH_USERNAME;
const password = import.meta.env.VITE_AUTH_PASSWORD;
const encodedCredentials = btoa(`${username}:${password}`); // Base64 encode

import { auth } from './auth/firebaseConfig';
import { user } from '../stores/auth';

let email;
let loggedInUser;

let currEmail = '';

export function setCurrEmail(email) {
	currEmail = email;
}
export function getCurrEmail() {
	return currEmail;
}

export function basicSetUp() {
	user.subscribe(async (value) => {
		if (value) {
			email = value.email;
			userInfo = retrieveValue('userInfo');
			if (window.localStorage.getItem('userInfo')) {
				userInfo = window.localStorage.getItem('userInfo');
			} else {
				userInfo = await getUserDocData(email);
				window.localStorage.setItem('userInfo', userInfo);
			}
			console.log(userInfo);
		}
	});
}

const SEND_URL = import.meta.env.VITE_REDIS_URL;

export const roleChoices = [
	{ value: 'Member', name: 'Member', color: 'light' },
	{ value: 'Mentor', name: 'Mentor', color: 'blue' },
	{ value: 'Leader', name: 'Leader', color: 'green' },
	{ value: 'Advisor', name: 'Advisor', color: 'yellow' },
	{ value: 'Admin', name: 'Admin', color: 'dark' },
	{ value: 'Super Admin', name: 'Super Admin', color: 'purple' }
];

export async function editUser(email, is_leader, password, role) {
	const toSend = {
		email,
		is_leader,
		password,
		role
	};

	console.log(toSend);

	try {
		const url = SEND_URL + 'updateuser/';
		const res = await fetch(url, {
			method: 'POST',
			headers: { 'Content-type': 'application/json', Authorization: `Basic ${encodedCredentials}` },
			body: JSON.stringify(toSend)
		});
		const resData = await res.json();
		const status = resData['status'];
		console.log('Successfully retrieved message: ' + status);
		// location.reload(); // Change later, etc.
		console.log(status);
		return status;
	} catch (error) {
		console.log('Error: ' + error);
		return -1;
	}
}

let isLoggedIn = false;

function toggleIsLoggedIn() {
	isLoggedIn = !isLoggedIn;
}

export function getLoggedIn() {
	return isLoggedIn;
}

export async function fetchUserInfo() {
	// console.log(auth.currentUser["email"]);
	const token = await getIdToken(auth.currentUser);
	console.log(token);
	const response = await fetch(SEND_URL + 'user-info', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	if (!response.ok) {
		throw new Error('Failed to fetch user info');
	}

	const resData = await response.json();
	// console.log(resData);
	return resData;
}

export async function getUserDocData(email) {
	const url = SEND_URL + 'getuserdocdata' + '/' + email;

	try {
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Basic ${encodedCredentials}`
			}
		});
		if (!res.ok) {
			throw new Error('Failed to getuserdocdata');
		}

		const resData = await res.json();
		return JSON.parse(resData);
	} catch (error) {
		return null;
	}
}

export async function toggleClub(userEmail, clubId) {
	const url = SEND_URL + 'toggleclub/' + userEmail + '/' + clubId;
	// SEND_URL = http://127.0.0.1:8000/
	try {
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Basic ${encodedCredentials}`
			}
		});
		if (!res.ok) {
			return 'Failed to toggle club';
		}

		const resData = await res.json();
		console.log(resData);
		return resData;
	} catch (error) {
		return 'Failed to toggle club: ' + error;
	}
}

export async function changeUserRole(email, newRole) {
	const url = SEND_URL + 'changerole';
	try {
		const toSend = {
			email,
			new_role: newRole
		};
		console.log(toSend);
		const res = await fetch(url, {
			method: 'POST',
			headers: { 'Content-type': 'application/json', Authorization: `Basic ${encodedCredentials}` },
			body: JSON.stringify(toSend)
		});
		console.log(res);
	} catch (error) {
		console.log('Error changing role: ' + error);
	}
}

export async function deleteUser(email) {
	const url = SEND_URL + 'deleteuser/' + email;
	try {
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Basic ${encodedCredentials}`
			}
		});
		if (!res.ok) {
			console.log('Failed to fetch url');
		}
		const resData = await res.json();
		console.log(resData);
		return resData;
	} catch (error) {
		console.log('Failed to delete user: ' + error);
	}
}

export async function toggleLeaderMentor(email, leaderMentor, toggle) {
	const toSend = {
		email,
		leader_mentor: leaderMentor,
		toggle
	};
	const url = SEND_URL + 'toggleleadermentor';
	console.log(toSend);
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-type': 'application/json', Authorization: `Basic ${encodedCredentials}` },
		body: JSON.stringify(toSend)
	});
}

export async function confirmMentorMenteeHours(
	confirm,
	catalog_id,
	mentee_email,
	mentor_email,
	mentee_hours,
	mentee_description
) {
	// confirm: int
	// catalog_id: str
	// mentee_email: str
	// mentor_email: str
	// mentee_hours: str
	// mentee_description: str

	const toSend = {
		confirm,
		catalog_id,
		mentee_email,
		mentor_email,
		mentee_hours,
		mentee_description
	};

	console.log(toSend);

	const url = SEND_URL + 'menteeconfirmhours';
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-type': 'application/json', Authorization: `Basic ${encodedCredentials}` },
		body: JSON.stringify(toSend)
	});
	const resData = await res.json();
	console.log(resData);
	return resData;
}

export async function getMentees() {
	const url = SEND_URL + 'getmentees';
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Basic ${encodedCredentials}`
		}
	});
	const resData = await res.json();
	console.log(resData);
	return resData;
}
