<script setup>
import ItemList from '@/modules/boardGame/components/item/ItemList.vue';

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { helper } from '@/composables/helper.js'
const { route } = helper();

const requestInProgress = ref(false);

const debugAddItemToInventory = async (item) => {
	requestInProgress.value = true;

	try {
		const body = {
			slug: route.params.slug,
			itemId: item.id,
		};

		const response = await sendApiRequest('board-game/v2/debug/add-item-to-inventory', 'POST', body);
		requestInProgress.value = false;

		if (response) {
			alert('Предмет добавлен');
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
	<ItemList
		showDebugControlPanel="true"
		@debugAddItemToInventory="debugAddItemToInventory($event)"
	/>
</template>

<style lang="scss" scoped>

</style>
