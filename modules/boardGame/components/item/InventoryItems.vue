<script setup>
import ItemCard from '@/modules/boardGame/components/item/ItemCard.vue';
import Modal from '@/components/modals/Modal.vue';
import UseItem from '@/modules/boardGame/components/item/UseItem.vue';

import { computed, ref } from "vue";

const props = defineProps({
	items: {
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
	}
});

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

const route = useRoute();
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
</script>

<template>
	<ui-BigPreloader v-if="requestInProgress" />
	<div
			v-else-if="fetchedData && fetchedData.length > 0"
			class="inventory"
	>
		<div class="box mb-[2rem]">
			<h2 v-if="fetchedData" class="inv-title">Инвентарь игрока</h2>
			<span v-if="fetchedData && fetchedData.filter(item => !item.has_used).length === 0">Предметов нет</span>
			<div class="wrapper">
				<ItemCard
						v-for="(element, key) in fetchedData.filter(item => !item.has_used)"
						:key="key"
						:element="element.item"
						:useLightBox="true"
						:showControlPanel="canUse"
						@useItem="useItem"
				/>
			</div>
		</div>
		<div class="box">
			<h2 v-if="fetchedData" class="inv-title">Использованные предметы игрока</h2>
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
.inventory,
{
	@apply block lg:flex gap-4 mb-4;

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
