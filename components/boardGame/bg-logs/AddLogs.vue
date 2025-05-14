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

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
});

const form = ref(
		{
			message: {
				name: 'Сообщение',
				value: '',
				type: 'textarea',
				placeholder: 'Текст, добавляемый в лог',
				validateRules: 'required, minLength_2, maxLength_500',
				classes: 'min-w-[30%]',
			},
		},
);

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
const emit = defineEmits(['fetchLogs']);

const sendRequest = async () => {
	requestInProgress.value = true;

	try {
		const body = preparedRequestBody(form.value);

		body.board_game_id = props.boardGameId;

		const response = await sendApiRequest('board-game/log/add', 'POST', body);

		if (response) {
			requestInProgress.value = false;

			form.value.message.value = '';
			alert('Ваше сообщение добавлено');
			emit('fetchLogs');
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
	<div
			v-if="userStore.user && Object.keys(userStore.user).length > 0"
			class="wrapper"
	>
		<AlertBox
				:errorsMessages="errorsMessages"
				class="mb-2"
		/>
		<FormGenerator
				v-if="form.message"
				name="name"
				:element="form.message"
				:showTitle="false"
				validateErrorPosition="bottom"
				labelClasses="mr-4 mt-[10px] mb-[10px]"
				:fieldClasses="form.message.classes"
		/>
		<div class="text-center">
			<ActionButton
					buttonName="Добавить"
					:actionInProgress="requestInProgress"
					@startAction="sendForm()"
			/>
		</div>
	</div>
	<div v-else>
		Данный функционал доступен только авторизованному пользователю
	</div>
</template>

<style lang="scss" scoped>
.wrapper {
	@apply mb-[1rem];
}
</style>
