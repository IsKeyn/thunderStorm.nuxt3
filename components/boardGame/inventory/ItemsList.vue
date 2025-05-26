<script setup>
import ItemCard from '@/components/boardGame/inventory/ItemCard.vue';
import LightBox from '@/components/media/LightBox.vue'

import { ref } from "vue";

const emit = defineEmits(['setOpenedImage']);

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

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
});

/* Получение данных */
const itemList = ref([]);

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
									itemList.value = response._data.items;
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
	<div class="wrapper">
		<span v-if="itemList && itemList.length === 0">Предметов нет</span>
		<ItemCard
				v-else
				v-for="(element, key) in itemList"
				:key="key"
				:element="element"
				:useLightBox="true"
				@setOpenedImage="setOpenedImage"
		/>
	</div>

	<LightBox
			v-if="openedImage"
			:image="openedImage"
			:setViewsLog="true"
			@setCurrentElement="setOpenedImage"
	/>
</template>

