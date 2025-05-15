<script setup>
import AlertBox from '@/components/notifications/AlertBlock.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { validate } from '@/composables/validate.js';
const { validateForm } = validate();

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { boardGameLog } from '@/composables/BoardGame/boardGameLog.js'
const { setLog } = boardGameLog();

import { onMounted, watch } from "vue";

const emit = defineEmits(['updateBoardGameInfo', 'fetchLogs']);

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
	boardGameInfo: {
		type: Object,
		default: {},
	},
});

const form = ref(
		{
			points: {
				name: 'Очки',
				value: null,
				type: 'number',
				placeholder: 'Количество очков',
				validateRules: 'required, minLength_2, maxLength_50',
				classes: 'w-[100px]',
			},
		},
);

onMounted(() => {
	setPoints();
});

const points = ref(null);

const setPoints = () => {
	const player = props.boardGameInfo.players.filter((item) => {
		if (item.user.id === userStore.user.id) {
			return true;
		} else {
			return false;
		}
	});

	if (player.length > 0) {
		points.value = player[0].points;
	}
}

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
	points.value = points.value + form.value.points.value;

	try {
		// const body = preparedRequestBody(form.value);
		const body = {};

		body.board_game_id = props.boardGameId;
		body.points = points.value;

		const response = await sendApiRequest('board-game/player/updatedPoints', 'POST', body);

		if (response) {
			requestInProgress.value = false;

			alert('Ваши очки обновлены');

			const logBody = {
				board_game_id: props.boardGameId,
				message: `обновил количество очков на "${form.value.points.value}"`
			};
			setLog(logBody);

			form.value.points.value = null;
			emit('fetchLogs');
			emit('updateBoardGameInfo');
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}

watch(() => props.boardGameInfo.players, () => {
	setPoints();
}, { deep: true });

const buttonName = computed(() => {
	if (form.value.points.value === 0 || form.value.points.value === null) {
		return 'Обновить';
	} else if (form.value.points.value > 0) {
		return 'Добавить';
	} else {
		return 'Отнять';
	}
});
</script>

<template>
	<span class="user-interface-title">Очки: {{ points }}</span>
	<div class="text-center mb-2">
		<span class="block">Впишите число, для добавления</span>
		<span class="block">Впишите число со знаком "-", для уменьшения</span>
	</div>
	<AlertBox
			:errorsMessages="errorsMessages"
			class="mb-2"
	/>
	<div
			v-if="userStore.user && Object.keys(userStore.user).length > 0"
			class="wrapper points-form"
	>
		<FormGenerator
				v-if="form.points"
				name="name"
				class="w-1/2"
				:element="form.points"
				:showTitle="false"
				validateErrorPosition="bottom"
				labelClasses="mr-4 mt-[10px] mb-[10px]"
				:fieldClasses="form.points.classes"
		/>
		<ActionButton
				buttonClasses="btn btn-simple-1 w-1/2"
				:buttonName="buttonName"
				:actionInProgress="requestInProgress"
				@startAction="sendForm()"
		/>
	</div>
	<div v-else>
		Данный функционал доступен только авторизованному пользователю
	</div>
</template>

<style lang="scss" scoped>
.wrapper {
	@apply flex mb-[1rem] justify-center;
}
</style>

<style lang="scss">
.points-form {
	input {
		@apply w-full;
	}
}
</style>
