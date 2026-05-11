<script setup>
import { computed } from "vue";

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

import { roles } from '@/composables/roles.js';
const { checkPermission } = roles();

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
			const menuElementsArray = setMenuElementsArray(item.elements);

			if (menuElementsArray.length) {
				if (item.group) {
					returnData.push({
						name: item.name,
						icon: item.group_icon,
						group: menuElementsArray,
					});
				} else {
					returnData = returnData.concat(menuElementsArray);
				}
			}
		});
	}

	return returnData;
});

const setMenuElementsArray = (elements) => {
	let returnData = [];

	elements.forEach((element) => {
		let addElement = true;

		if (element?.permissions?.length) {
			const permissionList = [];

			element.permissions.forEach((item) => {
				permissionList.push(item.system_name);
			});

			if (!checkPermission(permissionList)) {
				addElement = false;
			}
		}

		if (addElement) {
			returnData.push({
				name: element.name,
				path: element.url,
				icon: element.icon,
			});
		}
	});

	return returnData;
}
</script>

<template>
	<ui-SideMenu
			:menu="sideMenuObj"
	/>
</template>
