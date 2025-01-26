<script>
	import { Section } from 'flowbite-svelte-blocks';
	import RegisterForm from './RegisterForm.svelte';

	let view = 'Register';
</script>

<Section name="crudcreateform">
	<RegisterForm {view}></RegisterForm>
</Section>
