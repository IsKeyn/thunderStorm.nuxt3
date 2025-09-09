<script setup>
import UserAvatar from '@/components/user/avatar/UserAvatar.vue';
import Tabs from '@/components/ui/tabs/Tabs.vue';
import ProfileSettings from '@/components/user/profile/fragments/Settings.vue';
import UserMessagesModal from '@/components/user/message/UserMessagesModal.vue';
import UserNotificationModal from '@/components/user/notifications/UserNotificationModal.vue';

import { inject } from 'vue'
const layoutMethods = inject('layoutMethods')

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { useLoadStateStore } from '@/stores/loadState';
const loadState = useLoadStateStore();

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
} = api();

import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

import { userNotification } from '@/composables/userNotification.js';
const {
	userNotificationModalRef,
	showNotificationModal,
} = userNotification();

import { userMessage } from '@/composables/userMessage.js';
const {
	userMessagesModalRef,
	showUserMessagesModal,
} = userMessage();

import { userFunctions } from '@/composables/userFunctions.js';
const {
	isAuth,
	logout,
	sendLogoutRequest,
} = userFunctions();

const requestName = 'userProfileRequest';
const route = useRoute();

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			let userName = null;

			if (route.params.name) {
				userName = route.params.name;
			} else if (userStore && userStore.user && userStore.user.name) {
				userName = userStore.user.name;
			}

			if (userName) {
				let request = `${apiUrl.value}auth/getFullProfile/${userName}`;

				const query = {};
				const sessionCookie = useCookie(sessionCookieName.value);

				try {
					loadState.loadList[requestName] = {
						name: requestName,
						type: 'useAsyncData',
						preloaderType: 'fullscreenTransparent',
						status: 'load',
					};

					const response = await $fetch(
							request,
							{
								method: 'GET',
								credentials: 'include',
								query,
								headers: {
									Accept: 'application/json',
									Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
									Referer: publicUrl.value,
								}
							},
					);

					if (!response) {
						throw showError({
							statusCode: 404,
							message: 'Игра не найдены'
						});
					} else {
						if (loadState.loadList[requestName]) {
							loadState.loadList[requestName].status = 'finish';
						}

						return response.data;
					}
				} catch (e) {
					if (loadState.loadList[requestName]) {
						loadState.loadList[requestName].status = 'error';
					}
					errorHandler(e);
				}
			}
		},
		{
			server: true, // выполнять только на сервере
			lazy: true, // ждать выполнения запроса перед рендерингом
		}
);

const userInfo = computed(() => requestData.value || null);

const isCurrentUser = computed(() => {
	if (userStore.user && Object.keys(userStore.user).length > 0 && userStore.user.id === userInfo.value.id) {
		return true;
	}

	return false;
});

const twitch = computed(() => {
	if (userInfo.value && userInfo.value.additional_fields) {
		const twitchField = userInfo.value.additional_fields.filter((item) => item.slug === 'twitch_channel');

		if (twitchField.length > 0 && twitchField[0]) {
			return twitchField[0];
		}
	}

	return false;
});

const tabsElements = [
	{
		id: 1,
		title: 'Участие в ивентах',
	},
	{
		id: 'settings',
		title: 'Настройки',
	},
];
</script>

<template>
	<div v-if="userInfo">
		<div
				class="profile-info"
		>
			<div class="box">
				<UserAvatar :userInfo="userInfo" />
			</div>
			<div class="box w-full">
					<h2 class="profile-title">{{ userInfo.name }}</h2>
					<div class="info">
						<div class="column1">
							<span class="field">
								Зарегистрирован с: {{ getFormattedDate('d.m.Y H:i', userInfo.created_at) }}
							</span>
							<span
									v-if="twitch"
									class="field"
							>
								Канал на twitch: <a :href="`${twitch.value}`" target="_blank" :title="`Twitch канал ${userInfo.name}`">{{ twitch.value }}</a>
							</span>
							<span class="field" v-if="userInfo.roles && userInfo.roles.length > 0">
								Роли:
									<div class="tags-list inline">
										<span class="tag" v-for="(role, key) in userInfo.roles" :key="key">{{ role.name }}</span>
									</div>
							</span>

							<template v-if="isAuth">
								<div v-if="isCurrentUser">
									<button
											class="btn btn-simple-1 mr-2"
											@click="showUserMessagesModal"
									>
										<font-awesome-icon icon="fa-solid fa-envelope" class="mr-2" /> Мои сообщения
									</button>
									<button
											class="btn btn-simple-1 mr-2"
											@click="showNotificationModal"
									>
										<font-awesome-icon icon="fa-solid fa-bell" class="mr-2" /> Мои уведомления
									</button>
									<button
											class="btn btn-simple-1 mr-2"
											@click="logout"
									>
										<font-awesome-icon :icon="['fas', 'right-from-bracket']" class="mr-2" /> Выйти
									</button>
								</div>
								<div v-else>
									<button
											v-if="(userStore.user && Object.keys(userStore.user).length > 0) && (userInfo.user_id !== userStore.user.id)"
											class="btn btn-simple-1"
											@click="emit('sendNotification', userInfo.user_id)"
									>
										Отправить сообщение
									</button>
									<button
											v-if="(userStore.user && Object.keys(userStore.user).length > 0) && (userInfo.user_id !== userStore.user.id)"
											class="btn btn-simple-1"
											@click="emit('sendNotification', userInfo.user_id)"
									>
										Отправить уведомление
									</button>
								</div>
							</template>
						</div>
						<div class="column2">
							колонка 2
						</div>
					</div>
			</div>
		</div>
		<Tabs
				name="profileTab"
				:tabs="tabsElements"
				type="if"
		>
			<template #tab-1>
				1111
			</template>
			<template #tab-settings>
				<ProfileSettings />
			</template>
		</Tabs>
	</div>
	<UserNotificationModal ref="userNotificationModalRef" />
	<UserMessagesModal ref="userMessagesModalRef" />
</template>

<style lang="scss" scoped>
.profile-info {
	@apply block lg:flex gap-4 mb-[2rem];

	.box {
		@apply mb-[1rem] lg:mb-0;

		span {
			&.field {
				@apply block mb-[0.2rem];
			}
		}

		.info {
			@apply block lg:flex;

			.column1 {
				@apply w-full lg:w-1/2;
			}

			.column2 {
				@apply flex justify-center lg:justify-end w-full lg:w-1/2;
			}
		}
	}

	.profile-title {
		@apply font-bold mb-4 uppercase;
	}
}
</style>
