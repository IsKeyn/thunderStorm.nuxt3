<script setup>
import ItemCard from '@/modules/boardGame/components/item/ItemCard.vue';
import UseItem from '@/modules/boardGame/components/item/UseItem.vue';
import SellItemComponent from '@/modules/boardGame/components/item/SellItem.vue';
import StatusEffectCard from '@/modules/boardGame/components/statusEffect/StatusEffectCard.vue';
import Modal from '@/components/modals/Modal.vue';

const emit = defineEmits(['updateInventory']);

import { computed, ref } from "vue";

import { helper } from '@/composables/helper.js'
const { route, hasWebSocked } = helper();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { refreshLayoutData } = boardGame();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

const props = defineProps({
	items: {
		type: Array,
		default: [],
	},
	statusEffects: {
		type: Array,
		default: [],
	},
	userName: {
		type: String,
		default: null,
	},
	canUse: {
		type: Boolean,
		default: false,
	},
	showUsedItemsBox: {
		type: Boolean,
		default: false,
	},
	classes: {
		type: String,
		default: null,
	},
	groupUnusedItems: {
		type: Boolean,
		default: false,
	},
});

const requestName = 'getBoardGamePlayerInventoryHistory';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (props.userName) {
				const response = await Promise.resolve(
						sendApiRequest(`board-game/v2/player/getInventory/${route.params.slug}/${props.userName}`, 'GET', {}, requestName, '')
				);

				return response || null;
			}
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => {
	return requestData.value ? requestData.value?.data : props.items;
});

const usedItems = computed(() => {
	const grouped = {};

	if (fetchedData.value) {
		fetchedData.value.filter(item => item.has_used).forEach((item) => {
			if (item.item) {
				if (grouped[item.item.id]) {
					grouped[item.item.id].item.quantity++;
				} else {
					grouped[item.item.id] = { ...item };
					grouped[item.item.id].item.quantity = 1;
				}
			}
		});
	}

	return Object.values(grouped).sort(function(a, b) {
		return b.item.quantity - a.item.quantity;
	});
});

const unusedItems = computed(() => {
	const grouped = {};

	if (fetchedData.value) {
		fetchedData.value.filter(item => !item.has_used).forEach((item) => {
			if (item.item) {
				if (grouped[item.item.id]) {
					grouped[item.item.id].item.quantity++;
				} else {
					grouped[item.item.id] = { ...item };
					grouped[item.item.id].item.quantity = 1;
				}
			}
		});
	}

	return Object.values(grouped).sort(function(a, b) {
		return b.item.quantity - a.item.quantity;
	});
});

// Использование предмета
const modalOpen = ref(false);

const openCloseModalFunc = () => {
	modalOpen.value = !modalOpen.value;
};

const itemForUse = ref();

const useItem = (item) => {
	openCloseModalFunc();
	itemForUse.value = item;
}

const useItemFromEmit = (params) => {
	openCloseModalFunc();
	useItemRequest(params.item.id, params.item.item.item.name, params.additionalParams);
}

// Продажа предмета
const sellModalStatus = ref(false);

const toggleSellModal = () => {
	sellModalStatus.value = !sellModalStatus.value;
};

const itemForSell = ref();

const sellItem = (item) => {
	toggleSellModal();
	itemForSell.value = item;
}

const sellItemFromEmit = (params) => {
	toggleSellModal();
	sellItemRequest(params.item.id, params.item.item.item.name, params.additionalParams);
}

const useItemRequest = async (
		inventoryId,
		name,
		additionalParams = {}
) => {
	try {
		const body = {
			id: inventoryId,
			slug: route.params.slug,
			additionalParams,
		}

		const response = await sendApiRequest('board-game/v2/inventory/useItem', 'POST', body, 'bg_useItem', 'small', 'method');

		if (!response) {
			error('Ответ от сервера пуст');
			return;
		}

		if (response.error) {
			error(response.error);
			return;
		}

		alert(
				response.message ? response.message : `Предмет "${name}" был использован`,
				60000
		);

		if (!hasWebSocked()) refreshLayoutData();
		emit('updateInventory');
	} catch (e) {
		error(e);
	}
};

