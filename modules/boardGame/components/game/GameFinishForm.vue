<script setup>
import AlertBox from '@/components/notifications/AlertBlock.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';

const emit = defineEmits(['toggleFormVisible', 'updateBoardGameInfo', 'refreshGameList']);

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { validate } from '@/composables/validate.js';
const { validateForm } = validate();

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
	sendApiRequest,
} = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { boardGameLog } from '@/composables/BoardGame/boardGameLog.js'
import { watch } from "vue";
const { setLog } = boardGameLog();

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
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
	doType: {
		type: String,
		default: 'update',
	},
	points: {
		type: Number,
		default: 0,
	},
});

const form = ref({});

if (props.type === 2) {
	// form.value.hourCount = {
	// 	name: 'Затраченное время (в формате 8:40)',
	// 			value: null,
	// 			type: 'text',
	// 			placeholder: 'Время',
	// 			validateRules: 'minLength_1, 10',
	// 			classes: 'mt-1 mb-1',
	// };

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
		// const body = preparedRequestBody(form.value);
		const body = {};

		body.board_game_id = props.boardGameId;
		body.type = props.type;
		body.entity_type = "App\\Models\\Game";
		body.entity_id = props.game.id;
		body.board_game_game_list_id = props.board_game_game_list_id;

		if (props.type === 2) {
			body.hourCount = (form.value.hours.value * 60 + form.value.minuts.value) * 60 + form.value.seconds.value;
		}

		body.comment = form.value.comment.value;

		const response = await sendApiRequest(`board-game/player-game/${props.doType}`, 'POST', body);

		if (response) {
			requestInProgress.value = false;

			if (props.doType === 'update') {
				alert('Теперь мы можете крутить рулетку, для новой игры');
			} else if (props.doType === 'add') {
				alert(`Игра "${props.game.name}" успешно удалена из списка`);
			}

			const logBody = {
				board_game_id: props.boardGameId,
				message: writeLogMessage(),
			};

			setLog(logBody);

			if (props.type === 2) {
				form.value.hours.value = null;
				form.value.minuts.value = null;
				form.value.seconds.value = null;
			}

			form.value.comment.value = null;

			emit('fetchLogs');
			emit('updateBoardGameInfo');
			emit('refreshGameList');
			emit('toggleFormVisible');
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}

const writeLogMessage = () => {
	let message = '';

	switch (props.type) {
		case 0:
			if (props.doType === 'add') {
				message += `отметил игру "${props.game.name}" как текущую`;
			}
			break;

		case 1:
			if (props.doType === 'update') {
					message += `рерольнул игру "${props.game.name}"`;
			} else if (props.doType === 'add') {
				message += `отметил "${props.game.name}" игру как рерольнутую`;
			}
			break;

		case 2:
			if (props.doType === 'update') {
				message += `прошел игру "${props.game.name}"`;
			} else if (props.doType === 'add') {
				message += `отметил игру "${props.game.name}" как пройденную`;
			}
			break;

		case 3:
			if (props.doType === 'update') {
				message += `отдал игру "${props.game.name}"`;
			} else if (props.doType === 'add') {
				message += `отметил игру "${props.game.name}" как отданную`;
			}
			break;
	}

	if (props.type === 2) {
		let time = '';

		if (form.value?.hours?.value || form.value?.minuts?.value || form.value?.seconds?.value) {
			time += form.value?.hours?.value ? form.value.hours.value : '00';
			time += form.value?.minuts?.value ? ':' + form.value.minuts.value : ':00';
			time += form.value?.seconds?.value ? ':' + form.value.seconds.value : ':00';
		}
		message += ` ${time}`;
	}

	if (form.value.comment.value) {
		message += ` и оставил мнение об игре "${form.value.comment.value}"`;
	}

	return message;
}

// Получение времени игры
const { data: requestData, pending: timeRequestInProgress, refresh } = await useAsyncData(
		'getCurrentGameTime',
		async () => {
			let request = `${apiUrl.value}board-game/player-game/get-spend-time`;

			const query = {
				board_game_id: props.boardGameId,
			};

			const sessionCookie = useCookie(sessionCookieName.value);

			try {
				const response = await $fetch(
						request,
						{
							method: 'GET',
							credentials: 'include',
							query,
							headers: {
								Accept: 'application/json',
								Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
								Referer: publicUrl.value,
							}
						},
				);

				return response;
			} catch (e) {
				errorHandler(e);
			}
		},
		{
			server: true, // выполнять только на сервере
			lazy: true, // ждать выполнения запроса перед рендерингом
		}
);

watch(() => requestData.value, (newValue) => {
	if (requestData.value
			&& form.value.hours
			&& form.value.minuts
			&& form.value.seconds
	) {
		form.value.hours.value = Math.floor(requestData.value / 3600);
		form.value.minuts.value = Math.floor((requestData.value % 3600) / 60);
		form.value.seconds.value = requestData.value % 60;
	}
}, { deep: true });
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
		<div
				v-if="userStore.user && Object.keys(userStore.user).length > 0"
		>
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
				<template v-if="type === 1">При рероле игры, вы получите "Тухлый банан" в инвентарь</template>
				<template v-if="type === 2">За прохождение игры, вам будут начислены {{ points }} очков</template>
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
