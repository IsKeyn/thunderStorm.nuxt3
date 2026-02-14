<script setup>
import LogCard from '@/modules/boardGame/components/log-list/LogCard.vue';
import Pagination from '@/components/navigation/Pagination.vue';

import {computed, onMounted, onUnmounted, ref} from 'vue'

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

import { helper } from '@/composables/helper.js'
const { route } = helper();

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

const hiddenRefresh = ref(false);
const requestName = 'getBoardGameLogList';

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
					sendApiRequest(`board-game/v2/log/list/${route.params.slug}`, 'GET', query, requestName, '')
			);

			hiddenRefresh.value = false;

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

// Передаем функцию refresh в композабл pagination
setRefresh(refresh);

const fetchedData = computed(() => requestData.value?.data || null);
const paginationData = computed(() => requestData.value?.meta || null);

const updateLogs = async () => {
	hiddenRefresh.value = true;
	await refresh();
}

const interval = ref(null);

onMounted(() => {
	interval.value = setInterval(() => {
		if (page.value === 1) {
			updateLogs();
		}
	}, 10000);
})

onUnmounted(() => {
	if (interval.value) {
		clearInterval(interval.value);
	}
});
</script>

<template>
	<ui-BigPreloader
			v-if="requestInProgress && !hiddenRefresh"
	/>
	<div
			v-else-if="fetchedData && fetchedData.length > 0"
			class="log-box"
	>
		<LogCard
				v-for="(log, key) in fetchedData"
				:key="key"
				:element="log"
				:useLightBox="true"
		/>
	</div>
	<ui-itemBox
			v-else
			borderColor="red"
			message="Логи отсутствуют"
	/>
	<Pagination
			v-if="paginationData"
			:pagination="paginationData"
			:navigationButtons="true"
			@changePage="changePage"
			@setPerPage="setPerPage"
	/>
</template>

<style lang="scss" scoped></style>
