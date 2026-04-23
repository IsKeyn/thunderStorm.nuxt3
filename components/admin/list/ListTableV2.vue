<script setup>
import ResponseErrorsComponent from '@/components/forms/fragments/ResponseErrorsComponent.vue';
import SearchFilterSort from '@/components/filters/SearchFilterSort.vue';
import EntityTable from '@/components/admin/tables/EntityTable.vue';
import Pagination from '@/components/navigation/Pagination.vue';

import { computed } from "vue";

import { useFiltersStore } from '@/stores/filters';
const filtersStore = useFiltersStore();

import { notifications } from '@/composables/notifications.js';
const { alert, choiceAlert } = notifications();

import { api } from '@/composables/api.js'
const { sendApiRequest, errorHandler } = api();

import { helper } from '@/composables/helper.js'
const { route, router } = helper();

import { filters } from '@/composables/filters/filters.js';
const {
	setFilterName,
	setFilter,
	setQueryFilters,
} = filters();

const props = defineProps({
	/* Опции запроса */
	fetchUrl: {
		type: String,
		default: '',
	},
	method: {
		type: String,
		default: 'GET',
	},
	hasResource: {
		type: Boolean,
		default: false,
	},

	/* Заголовки таблицы */
	titles: {
		type: Object,
		default: {},
	},
	/* Системные/общие заголовки таблицы */
	systemTitles: {
		type: Object,
		default: {
			created_at: {
				name: 'Дата создания',
				sortable: true,
			},
			updated_at: {
				name: 'Дата обновления',
				sortable: true,
			},
			deleted_at: {
				name: 'Дата удаления',
				sortable: true,
			},
			doTypes: {
				name: 'Действия',
			},
		},
	},
	/* Сообщение, когда элементов не найдено */
	nullMessage: {
		type: String,
		default: 'Записи не найдены',
	},

	/* Ключ в котором находятся заголовки */
	titleKey: {
		type: String,
		default: 'name',
	},

	/* Опции пагинации */
	usePagination: {
		type: Boolean,
		default: false,
	},
	perPage: {
		type: Number,
		default: 15,
	},
	perPageOptionsProp: {
		type: Array,
		default: () => [15, 30, 60],
	},

	/* Возможность добавлять несколько элементов */
	hasMultiUpload: {
		type: Boolean,
		default: false,
	},
	/* Дополнительные кнопки */
	additionalButtons: {
		type: Array,
		default: [],
	},

	/* url страницы в публичной части сайта */
	previewUrl: {
		type: String,
		default: null,
	},

	/* Свойства для фильтра */
	entity: {
		type: String,
		default: null,
	},
	usedFilters: {
		type: Array,
		default: [],
	},
	defaultFilters: {
		type: Array,
		default: [],
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

const filterName = setFilterName([ 'adminList', props.fetchUrl ]);

// Устанавливаем фильтры из get параметров
setQueryFilters(filterName, props.usedFilters, props.defaultFilters);

let requestName = 'adminEntityList';
if (props.fetchUrl) requestName += '_' + props.fetchUrl;

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
				filters: filtersStore.filters[filterName],
			};

			const response = await Promise.resolve(
					sendApiRequest(
							props.fetchUrl,
							props.method,
							query,
							requestName,
					)
			);

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value ? (props.hasResource ? requestData.value.data : requestData.value) : null);
const paginationData = computed(() => requestData.value?.meta || null);

// Передаем функцию refresh в композабл pagination
setRefresh(refresh);

/* НАЧАЛО: Фильтры */
let oldFilter = filtersStore.filters[filterName] ?? {};

const updateDataWithFilters = () => {
	if (JSON.stringify(oldFilter) !== JSON.stringify(filtersStore.filters?.[filterName])) {
		oldFilter = filtersStore.filters?.[filterName];
		page.value = 1;
		refresh();
	}
}

// Отслеживаем нажатие кнопок назад\вперед в браузере, для обновления фильтра, в случае изменении get параметров
const isBrowserNavigation = ref(false);
const handlePopState = async () => { isBrowserNavigation.value = true; };

onMounted(() => { window.addEventListener('popstate', handlePopState); });
onUnmounted(() => { window.removeEventListener('popstate', handlePopState); });

watch(() => route.query, async () => {
	/* TODO на данный момент нет решения без таймаута, проблема в том, что сначала срабатывает данный watch, а потом событие popstate */
	setTimeout(() => {
		if (isBrowserNavigation.value) {
			isBrowserNavigation.value = false;
			setQueryFilters(filterName);
			updateDataWithFilters();
		}
	}, 100)}, { deep: true }
);

watch(() => filtersStore.filters?.[filterName], () => {
	updateDataWithFilters();
}, { deep: true });

/* КОНЕЦ: Фильтры */

const pageUrl = computed(() => {
	return route.matched[0].path;
});

const responseErrors = ref({});

const deleteElement = (item) => {
	const message = item[props.titleKey] ? `Удалить элемент "${item[props.titleKey]}"?` : 'Вы действительно уверены, что хотите удалить этот элемент?';

	choiceAlert(
			{
				title: 'Удаление',
				message,
				buttons: [
					{
						name: 'Да',
						func: () => {
							sendRequestForDeleteElement(item.id);
						},
						additionalKeywordFunc: 'close',
					},
					{
						name: 'Нет',
						additionalKeywordFunc: 'close',
					},
				],
			}
	);
};

const sendRequestForDeleteElement = async (id) => {
	responseErrors.value = {};
	requestInProgress.value = true;

	try {
		const response = await sendApiRequest(`${props.fetchUrl}/${id}`, 'DELETE', {});

		if (response) {
			requestInProgress.value = false;

			if (response.error) {
				error(response.error);
			} else {
				refresh();

				alert('Успешно удалено');
			}
		} else {
			error('Произошла ошибка');
			requestInProgress.value = false;
		}
	} catch (e) {
		const errorsPromise = errorHandler(e);

		errorsPromise.then((element) => {
			responseErrors.value = element;
		});
		requestInProgress.value = false;
	}
}

const recoveryElement = (item) => {
	const message = item[props.titleKey] ? `Восстановить элемент "${item[props.titleKey]}"?` : 'Вы действительно уверены, что хотите восстановить этот элемент?';

	choiceAlert(
			{
				title: 'Восстановление',
				message,
				buttons: [
					{
						name: 'Да',
						func: () => {
							sendRequestForRecoveryElement(item.id);
						},
						additionalKeywordFunc: 'close',
					},
					{
						name: 'Нет',
						additionalKeywordFunc: 'close',
					},
				],
			}
	);
};

const sendRequestForRecoveryElement = async (id) => {
	responseErrors.value = {};
	requestInProgress.value = true;

	try {
		const response = await sendApiRequest(`${props.fetchUrl}/${id}/recovery`, 'POST', {});

		if (response) {
			requestInProgress.value = false;

			if (response.error) {
				error(response.error);
			} else {
				refresh();

				alert('Успешно восстновлено');
			}
		} else {
			error('Произошла ошибка');
			requestInProgress.value = false;
		}
	} catch (e) {
		const errorsPromise = errorHandler(e);

		errorsPromise.then((element) => {
			responseErrors.value = element;
		});
		requestInProgress.value = false;
	}
}

const forceDeleteElement = (item) => {
	const message = item[props.titleKey] ? `Полностью удалить элемент "${item[props.titleKey]}"?` : 'Вы действительно уверены, что хотите полностью удалить этот элемент?';

	choiceAlert(
			{
				title: 'Полное удаление',
				message,
				buttons: [
					{
						name: 'Да',
						func: () => {
							sendRequestForForceDeleteElement(item.id);
						},
						additionalKeywordFunc: 'close',
					},
					{
						name: 'Нет',
						additionalKeywordFunc: 'close',
					},
				],
			}
	);
};

const sendRequestForForceDeleteElement = async (id) => {
	responseErrors.value = {};
	requestInProgress.value = true;

	try {
		const response = await sendApiRequest(`${props.fetchUrl}/${id}/force-delete`, 'POST', {});

		if (response) {
			requestInProgress.value = false;

			if (response.error) {
				error(response.error);
			} else {
				refresh();

				alert('Успешно полностью удалено');
			}
		} else {
			error('Произошла ошибка');
			requestInProgress.value = false;
		}
	} catch (e) {
		const errorsPromise = errorHandler(e);

		errorsPromise.then((element) => {
			responseErrors.value = element;
		});
		requestInProgress.value = false;
	}
}
</script>

<template>
	<div>
		<ResponseErrorsComponent :responseErrors="responseErrors" />
		<SearchFilterSort
				:entity="props.entity"
				:pagination="paginationData"
				:filterName="filterName"
				:usedFilters="usedFilters"
		/>
		<div v-if="fetchedData && fetchedData.length > 0">
			<div class="relative">
				<ui-BigPreloader
						v-if="requestInProgress"
						class="absolute w-full h-full bg-black/70"
						theme="image"
						:themeType="9"
				/>
				<EntityTable
						:titles="{ ...titles, ...systemTitles }"
						:data="fetchedData"
						:filterName="filterName"
						:previewUrl="previewUrl"
						@deleteElement="deleteElement"
						@recoveryElement="recoveryElement"
						@forceDeleteElement="forceDeleteElement"
				/>
				<Pagination
						v-if="usePagination && paginationData"
						:pagination="paginationData"
						:navigationButtons="true"
						:perPageOptionsProp="perPageOptionsProp"
						@changePage="changePage"
						@setPerPage="setPerPage"
				/>
			</div>
		</div>
		<ui-BigPreloader
				v-else-if="requestInProgress"
				class="h-full"
				theme="image"
				:themeType="9"
		/>
		<ui-itemBox
				v-else
				:message="nullMessage"
				borderColor="red"
		/>
		<router-link :to="`${pageUrl}/create`">
			<button class="btn btn-simple mr-2">Добавить один элемент</button>
		</router-link>
		<router-link
				v-if="hasMultiUpload"
				:to="`${pageUrl}/multi-upload`"
		>
			<button class="btn btn-simple mr-2">Добавить несколько элементов</button>
		</router-link>
		<nuxt-link
				v-for="(button, key) in additionalButtons"
				:to="button.url"
				:title="button.name"
				:key="key"
		>
			<button class="btn btn-simple mr-2">{{ button.name }}</button>
		</nuxt-link>
	</div>
</template>
