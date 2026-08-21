<script setup>
import StatusEffectList from '@/modules/boardGame/components/statusEffect/StatusEffectList.vue';

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { helper } from '@/composables/helper.js'
const { route } = helper();

const requestInProgress = ref(false);

const debugSetStatusEffect = async (item) => {
	requestInProgress.value = true;

	try {
		const body = {
			slug: route.params.slug,
			itemId: item.statusEffectBind.id,
		};

		const response = await sendApiRequest('board-game/v2/debug/set-status-effect-on-player', 'POST', body, `setStatusEffect`, 'fullscreenTransparent');
		requestInProgress.value = false;

		if (response) {
			alert('Статус эффект наложен');
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
	<StatusEffectList
			showDebugControlPanel="true"
			@debugSetStatusEffect="debugSetStatusEffect($event)"
	/>
</template>

<style lang="scss" scoped>

</style>
