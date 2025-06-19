<script setup>
import ItemCard from '@/components/boardGame/inventory/ItemCard.vue';
import LightBox from '@/components/media/LightBox.vue'
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

import { ref, watch } from "vue";

const emit = defineEmits(['setOpenedImage', 'loadingToggle']);

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

const form = ref(
		{
			searchLine: {
				name: 'Поиск',
				value: '',
				type: 'text',
				placeholder: 'Начните вводить название предмета, для фильтрации',
				validateRules: 'required, minLength_2, maxLength_50',
				classes: 'w-full',
			},
		},
);

/* Получение данных */
const itemList = ref([]);

const filteredItems = ref(null);

const useFilter = () => {
	const filteredItemsVal = itemList.value.filter((item) => {
		return item.name.toLowerCase().includes(form.value.searchLine.value ? form.value.searchLine.value.toLowerCase() : '');
	});

	filteredItems.value = filteredItemsVal;
}

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
									useFilter();
								} else {
									error('Request error', 5000);
								}

								requestInProgress.value = false;
								emit('loadingToggle');
							}
						},
				);
			} catch (e) {
				errorHandler(e);
				requestInProgress.value = false;
				emit('loadingToggle');
			}
		}
);

watch(form.value.searchLine, () => {
	useFilter();
}, { deep: true });
</script>

<template>
	<BigPreloader v-if="requestInProgress" />
	<div v-else class="wrapper">
		<FormGenerator
				v-if="form.searchLine"
				name="search"
				class="w-1/2"
				:element="form.searchLine"
				:showTitle="false"
				:clearButton="true"
				validateErrorPosition="bottom"
				labelClasses="mr-4 mt-[10px] mb-[10px]"
				:fieldClasses="form.searchLine.classes"
		/>
		<span v-if="itemList && itemList.length === 0">Предметов нет</span>
		<ItemCard
				v-else
				v-for="(element, key) in filteredItems"
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

<style lang="scss">
input[name="search"] {
	@apply bg-[var(--third-bg-color)];
}
</style>
