const SEND_URL = import.meta.env.VITE_URL;
const username = import.meta.env.VITE_AUTH_USERNAME;
const password = import.meta.env.VITE_AUTH_PASSWORD;
const encodedCredentials = btoa(`${username}:${password}`); // Base64 encode

export async function getLibraryInfo() {
	const url = SEND_URL + 'getlibraryinfo/';
	const res = await fetch(url, {
		method: 'GET',
		headers: { 'Content-type': 'application/json', Authorization: `Basic ${encodedCredentials}` }
	});
	const resData = await res.json();
	if (resData.status == 0) {
		return resData.data;
	} else {
		return resData.error_message;
	}
}
