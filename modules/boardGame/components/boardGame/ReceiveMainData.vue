<script setup>
import { computed } from "vue";

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { useTwitchStore } from '@/stores/twitch';
const twitchStore = useTwitchStore();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { helper } from '@/composables/helper.js'
const { route } = helper();

const requestName = 'get_bg_layout_data_' + route.params.slug;

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const query = {
				slug: route.params.slug,
			};

			const requestUrl = 'board-game/v2/layout/get';

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
		if (newData.twitchOnline) {
			twitchStore.streamersOnline = newData.twitchOnline;
		}
		//
		// if (newData.settings) {
		// 	settingStore.settings = newData.settings;
		// }
	}
}, { immediate: true })
</script>

<template />

<style lang="scss" scoped />
