<script setup>
import FormGenerator from '@/components/forms/FormGenerator.vue';

import { useUserStore } from '@/stores/user';
import { api } from '@/composables/api.js';
import { validate } from '@/composables/validate.js';
import { notifications } from '@/composables/notifications.js';

const userStore = useUserStore();
const { apiUrl } = api();
const { validateElement } = validate();
const { alert, error } = notifications();

const formError = ref(null);

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

const Authorization = useCookie('Authorization');

const sendLoginForm = async () => {
	alert('asd');
	error('test');

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
		error(e);
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
<!--			<div v-if="formError">-->
<!--				{{ formError }}-->
<!--			</div>-->
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
			<button @click="sendLoginForm()">Отправать</button>
		</template>
	</div>
</template>

<style lang="scss">

</style>
