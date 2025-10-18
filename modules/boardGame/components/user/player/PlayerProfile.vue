<script setup>
import Tabs from '@/components/ui/tabs/Tabs.vue';
import Timer from '@/modules/boardGame/components/timer/Timer.vue';
import UserAvatar from '@/components/user/avatar/UserAvatar.vue';
import TwitchCard from '@/components/twitch/TwitchCard.vue';

import CurrentGame from '@/modules/boardGame/components/user/player/profileElement/CurrentGame.vue';
import GameHistory from '@/modules/boardGame/components/user/player/profileElement/GameHistory.vue';
import InventoryItems from '@/modules/boardGame/components/item/InventoryItems.vue';
import StatusEffects from '@/modules/boardGame/components/statusEffect/StatusEffects.vue';
import PlayerLogs from '@/modules/boardGame/components/user/player/profileElement/PlayerLogs.vue';
import PlayerEvents from '@/modules/boardGame/components/user/player/profileElement/PlayerEvents.vue';
import ProfileSettings from '@/components/user/profile/fragments/Settings.vue';

import UserMessagesModal from '@/components/user/message/UserMessagesModal.vue';
import UserNotificationModal from '@/components/user/notifications/UserNotificationModal.vue';

import { computed, inject, onMounted, ref, watch } from 'vue';

const route = useRoute();

const boardGameInfo = inject('boardGameInfo');
const layoutMethods = inject('layoutMethods');

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { api } from '@/composables/api.js'
const { sendApiRequest, responseErrors } = api();

import { helper } from '@/composables/helper.js'
const {
	findElementById,
} = helper();

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

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

const props = defineProps({
	userName: {
		type: String,
		default: null,
	},
});

const requestName = 'getBoardGamePlayerInfo';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (props.userName) {
				const response = await Promise.resolve(
						sendApiRequest(`board-game/v2/player/get/${route.params.slug}/${props.userName}`, 'GET', {}, requestName, 'fullscreen')
				);

				return response?.data || null;
			}
		},
		{
			server: true,
			lazy: true,
		}
);

const userInfo = computed(() => requestData.value || null);

const isCurrentUser = computed(() => {
	if (isAuth && userInfo.value && userStore.user.id === userInfo.value.user_id) {
		return true;
	}

	return false;
});

/* НАЧАЛО: Поля профайла */
const twitch = computed(() => {
	if (userInfo.value && userInfo.value.user && userInfo.value.user.additional_fields) {
		const twitchField = userInfo.value.user.additional_fields.filter((item) => item.slug === 'twitch_channel');

		if (twitchField.length > 0 && twitchField[0]) {
			return twitchField[0];
		}
	}

	return false;
});
/* КОНЕЦ: Поля профайла */

/* Табы профайла */
const tabsElements = ref([]);

watch(() => boardGameStore.playersOnline, () => {
	if (userInfo.value && userInfo.value?.user?.id && boardGameStore.playersOnline[userInfo.value.user.id]) {
		setUnsetTwitchTab();
	}
}, { deep: true });

const hasStream = ref(false);

const setUnsetTwitchTab = () => {
	if (!hasStream.value && userInfo.value && userInfo.value?.user?.id && boardGameStore.playersOnline[userInfo.value.user.id]) {
		tabsElements.value.unshift({
			id: 'stream',
			title: 'Стрим',
		});

		hasStream.value = true;
	} else {
		tabsElements.value = tabsElements.value.filter(item => item.id !== 'stream')

		hasStream.value = false;
	}
}

setUnsetTwitchTab();

tabsElements.value.push(
		{
			id: 'currentElement',
			title: 'Текущая игра',
		}
);

tabsElements.value.push(
		{
			id: 'gameHistory',
			title: 'История игр',
		}
);

tabsElements.value.push(
		{
			id: 'itemsHistory',
			title: 'История предметов',
		}
);

tabsElements.value.push(
		{
			id: 'statusEffectsHistory',
			title: 'История статус эффектов',
		}
);

tabsElements.value.push(
		{
			id: 'logsHistory',
			title: 'Логи',
		}
);

tabsElements.value.push(
		{
			id: 'playerEvents',
			title: 'Участие в ивентах',
		}
);

if (isCurrentUser.value) {
	tabsElements.value.push(
			{
				id: 'settings',
				title: 'Настройки',
			}
	);
}

watch(() => isCurrentUser.value, (newValue) => {
	const result = findElementById(tabsElements.value, 'settings');

	if (newValue) {
		if (result === undefined) {
			tabsElements.value.push(
					{
						id: 'settings',
						title: 'Настройки',
					}
			);
		}
	} else {
		tabsElements.value = tabsElements.value.filter(item => item.id !== 'settings');
	}
}, { deep: true });

const scriptTwitchIsOnline = ref(false);

onMounted(() => {
	if (process.client) {
		const script = document.createElement('script');
		script.src = 'https://player.twitch.tv/js/embed/v1.js';
		document.body.appendChild(script);
		script.onload = () => {
			scriptTwitchIsOnline.value = true;
		};
	}
});

// TODO Вывести бафы дебафы, вывести доп. соц сети
</script>

