<script setup>
import LogCard from '@/modules/boardGame/components/log-list/LogCard.vue';
import Pagination from '@/components/navigation/Pagination.vue';

import { computed, onMounted, onUnmounted } from 'vue'

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

const props = defineProps({
	perPage: {
		type: Number,
		default: 10,
	},
});

const route = useRoute();

const page = ref(route.query.page ? Number(route.query.page) : 1);
const perPageCount = ref(route.query.perPage ? Number(route.query.perPage) : props.perPage);

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
				perPage: perPageCount.value,
			};

			const response = await Promise.resolve(
					sendApiRequest(`board-game/v2/log/list/${route.params.slug}`, 'GET', query, requestName, '')
			);

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value?.data || null);
const paginationData = computed(() => requestData.value?.meta || null);

const updateLogs = async () => {
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

const changePage = async (p) => {
	page.value = p;
	refresh();
}

const setPerPage = (count) => {
	const maxPage = Math.ceil(paginationData.value.total / count);

	if (page.value > maxPage) {
		page.value = maxPage;
	}

	perPageCount.value = count;
	refresh();
}
</script>

<template>
	<div
			v-if="fetchedData && fetchedData.length > 0"
			class="log-box"
	>
		<LogCard
				v-for="(log, key) in fetchedData"
				:key="key"
				:element="log"
				:useLightBox="true"
		/>
		<Pagination
				v-if="paginationData"
				:pagination="paginationData"
				:navigationButtons="true"
				@changePage="changePage"
				@setPerPage="setPerPage"
		/>
	</div>
	<template v-else>
		Логи отсутствуют
	</template>
</template>

<style lang="scss" scoped></style>
