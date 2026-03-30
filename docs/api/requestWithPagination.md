# Получение данных и использовании пагинации на странице

## Из API
### useAsyncData

```bash
import Pagination from '@/components/navigation/Pagination.vue';

import { computed } from "vue";

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

const props = defineProps({
	perPage: {
		type: Number,
		default: 10,
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

const requestName = 'getData';

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
                sendApiRequest(
                    `url`, // url на конечном api
                    'GET', // Метод запроса
                    query, // Тело запроса
                    requestName, // Имя запроса, системно, используется для логов запросов
                    'fullscreen' // Тип прелоадера, который используется при загрузки данных
                )
            );

			return response?.data || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value?.data || []);
const paginationData = computed(() => requestData.value?.meta || null);

// Передаем функцию refresh в композабл pagination
setRefresh(refresh);
```
```bash
<template>
	<ui-BigPreloader
			v-if="requestInProgress"
			class="h-full"
			theme="image"
			:themeType="9"
	/>
	<div v-else-if="fetchedData">
		{{ fetchedData }}
		<Pagination
				v-if="paginationData"
				:pagination="paginationData"
				:navigationButtons="true"
				:perPageOptionsProp="[10, 20, 30]"
				@changePage="changePage"
				@setPerPage="setPerPage"
		/>
	</div>
	<ui-itemBox
			v-else
			borderColor="red"
	/>
</template>
```
