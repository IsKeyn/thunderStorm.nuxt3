<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ResentVerifyEmail from '@/components/user/fragments/ResentVerifyEmail.vue';
import SocialAuthComponent from '@/components/user/auth/SocialAuthComponent.vue';

const route = useRoute();

import { validate } from '@/composables/validate.js';
import { api } from '@/composables/api.js';
import { useUserStore } from '@/stores/user';

const { validateElement } = validate();
const {
	apiUrl,
	errorHandler,
	getCsrfCookie,
	sendApiRequest,
} = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const userStore = useUserStore();

const props = defineProps({
	registerOnEventBySlug: {
		type: String,
		default: null,
	},
});

const form = ref(
		{
			name: {
				name: 'Никнейм',
				value: '',
				type: 'text',
				validateRules: 'required, minLength_2, maxLength_40',
				classes: ['w-full', 'mt-[5px]'],
			},
			email: {
				name: 'E-mail',
				value: '',
				type: 'text',
				validateRules: 'required, email, maxLength_50',
				classes: ['w-full', 'mt-[5px]'],
			},
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
			personal_data_processing_policy: {
				name: 'Я согласен с правилами использования материалов сайта и политикой по обработке персональных данных',
				showTitle: false,
				html: 'Я согласен с <a href="/article/rule-for-use-site/" target="_blank">правилами использования материалов сайта</a> и <a href="/article/consent-of-personal-data/" target="_blank">политикой по обработке персональных данных</a>',
				value: false,
				type: 'checkbox',
				validateRules: 'required',
				validateErrorText: 'Соглашение с правилами использования материалов сайта и пополитикой по обработке персональных данных обязательно для регистрации',
				classes: ['w-full', 'mt-[5px]'],
			},
		}
);

const formError = ref(null);
const responseErrors = ref({});
const requestInProgress = ref(false);

const sendForm = async () => {
	formError.value = '';

	const rawData = toRaw(form)._rawValue;

	for (var key in rawData) {
		form.value[key].validateResult = validateElement(rawData[key].value, rawData[key].validateRules, rawData, rawData[key]?.validateErrorText);

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

const Authorization = useCookie('Authorization');

const sendRequest = async () => {
	responseErrors.value = {};
	requestInProgress.value = true;

	try {
		const csrfCookie = await getCsrfCookie();

		const body = {
			name: form.value.name.value,
			email: form.value.email.value,
			password: form.value.password.value,
			password_confirmation: form.value.repeatPassword.value,
			additional_fields: [
				{
					name: 'Страница регистрации',
					slug: 'registrationPage',
					value: route.fullPath,
					sort: 90,
				},
			],
		};

		if (props.registerOnEventBySlug) {
			body.registerOnEventBySlug = props.registerOnEventBySlug;
		}

		const response = await $fetch(
				`${apiUrl.value}auth/register`,
				{
					method: 'POST',
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						'X-XSRF-TOKEN': csrfCookie.value,
					},
					body,
				},
		);

		if (response) {
			Authorization.value = `${response.token_type} ${response.token}`;
			Authorization.expires = response.expires;
			Authorization.path = '/';

			requestInProgress.value = false;
			getUserData();
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
		const body = {}

		const response = await sendApiRequest('auth/user', 'GET', body);

		if (response) {
			userStore.user = response.data;
			requestInProgress.value = false;
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}
//
// const getUserData = async () => {
// 	requestInProgress.value = true;
//
// 	try {
// 		const response = await $fetch(
// 				`${apiUrl.value}auth/user`,
// 				{
// 					method: 'GET',
// 					headers: {
// 						Authorization: Authorization.value,
// 						Accept: 'application/json',
// 						'X-Requested-With': 'XMLHttpRequest',
// 					},
// 				},
// 		);
//
// 		if (response) {
// 			userStore.user = response.data;
// 			requestInProgress.value = false;
// 		}
// 	} catch (e) {
// 		const errorsPromise = errorHandler(e);
//
// 		errorsPromise.then((element) => {
// 			responseErrors.value = element;
// 		});
// 		requestInProgress.value = false;
// 	}
// }
</script>

<template>
	<div>
		<template v-if="userStore.user && Object.keys(userStore.user).length > 0 && Authorization">
			<template v-if="userStore.user.email_verified_at">
				Вы уже зарегистрированы
			</template>
			<template v-else>
				<ResentVerifyEmail />
			</template>
		</template>
		<template v-else>
			<template v-if="Object.keys(responseErrors).length > 0">
				<template v-for="fieldErrors in responseErrors">
					{{ fieldErrors }}
					<div
							v-for="error in fieldErrors"
							class="field-error-message small-text mb-[10px]"
					>
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
					:showTitle="field.hasOwnProperty('showTitle') ? field.showTitle : true"
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
							Зарегистрироваться
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
							@click.prevent="$emit('setActionType', { value: 'recovery_password', title: 'Восстановление пароля' })"
					>
						Забыли пароль
					</a>
				</div>
			</div>
			<SocialAuthComponent
					:registerOnEventBySlug="registerOnEventBySlug"
					class="mt-2"
			/>
		</template>
	</div>
</template>
