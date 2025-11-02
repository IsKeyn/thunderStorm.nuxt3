<script setup>
import JoinTheGameForm from '@/modules/boardGame/components/user/JoinTheGameForm.vue';

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { helper } from '@/composables/helper.js'
const { filterByPairFieldValue } = helper();

const eventType = computed(() => {
	return filterByPairFieldValue(boardGameStore.boardGameInfo.settings, 'code', 'type', true);
});
</script>

<template>
	<div>
		<template v-if="eventType">
			<div class="item-box mt-2 mb-2" v-if="eventType.value === 'upon-request'">
				Участие в ивенте по запросам. Отправьте запрос на участие в ивенте и его рассмотрит модератор
			</div>
			<div class="item-box mt-2 mb-2" v-if="eventType.value === 'registrationIsClose'">
				Регистрация в ивенте закрыта
			</div>
		</template>

		<JoinTheGameForm v-if="eventType?.value !== 'registrationIsClose'" />
	</div>
</template>
