const SEND_URL = import.meta.env.VITE_REDIS_URL;
const username = import.meta.env.VITE_AUTH_USERNAME;
const password = import.meta.env.VITE_AUTH_PASSWORD;
const encodedCredentials = btoa(`${username}:${password}`); // Base64 encode

import { retrieveCollectionInfo, retrieveUserInfo } from '$lib/cache';

export async function createClub(
	advisor_email,
	clubDays,
	club_description,
	club_name,
	president_email,
	room_number,
	gClassLink,
	start_time,
	status,
	vicePresidentsEmails
) {
	let club_days = [];
	let vice_president_emails = [];

	club_days.push(clubDays);
	vice_president_emails.push(vicePresidentsEmails);

	const secret_password = Math.floor(10000 + Math.random() * 90000);
	console.log(secret_password);

	const toSend = {
		advisor_email: advisor_email,
		club_days: clubDays,
		club_description: club_description,
		club_name: club_name,
		president_email: president_email,
		room_number: room_number,
		google_classroom_link: gClassLink,
		secret_password: secret_password,
		start_time: start_time,
		status: status,
		vice_president_emails: vicePresidentsEmails
	}; // Make sure the values here match the ORDER and NAME that is expected in the Python class!

	console.log(toSend);

	try {
		const url = SEND_URL + 'createclub/';
		const res = await fetch(url, {
			method: 'POST',
			headers: { 'Content-type': 'application/json', Authorization: `Basic ${encodedCredentials}` },
			body: JSON.stringify(toSend)
		});
		const resData = await res.json();
		const status = resData['status'];
		console.log(resData);
		console.log(status);
		// have to read the value of status and determine whether or not to proceed:
		if (status === -16) {
			return resData['error_message'];
		}

		console.log('Successfully retrieved message: ' + status);
		// location.reload(); // Change later, etc.
		return status;
	} catch (error) {
		console.log('Error: ' + error);
		return -1;
	} finally {
		await retrieveCollectionInfo('Clubs');
		await retrieveUserInfo();
	}
}

export async function editClub(
	advisor_email,
	clubDays,
	club_description,
	club_name,
	president_email,
	room_number,
	gClassLink,
	start_time,
	status,
	vicePresidentsEmails,
	secret_password
) {
	let club_days = [];
	let vice_presidents_emails = [];

	club_days.push(clubDays);
	vice_presidents_emails.push(vicePresidentsEmails);

	secret_password = parseInt(secret_password, 10);

	const toSend = {
		advisor_email: advisor_email,
		club_days: clubDays,
		club_description: club_description,
		club_name: club_name,
		president_email: president_email,
		room_number: room_number,
		google_classroom_link: gClassLink,
		secret_password: secret_password,
		start_time: start_time,
		status: status,
		vice_president_emails: vicePresidentsEmails
	};

	console.log(toSend);

	try {
		const url = SEND_URL + 'updateclub/';
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
	} finally {
		await retrieveCollectionInfo('Clubs');
		// updateCache("clubsInfo", all_clubs);
		await retrieveUserInfo();
	}
}

export async function changeStatus(secret_password, status) {
	if (status.localeCompare('Pending') === 0) {
		status = 'Approved';
	} else if (status.localeCompare('Approved') === 0) {
		status = 'Pending';
	}

	secret_password = parseInt(secret_password, 10);

	const toSend = {
		secret_password: secret_password,
		status: status
	};

	console.log(toSend);

	try {
		const url = SEND_URL + 'changestatus/';
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

export async function deleteClub(clubId) {
	const url = SEND_URL + 'deleteclub/' + clubId;
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
		console.log('Failed to delete club: ' + error);
	} finally {
		await retrieveCollectionInfo('Clubs');
		await retrieveUserInfo();
	}
}

export async function verifyClub(secret_password) {
	const url = SEND_URL + 'verifyclub/';
	const toSend = { secret_password };
	try {
		const res = await fetch(url, {
			method: 'POST',
			headers: { 'Content-type': 'application/json', Authorization: `Basic ${encodedCredentials}` },
			body: JSON.stringify(toSend)
		});
		if (!res.ok) {
			console.log('Verification failed');
			return false;
		}
		const resData = await res.json();
		console.log(resData);
		return resData;
	} catch (error) {
		console.log('Verification failed: ' + error);
		return false;
	}
}

export async function UploadClubImage(file) {
	let formData = new FormData();
	formData.append('file', file);
	console.log(formData);

	try {
		let url = SEND_URL + 'uploadclubimage/';
		let response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Basic ${encodedCredentials}`
			},
			body: formData
		});

		let resData = await response.json();
		console.log(resData);
		const imgUrl = resData['status'];
		return imgUrl;

		// if (data.image_url) {
		//     imageUrl = data.image_url;
		// }
	} catch (error) {
		console.log('error uploading club img: ' + error);
		return false;
	}
}

export async function setClubImg(imgUrl, clubId, oldId) {
	const toSend = {
		img_url: imgUrl,
		club_id: clubId,
		old_id: oldId
	};

	// try {
	const url = SEND_URL + 'setclubimg';
	let response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-type': 'application/json', Authorization: `Basic ${encodedCredentials}` },
		body: JSON.stringify(toSend)
	});
	return response;
	// }
}
