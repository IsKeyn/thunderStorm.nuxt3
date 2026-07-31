<script setup>
import ShopOwner from '@/modules/boardGame/components/shop/ShopOwner.vue';
import SellItemCard from '@/modules/boardGame/components/item/SellItemCard.vue';

import { computed } from "vue";

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { addTextToPoints } = boardGame();

const requestName = 'getShopItems';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const response = await Promise.resolve(
					sendApiRequest(
							`board-game/v2/shop/list/${route.params.slug}/`,
							'GET',
							{
								entity_type: 'App\\Models\\BoardGame\\ItemBind',
							},
							requestName,
							''
					)
			);

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value?.items || null);
const storeProfit = computed(() => requestData.value?.storeProfit || 0);

const pointsForShop = computed(() => {
	if (userStore.player.points > 0) {
		return `У вас есть ${addTextToPoints(userStore.player.points)} для покупок`;
	} else {
		return 'У вас нет доступных для оплаты очков';
	}
});
</script>

<template>
	<ShopOwner
			class="mb-4"
			:storeProfit="storeProfit"
	/>
	<ui-BigPreloader
			v-if="requestInProgress"
			class="h-full"
			theme="image"
			:themeType="9"
	/>

	<div v-else-if="fetchedData.length">
		<h2 class="title">Предметы в продаже (В продаже {{ fetchedData.length }}):</h2>

		<ui-itemBox
				classes="green"
				:message="pointsForShop"
		/>

		<SellItemCard
				v-for="(shopItem, key) in fetchedData"
				:key="key"
				:shopItem="shopItem"
				@updateShop="refresh()"
		/>
	</div>
	<ui-itemBox
			v-else
			classes="red"
			message="В данный момент асортимент пуст"
	/>
</template>

<style lang="scss" scoped>
.title {
	@apply font-bold mb-4 uppercase text-[1rem];
}
</style>
