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

// : 'Bearer 3|b4WyeVmQQP3V1NYFbcYCOvqi8AS0Tda4LXU6Azfl'
</script>

<template>
	<div>
		Тут должны юыть данные:
		{{ userStore.user }}
	</div>
</template>
