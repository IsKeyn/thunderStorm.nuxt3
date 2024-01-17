<script setup>
import FormGenerator from '@/components/forms/FormGenerator.vue';

import { useUserStore } from '@/stores/user';
import { api } from '@/composables/api.js'
import { validate } from '@/composables/validate.js'

const userStore = useUserStore();
const { apiUrl } = api();
const { validateElement } = validate();

const formError = ref(null);

const form = ref(
		{
			email: {
				name: 'Логин пользователя',
				value: '',
				type: 'text',
				validateRules: 'required, email',
			},
			password: {
				name: 'Пароль пользователя',
				value: '',
				type: 'password',
				validateRules: 'required',
				showChangeTypeButton: true,
			},
		}
);

const Authorization = useCookie('Authorization');

const sendLoginForm = async () => {
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
	try {
		// const response = await $fetch(
		// 		`${apiUrl.value}auth/login`,
		// 		{
		// 			method: 'POST',
		// 			body: {
		// 				email: form.value.email.value,
		// 				password: form.value.password.value,
		// 			}
		// 		},
		// );
		//
		// if (response) {
		// 	Authorization.value = `${response.token_type} ${response.token}`;
		// 	Authorization.expires = response.expires;
		// 	Authorization.path = '/';
		// }
	} catch (e) {

		console.log(e);
		// TODO отображение ошибок показать
		// this.error(e);
	}
}

const sendLogoutRequest = async () => {
	// TODO запрос на логаут

	// if (response) {
		Authorization.value = '';
		// Authorization.expires = response.expires;
		// Authorization.path = '/';

		userStore.user = {};
	// }
}
</script>

<template>
	<div>
		<template v-if="Object.keys(userStore.user).length > 0">
				Вы залогинены
			<button @click="sendLogoutRequest()">send</button>
		</template>
		<template v-else>
			<div v-if="formErrors">
				{{ formErrors }}
			</div>
			<FormGenerator
					v-for="(field, index) in form"
					:key="index"
					:name="index"
					:element="field"
					:showValidateError="true"
			/>
			<button @click="sendLoginForm()">send</button>
		</template>
	</div>
</template>
