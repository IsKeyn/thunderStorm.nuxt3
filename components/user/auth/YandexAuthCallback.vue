<script setup>
import { onMounted, ref } from "vue";

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { helper } from '@/composables/helper.js'
const { route, router } = helper();

const requestInProgress = ref(false);

const initLogin = async () => {
	requestInProgress.value = true;

	if (route.query && route.query.code) {
		try {
			const body = {
				code: route.query.code,
			};

			const registerOnEventBySlug = sessionStorage.getItem('registerOnEventBySlug');

			if (registerOnEventBySlug) {
				body.registerOnEventBySlug = registerOnEventBySlug;
			}

			const response = await sendApiRequest('auth/yandex/apiCallback', 'POST', body, 'userAutoLogin', 'sendYandexApiCallbackRequest');

			if (response) {
				if (response.error) {
					error(response.error);
				} else {
					requestInProgress.value = false;

					userStore.user = response;
					alert(`Добро пожаловать ${userStore.user.name}!`);

					const redirectUrl = sessionStorage.getItem('pageForRedirect');

					sessionStorage.removeItem('registerOnEventBySlug');
					sessionStorage.removeItem('pageForRedirect');
					// router.push({ path: redirectUrl ? redirectUrl : '/' });
					window.location.href = redirectUrl ? redirectUrl : '/';
				}
			} else {
				error('Пустой ответ');
			}
		} catch (e) {
			error(e);
			requestInProgress.value = false;
		}
	}
}

onMounted(() => {
	initLogin();
});
</script>

<template>
	<ui-BigPreloader v-if="requestInProgress" />
</template>

<style lang="scss" scoped></style>
