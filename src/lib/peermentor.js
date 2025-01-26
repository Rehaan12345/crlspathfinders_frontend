const SEND_URL = import.meta.env.VITE_REDIS_URL;
const username = import.meta.env.VITE_AUTH_USERNAME;
const password = import.meta.env.VITE_AUTH_PASSWORD;
const encodedCredentials = btoa(`${username}:${password}`); // Base64 encode

export async function addLink(linkname, linkurl, categories, bio, deadline) {
	const url = SEND_URL + 'addlink/';

	const toSend = {
		link_name: linkname,
		link_url: linkurl,
		categories,
		bio,
		deadline
	};

	try {
		const res = await fetch(url, {
			method: 'POST',
			headers: { 'Content-type': 'application/json', Authorization: `Basic ${encodedCredentials}` },
			body: JSON.stringify(toSend)
		});
		console.log(res);
		return 'Success';
	} catch (error) {
		console.log('Failed to create add link: ' + error);
	}
}

export async function deleteLink(linkName) {
	const url = SEND_URL + 'deletelink/' + linkName;

	try {
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Basic ${encodedCredentials}`
			}
		});
		const resResponse = await res.json();
		console.log(resResponse);
		return 'Success';
	} catch (error) {
		console.log('Failed to delete link: ' + error);
	}
}

export async function editLink(oldName, newName, newUrl, categories, bio, deadline) {
	const url = SEND_URL + 'editlink/';

	const toSend = {
		old_name: oldName,
		new_name: newName,
		new_url: newUrl,
		categories,
		bio,
		deadline
	};

	console.log(toSend);

	try {
		const res = await fetch(url, {
			method: 'POST',
			headers: { 'Content-type': 'application/json', Authorization: `Basic ${encodedCredentials}` },
			body: JSON.stringify(toSend)
		});
		console.log(res);
		return 'Success';
	} catch (error) {
		console.log('Failed to edit link: ' + error);
	}
}

export function makeSelectCategoriesOk(categories) {
	let result = [];
	for (let i = 0; i < categories.length; i++) {
		const currCat = { value: categories[i], name: categories[i], catId: i };
		result.push(currCat);
	}
	return result;
}

export async function editCategories(oldCatName, newCatName) {
	const url = SEND_URL + 'editcategory';

	const toSend = {
		old_cat_name: oldCatName,
		new_cat_name: newCatName
	};

	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-type': 'application/json', Authorization: `Basic ${encodedCredentials}` },
		body: JSON.stringify(toSend)
	});
}

export async function addCategory(newCat) {
	const url = SEND_URL + 'addcategory';

	const toSend = {
		new_cat: newCat
	};

	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-type': 'application/json', Authorization: `Basic ${encodedCredentials}` },
		body: JSON.stringify(toSend)
	});
}

export async function deleteCategory(catName) {
	const url = SEND_URL + 'deletecategory';

	const toSend = {
		new_cat: catName
	};

	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-type': 'application/json', Authorization: `Basic ${encodedCredentials}` },
		body: JSON.stringify(toSend)
	});
}
