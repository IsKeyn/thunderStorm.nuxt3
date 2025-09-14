<script setup>
import LogCard from '@/modules/boardGame/components/log-list/LogCard.vue';
import Pagination from '@/components/navigation/Pagination.vue';

import { computed, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['showPlayer']);

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

const props = defineProps({
	perPage: {
		type: Number,
		default: 10,
	},
});

const route = useRoute();
const requestName = 'getBoardGameLogList';

const pagination = ref(null);
const page = ref(1);
const perPageCount = ref(props.perPage);

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const query = {
				boardGameId: props.boardGameId,
				page: page.value,
				perPage: perPageCount.value,
			};

			const response = await Promise.resolve(
					sendApiRequest(`board-game/v2/log/list/${route.params.slug}`, 'GET', query, requestName, '')
			);

			pagination.value = response.meta;
			return response?.data || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value || null);


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
				:boardGameInfo="boardGameInfo"
				@setOpenedImage="setOpenedImage"
				@showPlayer="$emit('showPlayer', $event)"
		/>
		<Pagination
				v-if="pagination"
				:pagination="pagination"
				:navigationButtons="true"
				@changePage="changePage"
				@setPerPage="setPerPage"
		/>
	</div>
	<template v-else>
		Логи отсутствуют
	</template>
</template>

<style lang="scss" scoped>
.log-box {
	.log-title {
		@apply block mb-2 text-[1.5rem];
	}
}
</style>
