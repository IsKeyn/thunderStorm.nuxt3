<script setup>
import ResponseErrorsComponent from '@/components/forms/fragments/ResponseErrorsComponent.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';

const sendForm = async () => {
	await sendRequest();
}

import { api } from '@/composables/api.js';
const { apiUrl, backendUrl, errorHandler } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const responseErrors = ref({});
const requestInProgress = ref(false);
const sendVerificationEmailMessage = ref(null);
const Authorization = useCookie('Authorization');

// Cookies.get('XSRF-TOKEN');

const sendRequest = async () => {
	responseErrors.value = {};
	requestInProgress.value = true;

	const response = await $fetch(
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
	try {
		const response = await $fetch(
				`${apiUrl.value}auth/verification-notification`,
				{
					method: 'POST',
					credentials: 'include',
					headers: {
						Authorization: Authorization.value,
						Accept: 'application/json',
						'X-Requested-With': 'XMLHttpRequest',
						'X-XSRF-TOKEN': XsrfToken.value,
					},
				},
		);

		if (response) {
			requestInProgress.value = false;

			if (response.status_code === 'notifications.account_verification') {
				sendVerificationEmailMessage.value = 'Проверьте ваш email ящик';

				alert(
						response.status,
						10000,
						'#004d42',
				);
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
		<span v-if="sendVerificationEmailMessage">{{ sendVerificationEmailMessage }}</span>
		<span v-else class="block mb-2">Подтвердите свой email, перейдя по ссылки из письма</span>
		<ResponseErrorsComponent :responseErrors="responseErrors" />
		<ActionButton
				v-if="!sendVerificationEmailMessage"
				buttonName="Или получите новую ссылку для подтверждения"
				:actionInProgress="requestInProgress"
				@startAction="sendForm"
		/>
	</div>
</template>
