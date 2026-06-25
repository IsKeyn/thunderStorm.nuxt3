<script setup>
import GamblingGameV2_1 from '@/components/games/gamblingGame/GamblingGameV2_1.vue'
import ItemCard from '@/modules/boardGame/components/item/ItemCard.vue';
import InventoryItems from '@/modules/boardGame/components/item/InventoryItems.vue';

import { computed, ref } from "vue";

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { helper } from '@/composables/helper.js'
const { route, hasWebSocked } = helper();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { refreshLayoutData } = boardGame();

const requestName = 'getBoardGameGamblingGameItemList';
const hiddenRefresh = ref(false);

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const response = await Promise.resolve(
					sendApiRequest(`board-game/v2/player/item/gamblingGame/${route.params.slug}/`, 'GET', {}, requestName, 'fullscreenTransparent')
			);

			hiddenRefresh.value = false;
			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value || null);

const requestObj = ref({
	url: `board-game/v2/player/rollItem/${route.params.slug}/`,
	method: 'POST',
	requestName: 'boardGameRollItem',
});

const droppedItem = ref(null);

const hiddenUpdate = () => {
	hiddenRefresh.value = true;
	refresh();
}

const showItem = (item) => {
	droppedItem.value = item;
	hiddenUpdate();

	if (!hasWebSocked()) refreshLayoutData();
}

const closeDroppedItemBox = () => {
	droppedItem.value = null;
}
</script>

<template>
	<ui-BigPreloader
			v-if="requestInProgress && !hiddenRefresh"
			class="h-full"
			theme="image"
			:themeType="9"
	/>
	<ui-itemBox
			v-else-if="fetchedData && fetchedData?.status === 'error' && fetchedData?.status_message"
			classes="red"
			:message="fetchedData.status_message"
	/>
	<div v-else-if="fetchedData?.items?.length">
		<div v-if="droppedItem" class="flex flex-col items-center">
			<ItemCard
					class="w-full"
					:element="droppedItem"
					:openFullDescription="true"
					:useLightBox="true"
					:playSound="true"
					:showDropChance="false"
			/>
			<button class="btn btn-simple" @click="closeDroppedItemBox">{{ fetchedData.player.item_roll_count > 0 ? 'Крутить ещё' : 'Закрыть' }}</button>
		</div>
		<GamblingGameV2_1
				v-else
				cardType="ItemCard"
				:items="fetchedData.items"
				:roll_count="fetchedData.player.item_roll_count"
				:requestObj="requestObj"
				:easeOutType="1"
				:showItemCount="false"
				:showRollCount="true"
				:requestParentData="requestInProgress"
				@funcAfterRollWithDelay1000="showItem"
		/>
		<ui-BigPreloader
				v-if="requestInProgress && !hiddenRefresh"
				class="h-full"
				theme="image"
				:themeType="9"
		/>
		<InventoryItems
				v-else
				classes="mt-8"
				:items="fetchedData.player.inventory"
				:statusEffects="fetchedData.player.statusEffects"
				:canUse="true"
				:useBindStatusEffect="true"
				@updateInventory="hiddenUpdate"
		/>
	</div>
</template>

<style lang="scss" scoped>
.item-box {
	a {
		@apply text-[var(--main-dark-text-color)];
	}
}
</style>
