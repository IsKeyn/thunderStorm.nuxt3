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
			<layout-InfoBlock
					v-if="eventType.value === 'upon-request'"
					text="Участие в ивенте по запросам. Отправьте запрос на участие в ивенте и его рассмотрит модератор"
					classes="!mb-6"
			/>
			<layout-InfoBlock
					v-if="eventType.value === 'registrationIsClose'"
					text="Регистрация в ивенте закрыта"
					classes="!mb-6"
			/>
		</template>

		<JoinTheGameForm v-if="eventType?.value !== 'registrationIsClose'" />
	</div>
</template>
