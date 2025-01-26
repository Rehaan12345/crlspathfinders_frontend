<script>
	import { user } from '../stores/auth';
	import { get } from 'svelte/store';

	let message = '';

	async function fetchProtectedData() {
		const userObj = get(user);
		if (userObj) {
			const token = await userObj.getIdToken();
			const response = await fetch('http://127.0.0.1:8000/protected', {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			const data = await response.json();
			console.log(data);
			message = data.message;
		}
	}

	fetchProtectedData();
</script>

<p>{message}</p>
