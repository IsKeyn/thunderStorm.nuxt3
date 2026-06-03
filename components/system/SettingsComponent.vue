<script setup>
// TODO легаси код, удалить компонент, когда он не будет нигде использоваться

import { useSettingsStore } from '@/stores/settings';
const settingStore = useSettingsStore();

import { api } from '@/composables/api.js'
const { apiUrl } = api();

const Authorization = useCookie('Authorization');

await useFetch(
		`${apiUrl.value}site-settings/get`,
		{
			headers: {
				Authorization: Authorization.value,
				Accept: 'application/json',
				'X-Requested-With': 'XMLHttpRequest',
			},
			onResponse({response}) {
				if (response.status === 200) {
					settingStore.settings = response._data.data;
				}
			},
		},
);
</script>

<template/>
