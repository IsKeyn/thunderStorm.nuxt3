<script setup>
import AlertBox from '@/components/notifications/AlertBlock.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';
import BoardCellInfo from '@/modules/boardGame/components/board/BoardCellInfo.vue';

const emit = defineEmits(['refreshData']);

import { computed } from "vue";

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { userFunctions } from '@/composables/userFunctions.js';
const { isAuth } = userFunctions();

import { bgPlayer } from '@/composables/BoardGame/bgPlayer.js'
const { isActivePlayer, player } = bgPlayer();

import { validate } from '@/composables/validate.js';
const { validateForm } = validate();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { errorHandler } from '@/composables/errorHandler.js';
const { show } = errorHandler();

const props = defineProps({
	eventSlug: {
		type: String,
		default: null,
	},
	element: {
		type: Object,
		default: {},
		required: true,
	},
});

const requestName = 'getBoardCellReviewByCurrentUser';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const response = await Promise.resolve(
					sendApiRequest(
							`board-game/v2/board-cell/get-current-player-review/`,
							'GET',
							{
								slug: route.params.slug,
								board_position_effects_id: props.element.boardPositionEffect.id,
							},
							requestName,
							''
					)
			);

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const review = computed(() => requestData.value?.data || null);
const requestNameForRefresh = 'player_reviews_in_event_' + props.eventSlug + '_' + props.element.boardPositionEffect.id;

const errorsMessages = ref([]);

const sendForm = async () => {
	for (const formKey in form.value) {
		form.value[formKey].validateResult = '';
	}

	const { status, key, validateResult } = validateForm(form.value);

	if (status) {
		await sendRequest();
	} else {
		form.value[key].validateResult = validateResult;
		errorsMessages.value = [validateResult];
	}
}

const sendRequest = async () => {
	requestInProgress.value = true;

	if (
			!props.element?.boardPositionEffect?.id
			|| !props.element?.boardPositionEffect?.model
	) {
		return;
	}

	try {
		const body = {};

		body.slug = route.params.slug;

		body.entity_type = props.element.boardPositionEffect.model;
		body.entity_id = props.element.boardPositionEffect.id;
		body.completion_time_seconds = (form.value.hours.value * 60 + form.value.minuts.value) * 60 + form.value.seconds.value;

		body.comment = form.value.comment.value;

		const response = await sendApiRequest(`board-game/v2/board-cell/set-review/`, 'PUT', body);
		show(response, 'Отправлено', async () => { refresh(); await refreshNuxtData(requestNameForRefresh); });
	} catch (e) {
		error(e);
	}

	requestInProgress.value = false;
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
		validateRules: 'required, minLength_2, maxLength_5000',
		classes: 'w-full mt-1 mb-1 resize-y',
	}
});

const pageState = computed(() => {
	if (
			!props.element?.boardPositionEffect?.id
			|| !props.element?.boardPositionEffect?.model
	) {
		return 'not-enough-data';
	}
	if (requestInProgress.value) return 'loading';
	if (!isAuth.value) return 'no-auth';
	if (!isActivePlayer) return 'not-active';
	if (props.element.position !== player.value.position.position) return 'not-same-position';

	if (boardGameStore.boardGameInfo.status !== 1) return 'event-closed';
	return 'ready';
});
</script>

<template>
	<BoardCellInfo
			v-if="element"
			:effects="[element]"
	/>
	<ui-BigPreloader
			v-if="pageState === 'loading'"
			class="h-full"
			theme="image"
			:themeType="9"
	/>
	<ui-itemBox
			v-else-if="pageState === 'not-enough-data'"
			classes="red"
			message="Не получены данные об элементе"
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
			v-else-if="pageState === 'not-same-position'"
			classes="red"
			message="Вы можете оставлять отзыв только о клетке, на которой вы стоите"
	/>
	<ui-itemBox
			v-else-if="pageState === 'event-closed'"
			classes="red"
			message="Отзывы можно оставлять только во время проведения ивента"
	/>
	<div v-else class="review-section">
		<ui-itemBox
				v-if="review"
				classes="green"
				message="Вы уже оставили отзыв о данной клетке игрового поля"
		/>
		<div v-else>
			<ui-itemBox
					classes="green"
					message="Вы можете оставить отзыв о данной клетке игрового поля, его увидят другие участники ивента"
			/>
			<AlertBox
					:errorsMessages="errorsMessages"
					class="mb-2"
			/>
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