const sellItemRequest = async (
		inventoryId,
		name,
		additionalParams = {}
) => {
	try {
		const body = {
			id: inventoryId,
			slug: route.params.slug,
			entity_type: 'App\\Models\\BoardGame\\ItemBind',
			additionalParams,
		}

		const response = await sendApiRequest('board-game/v2/inventory/sellItem', 'POST', body, 'bg_sellItem', 'small', 'method');

		if (!response) {
			error('Ответ от сервера пуст');
			return;
		}

		if (response.error) {
			error(response.error);
			return;
		}

		alert(
				response.message ? response.message : `Предмет "${name}" был выставлен на выставлен на продажу`,
				10000
		);

		if (!hasWebSocked()) refreshLayoutData();
		emit('updateInventory');
	} catch (e) {
		error(e);
	}
}
</script>

<template>
	<ui-BigPreloader
			v-if="requestInProgress"
			class="h-full"
			theme="image"
			:themeType="9"
	/>
	<div
			v-else-if="fetchedData && fetchedData.length"
			:class="['inventory', classes]"
	>
		<div class="box mb-[2rem]">
			<h2 class="inv-title">Инвентарь игрока</h2>
			<span v-if="fetchedData.filter(item => !item.has_used).length === 0">Предметов нет</span>
			<div class="wrapper">
				<ItemCard
						v-for="(element, key) in groupUnusedItems ? unusedItems : fetchedData.filter(item => !item.has_used)"
						:key="key"
						:element="element.item"
						:inventoryItem="element"
						:useLightBox="true"
						:showControlPanel="canUse"
						:showDropChance="false"
						@useItem="useItem"
						@sellItem="sellItem"
				/>
			</div>
		</div>
		<div
				v-if="showUsedItemsBox"
				class="box"
		>
			<h2 class="inv-title">Использованные предметы игрока</h2>
			<span v-if="usedItems.length === 0">Предметов нет</span>
			<div class="wrapper">
				<ItemCard
						v-for="(element, key) in usedItems"
						:key="key"
						:element="element.item"
						:useLightBox="true"
						:showDropChance="false"
				/>
			</div>
		</div>
		<div
				v-if="statusEffects.length"
				class="box"
		>
			<h2 class="inv-title">Статус эффекты игрока</h2>
			<span v-if="statusEffects.length === 0">Активные статус эффекты отсутствуют</span>
			<div class="wrapper">
				<StatusEffectCard
						v-for="(element, key) in statusEffects"
						:key="key"
						:element="element"
						:useLightBox="true"
						:showControlPanel="true"
						@updateList="emit('updateInventory');"
				/>
			</div>
		</div>
	</div>
	<ui-itemBox
			v-else
			classes="red"
			message="Предметы отсутствуют"
	/>

	<Modal
			:showOpenModal="modalOpen"
			size="full-width"
			:fullCloseModal="true"
			@toggleModal="openCloseModalFunc"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Применение предмета</h3>
			<div class="link-parent-box">
				<UseItem
						:item="itemForUse"
						@openCloseModalFunc="openCloseModalFunc"
						@useItemFromEmit="useItemFromEmit"
				/>
			</div>
		</div>
	</Modal>

	<Modal
			:showOpenModal="sellModalStatus"
			size="full-width"
			:fullCloseModal="true"
			@toggleModal="toggleSellModal"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Продажа предмета</h3>
			<div class="link-parent-box">
				<SellItemComponent
						:item="itemForSell"
						@toggleSellModal="toggleSellModal"
						@sellItemFromEmit="sellItemFromEmit"
				/>
			</div>
		</div>
	</Modal>
</template>

<style lang="scss" scoped>
.inventory {
	@apply block lg:flex justify-center gap-4 mb-4;

	.box {
		@apply mb-[1rem] lg:mb-0 w-full lg:w-1/2;

		.wrapper {
			@apply h-[600px] overflow-auto;
		}
	}
}

.inv-title {
	@apply font-bold mb-4 uppercase;
}
</style>
