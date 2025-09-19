<script setup>
import LogCard from '@/modules/boardGame/components/log-list/LogCard.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';

import { computed } from "vue";

const props = defineProps({
	userName: {
		type: String,
		default: {},
	},
	perPage: {
		type: Number,
		default: 10,
	},
});

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

const route = useRoute();

const page = ref(route.query.page ? Number(route.query.page) : 1);
const perPageCount = ref(route.query.perPage ? Number(route.query.perPage) : props.perPage);

const requestName = 'getBoardGamePlayerLogs';

const typeAddedData = ref('');
const logsResult = ref([]);

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (props.userName) {
				const query = {
					page: page.value,
					perPage: perPageCount.value,
				};

				const response = await Promise.resolve(
						sendApiRequest(`board-game/v2/log/get/${route.params.slug}/${props.userName}`, 'GET', query, requestName, '')
				);

				return response || null;
			}
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value?.data || null);
const paginationData = computed(() => requestData.value?.meta || null);

watch(() => fetchedData.value, (newData) => {
	if (typeAddedData.value === 'show_more') {
		logsResult.value = logsResult.value.concat(newData);
	} else {
		logsResult.value = newData;
	}
}, { deep: true, immediate: true });

const getNextPage = async () => {
	if (paginationData.value.current_page < paginationData.value.last_page) {
		typeAddedData.value = 'show_more';
		page.value += 1;
		await refresh();
	}
}
</script>

<template>
	<ui-BigPreloader v-if="typeAddedData !== 'show_more' && requestInProgress" />
	<template v-else>
		<LogCard
				v-for="(log, key) in logsResult"
				:key="key"
				:element="log"
				theme="simple"
		/>
		<div
				v-if="paginationData && paginationData.current_page < paginationData.last_page"
				class="text-center"
		>
			<ActionButton
					buttonName="Показать ещё"
					buttonClasses="btn btn-simple-1 min-w-24"
					:actionInProgress="requestInProgress"
					@startAction="getNextPage"
			/>
		</div>
	</template>
</template>

<style lang="scss" scoped></style>
