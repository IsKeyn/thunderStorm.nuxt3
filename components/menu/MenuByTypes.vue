<script setup>
import { api } from '@/composables/api.js'
const {
	apiUrl,
	getCsrfCookie
} = api();

const props = defineProps({
	fetchUrl: {
		type: String,
		default: 'menu/get',
	},
	parentClass: {
		type: String,
		default: 'menu-block',
	},
	showTitles: {
		type: Boolean,
		default: false,
	},
	arColumnsTypes: {
		type: Array,
		default: [
			'footer_column_1',
			'footer_column_2',
			'footer_column_3',
			'footer_column_4'
		]
	},
});

const menuElements = ref();

const csrfCookie = await getCsrfCookie();

await useFetch(
		`${apiUrl.value}${props.fetchUrl}`,
		{
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
			query: {
				arTypes: JSON.stringify(props.arColumnsTypes),
			},
			onResponse({response}) {
				if (response.status === 200) {
					menuElements.value = response._data.data;
				}
			},
		},
);
</script>

<template>
	<MenuColumns
			:menuElements="menuElements"
			:showTitles="showTitles"
			:parentClass="parentClass"
	/>
</template>
