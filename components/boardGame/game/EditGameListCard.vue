<script setup>
import GameFinishForm from '@/components/boardGame/game/GameFinishForm.vue';

const emit = defineEmits(['updateBoardGameInfo', 'refreshGameList']);

import { date } from '@/composables/date.js';
const {
	getFormattedDate
} = date();

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
	item: {
		type: Object,
		default: {},
	},
});

const type = ref(null);

const step = ref(1);
const errors = ref([]);

const initEdit = () => {
	errors.value = [];

	if (type.value === null) {
		errors.value.push('Необходимо выбрать тип действия');
	} else {
		changeStep(2);
	}
}

const changeStep = (stepValue) => {
	step.value = stepValue;
}
</script>

<template>
	<div class="item-box">
		<div class="item-element">
			<div>{{ item.game.name }} <span v-if="item.platform">({{ item.platform.name }})</span> <span  v-if="item.game?.release_dates[0]?.date">({{ getFormattedDate('Y', item.game.release_dates[0].date) }})</span></div>
			<div v-if="step === 1">
			<span
					class="error"
					v-for="error in errors"
			>{{ error }}</span>
				<select v-model="type">
					<option :value="null">Не выбрано</option>
					<option :value="1">Рерольнул</option>
					<option :value="2">Прошел</option>
					<option :value="3">Отдал</option>
					<option :value="0">Текущая</option>
				</select>
				<button class="btn btn-simple-1" @click="initEdit()">Выбрать</button>
			</div>
		</div>

		<GameFinishForm
				v-if="step === 2"
				:boardGameId="boardGameId"
				:game="item.game"
				:board_game_game_list_id="item.id"
				:type="type"
				doType="add"
				@toggleFormVisible="changeStep(1)"
				@refreshGameList="emit('refreshGameList')"
				@updateBoardGameInfo="emit('updateBoardGameInfo')"
		/>
	</div>
</template>


<style lang="scss" scoped>
.error {
	@apply block;
}

.item-box {
	@apply block;

	.item-element {
		@apply block lg:flex justify-between items-center;
	}
}

select {
	@apply pb-[8px] pt-[8px] pr-[8px] pl-[8px] border-none;
}
</style>
