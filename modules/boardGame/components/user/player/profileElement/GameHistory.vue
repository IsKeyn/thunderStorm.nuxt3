<script setup>
import DoughnutChart from '@/components/ui/charts/DoughnutChart.vue';
import Pagination from '@/components/navigation/Pagination.vue';
import GameCard from '@/modules/boardGame/components/game/GameCard.vue';

import { computed, watch } from "vue";

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { animate } from '@/composables/animate.js';
const { scrollToElement } = animate();

const props = defineProps({
	userName: {
		type: String,
		default: null,
	},
	perPage: {
		type: Number,
		default: 10,
	},
	contentBlockClass: {
		type: String,
		default: 'game-history-list-content',
	}
});

import { pagination } from '@/composables/ui/pagination.js'
const {
	page,
	perPage,
	scrollAfterLoad,
	setRefresh,
	changePage,
	setPerPage
} = pagination(props.perPage);

const requestName = 'getBoardGamePlayerGameHistory';

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
					perPage: perPage.value,
				};

				const response = await Promise.resolve(
						sendApiRequest(`board-game/v2/player/getGames/${route.params.slug}/${props.userName}`, 'GET', query, requestName, '')
				);

				return response || null;
			}
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value?.data || []);
const dataForChart = computed(() => requestData.value?.data_for_chart || []);
const paginationData = computed(() => requestData.value?.meta || null);

// Передаем функцию refresh в композабл pagination
setRefresh(refresh);

const chartData = ref({});

watch(() => dataForChart.value, () => {
	chartData.value = {
		labels: ['Пройденные', 'Рерольнутые', 'Отданные'],
		datasets: [
			{
				label: 'Игры',
				data: dataForChart.value,
				backgroundColor: [
					'#005d00',
					'#600000',
					'#000460'
				],
				borderColor: 'rgba(0, 0, 0, 0)', // Цвет обводки
				borderWidth: 2, // Толщина обводки
				hoverOffset: 4
			}
		]
	};
}, { deep: true, immediate: true });

const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: 'right',
			labels: {
				color: '#C0C0C0' // Черный цвет для текста легенды
			}
		},
		tooltip: {
			titleColor: '#C0C0C0', // Черный цвет заголовка подсказки
			bodyColor: '#C0C0C0'  // Черный цвет текста подсказки
		}
	}
}

watch(
		() => [fetchedData.value, requestInProgress.value],
		async ([newData, isPending]) => {
			// Ждем, пока данные загрузятся И прелоадер исчезнет
			if (scrollAfterLoad.value && newData && newData.length && !isPending) {
				await nextTick();

				setTimeout(() => {
					scrollToElement(`.${props.contentBlockClass}`);
					scrollAfterLoad.value = false;
				}, 50);
			}
		},
		{ deep: true }
);
</script>

<template>
	<ui-BigPreloader
			v-if="requestInProgress"
			class="h-full"
			theme="image"
			:themeType="9"
	/>
	<div v-else-if="fetchedData && fetchedData.length">
		<div class="item-box game-count-line">
			<DoughnutChart :chart-data="chartData" :chart-options="chartOptions" />
		</div>
		<div :class="[contentBlockClass]">
			<GameCard
					v-for="(element, key) in fetchedData"
					:key="key"
					:element="element"
			/>
		</div>
	</div>
	<ui-itemBox
			v-else
			classes="red"
			message="История игр отсутствует"
	/>

	<Pagination
			v-if="paginationData"
			:pagination="paginationData"
			:navigationButtons="true"
			:perPageOptionsProp="[10, 20, 40]"
			:setQueryParams="false"
			@changePage="changePage"
			@setPerPage="setPerPage"
	/>
</template>

<style lang="scss" scoped>
.game-count-line {
	@apply flex justify-center;

	span {
		@apply block lg:inline mr-[1.5rem];
	}
}
</style>
