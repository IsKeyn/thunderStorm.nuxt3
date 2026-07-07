<script setup>
import ItemCard from '@/modules/boardGame/components/item/ItemCard.vue';

const emit = defineEmits(['updateShop']);

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { helper } from '@/composables/helper.js'
const { route, hasWebSocked } = helper();

import { notifications } from '@/composables/notifications.js';
const { choiceAlert, error, alert } = notifications();

import { bgItems } from '@/composables/boardGame/bgItems.js'
const { calcShopPrice } = bgItems();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

const props = defineProps({
	shopItem: {
		type: Object,
		default: {},
	},
});

const buyItem = (shopItem) => {
	const price = calcShopPrice(shopItem.item.item.price);

	if (userStore.player.points < price) {
		error(`У вас не достаточно очков для покупки предмета "${shopItem.item.item.name}", его стоимость ${price} у вас есть ${userStore.player.points}`);
	}

	choiceAlert(
			{
				title: `Купить предмет ${shopItem.item.item.name}`,
				message: `Вы уверены, что хотите приобрести "${shopItem.item.item.name}" за ${price}?`,
				buttons: [
					{
						name: 'Да',
						func: () => {
							buyItemRequest(shopItem);
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

const buyItemRequest = async (shopItem) => {
	try {
		const body = {
			id: shopItem.id,
			slug: route.params.slug,
			entity_type: 'App\\Models\\BoardGame\\ItemBind',
		}

		const response = await sendApiRequest('board-game/v2/shop/buy', 'POST', body, 'bg_buyItem', 'small', 'method');

		if (!response) {
			error('Ответ от сервера пуст');
			return;
		}

		if (response.error) {
			error(response.error);
			return;
		}

		alert(
				response.message ? response.message : `Предмет "${shopItem.item.item.name}" был добавлен в ваш инвентарь`,
				10000
		);

		if (!hasWebSocked()) refreshLayoutData();
		emit('updateShop');
	} catch (e) {
		error(e);
	}
}

const withdrawnItem = (shopItem) => {
	choiceAlert(
			{
				title: `Отозвать предмет ${shopItem.item.item.name}`,
				message: `Вы уверены, что хотите вернуть в инвентарь предмет "${shopItem.item.item.name}"?`,
				buttons: [
					{
						name: 'Да',
						func: () => {
							withdrawnItemRequest(shopItem);
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

const withdrawnItemRequest = async (shopItem) => {
	try {
		const body = {
			id: shopItem.id,
			slug: route.params.slug,
			entity_type: 'App\\Models\\BoardGame\\ItemBind',
		}

		const response = await sendApiRequest('board-game/v2/shop/withdrawn', 'POST', body, 'bg_withdrawnItem', 'small', 'method');

		console.log(111, response);

		if (!response) {
			error('Ответ от сервера пуст');
			return;
		}

		if (response.error) {
			error(response.error);
			return;
		}

		alert(
				response.message ? response.message : `Предмет "${shopItem.item.item.name}" был добавлен в ваш инвентарь`,
				10000
		);

		if (!hasWebSocked()) refreshLayoutData();
		emit('updateShop');
	} catch (e) {
		error(e);
	}
}
</script>

<template>
	<ItemCard
			:element="shopItem.item"
			:shopItem="shopItem"
			:useLightBox="true"
			:showDropChance="false"
			:salesman="shopItem.user"
			theme="shopItem"
			@buyItem="buyItem"
			@withdrawnItem="withdrawnItem"
	/>
</template>

<style lang="scss" scoped />
