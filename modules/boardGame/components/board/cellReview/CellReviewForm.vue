<script setup>
import AlertBox from '@/components/notifications/AlertBlock.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';

import { computed } from "vue";

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { userFunctions } from '@/composables/userFunctions.js';
const { isAuth } = userFunctions();

import { bgPlayer } from '@/composables/BoardGame/bgPlayer.js'
const { isActivePlayer } = bgPlayer();

const requestName = 'getBoardCellReviewByCurrentUser';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (pageState.value === 'ready') {
				// const response = await Promise.resolve(
				// 		sendApiRequest(`board-game/v2/board-cell/get-current-user-review/${route.params.slug}/`, 'GET', {}, requestName, '')
				// );
			}

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const review = computed(() => requestData.value?.data || null);


const sendRequest = async () => {
	requestInProgress.value = true;

	try {
		const body = {};

		body.board_game_id = props.boardGameId;
		body.type = props.type;
		body.entity_type = "App\\Models\\Game";
		body.entity_id = props.game.id;
		body.board_game_game_list_id = props.board_game_game_list_id;

		body.time = (form.value.hours.value * 60 + form.value.minuts.value) * 60 + form.value.seconds.value;

		body.comment = form.value.comment.value;
		//
		// const response = await sendApiRequest(`board-game/player-game/${props.doType}`, 'POST', body);
		//
		// if (response) {
		// 	requestInProgress.value = false;
		//
		// 	if (props.doType === 'update') {
		// 		alert('Теперь мы можете крутить рулетку, для новой игры');
		// 	} else if (props.doType === 'add') {
		// 		alert(`Игра "${props.game.name}" успешно удалена из списка`);
		// 	}
		//
		// 	const logBody = {
		// 		board_game_id: props.boardGameId,
		// 		message: writeLogMessage(),
		// 	};
		//
		// 	setLog(logBody);
		//
		// 	if (props.type === 2) {
		// 		form.value.hours.value = null;
		// 		form.value.minuts.value = null;
		// 		form.value.seconds.value = null;
		// 	}
		//
		// 	form.value.comment.value = null;
		//
		// 	emit('fetchLogs');
		// 	emit('updateBoardGameInfo');
		// 	emit('refreshGameList');
		// 	emit('toggleFormVisible');
		// }
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}

const form = ref({
	hours: {
		name: 'Часы',
		value: null,
		type: 'number',
		placeholder: '00',
		validateRules: 'minNumber_0, maxNumber_999',
		classes: 'w-[4rem]',
	},
	minuts: {
		name: 'Минуты',
		value: null,
		type: 'number',
		placeholder: '00',
		validateRules: 'minNumber_0, maxNumber_60',
		classes: 'w-[4rem]',
	},
	seconds: {
		name: 'Секунды',
		value: null,
		type: 'number',
		placeholder: '00',
		validateRules: 'minNumber_0, maxNumber_60',
		classes: 'w-[4rem]',
	},
	comment: {
		name: 'Комментарий',
		value: null,
		type: 'textarea',
		placeholder: '',
		validateRules: 'minLength_2, maxLength_5000',
		classes: 'w-full mt-1 mb-1 resize-y',
	}
});

const pageState = computed(() => {
	if (requestInProgress.value) return 'loading';
	if (!isAuth.value) return 'no-auth';
	if (!isActivePlayer) return 'not-active';
	if (boardGameStore.boardGameInfo.status !== 1) return 'event-closed';
	return 'ready';
});
</script>

<template>
	<ui-BigPreloader
			v-if="pageState === 'loading'"
			class="h-full"
			theme="image"
			:themeType="9"
	/>
	<ui-itemBox
			v-else-if="pageState === 'no-auth'"
			classes="red"
			message="Только авторизованные пользователи могут оставлять отзывы"
	/>
	<ui-itemBox
			v-else-if="pageState === 'not-active'"
			classes="red"
			message="Только активные участники ивента могут оставлять отзывы"
	/>
	<ui-itemBox
			v-else-if="pageState === 'event-closed'"
			classes="red"
			message="Отзывы можно оставлять только во время проведения ивента"
	/>
	<div v-else class="review-section">
		<div v-if="review">текущее сообщение</div>
		<div v-else>
<!--			<AlertBox-->
<!--					:errorsMessages="errorsMessages"-->
<!--					class="mb-2"-->
<!--			/>-->

			<div class="flex">
				<FormGenerator
						name="hours"
						:element="form.hours"
						validateErrorPosition="bottom"
						labelClasses="lg:mr-4 mt-[10px] mb-[10px] block"
						:fieldClasses="form.hours.classes"
				/>

				<FormGenerator
						name="minuts"
						:element="form.minuts"
						validateErrorPosition="bottom"
						labelClasses="lg:mr-4 mt-[10px] mb-[10px] block"
						:fieldClasses="form.minuts.classes"
				/>

				<FormGenerator
						name="seconds"
						:element="form.seconds"
						validateErrorPosition="bottom"
						labelClasses="lg:mr-4 mt-[10px] mb-[10px] block"
						:fieldClasses="form.seconds.classes"
				/>
			</div>

			<FormGenerator
					name="comment"
					:element="form.comment"
					validateErrorPosition="bottom"
					labelClasses="lg:mr-4 mt-[10px] mb-[10px] !mr-0 block"
					:fieldClasses="form.comment.classes"
					:showMaxLength="true"
			/>

			<ActionButton
					buttonClasses="btn btn-simple-1 w-1/2"
					buttonName="Отправить"
					:actionInProgress="requestInProgress"
					@startAction="sendForm()"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped />
