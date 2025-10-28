<script setup>
import AlertBox from '@/components/notifications/AlertBlock.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';

import { watch } from "vue";

const emit = defineEmits(['toggleFormVisible', 'updateData']);

import { userFunctions } from '@/composables/userFunctions.js';
const { isAuth, userStore } = userFunctions();

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { validate } from '@/composables/validate.js';
const { validateForm } = validate();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const props = defineProps({
	board_game_game_list_id: {
		type: Number,
		default: 1,
	},
	game: {
		type: Object,
		default: {},
	},
	type: {
		type: Number,
		default: 1,
	},
	gameType: { // Тип игры 0 - переданная игра, 1 - ультра-мошна
		type: Number,
		default: null,
	},
	doType: {
		type: String,
		default: 'update',
	},
	points: {
		type: Number,
		default: 0,
	},
	rerolled_points: {
		type: Number,
		default: 0,
	},
	streak: {
		type: Number,
		default: 0,
	},
});

const form = ref({});

if (props.type === 2) {
	form.value.hours = {
		name: 'Часы',
		value: null,
		type: 'number',
		placeholder: '00',
		validateRules: 'minNumber_0, maxNumber_999',
		classes: 'w-[4rem]',
	};

	form.value.minuts = {
		name: 'Минуты',
		value: null,
		type: 'number',
		placeholder: '00',
		validateRules: 'minNumber_0, maxNumber_60',
		classes: 'w-[4rem]',
	};

	form.value.seconds = {
		name: 'Секунды',
		value: null,
		type: 'number',
		placeholder: '00',
		validateRules: 'minNumber_0, maxNumber_60',
		classes: 'w-[4rem]',
	};
}

form.value.comment = {
	name: 'Комментарий',
			value: null,
			type: 'textarea',
			placeholder: '',
			validateRules: 'minLength_2, maxLength_5000',
			classes: 'w-full mt-1 mb-1 resize-y',
};

// Получение времени игры
const timeRequestName = 'getCurrentGameTime';

const {
	data: requestData,
	pending: timeRequestInProgress,
	refresh
} = await useAsyncData(
		timeRequestName,
		async () => {
			const query = {
				slug: route.params.slug,
			};

			const response = await Promise.resolve(
					sendApiRequest('board-game/v2/player-game/get-spend-time', 'GET', query, timeRequestName, '')
			);

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

watch(() => requestData.value, () => {
	if (requestData.value
			&& form.value.hours
			&& form.value.minuts
			&& form.value.seconds
	) {
		form.value.hours.value = Math.floor(requestData.value / 3600);
		form.value.minuts.value = Math.floor((requestData.value % 3600) / 60);
		form.value.seconds.value = requestData.value % 60;
	}
}, { immediate: true });

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

const requestInProgress = ref(false);

const sendRequest = async () => {
	requestInProgress.value = true;

	try {
		const body = {};

		body.slug = route.params.slug;
		body.type = props.type;
		body.entity_type = "App\\Models\\Game";
		body.entity_id = props.game.id;
		body.board_game_game_list_id = props.board_game_game_list_id;

		if (props.type === 2) {
			body.time = (form.value.hours.value * 60 + form.value.minuts.value) * 60 + form.value.seconds.value;
		}

		body.comment = form.value.comment.value;

		const response = await sendApiRequest(`board-game/v2/player-game/${props.doType}`, 'POST', body, 'sendFinishGameRequest', '');

		if (response.error) {
			error(response.error);
		} else if (response) {
			requestInProgress.value = false;

			if (props.doType === 'update') {
				alert(`Игра "${props.game.name}" успешно отмечена как пройденная`, 10000);
			} else if (props.doType === 'add') {
				alert(`Игра "${props.game.name}" успешно удалена из списка`, 10000);
			}

			if (props.type === 2) {
				form.value.hours.value = null;
				form.value.minuts.value = null;
				form.value.seconds.value = null;
			}

			form.value.comment.value = null;

			// Обновляем данные игрока, в данном случае, чтобы обновить очки
			await refreshNuxtData('boardGameCurrentPlayerInfoRequest');

			if (props.type === 2) { // Если игра пройдена переводим игрока на шаг 1
				emit('updateData', 1);
			} else {
				emit('updateData');
			}

			emit('toggleFormVisible');
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}

const pointsForFinishGame = computed(() => {
	let resultPoints = props.points;

	if (props.gameType === 0) {
		resultPoints = resultPoints / 2;
	}

	if (props.streak) {
		resultPoints = Math.round(resultPoints + (resultPoints/100 * (props.streak * 2)));
	}

	return resultPoints;
});
</script>

<template>
	<ui-BigPreloader v-if="timeRequestInProgress" class="h-full" />
	<div v-else class="w-full mt-[1rem]">
		<span>
			<template v-if="type === 1">
				Оставьте свое мнение об игре
			</template>
			<template v-if="type === 2">
				Укажите количество часов, которое вы затратили на прохождение игры и напишите свое мнение об игре
			</template>
		</span>

		<AlertBox
				:errorsMessages="errorsMessages"
				class="mb-2"
		/>
		<div v-if="userStore.user && Object.keys(userStore.user).length > 0">
			<div v-if="type === 2" class="flex">
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

			<div v-if="props.doType === 'update'" class="item-box">
				<template v-if="type === 1">При рероле игры, вы потеряете {{ rerolled_points }} очков, а также накомленный стрик x{{ streak }}</template>
				<template v-if="type === 2">
					За прохождение игры, вам будут начислены {{ pointsForFinishGame }} очков, очки подсчитаны с учетом вашего стрика, который сейчас равен x{{ streak }}
				</template>
				<template v-if="type === 3">Используйте данную кнопку, если передаете игру другому игроку</template>
			</div>
			<div class="flex">
				<button
						class="btn btn-simple-1 w-1/2 mr-[2rem]"
						@click="emit('toggleFormVisible')"
				>Отмена</button>
				<ActionButton
						buttonClasses="btn btn-simple-1 w-1/2"
						buttonName="Отправить"
						:actionInProgress="requestInProgress"
						@startAction="sendForm()"
				/>
			</div>
		</div>
		<div v-else>
			Данный функционал доступен только авторизованному пользователю
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
