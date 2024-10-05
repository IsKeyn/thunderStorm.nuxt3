<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

import { api } from '@/composables/api.js';
const { apiUrl, errorHandler } = api();

import { validate } from '@/composables/validate.js';
const { validateForm, validateElement } = validate();

const form = ref(
		{
			email: {
				name: 'e-mail',
				value: '',
				type: 'text',
				validateRules: 'required, email',
				classes: ['w-full', 'mt-[5px]'],
			},
		}
);

const sendForm = async () => {
	const { status, key, validateResult } = validateForm(form);

	if (status) {
		await sendRequest();
	} else {
		form.value[key].validateResult = validateResult;
	}
}

const responseErrors = ref({});
const requestInProgress = ref(false);

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const emit = defineEmits(['closeModal']);

const sendRequest = async () => {
	responseErrors.value = {};
	requestInProgress.value = true;

	try {
		const response = await $fetch(
				`${apiUrl.value}auth/forgot-password`,
				{
					method: 'POST',
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						'X-XSRF-TOKEN': csrfCookie.value,
					},
					body: {
						email: form.value.email.value,
					}
				},
		);

		if (response) {
			requestInProgress.value = false;
			alert(
					response.status,
					10000,
					'#004d42',
			);
			emit('closeModal');
		}
	} catch (e) {
		const errorsPromise = errorHandler(e);

		errorsPromise.then((element) => {
			responseErrors.value = element;
		});
		requestInProgress.value = false;
	}
}
</script>

<template>
	<div>
		<span class="block mb-2">Укажите свой e-mail, чтобы получить ссылки для восстановления пароля</span>
		<template v-if="Object.keys(responseErrors).length > 0">
			<template v-for="fieldErrors in responseErrors">
				<div class="field-error-message small-text mb-[10px]" v-for="error in fieldErrors">
					{{ error }}
				</div>
			</template>
		</template>
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
		<div class="grid grid-cols-6">
			<div class="col-span-3">
				<button
						@click="sendForm()"
						:disabled="requestInProgress"
						class="btn btn-primary min-w-24"
				>
					<template v-if="!requestInProgress">
						Восстановить
					</template>
					<font-awesome-icon
							v-else
							:icon="['fas', 'spinner']"
							spin-pulse
					/>
				</button>
			</div>
			<div class="col-span-3 text-right">
				<a
						href="#"
						class="block small-text"
						@click.prevent="$emit('setActionType', { value: 'login', title: 'Авторизация' })"
				>
					Авторизоваться
				</a>
				<a
						href="#"
						class="block small-text"
						@click.prevent="$emit('setActionType', { value: 'registration', title: 'Регистрация' })"
				>
					Зарегистрироваться
				</a>
			</div>
		</div>
	</div>
</template>
