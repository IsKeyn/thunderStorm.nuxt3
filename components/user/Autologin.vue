<script setup>
import { onMounted, ref } from "vue";

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { helper } from '@/composables/helper.js'
const { route, router } = helper();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const requestInProgress = ref(false);

const initAutologin = async () => {
	requestInProgress.value = true;

	if (route.params && route.params.slug) {
		try {
			const response = await sendApiRequest(`auth/magical-link/login/${route.params.slug}`, 'GET', {}, 'userAutoLogin', '');

			if (response) {
				if (response.error) {
					error(response.error);
				} else {
					requestInProgress.value = false;

					userStore.user = response;
					alert(`Добро пожаловать ${userStore.user.name}!`);
					router.push({ path: '/' })
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
	initAutologin();
});
</script>

<template>
	<ui-preloader v-if="requestInProgress" />
</template>

<style lang="scss" scoped></style>
