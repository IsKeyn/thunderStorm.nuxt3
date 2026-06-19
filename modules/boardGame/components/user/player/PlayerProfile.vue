<script setup>
import ProfileLine from '@/modules/boardGame/components/user/player/fragments/ProfileLine.vue';

import Tabs from '@/components/ui/tabs/Tabs.vue';
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

import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { api } from '@/composables/api.js'
const { sendApiRequest, publicUrl } = api();

import { helper } from '@/composables/helper.js'
const { findElementById, route } = helper();

import { userFunctions } from '@/composables/userFunctions.js';
const { isAuth } = userFunctions();

import { userNotification } from '@/composables/userNotification.js';
const { userNotificationModalRef, showNotificationModal } = userNotification();

import { userMessage } from '@/composables/userMessage.js';
const { userMessagesModalRef, showUserMessagesModal } = userMessage();

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

				return response || null;
			}
		},
		{
			server: true,
			lazy: true,
		}
);

const userInfo = computed(() => requestData.value?.data || null);
const isCurrentUser = computed(() => isAuth.value && userInfo.value && userStore.user.id === userInfo.value.user_id );
const twitch = computed(() => {
	if (userInfo.value?.user?.additional_fields) {
		const twitchField = userInfo.value.user.additional_fields.filter((item) => item.slug === 'twitch_channel');

		if (twitchField.length > 0 && twitchField[0]) {
			return twitchField[0];
		}
	}

	return false;
});

/* Табы профайла */
const tabsElements = ref([
	{
		id: 'currentGame',
		title: 'Текущая игра',
	},
	{
		id: 'gameHistory',
		title: 'История игр',
	},
	{
		id: 'itemsHistory',
		title: 'История предметов',
	},
	{
		id: 'statusEffectsHistory',
		title: 'История статус эффектов',
	},
	{
		id: 'logsHistory',
		title: 'Логи',
	},
	{
		id: 'playerEvents',
		title: 'Участие в ивентах',
	},
]);

/* Добавление табов собственного профиля */
watch(() => isCurrentUser.value, () => {
	const result = findElementById(tabsElements.value, 'settings');

	if (isCurrentUser.value) {
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
}, { immediate: true, deep: true });

/* Добавление таба стрима */
const hasStream = ref(false);

watch(() => userInfo.value, () => {
	if (
			userInfo.value?.user?.id
			&& boardGameStore?.playersOnline
			&& boardGameStore?.playersOnline[userInfo.value.user.id]
	) {
		hasStream.value = true;
		tabsElements.value.unshift({
			id: 'stream',
			title: 'Стрим',
		});
	} else {
		hasStream.value = false;
		tabsElements.value = tabsElements.value.filter(item => item.id !== 'stream');
	}
}, { immediate: true, deep: true });

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

/* Очищаем данные, чтобы при onMounted не использовал данные игрока, к которому заходили последний раз */
onUnmounted(() => {
	requestData.value = null;
})

const requestURL = useRequestURL();
const pageForRedirect = computed(() => {
	return `${requestURL.protocol}//${publicUrl.value}/e/${route.params.slug}/`;
});
</script>

<template>
	<div v-if="userInfo">
		<ProfileLine
				:element="userInfo"
				@showNotificationModal="showNotificationModal"
				@showUserMessagesModal="showUserMessagesModal"
				@refresh="refresh"
		/>
		<Tabs
				:tabs="tabsElements"
				:defaultCurrentTab="hasStream ? 'stream' : 'currentGame'"
				type="if"
		>
			<template #tab-stream>
				<div class="twitch">
					<TwitchCard
							v-if="hasStream && scriptTwitchIsOnline"
							:channel="twitch"
					/>
				</div>
			</template>
			<template #tab-currentGame>
				<CurrentGame :userName="userName" />
			</template>
			<template #tab-gameHistory>
				<GameHistory :userName="userName" />
			</template>
			<template #tab-itemsHistory>
				<InventoryItems
						:userName="userName"
						:showUsedItemsBox="true"
						:groupUnusedItems="true"
				/>
			</template>
			<template #tab-statusEffectsHistory>
				<StatusEffects
						:userName="userName"
						:showUsedItemsBox="true"
				/>
			</template>
			<template #tab-logsHistory>
				<PlayerLogs :userName="userName" />
			</template>
			<template #tab-settings>
				<ProfileSettings
						:pageForRedirect="pageForRedirect"
						@refresh="refresh"
				/>
			</template>
			<template #tab-playerEvents>
				<PlayerEvents :userName="userName" />
			</template>
		</Tabs>
	</div>
	<ui-itemBox
			v-else
			classes="red"
			message="Игрок не найден в ивенте"
	/>

	<UserNotificationModal ref="userNotificationModalRef" />
	<UserMessagesModal ref="userMessagesModalRef" />
</template>

<style lang="scss">
.twitch {
	position: relative;
	width: 100%;

	iframe {
		@apply w-full h-auto;
		aspect-ratio: 16 / 9; /* Стандартное соотношение для Twitch */
	}
}
</style>
