<script setup>


import { computed } from "vue";

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

const props = defineProps({
	code: {
		type: String,
		required: true,
	},
});

const requestName = 'getMenuListBySlug_' + props.code;

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const body = {
				code: props.code,
			};

			const response = await Promise.resolve(
					sendApiRequest('menu/getByCode', 'GET', body, requestName, '')
			);

			return response?.data || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value || null);

const sideMenuObj = computed(() => {
	let returnData = [];

	if (fetchedData.value) {
		fetchedData.value.forEach((item) => {
			if (item.group) {
				returnData.push({
					name: item.name,
					icon: item.group_icon,
					group: setMenuElementsArray(item.elements),
				});
			} else {
				returnData = returnData.concat(setMenuElementsArray(item.elements));
			}
		});
	}

	return returnData;
});

const setMenuElementsArray = (elements) => {
	let returnData = [];

	elements.forEach((element) => {
		returnData.push({
			name: element.name,
			path: element.url,
			icon: element.icon,
		});
	});

	return returnData;
}
</script>

<template>
	<ui-SideMenu
			:menu="sideMenuObj"
	/>
</template>
