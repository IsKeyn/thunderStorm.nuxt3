<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';
import CountdownTimer from '@/components/additional/CountdownTimer.vue';

import { ref } from "vue";

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { api } from '@/composables/api.js'
const { sendApiRequest, publicUrl } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const form = ref(
		{
			autoLoginUrl: {
				name: 'Ссылка авто-логина',
				value: '',
				type: 'text',
				placeholder: 'Нажмите кнопку сгенерировать, чтобы создать ссылку',
				validateRules: null,
				classes: 'w-full',
			},
		},
);

const requestInProgress = ref(false);
const fetchedData = ref({});

const generateLinkRequest = async () => {
	requestInProgress.value = true;

	try {
		const response = await sendApiRequest(`admin/magical-link/generate/${route.params.slug}`, 'GET', {}, 'generateAutoLoginToken', '');

		if (response) {
			if (response.error) {
				error(response.error);
			} else {
				requestInProgress.value = false;
				fetchedData.value = response;

				if (response.token) {
					form.value.autoLoginUrl.value = `${window.location.protocol}//${publicUrl.value}/auth/autologin/${response.token}`;
				} else {
					error('Токен не получен');
				}
			}
		} else {
			error('Пустой ответ');
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}
</script>

<template>
	<div class="flex">
		<FormGenerator
				v-if="form.autoLoginUrl"
				name="autologin"
				class="w-full"
				:element="form.autoLoginUrl"
				:showTitle="false"
				:showCopyButton="true"
				validateErrorPosition="bottom"
				labelClasses="mr-4 mt-[10px] mb-[10px]"
				:fieldClasses="form.autoLoginUrl.classes"
		/>
		<ActionButton
				buttonClasses="btn btn-simple"
				buttonName="сгенерировать"
				:actionInProgress="requestInProgress"
				@startAction="generateLinkRequest()"
		/>
	</div>
	<div class="qr-code">
		<a
				v-if="fetchedData.qr_code"
				:href="fetchedData.qr_code"
				target="_blank"
				title="QR код для авторизации"
		>
			<img
					:src="fetchedData.qr_code"
					alt="QR код для авторизации"
					title="Просканируйте QR код для авторизации"
			>
		</a>
		<CountdownTimer
				v-if="fetchedData.expires_at"
				:targetDate="fetchedData.expires_at"
				title="Истечет через"
				endTitle="Действие кода закончилось"
				:showColumns="{ days: false, hours: false, minutes: true, seconds: true }"
		/>
	</div>
</template>

<style lang="scss" scoped>
.qr-code {
	@apply flex mt-4;
}
</style>
