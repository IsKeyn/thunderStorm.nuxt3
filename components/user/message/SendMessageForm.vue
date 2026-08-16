<script setup>
import AlertBox from '@/components/notifications/AlertBlock.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';

const emit = defineEmits(['fetchMessage', 'isTyping']);

import { watch } from "vue";

import { validate } from '@/composables/validate.js';
const { validateForm } = validate();

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const props = defineProps({
	selectedUserId: {
		type: Number,
		default: null,
	},
	messageTo: {
		type: Number,
		default: null,
	},
});

const form = ref({
	message: {
		name: 'Сообщение',
		value: '',
		type: 'textarea',
		placeholder: 'Сообщение',
		validateRules: 'required, minLength_2, maxLength_4000',
		classes: 'w-full resize-y',
	},
});

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
		const body = preparedRequestBody(form.value);

		body.recipient_user_id = props.selectedUserId;

		const response = await sendApiRequest('auth/message/store', 'POST', body);

		requestInProgress.value = false;

		if (response) {
			form.value.message.value = '';
			alert('Ваше сообщение добавлено');
			emit('fetchMessage', body);
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}

watch(form.value.message, () => {
	if (form.value.message.value) {
		emit('isTyping');
	}
}, { deep: true });
</script>

<template>
	<AlertBox
			:errorsMessages="errorsMessages"
			class="mb-2"
	/>
	<form @submit.prevent="sendForm()">
		<FormGenerator
				v-if="form.message"
				name="message"
				:element="form.message"
				:showTitle="false"
				validateErrorPosition="bottom"
				:showMaxLength="true"
				:fieldClasses="form.message.classes"
		/>
		<ActionButton
				buttonName="Отправить"
				:actionInProgress="requestInProgress"
				@startAction="sendForm()"
		/>
	</form>
</template>

<style lang="scss" scoped />
