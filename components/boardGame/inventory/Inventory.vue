<script setup>
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

import Modal from '@/components/modals/Modal.vue';
import InventoryInterface from '@/components/boardGame/inventory/InventoryInterface.vue';
import ItemCard from '@/components/boardGame/inventory/ItemCard.vue';
import LightBox from '@/components/media/LightBox.vue'

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
	sendApiRequest,
} = api();

import { lightBox } from '@/composables/lightBox.js';
const {
	openedImage,
	setOpenedImage
} = lightBox();

import { ref, watch } from "vue";

const emit = defineEmits(['fetchLogs', 'updateBoardGameInfo']);

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
	boardGameInfo: {
		type: Object,
		default: {},
	},
});

const modalOpen = ref(false);
const modalLoading = ref(false);

const openCloseModalFunc = () => {
	modalOpen.value = !modalOpen.value;
	modalLoading.value = true;
};

/* Получение данных */
const UserItems = ref([]);
const SmallUserItems = ref([]);
const UsedItems = ref([]);

const requestInProgress = ref(false);

const updateUserItems = (items) => {
	SmallUserItems.value = items;
}

const updateInventory = () => {
	emit('updateBoardGameInfo');
}

const carouselConfig = {
	dir: 'ttb',
	wrapAround: true,
	itemsToShow: 2,
	snapAlign: 'center',
	height: '180px',
	gap: 2,
	pauseAutoplayOnHover: true,
	autoplay: 5000,
	mouseWheel: true,
}

const currentPlayer = computed(() => {
	let curPlayer = props.boardGameInfo.players.filter((item) => item.user_id === userStore.user.id);

	if (curPlayer && curPlayer[0]) {
		return curPlayer[0];
	}
});

const setUserItems = (inventory) => {
	UserItems.value = [];
	SmallUserItems.value = [];
	UsedItems.value = [];

	if (inventory) {
		inventory.forEach((item) => {
			if (item.has_used === 1) {
				UsedItems.value.push({ ...item.item, inventory_id: item.id });
			} else {
				UserItems.value.push({ ...item.item, inventory_id: item.id });
				SmallUserItems.value.push({ ...item.item, inventory_id: item.id });
			}
		});
	}
};

setUserItems(currentPlayer.value.inventory);

watch(() => props.boardGameInfo, () => {
	setUserItems(currentPlayer.value.inventory);
}, { deep: true });

defineExpose({
	openCloseModalFunc,
});
</script>

<template>
	<div>
		<div class="user-items">
			<Carousel
					v-if="SmallUserItems.length > 2"
					v-bind="carouselConfig"
					class="w-full"
			>
				<Slide
						v-for="(element, key) in SmallUserItems"
						:key="key"
						class="slide"
				>
					<ItemCard
							class="w-full"
							:element="element"
							:cutDescription="true"
							@setOpenedImage="setOpenedImage"
							@deleteItem="deleteItem"
							@useItem="useItem"
							@click="openCloseModalFunc"
					/>
				</Slide>

				<template #addons>
					<Navigation />
					<Pagination />
				</template>
			</Carousel>
			<div
				v-else-if="SmallUserItems.length > 0"
			>
				<div
						v-for="(element, key) in SmallUserItems"
						:key="key"
				>
					<ItemCard
							class="w-full"
							:element="element"
							:cutDescription="true"
							@setOpenedImage="setOpenedImage"
							@deleteItem="deleteItem"
							@useItem="useItem"
							@click="openCloseModalFunc"
					/>
				</div>
			</div>
		</div>
		<div class="button-block">
			<button
					class="btn btn-simple-1 w-full"
					@click="openCloseModalFunc"
			>
				Открыть инвентарь
			</button>
		</div>
	</div>
	<Modal
			:showOpenModal="modalOpen"
			size="full-width"
			:fullCloseModal="true"
			@toggleModal="openCloseModalFunc"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Инвентарь</h3>
			<div class="link-parent-box">
				<ui-BigPreloader v-if="modalLoading" />
				<InventoryInterface
						v-show="!modalLoading"
						:UserItems="UserItems"
						:UsedItems="UsedItems"
						:boardGameInfo="boardGameInfo"
						@fetchLogs="emit('fetchLogs')"
						@updateUserItems="updateUserItems"
						@updateBoardGameInfo="emit('updateBoardGameInfo')"
						@updateInventory="updateInventory"
						@loadingToggle="modalLoading = !modalLoading"
				/>
			</div>
		</div>
	</Modal>

	<LightBox
			v-if="openedImage"
			:image="openedImage"
			:setViewsLog="true"
			@setCurrentElement="setOpenedImage"
	/>
</template>

<style lang="scss" scoped>
.user-items {
	@apply max-h-[275px];

	overflow: auto;
	scrollbar-width: none; /* Firefox */
	-ms-overflow-style: none; /* IE и Edge */

	&::-webkit-scrollbar {
		display: none; /* Chrome, Safari, Opera */
	}
}

.button-block {
	@apply text-center;
}
</style>

<style lang="scss">
.user-items {
	.carousel__prev,
	.carousel__next,
	.carousel__pagination-button {
		@apply text-[var(--main-dark-text-color)];
	}

	.carousel__pagination-button {
		@apply bg-[var(--second-border-color)];
	}

	.carousel__pagination-button--active {
		@apply bg-[var(--main-dark-text-color)];
	}
}
</style>
