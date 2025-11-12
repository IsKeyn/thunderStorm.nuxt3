<script setup>
import CountdownTimer from '@/components/additional/CountdownTimer.vue';

import { ref } from "vue";

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { userFunctions } from '@/composables/userFunctions.js';
const { isAuth, userStore } = userFunctions();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

const props = defineProps({
	pageForRedirect: {
		type: String,
		default: null,
	},
});

const requestInProgress = ref(false);

const fetchedData = ref({});

const generateQrCode = async () => {
	requestInProgress.value = true;

	try {
		const body = {
			redirectUrl: props.pageForRedirect,
		};

		body.userId = userStore.user.id;

		const response = await sendApiRequest('auth/generate-auth-link/', 'POST', body, 'sendGenerateQrRequest', '');

		if (response) {
			requestInProgress.value = false;

			alert('Ваш QR сгенерирован, помните, что он будет действовать 10 минут');
			fetchedData.value = response;
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}

const clearQrCodeLink = () => {
	fetchedData.value.qr_code = '';
}
</script>

<template>
	<div class="mb-[1rem]">
		<span class="title block mb-5">Авторизацию по QR</span>
		<span class="block">Сгенерировать QR код для авторизации, используйте его, для авторизации с других устройств, например с мобильного телефона</span>
		<span class="block">Код будет действовать в течении 10 минут</span>
		<span class="block">ВНИМАНИЕ! Никому не показывайте свой QR код</span>
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
					@activeParentFunc="clearQrCodeLink()"
			/>
		</div>
		<button class="btn btn-simple" @click="generateQrCode()">Сгенерировать</button>
	</div>
</template>

<style lang="scss" scoped>
.qr-code {
	@apply flex mt-4;
}
</style>
