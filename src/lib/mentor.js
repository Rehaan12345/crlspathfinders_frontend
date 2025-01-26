const SEND_URL = import.meta.env.VITE_REDIS_URL;
const username = import.meta.env.VITE_AUTH_USERNAME;
const password = import.meta.env.VITE_AUTH_PASSWORD;
const encodedCredentials = btoa(`${username}:${password}`); // Base64 encode

export let listRaces = [];

export let listReligions = [];

export let listGenders = [];

export let listLanguages = [];

export let listAcademics = [];

export let races = [
	{ value: 'Asian / South Asian', name: 'Asian / South Asian' },
	{ value: 'Black', name: 'Black' },
	{ value: 'Hispanic', name: 'Hispanic' },
	{ value: 'White', name: 'White' },
	{ value: 'Arab', name: 'Arab' }
];

export let religions = [
	{ value: 'Muslim', name: 'Muslim' },
	{ value: 'Jewish', name: 'Jewish' },
	{ value: 'Hindu', name: 'Hindu' },
	{ value: 'Buddhist', name: 'Buddhist' },
	{ value: 'Atheist', name: 'Atheist' },
	{ value: 'Christian', name: 'Christian' }
];

export let genders = [
	{ value: 'Male', name: 'Male' },
	{ value: 'Female', name: 'Female' },
	{ value: 'Non-binary', name: 'Non-binary' }
];

export let languages = [
	{ value: 'Amharic', name: 'Amharic' },
	{ value: 'Bangla', name: 'Bangla' },
	{ value: 'Spanish', name: 'Spanish' },
	{ value: 'Hindi', name: 'Hindi' },
	{ value: 'Portuguese', name: 'Portuguese' },
	{ value: 'Chinese', name: 'Chinese' },
	{ value: 'Korean', name: 'Korean ' },
	{ value: 'Japanese', name: 'Japanese' }
];

export let academics = [
	{ value: 'English', name: 'English' },
	{ value: 'History', name: 'History' },
	{ value: 'Chemistry', name: 'Chemistry' },
	{ value: 'Math', name: 'Math' },
	{ value: 'Physics', name: 'Physics' },
	{ value: 'Biology', name: 'Biology' },
	{ value: 'Computer Science', name: 'Computer Science' }
];

export async function createMentor(
	firstName,
	lastName,
	bio,
	email,
	races,
	religions,
	gender,
	languages,
	academics
) {
	const toSend = {
		firstname: firstName,
		lastname: lastName,
		bio,
		email: email,
		races: races,
		religions: religions,
		gender: gender,
		languages: languages,
		academics: academics
	}; // Make sure the values here match the ORDER and NAME that is expected in the Python class!

	console.log(toSend);

	try {
		const url = SEND_URL + 'creatementor/';
		const res = await fetch(url, {
			method: 'POST',
			headers: { 'Content-type': 'application/json', Authorization: `Basic ${encodedCredentials}` },
			body: JSON.stringify(toSend)
		});
		const resData = await res.json();
		const status = resData['status'];
		console.log('Successfully retrieved message: ' + status);
		// location.reload(); // Change later, etc.
		return status;
	} catch (error) {
		console.log('Error: ' + error);
		return -1;
	}
}

export async function editMentor(
	firstName,
	lastName,
	bio,
	email,
	races,
	religions,
	gender,
	languages,
	academics
) {
	// races = races.split(",");
	// religions = religions.split(",");
	// gender = gender.split(",");
	// languages = languages.split(",");
	// academics = academics.split(",");

	const toSend = {
		firstname: firstName,
		lastname: lastName,
		bio,
		email: email,
		races: races,
		religions: religions,
		gender: gender,
		languages: languages,
		academics: academics
	}; // Make sure the values here match the ORDER and NAME that is expected in the Python class!

	console.log(toSend);

	try {
		const url = SEND_URL + 'updatementor/';
		const res = await fetch(url, {
			method: 'POST',
			headers: { 'Content-type': 'application/json', Authorization: `Basic ${encodedCredentials}` },
			body: JSON.stringify(toSend)
		});
		const resData = await res.json();
		const status = resData['status'];
		console.log('Successfully retrieved message: ' + status);
		// location.reload(); // Change later, etc.
		return status;
	} catch (error) {
		console.log('Error: ' + error);
		return -1;
	}
}

export async function deleteMentor(email) {
	const url = SEND_URL + 'deletementor/' + email;
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
		console.log('Failed to delete mentor: ' + error);
	}
}

// Make a function that just sends the name of the old file to the backend for deletion (can copy format of uploadMentorImage)

export async function UploadMentorImage(file, oldFileName) {
	let formData = new FormData();
	formData.append('file', file);
	formData.append('old_file_name', oldFileName);
	console.log(formData);

	try {
		let url = SEND_URL + 'uploadmentorimage/';
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
	} catch (error) {
		console.log('error uploading mentor img: ' + error);
		return false;
	}
}

export async function SetMentorImage(imgUrl, mentorEmail) {
	const toSend = {
		img_url: imgUrl,
		mentor_email: mentorEmail
	};
	console.log(toSend);

	// try {
	const url = SEND_URL + 'setmentorimg/';
	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-type': 'application/json', Authorization: `Basic ${encodedCredentials}` },
		body: JSON.stringify(toSend)
	});
	return response;
	// }
}

export async function sendMentorPitch(email, pitch) {
	const toSend = {
		mentor_email: email,
		pitch
	};
	console.log(toSend);

	const url = SEND_URL + 'sendmentorpitch/';
	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-type': 'application/json', Authorization: `Basic ${encodedCredentials}` },
		body: JSON.stringify(toSend)
	});
	console.log(response);
	return response;
}

export async function retrieveDemographics() {
	const url = SEND_URL + 'read/AllInfo/demographics';
	try {
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Basic ${encodedCredentials}`
			}
		});
		const wholeRes = await res.json();
		console.log(wholeRes);
		console.log('OK');
		console.log(JSON.parse(wholeRes.collid));
		const newDems = JSON.parse(wholeRes.collid);
		console.log('OK');
		listAcademics = newDems.academics;
		listLanguages = newDems.languages;
		listGenders = newDems.genders;
		listReligions = newDems.religions;
		listRaces = newDems.races;
		return newDems;
	} catch (error) {
		console.log('Error retrieving demographics: ' + error);
		return -1;
	}
}

export async function sendMentorMenteeLogs(mentorEmail, menteeEmail, logDescription, logHours) {
	const toSend = {
		mentor_email: mentorEmail,
		mentee_email: menteeEmail,
		log_description: logDescription,
		log_hours: logHours
	};

	console.log(toSend);

	const url = SEND_URL + 'mentormenteelogs/';
	const response = await fetch(url, {
		method: 'POST',
		headers: { 'Content-type': 'application/json', Authorization: `Basic ${encodedCredentials}` },
		body: JSON.stringify(toSend)
	});

	console.log(response);
	return response;
}

export async function toggleMentorShow(mentor_email) {
	const url = SEND_URL + 'toggleshowmentor/' + mentor_email;
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Basic ${encodedCredentials}`
		}
	});
	const resData = await response.json();
	console.log(resData);
}
