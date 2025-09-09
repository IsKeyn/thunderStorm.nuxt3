<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ResponseErrorsComponent from '@/components/forms/fragments/ResponseErrorsComponent.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';

const emit = defineEmits(['closeModal']);

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { userFunctions } from '@/composables/userFunctions.js';
const { isAuth } = userFunctions();

import { api } from '@/composables/api.js';
const { errorHandler, sendApiRequest } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { validate } from '@/composables/validate.js';
const { validateForm } = validate();

import { useLoadStateStore } from '@/stores/loadState';
const loadState = useLoadStateStore();

const props = defineProps({
	description: {
		type: String,
		default: '',
	},
});

const form = ref({});

if (isAuth.value) {
	form.value.currentPassword = {
		name: 'Текущий пароль',
		value: '',
		type: 'password',
		validateRules: 'required, minLength_8, maxLength_50',
		showChangeTypeButton: true,
		classes: ['w-full', 'pr-[25px]', 'mt-[5px]'],
	};
}

form.value.password = {
	name: 'Новый пароль',
			value: '',
			type: 'password',
			validateRules: 'required, minLength_8, maxLength_50',
			showChangeTypeButton: true,
			classes: ['w-full', 'pr-[25px]', 'mt-[5px]'],
};

form.value.repeatPassword = {
	name: 'Повторите новый пароль',
			value: '',
			type: 'password',
			validateRules: 'required, minLength_8, maxLength_50, sameFields_password',
			showChangeTypeButton: true,
			classes: ['w-full', 'pr-[25px]', 'mt-[5px]'],
};

const route = useRoute();
const router = useRouter();

const responseErrors = ref({});
const requestInProgress = ref(false);

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

const requestName = 'changePassword';

const sendRequest = async () => {
	responseErrors.value = {};
	requestInProgress.value = true;

	try {
		loadState.loadList[requestName] = {
			name: requestName,
			type: 'fetch',
			preloaderType: null,
			status: 'load',
		};

		if (userStore.user && Object.keys(userStore.user).length > 0) {
			requestForAuthUser();
		} else {
			requestForUnAuthUser();
		}
	} catch (e) {
		if (loadState.loadList[requestName]) {
			loadState.loadList[requestName].status = 'error';
		}

		const errorsPromise = errorHandler(e);

		errorsPromise.then((element) => {
			responseErrors.value = element;
		});
		requestInProgress.value = false;
	}
}

const requestForUnAuthUser = async () => {
	const body = {
			email: route.query.email,
			token: route.query.token,
			password: form.value.password.value,
			password_confirmation: form.value.repeatPassword.value,
	};

	const response = await sendApiRequest('auth/reset-password', 'POST', body);

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

		if (loadState.loadList[requestName]) {
			loadState.loadList[requestName].status = 'finish';
		}
	}
};

const requestForAuthUser = async () => {
	const body = {
		currentPassword: form.value.currentPassword.value,
		password: form.value.password.value,
		password_confirmation: form.value.repeatPassword.value,
	};

	const response = await sendApiRequest('auth/change-password', 'POST', body);

	if (response) {
		requestInProgress.value = false;

		switch (response.status_code) {
			case 'passwords.change':
				alert(
						response.status,
						10000,
						'#004d42',
				);
				clearForm();
				break;
			case 'auth.password':
				alert(
						response.status,
						10000,
						'#800000',
				);
				break;
		}

		if (loadState.loadList[requestName]) {
			loadState.loadList[requestName].status = 'finish';
		}
	}
};

const clearForm = () => {
	for (let key in form.value) {
		form.value[key].value = null;
	}
}
</script>

<template>
	<div>
		<span
				v-if="description"
				class="block mb-2"
		>{{ description }}</span>
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
				<ActionButton
						buttonName="Изменить"
						buttonClasses="btn btn-simple-1 min-w-24"
						:actionInProgress="requestInProgress"
						@startAction="sendForm"
				/>
			</div>
			<div
					v-if="!isAuth"
					class="col-span-3 text-right"
			>
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
