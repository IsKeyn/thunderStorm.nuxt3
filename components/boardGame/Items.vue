<script setup>
import Modal from '@/components/modals/Modal.vue';
import ItemsList from '@/components/boardGame/inventory/ItemsList.vue';
import LightBox from '@/components/media/LightBox.vue'

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
</script>

<template>
	<div class="text-center">
		<button
				class="btn btn-simple-1 ml-[1rem]"
				@click="openCloseModalFunc"
		>
			Предметы <font-awesome-icon :icon="['fas', 'hat-wizard']" />
		</button>
	</div>
	<Modal
			:showOpenModal="modalOpen"
			size="full-width"
			@toggleModal="openCloseModalFunc"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Предметы</h3>
			<div class="link-parent-box">
				<ItemsList
						:itemList="ItemList"
						@setOpenedImage="setOpenedImage"
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
