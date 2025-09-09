<script setup>
import DoughnutChart from '@/components/ui/charts/DoughnutChart.vue';
import ProfileGameCard from '@/modules/boardGame/components/game/ProfileGameCard.vue';

import { computed } from "vue";

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

const props = defineProps({
	userName: {
		type: String,
		default: '',
	},
});

const route = useRoute();
const requestName = 'getBoardGamePlayerGameHistory';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (props.userName) {
				const response = await Promise.resolve(
						sendApiRequest(`board-game/v2/player/getGames/${route.params.slug}/${props.userName}`, 'GET', {}, requestName, '')
				);

				return response?.data || null;
			}
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value || null);

const finishedGamesCount = computed(() => {
	return fetchedData.value ? fetchedData.value.filter((item) => item.status === 2).length : [];
});

const rerolledGamesCount = computed(() => {
	return fetchedData.value ? fetchedData.value.filter((item) => item.status === 1).length : [];
});

const givenAwayGamesCount = computed(() => {
	return fetchedData.value ? fetchedData.value.filter((item) => item.status === 3).length : [];
});

const chartData = {
	labels: ['Пройденные', 'Рерольнутые', 'Отданные'],
	datasets: [
		{
			label: 'Игры',
			data: [
				finishedGamesCount,
				rerolledGamesCount,
				givenAwayGamesCount
			],
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
		// title: {
		// 	display: true,
		// 	text: 'Игры',
		// 	color: '#000000' // Черный цвет для заголовка
		// },
		tooltip: {
			titleColor: '#C0C0C0', // Черный цвет заголовка подсказки
			bodyColor: '#C0C0C0'  // Черный цвет текста подсказки
		}
	}
}

fetchedData.value = null;
</script>

<template>
	<ui-BigPreloader v-if="requestInProgress" />
	<template v-else-if="fetchedData">
		<div class="item-box game-count-line">
			<DoughnutChart :chart-data="chartData" :chart-options="chartOptions" />
<!--			<span>Пройдено игр: {{ finishedGamesCount }}</span>-->
<!--			<span>Рерольнуто игр: {{ rerolledGamesCount }}</span>-->
<!--			<span>Отдано игр: {{ givenAwayGamesCount }}</span>-->
		</div>
		<div v-for="(element, key) in fetchedData" :key="key">
			<ProfileGameCard
					v-if="element.status !== 0"
					:element="element"
					@setOpenedImage="emit('setOpenedImage', $event)"
			/>
		</div>
	</template>
	<template v-else>
		История игр отсутствует
	</template>
</template>

<style lang="scss" scoped>
.game-count-line {
	@apply block lg:flex justify-center;

	span {
		@apply block lg:inline mr-[1.5rem];
	}
}
</style>
