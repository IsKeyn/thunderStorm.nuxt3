<script setup>
import PageHeader from '@/components/layout/PageHeader.vue';
import EntertainmentListCard from '@/components/entertainment/card/EntertainmentListCard.vue';
import Pagination from '@/components/navigation/Pagination.vue';

import { computed } from "vue";

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { helper } from '@/composables/helper.js'
const { route } = helper();

const props = defineProps({
	entity: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		default: 'Равлекательный контент',
	},
	title: {
		type: String,
		default: 'Список развлекательного контента',
	},
	useGroups: {
		type: Boolean,
		default: false,
	},
	perPage: {
		type: Number,
		default: 24,
	},
});

import { pagination } from '@/composables/ui/pagination.js'
const {
	page,
	perPage,
	setRefresh,
	changePage,
	setPerPage
} = pagination(props.perPage);

const requestName =  props.entity + 'EntertainmentList';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const query = {
				page: page.value,
				perPage: perPage.value,
			};

			const response = await Promise.resolve(
					sendApiRequest(`${props.entity}/list`, 'GET', query, requestName, '')
			);

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

// Передаем функцию refresh в композабл pagination
setRefresh(refresh);

const fetchedData = computed(() => requestData.value?.data || []);
const paginationData = computed(() => requestData.value?.meta || null);

const getBreadCrumbs = () => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: props.name,
			href: `/${splitedPath[1]}/`,
		},
	];
}

const dataByGroups = computed(() => {
	let returnData = [];
	let preparedData = {};

	if (fetchedData.value) {
		fetchedData.value.forEach((item) => {
			if (!item.groups || item.groups.length === 0) {
				if (!preparedData.hasOwnProperty('emptyGroup')) {
					preparedData.emptyGroup = {
						name: 'Без группы',
						sort: 9999,
						items: [],
					};
				}

				preparedData.emptyGroup.items.push(item);
			} else {
				item.groups.forEach((it) => {
					if (!preparedData.hasOwnProperty(it.slug)) {
						preparedData[it.slug] = {
							name: it.name,
							sort: it.sort,
							items: [],
						};
					}

					preparedData[it.slug].items.push(item);
				});
			}
		});
	}

	for (let key in preparedData) {
		returnData.push(preparedData[key]);
	}

	returnData.sort(function(a, b) {
		return a.sort - b.sort;
	});

	return returnData;
});
</script>

<template>
	<PageHeader
			:title="title"
			:breadCrumbs="getBreadCrumbs()"
	/>
	<ui-BigPreloader
			v-if="requestInProgress"
			class="h-full"
			theme="image"
			:themeType="9"
	/>
	<div v-else-if="fetchedData && fetchedData.length > 0">
		<template v-if="useGroups">
			<div v-if="dataByGroups">
					<div class="group" v-for="(group, key) in dataByGroups">
						<span class="title">{{ group.name }}</span>
						<div class="game-list">
							<EntertainmentListCard
									v-for="(game, index) in group.items"
									:key="key"
									:data="data"
									:entity="entity"
							/>
						</div>
					</div>
			</div>
		</template>
		<template v-else>
			<div class="game-list">
				<EntertainmentListCard
						v-for="(data, index) in fetchedData"
						:key="key"
						:data="data"
						:entity="entity"
				/>
			</div>
		</template>
	</div>
	<ui-itemBox
			v-else
			borderColor="red"
	/>
	<Pagination
			v-if="paginationData"
			:pagination="paginationData"
			:navigationButtons="true"
			:perPageOptionsProp="[24, 48, 96]"
			@changePage="changePage"
			@setPerPage="setPerPage"
	/>
</template>

<style scoped lang="scss">
.group {
	@apply mb-10;
}

.game-list {
	@apply grid grid-cols-12 gap-x-[1rem] gap-y-[1rem];
}
</style>
