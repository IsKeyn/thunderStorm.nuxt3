<script setup>
import SelectWithSearch from '@/components/forms/fragments/SelectWithSearch.vue';
import TagsList from '@/components/tags/TagsList.vue';

import { ref, watch } from "vue";

import { useFiltersStore } from '@/stores/filters';
const filtersStore = useFiltersStore();

import { filters } from '@/composables/filters/filters.js';
const { setFilter } = filters();

import { helper } from '@/composables/helper.js'
const { route, router } = helper();

const props = defineProps({
	entity: {
		type: String,
		default: 'game',
	},
	setQueryParams: {
		type: Boolean,
		default: true,
	},
	fetchedData: {
		type: Object,
		default: {},
	},
	usedFilters: {
		type: Array,
		default: [
			{
				name: 'gamePlatforms',
				langName: 'Игровые платформы',
				type: 'multiselect',
			},
			{
				name: 'genres',
				langName: 'Жанры',
				type: 'multiselect',
			},
			{
				name: 'companies',
				langName: 'Компании',
				type: 'multiselect',
			},
			{
				name: 'tags',
				langName: 'Теги',
				type: 'curtained',
			},
		],
	},
});

const filtersModel = ref({
	gamePlatforms: [],
	genres: [],
	companies: [],
	tags: [],
});

let disableSendData = false;
let formForEdit = null;

const setDefaultData = (disableSend = false) => {
	if (filtersStore.filters?.[props.entity]) {
		const rawForm = toRaw(filtersModel.value);
		formForEdit = structuredClone(rawForm);

		props.usedFilters.forEach((item) => {
			if (filtersStore.filters[props.entity][item.name] && filtersStore.filters[props.entity][item.name].length > 0) {
				formForEdit[item.name] = [...filtersStore.filters[props.entity][item.name]];
			} else {
				formForEdit[item.name] = [];
			}
		});

		if (JSON.stringify(filtersModel.value) !== JSON.stringify(formForEdit)) {
			disableSendData = disableSend;
			filtersModel.value = structuredClone(formForEdit);
		}
	}
}

setDefaultData();

watch(() => filtersStore.filters?.[props.entity], () => {
	setDefaultData(true);
}, { deep: true });

watch(filtersModel, () => {
	if (disableSendData) {
		disableSendData = false;
		return false;
	}

	if (JSON.stringify(filtersModel.value) !== JSON.stringify(formForEdit)) {
		sendData();
	}
}, { deep: true });

const sendData = () => {
	const filtersData = {};

	const query = {
		...route.query,
	};

	/* Фильтрация данных передающихся в формате JSON */
	props.usedFilters.forEach((item) => {
		if (filtersModel.value[item.name]) {
			filtersData[item.name] = [...filtersModel.value[item.name]];

			if (filtersModel.value[item.name].length > 0) {
				query[item.name] = JSON.stringify(filtersData[item.name]);
			} else if (query[item.name]) {
				delete query[item.name];
			}
		}
	});

	if (props.setQueryParams) {
		router.push({
			name: route.name,
			query,
		});
	}

	setFilter(filtersData, props.entity);
}
</script>

<template>
	<div class="field">
		<template
				v-for="(filter, key) in usedFilters"
				:key="key"
		>
			<div
					v-if="filter.type === 'multiselect' && fetchedData[filter.name]"
					class="element"
			>
				<SelectWithSearch
						class="mt-2"
						:options="fetchedData[filter.name].filter((item) => item.active === true)"
						valueKey="id"
						:multiSelect="true"
						:emptyFieldName="filter.langName"
						v-model="filtersModel[filter.name]"
				/>
			</div>
		</template>
	</div>
	<div>
		<template
				v-for="(filter, key) in usedFilters"
				:key="key"
		>
			<ui-ShowMoreBlock
					v-if="filter.type === 'curtained' && fetchedData[filter.name].filter((item) => item.active === true)"
					:names="{
							showMore: 'Открыть список фильтров по: ' + filter.langName,
							showLess: 'Закрыть список фильтров по: ' + filter.langName,
						}"
			>
				<template #default>
					<span class="block text-[1.2rem] mt-4"><span class="strong">Фильтрация по: {{ filter.langName }}</span></span>
				</template>
				<template #hiddenContent >
					<TagsList
							class="col-span-8 mt-4"
							:canAddTags="false"
							:fetchTags="!fetchedData[filter.name].length"
							:tags="fetchedData[filter.name].filter((item) => item.active === true)"
							type="media"
							:tagsCountForShow="35"
							v-model="filtersModel[filter.name]"
					/>
				</template>
			</ui-ShowMoreBlock>
		</template>
	</div>
</template>

<style lang="scss" scoped>
.field {
	@apply flex gap-2;

	.element {
		@apply w-full md:w-1/3 pt-2 pb-2;
	}
}
</style>
