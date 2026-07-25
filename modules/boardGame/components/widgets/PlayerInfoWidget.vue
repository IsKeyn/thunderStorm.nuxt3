<script setup>
import PlayerInfoObs from '@/modules/boardGame/components/widgets/PlayerInfoObs.vue';
import Settings from '@/modules/boardGame/components/widgets/Settings.vue';

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { api } from '@/composables/api.js';
const { sendApiRequest, publicUrl } = api();

import { notifications } from '@/composables/notifications.js';
const { alert } = notifications();

const copyObsLink = () => {
	const text = `${window.location.protocol}//${publicUrl.value}/obs/widget/?player_id=${userStore.player.id}`;

	navigator.clipboard.writeText(text)
			.then(() => {
				alert('Ссылка для OBS скопирована в буфер обмена');
			})
			.catch(err => {
				alert('Ошибка копирования:', err);
			});
}
</script>

<template>
	<div class="grid grid-cols-2">
		<PlayerInfoObs
				:player_id="userStore.player.id"
				:setTheme="false"
		/>
		<Settings />
	</div>
	<button
			@click="copyObsLink()"
			class="btn btn-simple-1 w-full"
	>
		Скопировать OBS ссылку
	</button>
</template>

<style lang="scss" scoped>

</style>
