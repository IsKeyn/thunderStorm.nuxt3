<script setup>
import AlertBox from '@/components/notifications/AlertBlock.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';

import { onMounted } from "vue";

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { validate } from '@/composables/validate.js';
const { validateForm } = validate();

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { useLoadStateStore } from '@/stores/loadState';
const loadState = useLoadStateStore();

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
			other_stream_platform: {
				name: 'Отличная от twitch стрим площадка',
				value: '',
				type: 'text',
				placeholder: 'Укажите ссылку',
				validateRules: 'required, minLength_2, maxLength_50',
				classes: 'w-full',
			},
		},
);

onMounted(() => {
	setValue();
});

const setValue = () => {
	form.value.twitch.value = `https://www.twitch.tv/${twitch.value.value}`;
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
const requestName = 'changeProfileFields';

const sendRequest = async () => {
	requestInProgress.value = true;

	try {
		loadState.loadList[requestName] = {
			name: requestName,
			type: 'fetch',
			preloaderType: null,
			status: 'load',
		};

		const preparedFormData = preparedRequestBody(form.value);

		const body = {
			additional_fields: [
				{
					name: 'Twitch канал',
					slug: 'twitch_channel',
					value: preparedFormData.twitch,
					sort: 100,
				},
				{
					name: 'Отличная от twitch стрим площадка',
					slug: 'other_stream_platform',
					value: preparedFormData.other_stream_platform,
					sort: 200,
				},
			],
		};

		if (twitch.value) {
			body.additional_fields.id = twitch.value.id;
		}

		const response = await sendApiRequest('auth/update-profile', 'POST', body);

		if (response) {
			requestInProgress.value = false;

			if (loadState.loadList[requestName]) {
				loadState.loadList[requestName].status = 'finish';
			}
			alert('Ссылка на Ваш twitch канал обновлена');
		}
	} catch (e) {
		if (loadState.loadList[requestName]) {
			loadState.loadList[requestName].status = 'error';
		}

		error(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
	<div class="mb-[1rem]">
		<span class="title block mb-5">Поля профиля</span>
		<div v-if="userStore.user && Object.keys(userStore.user).length > 0">
			<AlertBox
					:errorsMessages="errorsMessages"
					class="mb-2"
			/>
			<FormGenerator
					v-for="(field, index) in form"
					:key="index"
					:name="index"
					:element="field"
					:showValidateError=true
					validateErrorPosition="bottom"
					:labelClasses="['block', 'mb-[10px]']"
					:fieldClasses="field.classes"
			/>
			<ActionButton
					buttonName="Обновить"
					buttonClasses="btn btn-simple-1 min-w-24"
					:actionInProgress="requestInProgress"
					@startAction="sendForm()"
			/>
		</div>
		<div v-else>
			Данный функционал доступен только авторизованному пользователю
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
