<script setup>
import Modal from '@/components/modals/Modal.vue';
import InventoryInterface from '@/components/boardGame/inventory/InventoryInterface.vue';
import ItemCard from '@/components/boardGame/inventory/ItemCard.vue';
import LightBox from '@/components/media/LightBox.vue'

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

import { ref } from "vue";

const emit = defineEmits(['fetchLogs']);

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
});

const modalOpen = ref(false);

const openCloseModalFunc = () => {
	modalOpen.value = !modalOpen.value;
};

/* Получение данных */
const ItemList = ref([]);
const UserItems = ref([]);
const SmallUserItems = ref([]);
const UsedItems = ref([]);

const requestInProgress = ref(false);

const { refresh } = await useAsyncData(
		async () => {
			let request = `${apiUrl.value}board-game/getItemAndInventory`;

			const query = {
				board_game_id: props.boardGameId,
			};
			const sessionCookie = useCookie(sessionCookieName.value);

			requestInProgress.value = true;

			try {
				await $fetch(
						request,
						{
							method: 'GET',
							credentials: 'include',
							query,
							headers: {
								Accept: 'application/json',
								Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
								Referer: publicUrl.value,
							},
							onResponse({response}) {
								if (response.status === 200) {
									ItemList.value = response._data.items;

									if (response._data.inventory) {
										response._data.inventory.forEach((item) => {
											if (item.has_used === 1) {
												UsedItems.value.push({ ...item.item, inventory_id: item.id });
											} else {
												UserItems.value.push({ ...item.item, inventory_id: item.id });
												SmallUserItems.value.push({ ...item.item, inventory_id: item.id });
											}
										})
									}
								} else {
									error('Request error', 5000);
								}

								requestInProgress.value = false;
							}
						},
				);
			} catch (e) {
				errorHandler(e);
				requestInProgress.value = false;
			}
		}
);

const updateUserItems = (items) => {
	SmallUserItems.value = items;
}
</script>

<template>
	<div>
		<div class="user-items">
			<div
					v-for="(element, key) in SmallUserItems"
					class="wrapper"
					:key="key"
			>
				<span v-if="SmallUserItems.length === 0">Предметов нет</span>
				<ItemCard
						:element="element"
						:cutDescription="true"
						@setOpenedImage="setOpenedImage"
						@deleteItem="deleteItem"
						@useItem="useItem"
				/>
			</div>
		</div>

		<div class="button-block">
			<button
					class="btn btn-primary"
					@click="openCloseModalFunc"
			>
				Открыть инвентарь
			</button>
		</div>
	</div>
	<Modal
			:showOpenModal="modalOpen"
			size="full-width"
			@toggleModal="openCloseModalFunc"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Инвентарь</h3>
			<div class="link-parent-box">
				<InventoryInterface
						:ItemList="ItemList"
						:UserItems="UserItems"
						:UsedItems="UsedItems"
						@fetchLogs="emit('fetchLogs')"
						@updateUserItems="updateUserItems"
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
	@apply text-center mt-[1rem];
}
</style>
