<script setup>
import { api } from '@/composables/api.js'
const { apiUrl } = api();

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

await useFetch(
		`${apiUrl.value}${props.fetchUrl}`,
		{
			method: 'POST',
			body: {
				arTypes: props.arColumnsTypes,
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
