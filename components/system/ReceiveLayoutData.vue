<script setup>
import { computed } from "vue";

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { useSettingsStore } from '@/stores/settings';
const settingStore = useSettingsStore();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

const requestName = 'get_layout_data';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const query = {};

			const requestUrl = 'layout/get';

			const response = await Promise.resolve(
					sendApiRequest(requestUrl, 'GET', query, requestName, '')
			);

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value || null);

watch(() => requestData.value, (newData) => {
	if (newData) {
		if (newData.user) {
			userStore.user = newData.user;
		}

		if (newData.settings) {
			settingStore.settings = newData.settings;
		}
	}
}, { immediate: true })
</script>

<template />
