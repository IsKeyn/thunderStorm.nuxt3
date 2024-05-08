<script setup>
import { watch } from 'vue'

import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ResentVerifyEmail from '@/components/user/fragments/ResentVerifyEmail.vue';

import { useUserStore } from '@/stores/user';
import { api } from '@/composables/api.js';
import { validate } from '@/composables/validate.js';

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const userStore = useUserStore();
const { apiUrl, backendUrl, errorHandler } = api();
const { validateElement } = validate();

const emit = defineEmits(['сlosureFunc']);

const formError = ref(null);
const responseErrors = ref({});

const form = ref(
		{
			email: {
				name: 'E-mail',
				value: '',
				type: 'text',
				validateRules: 'required, email',
				classes: ['w-full', 'mt-[5px]'],
			},
			password: {
				name: 'Пароль',
				value: '',
				type: 'password',
				validateRules: 'required',
				showChangeTypeButton: true,
				classes: ['w-full', 'pr-[25px]', 'mt-[5px]'],
			},
		}
);

const requestInProgress = ref(false);

// const Authorization = useCookie('Authorization');

const sendForm = async () => {
	formError.value = '';

	const rawData = toRaw(form)._rawValue;

	for (var key in rawData) {
		form.value[key].validateResult = validateElement(rawData[key].value, rawData[key].validateRules);

		if (typeof form.value[key].validateResult === 'string') {
			form.value[key].validateResult = form.value[key].validateResult.replaceAll('{fieldName}', form.value[key].name);
			formError.value = form.value[key].validateResult;
			break;
		}
	}

	if (!formError.value) {
		await sendRequest();
	}
}

const sendRequest = async () => {
	responseErrors.value = {};
	requestInProgress.value = true;

	try {
		await $fetch(
				`${backendUrl.value}/sanctum/csrf-cookie`,
				{
					withCredentials: true,
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						'X-Requested-With': 'XMLHttpRequest',
					},
				},
		);

		const XsrfToken = useCookie('XSRF-TOKEN');

		const response = await $fetch(
				`${apiUrl.value}auth/login`,
				{
					method: 'POST',
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						'X-Requested-With': 'XMLHttpRequest',
						'X-XSRF-TOKEN': XsrfToken.value,
					},
					body: {
						email: form.value.email.value,
						password: form.value.password.value,
					}
				},
		);

		if (response) {
			// Authorization.value = `${response.token_type} ${response.token}`;
			// Authorization.expires = response.expires;
			// Authorization.path = '/';

			requestInProgress.value = false;

			getUserData();
			emit('сlosureFunc');
		}
	} catch (e) {
		const errorsPromise = errorHandler(e);

		errorsPromise.then((element) => {
			responseErrors.value = element;
		});
		requestInProgress.value = false;
	}
}

const sendLogoutRequest = async () => {
	requestInProgress.value = true;

	try {
		const response = await $fetch(
				`${apiUrl.value}auth/logout`,
				{
					method: 'GET',
					headers: {
						// Authorization: Authorization.value,
						Accept: 'application/json',
						'X-Requested-With': 'XMLHttpRequest',
					},
				},
		);

		if (response) {
			// Authorization.value = '';
			// Authorization.expires = 0;
			// Authorization.path = '/';

			userStore.user = {};

			requestInProgress.value = false;
		}
	} catch (e) {
		const errorsPromise = errorHandler(e);

		errorsPromise.then((element) => {
			responseErrors.value = element;
		});
		requestInProgress.value = false;
	}
}

const getUserData = async () => {
	requestInProgress.value = true;

	try {
		const response = await $fetch(
				`${apiUrl.value}auth/user`,
				{
					method: 'GET',
					headers: {
						// Authorization: Authorization.value,
						Accept: 'application/json',
						'X-Requested-With': 'XMLHttpRequest',
					},
					withCredentials: true,
					credentials: 'include',
					// onRequest({request, options}) {
					// 	console.log("[fetch request]", request, options)
					// },
					// onResponse({request, response, options}) {
					// 	console.log("[fetch response]", request, response, response._data, options)
					// 	// cart_session.value = response._data
					// },
				},
		);

		if (response) {
			userStore.user = response.data;
			requestInProgress.value = false;
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
		<template v-if="userStore.user && Object.keys(userStore.user).length > 0">
			<template v-if="userStore.user.email_verified_at">
				Вы залогинены
				<div class="grid grid-cols-6">
					<div class="col-span-3">
						<button
								@click="sendLogoutRequest()"
								:disabled="requestInProgress"
								class="min-w-24"
						>
							<template v-if="!requestInProgress">
								Выйти
							</template>
							<font-awesome-icon
									v-else
									:icon="['fas', 'spinner']"
									spin-pulse
							/>
						</button>
					</div>
					<div class="col-span-3 text-right"></div>
				</div>
			</template>
			<template v-else>
				<ResentVerifyEmail />
			</template>
		</template>
		<template v-else>
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
							class="min-w-24"
					>
						<template v-if="!requestInProgress">
							Войти
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
							@click.prevent="$emit('setActionType', { value: 'recovery_password', title: 'Восстановление пароля' })"
					>
						Забыли пароль
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
		</template>
	</div>
</template>

<style lang="scss">

</style>
