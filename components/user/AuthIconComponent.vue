<script setup>
import AuthComponent from '@/components/user/AuthComponent.vue';
import Modal from '@/components/modals/Modal.vue';

const activeAuthModal = ref(false);
const reCalc = ref(false);

const toggleAuthModal = () => {
	activeAuthModal.value = !activeAuthModal.value;
}

const reCalcHeight = (value = true) => {
	reCalc.value = value;
}

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

// Logout
// TODO попробовать убрать notifications и api в плагин
import { notifications } from '@/composables/notifications.js';
const { alert, choiceAlert } = notifications();

const logout = () => {
	choiceAlert(
			{
				title: 'Выход',
				message: 'Вы уверены, что хотите разлогиниться?',
				buttons: [
					{
						name: 'Да',
						func: () => {
							sendLogoutRequest();
						},
						additionalKeywordFunc: 'close',
					},
					{
						name: 'Нет',
						additionalKeywordFunc: 'close',
					},
				],
			}
	);
}

import { api } from '@/composables/api.js';
const { apiUrl, errorHandler } = api();
// const Authorization = useCookie('Authorization');

const requestInProgress = ref(false);
const responseErrors = ref({});

const sendLogoutRequest = async () => {
	requestInProgress.value = true;

	try {
		const response = await $fetch(
				`${apiUrl.value}auth/logout`,
				{
					method: 'GET',
					headers: {
						Authorization: Authorization.value,
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

</script>

<template>
	<div class="flex">
		<template v-if="requestInProgress">
			<font-awesome-icon
				:icon="['fas', 'spinner']"
				spin-pulse
				class="menu-element icon"
			/>
		</template>
		<template v-else-if="userStore.user && Object.keys(userStore.user).length > 0">
			<router-link
					to="/profile/"
					@click="$emit('showHideMenu', false)"
			>
				<font-awesome-icon
						:icon="['far', 'user']"
						class="menu-element icon"
				/>
			</router-link>
			<font-awesome-icon
					:icon="['fas', 'right-from-bracket']"
					class="menu-element icon"
					@click="logout()"
			/>
		</template>
		<template v-else-if="true">
			<font-awesome-icon
					:icon="['fas', 'right-to-bracket']"
					class="menu-element icon"
					@click="toggleAuthModal()"
			/>

			<Modal
					:showOpenModal="activeAuthModal"
					size="small"
					modal-id="login-modal"
					:re-calc-height="reCalc"
					@setReCalcValue="reCalcHeight"
					@toggleModal="toggleAuthModal"
			>
				<AuthComponent
						@reCalcHeight="reCalcHeight"
						@closeModal="toggleAuthModal"
				/>
			</Modal>
		</template>
	</div>
</template>
