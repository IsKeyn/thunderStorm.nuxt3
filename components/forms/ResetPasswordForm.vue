<script setup>
import FormGenerator from '@/components/forms/FormGenerator.vue';
import ResponseErrorsComponent from '@/components/forms/fragments/ResponseErrorsComponent.vue';
import SendFormButton from '@/components/forms/fragments/SendFormButton.vue';

const form = ref(
		{
			password: {
				name: 'Пароль',
				value: '',
				type: 'password',
				validateRules: 'required, minLength_8, maxLength_50',
				showChangeTypeButton: true,
				classes: ['w-full', 'pr-[25px]', 'mt-[5px]'],
			},
			repeatPassword: {
				name: 'Повторите пароль',
				value: '',
				type: 'password',
				validateRules: 'required, minLength_8, maxLength_50, sameFields_password',
				showChangeTypeButton: true,
				classes: ['w-full', 'pr-[25px]', 'mt-[5px]'],
			},
		}
);

import { validate } from '@/composables/validate.js';
const { validateForm } = validate();

const sendForm = async () => {
	for (const formKey in form.value) {
		form.value[formKey].validateResult = '';
	}

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

const route = useRoute();
import { api } from '@/composables/api.js';
const { apiUrl, errorHandler } = api();

const emit = defineEmits(['closeModal']);
const router = useRouter();

const sendRequest = async () => {
	responseErrors.value = {};
	requestInProgress.value = true;

	try {
		const response = await $fetch(
				`${apiUrl.value}auth/reset-password`,
				{
					method: 'POST',
					body: {
						email: route.query.email,
						token: route.query.token,
						password: form.value.password.value,
						password_confirmation: form.value.repeatPassword.value,
					}
				},
		);

		if (response) {
			requestInProgress.value = false;

			switch (response.status_code) {
				case 'passwords.reset':
					alert(
							response.status,
							10000,
							'#004d42',
					);
					router.push({ path: '/' });
					emit('setActionType', { value: 'login', title: 'Авторизация' });
					break;
				case 'passwords.token':
					alert(
							response.status,
							10000,
							'#800000',
					);
					emit('setActionType', { value: 'recovery_password', title: 'Восстановление пароля' });
					break;
			}
		}
	} catch (e) {
		responseErrors.value = errorHandler(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
	<div>
		<span class="block mb-2">Введите новый пароль</span>
		<ResponseErrorsComponent :responseErrors="responseErrors" />
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
				<SendFormButton
						buttonName="Восстановить"
						:requestInProgress="requestInProgress"
						@sendForm="sendForm"
				/>
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