<template>
	<div v-if="userInfo">
		<div
				v-if="userInfo && userInfo.user"
				class="player-info"
		>
			<div class="box avatar-and-social-box">
				<UserAvatar
						:userInfo="userInfo.user"
						classes="w-[150px] h-[150px]"
				/>
				<div class="social">
					<NuxtLink v-if="twitch.value" :to="`https://www.twitch.tv/${twitch.value}`" target="_blank" :title="`Twitch канал ${userInfo.user.name}`">
						<font-awesome-icon icon="fa-brands fa-youtube" />
					</NuxtLink>
					<NuxtLink v-if="twitch.value" :to="`https://www.twitch.tv/${twitch.value}`" target="_blank" :title="`Twitch канал ${userInfo.user.name}`">
						<font-awesome-icon icon="fa-brands fa-twitch" />
					</NuxtLink>
					<NuxtLink v-if="twitch.value" :to="`https://www.twitch.tv/${twitch.value}`" target="_blank" :title="`Twitch канал ${userInfo.user.name}`">
						<font-awesome-icon icon="fa-regular fa-circle-play" />
					</NuxtLink>
				</div>
			</div>
			<div class="box w-full main-info-box">
				<h2 class="inv-title">{{ userInfo.user.name }}</h2>
				<div class="info">
					<div class="column1">
						<span class="field">
							Участвует в ивенте с {{ getFormattedDate('d ru_mouths_name Y', userInfo.created_at) }}
						</span>
						<span class="field">
							Количество очков: {{ userInfo.points }}
						</span>
						<span class="field">
							Позиция на поле: {{ userInfo.position ? userInfo.position : 'Не делал ходов' }}
						</span>
						<span class="field">
							Итоговый результат: {{ userInfo.full_points }}
						</span>
						<span
								v-if="userInfo.full_points && userInfo.seconds"
								class="field"
						>
							Очков в час: {{ Math.round((userInfo.full_points / userInfo.seconds) * 3600) }}
						</span>
						<span class="field">
							Статус: <span v-if="userInfo.active" class="text-rounded-box">Участвует</span><span v-else class="text-rounded-box">Не участвует</span>
						</span>
					</div>
					<div class="column2">
						<Timer
								class="w-2/3"
								:userId="userInfo.user_id"
								:showName="false"
								:showControlButtons="false"
						/>
					</div>
				</div>
				<div
						v-if="isAuth"
						class="mt-2"
				>
					<template v-if="isCurrentUser">
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
					</template>
					<template v-else>
						<button
								v-if="(userStore.user && Object.keys(userStore.user).length > 0) && (userInfo.user_id !== userStore.user.id)"
								class="btn btn-simple-1"
								@click="emit('sendNotification', userInfo.user_id)"
						>
							<font-awesome-icon icon="fa-solid fa-envelope" class="mr-2" /> Отправить сообщение
						</button>
					</template>
				</div>
			</div>
		</div>

		<Tabs
				:tabs="tabsElements"
				:defaultCurrentTab="hasStream ? 'stream' : 'currentElement'"
				type="if"
		>
			<template #tab-stream>
				<div class="twitch">
					<TwitchCard
							v-if="hasStream && scriptTwitchIsOnline"
							:channel="twitch.value"
					/>
				</div>
			</template>
			<template #tab-currentElement>
				<CurrentGame :userName="userName" />
			</template>
			<template #tab-gameHistory>
				<GameHistory :userName="userName" />
			</template>
			<template #tab-itemsHistory>
				<InventoryItems
						:userName="userName"
						:showUsedItemsBox="true"
				/>
			</template>
			<template #tab-statusEffectsHistory>
				<StatusEffects
						:userName="userName"
						:canUse="isCurrentUser"
						:showUsedItemsBox="true"
				/>
			</template>
			<template #tab-logsHistory>
				<PlayerLogs :userName="userName" />
			</template>
			<template #tab-settings>
				<ProfileSettings />
			</template>
			<template #tab-playerEvents>
				<PlayerEvents :userName="userName" />
			</template>
		</Tabs>
	</div>
	<UserNotificationModal ref="userNotificationModalRef" />
	<UserMessagesModal ref="userMessagesModalRef" />
</template>

<style lang="scss">
.twitch {
	iframe {
		@apply w-[50%] h-[40rem];
	}
}
</style>

<style lang="scss" scoped>
.player-info {
	@apply block lg:grid grid-cols-12 mb-[2rem];

	.box {
		@apply mb-[1rem] lg:mb-0;

		&.avatar-and-social-box {
			@apply lg:col-span-1 2xl:col-span-1;

			.social {
				@apply mt-[1rem] flex justify-center gap-1;

				a {
					@apply text-[var(--main-text-color)] p-2 bg-[var(--second-block-color)] flex justify-center items-center;

					&:hover {
						@apply bg-[var(--main-hover-color)];
					}

					svg {
						@apply text-[1.3rem] cursor-pointer;
					}
				}
			}
		}

		&.main-info-box {
			@apply lg:col-span-10 2xl:col-span-10;
		}

		span {
			&.field {
				@apply block mb-[0.5rem];
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

		img {
			@apply mx-auto rounded-full;
		}
	}
}

.inventory,
.logs-and-steps,
.current-game
{
	@apply block lg:flex gap-4 mb-4;

	.box {
		@apply mb-[1rem] lg:mb-0 w-full lg:w-1/2;

		.wrapper {
			@apply h-[440px] overflow-auto;
		}
	}
}

.logs-and-steps {
	@apply block lg:flex gap-4;

	.logs {

	}
}

.inv-title {
	@apply font-bold mb-4 uppercase;
}

.text-rounded-box {
	@apply bg-[var(--second-bg-color)] text-[var(--main-dark-text-color)];
}
</style>
