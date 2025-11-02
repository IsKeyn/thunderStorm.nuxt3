<script setup>
import GamblingGame from '@/components/games/GamblingGame.vue'
import ItemCard from '@/modules/boardGame/components/item/ItemCard.vue';
import InventoryItems from '@/modules/boardGame/components/item/InventoryItems.vue';

import { computed, ref } from "vue";
const route = useRoute();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

const props = defineProps({});

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
}

const closeDroppedItemBox = () => {
	droppedItem.value = null;
}
</script>

<template>
<!--	<ui-BigPreloader v-if="requestInProgress && !hiddenRefresh" />-->
	<div v-if="requestInProgress && !hiddenRefresh"></div>
	<div class="item-box" v-else-if="fetchedData && fetchedData.status === 'error' && fetchedData.status_message">
		{{ fetchedData.status_message }}
	</div>
	<div v-else-if="fetchedData && fetchedData.items && fetchedData.items.length > 0">
		<div v-if="droppedItem" class="flex flex-col items-center">
			<ItemCard
					class="w-full"
					:element="droppedItem"
					:openFullDescription="true"
					:useLightBox="true"
					:playSound="true"
			/>
			<button class="btn btn-simple" @click="closeDroppedItemBox">{{ fetchedData.player.item_roll_count > 0 ? 'Крутить ещё' : 'Закрыть' }}</button>
		</div>
		<GamblingGame
				v-else
				:items="fetchedData.items"
				:roll_count="fetchedData.player.item_roll_count"
				:requestObj="requestObj"
				:easeOutType="1"
				:showItemCount="false"
				:showRollCount="true"
				:requestParentData="requestInProgress"
				@funcAfterRollWithDelay2="showItem"
		/>
		<ui-BigPreloader v-if="requestInProgress && !hiddenRefresh" />
		<InventoryItems
				v-else
				classes="mt-8"
				:items="fetchedData.player.inventory"
				:statusEffects="fetchedData.player.status_effects"
				:canUse="true"
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
