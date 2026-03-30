# Получение данных

## Из API
### useAsyncData

useAsyncData - позволяет получить данные с API и корректно работает с SSR

```bash
import { computed } from "vue";

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

const requestName = 'getData';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
            const response = await Promise.resolve(
                sendApiRequest(
                    `url`, // url на конечном api
                    'GET', // Метод запроса
                    {}, // Тело запроса
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

const fetchedData = computed(() => requestData.value || null);
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
	</div>
	<ui-itemBox
			v-else
			borderColor="red"
	/>
</template>
```
