<script setup>
import Modal from '@/components/modals/Modal.vue';

import ItemCard from '@/modules/boardGame/components/item/ItemCard.vue';
import UseItem from '@/modules/boardGame/components/item/UseItem.vue';
import StatusEffectCard from '@/modules/boardGame/components/statusEffect/StatusEffectCard.vue';

import { computed, ref } from "vue";
const route = useRoute();

const emit = defineEmits(['updateInventory']);

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
});

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

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

				return response?.data || null;
			}
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => {
	if (requestData.value) {
		return requestData.value;
	} else {
		return props.items;
	}
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

/* Использование предмета */
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

const useItemRequest = async (inventory_id, name, additionalParams = {}) => {
	try {
		const body = {
			id: inventory_id,
			slug: route.params.slug,
			additionalParams,
		}

		const response = await sendApiRequest('board-game/v2/inventory/use', 'POST', body, 'bg_useItem', 'small', 'method');

		if (response) {
			if (response.error) {
				error(response.error);
			} else {
				if (response.message) {
					alert(response.message, 10000);
				} else {
					alert(`Предмет "${name}" был использован`);
				}

				await refreshNuxtData('boardGameCurrentPlayerInfoRequest');
				emit('updateInventory');
			}
		}
	} catch (e) {
		error(e);
	}
};
</script>

<template>
	<ui-BigPreloader v-if="requestInProgress" />
	<div
			v-else-if="fetchedData && fetchedData.length > 0"
			:class="['inventory', classes]"
	>
		<div class="box mb-[2rem]">
			<h2 class="inv-title">Инвентарь игрока</h2>
			<span v-if="fetchedData.filter(item => !item.has_used).length === 0">Предметов нет</span>
			<div class="wrapper">
				<ItemCard
						v-for="(element, key) in fetchedData.filter(item => !item.has_used)"
						:key="key"
						:element="element.item"
						:inventoryItem="element"
						:useLightBox="true"
						:showControlPanel="canUse"
						@useItem="useItem"
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
				/>
			</div>
		</div>
		<div
				v-if="statusEffects.length > 0"
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
	<template v-else>
		Предметы отсутствуют
	</template>

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
