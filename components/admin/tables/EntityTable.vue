<script setup>
import TdElementCard from '@/components/admin/tables/TdElementCard.vue';

const emit = defineEmits(['deleteElement', 'recoveryElement', 'forceDeleteElement']);

import { ref, watch } from "vue";

import { useFiltersStore } from '@/stores/filters';
const filtersStore = useFiltersStore();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { filters } from '@/composables/filters/filters.js';
const { setFilterName, setFilter } = filters();

import { helper } from '@/composables/helper.js'
const { setQueryParam, route } = helper();

const props = defineProps({
	titles: {
		type: Object,
		default: {},
	},
	data: {
		type: Object,
		default: {},
	},
	entityId: {
		type: Number,
		default: null,
	},
	entityType: {
		type: String,
		default: null,
	},
	setQueryParams: {
		type: Boolean,
		default: true,
	},
	defaultSortValue: {
		type: String,
		default: '',
	},
	defaultSortDirection: {
		type: String,
		default: 'desc',
	},
	pagination: {
		type: Object,
	},

	/* Типы действий */
	doTypes: {
		type: Array,
		default: ['edit'],
	},

	filterName: {
		type: String,
		default: null,
	},
	/* url страницы в публичной части сайта */
	previewUrl: {
		type: String,
		default: null,
	},
});

const requestName = 'tableGetEntityForList';

const {
	data: entities,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const requestsQueue = [];

			for (const key in props.titles) {
				const config = props.titles[key];

				if (config.type === 'EntityList' && config.apiUrl) {
					requestsQueue.push(
							sendApiRequest(config.apiUrl, 'GET', {}, `${requestName}_${key}`, '')
									.then(data => ({ key: config.apiUrl, data, error: null }))
									.catch(err => ({ key: config.apiUrl, data: null, error: err }))
					);
				}
			}

			const listResults = await Promise.all(requestsQueue);
			const listsData = {};

			listResults.forEach(result => {
				if (result) {
					listsData[result.key] = result?.data?.data;
				}
			});

			return listsData;
		},
		{
			server: true,
			lazy: true,
		}
);

const filterName = props.filterName ? props.filterName : setFilterName([ props.entityType, props.entityId ]);

const sort = ref(filtersStore.filters?.[filterName]?.sort?.field ? filtersStore.filters?.[filterName].sort.field : props.defaultSortValue);
const sortDirection = ref(filtersStore.filters?.[filterName]?.sort?.sort ? filtersStore.filters?.[filterName].sort.sort : props.defaultSortDirection);

const setSort = () => {
	if (
			!filtersStore.filters?.[filterName]?.sort
			&& (sort.value === props.defaultSortValue && sortDirection.value === props.defaultSortDirection)
	) {
		return false;
	}

	const sortData = {
		field: sort.value,
		sort: sortDirection.value,
	};

	if (props.setQueryParams) {
		setQueryParam('sort', JSON.stringify(sortData));
	}

	setFilter({ sort: sortData }, filterName);
}

let oldSortValue = false;
let oldSortDirectionValue = false;

watch(() => filtersStore.filters?.[filterName]?.sort, () => {
	oldSortValue = sort.value;
	oldSortDirectionValue = sortDirection.value;

	sort.value = filtersStore.filters?.[filterName]?.sort?.field ? filtersStore.filters?.[filterName].sort.field : props.defaultSortValue;
	sortDirection.value = filtersStore.filters?.[filterName]?.sort?.sort ? filtersStore.filters?.[filterName].sort.sort : props.defaultSortDirection;
}, { deep: true });


watch(sort, () => {
	if (oldSortValue !== sort.value) {
		setSort();
	}
});

watch(sortDirection, () => {
	if (oldSortDirectionValue !== sortDirection.value) {
		setSort();
	}
});

const sortByField = (field) => {
	if (sort.value === field) {
		if (sortDirection.value === 'asc') {
			sortDirection.value = 'desc';
		} else if (sortDirection.value === 'desc') {
			sortDirection.value = 'asc';
		}
	} else {
		sort.value = field;
	}
}

const pageUrl = computed(() => {
	return route.matched[0].path;
});
</script>

<template>
	<table>
		<thead>
		<tr>
			<th
					v-for="(title, key) in titles"
					:key="key"
					:class="[(title?.sortable ? 'sortable' : ''), title?.classes]"
					@click="title?.sortable ? sortByField(key) : null"
			>
				{{ title.name }}
				<div
						v-if="sort === key"
						class="icon-box"
				>
					<font-awesome-icon v-if="sortDirection === 'asc'" :icon="['fas', 'angle-up']" />
					<font-awesome-icon v-if="sortDirection === 'desc'" :icon="['fas', 'angle-down']" />
				</div>
			</th>
		</tr>
		</thead>
		<tbody>
		<tr v-for="item in data">
			<td v-for="(titleEl, key) in titles">
				<TdElementCard
						:item="item"
						:titleEl="titleEl"
						:keyName="key"
						:pageUrl="pageUrl"
						:entities="entities"
						:entityId="entityId"
						:doTypes="doTypes"
						:previewUrl="previewUrl"
						@deleteElement="$emit('deleteElement', $event)"
						@recoveryElement="$emit('recoveryElement', $event)"
						@forceDeleteElement="$emit('forceDeleteElement', $event)"
				>
					<template v-if="key === 'doTypes'" #doTypes>
						<slot name="doTypes"/>
					</template>
				</TdElementCard>
			</td>
		</tr>
		</tbody>
	</table>
</template>

<style lang="scss" scoped>
table {
	@apply w-full;
	border-collapse: separate;
	border-spacing: 2px 0;

	thead {
		@apply bg-[var(--main-href-color)];

		tr {
			th {
				@apply text-left p-[5px] cursor-pointer relative pr-8;

				&.sortable {
					&:hover {
						@apply bg-[var(--main-hover-color)];
					}
				}

				.icon-box {
					@apply absolute right-2 top-1/2 -translate-y-1/2;
				}
			}
		}
	}

	tbody {
		tr {
			td {
				@apply p-[5px];

				.svg-inline--fa {
					@apply mr-[5px] text-[18px];
				}
			}

			&:hover {
				@apply bg-[var(--second-bg-color)];
			}
		}
	}
}
</style>
