<script setup>
import { computed } from "vue";

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

const requestName = 'getServerTime';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const query = {};

			const response = await Promise.resolve(
					sendApiRequest(
							'admin/get-server-time',
							'GET',
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

const fetchedData = computed(() => requestData.value || null);
</script>

<template>
	<div>
		<span class="sub-title">Время сервера</span>
		<ui-itemBox
				v-if="fetchedData"
				:message="fetchedData"
				classes="green"
		/>
		<button @click="refresh" class="btn btn-simple">Обновить</button>
	</div>
</template>

<style lang="scss" scoped>

</style>
