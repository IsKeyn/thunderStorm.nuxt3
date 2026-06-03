<script setup>
// TODO легаси код, удалить компонент, когда он не будет нигде использоваться

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { api } from '@/composables/api.js'
const { apiUrl, publicUrl, sessionCookieName } = api();

const sessionCookie = useCookie(sessionCookieName.value);

await useFetch(
		`${apiUrl.value}auth/user`,
		{
			headers: {
				Accept: 'application/json',
				Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
				Referer: publicUrl.value,
			},
			onResponse({response}) {
				if (response.status === 200) {
					userStore.user = response._data.data;
				}
			},
		},
);
</script>

<template />
