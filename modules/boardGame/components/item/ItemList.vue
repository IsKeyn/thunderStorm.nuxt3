<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import ItemCard from '@/modules/boardGame/components/item/ItemCard.vue';

import { computed, ref } from "vue";

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

const form = ref(
		{
			searchLine: {
				name: 'Поиск',
				value: '',
				type: 'text',
				placeholder: 'Начните вводить название предмета, для поиска',
				validateRules: 'required, minLength_2, maxLength_50',
				classes: 'w-full',
			},
		},
);

const route = useRoute();
const requestName = 'getBoardGameItemList';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const response = await Promise.resolve(
					sendApiRequest(`board-game/v2/item/list/${route.params.slug}/`, 'GET', {}, requestName, '')
			);

			return response?.data || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const itemList = computed(() => requestData.value || null);

const filteredItems = computed(() => {
	return itemList.value.filter((item) => {
		return item.item.name.toLowerCase().includes(form.value.searchLine.value ? form.value.searchLine.value.toLowerCase() : '');
	});
});
</script>

<template>
	<ui-BigPreloader v-if="requestInProgress" />
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
		<ItemCard
				v-if="itemList && itemList.length > 0"
				v-for="(element, key) in filteredItems"
				:key="key"
				:element="element"
				:useLightBox="true"
		/>
		<span v-else>Предметов нет</span>
	</div>
</template>
