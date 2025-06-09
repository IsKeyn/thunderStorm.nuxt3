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

import { onMounted } from "vue";

const form = ref(
		{
			twitch: {
				name: 'Ссылка Twitch канал',
				value: '',
				type: 'text',
				placeholder: 'Twitch канал',
				validateRules: 'required, minLength_2, maxLength_50',
				classes: 'w-full',
			},
		},
);

onMounted(() => {
	setValue();
});

const setValue = () => {
	form.value.twitch.value = twitch.value.value;
}

const twitch = computed(() => {
	if (userStore && userStore.user && userStore.user.additional_fields) {
		const twitchField = userStore.user.additional_fields.filter((item) => item.slug === 'twitch_channel');

		if (twitchField.length > 0 && twitchField[0]) {
			return twitchField[0];
		}
	}

	return false;
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
		const preparedFormData = preparedRequestBody(form.value);

		const body = {
			additional_fields: [
				{
					name: 'Twitch канал',
					slug: 'twitch_channel',
					value: preparedFormData.twitch,
					sort: 100,
				}
			],
		};

		if (twitch.value) {
			body.additional_fields.id = twitch.value.id;
		}

		const response = await sendApiRequest('auth/update-profile', 'POST', body);

		if (response) {
			requestInProgress.value = false;

			alert('Ссылка на Ваш twitch канал обновлена');
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
				v-if="form.twitch"
				name="name"
				:element="form.twitch"
				:showTitle="false"
				validateErrorPosition="bottom"
				labelClasses="mr-4 mt-[10px] mb-[10px]"
				:fieldClasses="form.twitch.classes"
		/>
		<ActionButton
				buttonName="Обновить"
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
	margin-bottom: 1rem;
	display: flex;
}
</style>
