<script setup>
import { useUserStore } from '@/stores/user';
import { api } from '@/composables/api.js'

const userStore = useUserStore();
const { apiUrl } = api();

const Authorization = useCookie('Authorization');

await useFetch(
		`${apiUrl.value}auth/user`,
		{
			method: 'GET',
			headers: {
				Authorization,
				Accept: 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
			},
			onResponse({ response}) {
				if (response.status === 200) {
					userStore.user = response._data;
				}
			},
		},
);
</script>

<template>
	<div />
</template>
