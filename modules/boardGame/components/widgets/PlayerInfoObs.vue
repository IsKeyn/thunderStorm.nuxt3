<script setup>
import SmallCardsLine from '@/modules/boardGame/components/user/player/playerCards/fragments/SmallCardsLine.vue';
import GameGamblingCard from '@/modules/boardGame/components/game/GameGamblingCard.vue';

import { onMounted, ref } from "vue";

const { subscribe, unsubscribe } = useWebSocket();
const runtimeConfig = useRuntimeConfig();

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { notifications } from '@/composables/notifications.js';
const { error } = notifications();

const props = defineProps({
	player_id: {
		type: Number,
		default: null,
	},
});

const requestName = 'getBgPlayerWithInventory';
const hiddenRefresh = ref(false);

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const query = {
				player_id: route.query.player_id ? route.query.player_id : props.player_id,
			};

			const response = await Promise.resolve(
					sendApiRequest(
							'board-game/v2/player/getPlayerWithInventory/',
							'GET',
							query,
							requestName,
							''
					)
			);

			hiddenRefresh.value = false;
			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = ref([]);
const hasSubscribe = ref(false);

const setSubscribe = () => {
	if (runtimeConfig.public.hasWebSockedServer && fetchedData.value?.user?.id && !hasSubscribe.value) {
		hasSubscribe.value = true;
		const { unsubscribe: stop, subscriptionId } = subscribe(
				`App.Models.User.${fetchedData.value.user.id}`,
				'BoardGame.PlayerInfoForObs',
				(data) => {
					if (data.status === 'update') {
						hiddenRefresh.value = true;
						refresh();
					}
				}
		);
	}
}

// Инициализация из useAsyncData
watchEffect(() => {
	fetchedData.value = requestData.value?.data || {};

	if (process.client) {
		setSubscribe();
	}
});
</script>

<template>
	<ui-BigPreloader
			v-if="requestInProgress && !hiddenRefresh"
			class="h-full"
			theme="image"
			:themeType="9"
	/>
	<div
			class="wrapper"
			v-else-if="fetchedData && Object.keys(fetchedData).length"
	>
		<h2 v-if="fetchedData?.settings?.widgetSettings?.show_name && fetchedData?.user?.name"
				class="block title title-line"
		>{{ fetchedData.user.public_name ? fetchedData.user.public_name : fetchedData.user.name }}</h2>

		<div
				v-if="fetchedData?.settings?.widgetSettings?.show_data"
				class="main-info-line"
		>
			<span v-if="fetchedData.full_points">
				<font-awesome-icon icon="fa-solid fa-coins" /> {{ fetchedData.full_points }}
			</span>
			<span v-if="fetchedData.streak">
				<font-awesome-icon icon="fa-solid fa-bolt" /> {{ fetchedData.streak }}
			</span>
			<span v-if="fetchedData.position">
				<font-awesome-icon icon="fa-solid fa-dice" /> {{ fetchedData.position }}
			</span>
		</div>

		<GameGamblingCard
				v-if="fetchedData?.settings?.widgetSettings?.show_game && fetchedData?.current_game?.game"
				:element="fetchedData.current_game.game"
				:itemHeight="100"
				classes="min-h-[100px]"
				overlayClasses="!bg-black/60"
		/>

		<div
				v-if="fetchedData?.settings?.widgetSettings?.show_items_and_se"
				class="grid grid-cols-2"
		>
			<div class="flex flex-col">
				<div class="flex items-center justify-center w-full">
					<SmallCardsLine
							v-if="fetchedData.statusEffects"
							:element="fetchedData.statusEffects"
							classes=""
					/>
				</div>
			</div>
			<div class="flex flex-col">
				<div class="flex items-center justify-center w-full">
					<SmallCardsLine
							v-if="fetchedData.inventory"
							:element="fetchedData.inventory"
							type="items"
							classes=""
					/>
				</div>
			</div>
		</div>
	</div>
	<ui-itemBox
			v-else
			classes="red"
			message="Не получено информации об игроке"
	/>
</template>

<style lang="scss" scoped>
.wrapper {
	@apply max-w-[220px];

	.title-line {
		@apply text-center mb-2 pb-2 break-words;

		border-bottom: 1px solid var(--second-border-color);
	}

	.main-info-line {
		@apply flex gap-2 justify-center text-[1.4rem] mb-2 pb-2;

		border-bottom: 1px solid var(--second-border-color);
	}
}
</style>
