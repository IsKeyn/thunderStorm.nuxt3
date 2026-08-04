<script setup>
import BarChart from '@/components/ui/charts/BarChart.vue';
import LineChart from '@/components/ui/charts/LineChart.vue';
import PieChart from '@/components/ui/charts/PieChart.vue';

import { ref } from "vue";

const emit = defineEmits(['showPlayer']);

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { date } from '@/composables/date.js';
const {
	getFormattedDate,
	getFormattedHoursFromSeconds
} = date();

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
	sendApiRequest,
} = api();

const requestName = 'boardGameStats';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const query = {
				slug: route.params.slug,
				limit: 10,
			};

			const response = await Promise.resolve(
					sendApiRequest('board-game/v2/stats/get', 'GET', query, requestName, '')
			);

			return response || null;
		},
		{
			server: true, // выполнять только на сервере
			lazy: true, // ждать выполнения запроса перед рендерингом
		}
);

const fetchedData = computed(() => requestData.value || null);

const updateStats = async () => {
	await refresh();
}

/* Построение графиков */
const charDataForMostCompletedGames = (data, dataKey = 'additional_data', color = '#4700d8') => {
	const returnData = {
		labels: [],
		datasets: [
			{
				label: data.name,
				backgroundColor: color,
				data: []
			},
		]
	};

	data.data.forEach((item) => {
		returnData.labels.push(item.game.game.name);
		returnData.datasets[0].data.push(item[dataKey]);
	});

	return returnData;
};

const charDataForMostCompletedPlayers = (data, dataKey = 'additional_data', color = '#4700d8') => {
	const returnData = {
		labels: [],
		datasets: [
			{
				label: data.name,
				backgroundColor: [
					'rgb(62,19,136)',
					'rgb(77,10,200)',
					'rgb(10,33,157)',
					'rgb(18,29,88)',
					'rgb(7,60,58)',
					'rgb(16,74,74)',
					'rgb(19,81,81)',
					'rgb(16,84,54)',
					'rgb(30,171,109)',
					'rgb(22,200,65)',
				],
				borderColor: 'rgba(0, 0, 0, 0)', // Цвет обводки
				borderWidth: 2, // Толщина обводки
				hoverOffset: 4,
				data: []
			},
		]
	};

	data.data.forEach((item) => {
		returnData.labels.push(item.user.name);
		returnData.datasets[0].data.push(item[dataKey]);
	});

	return returnData;
};

const charDataForItems = (data, dataKey = 'additional_data', color = '#4700d8') => {
	const returnData = {
		labels: [],
		datasets: [
			{
				label: data.name,
				backgroundColor: [
					'rgb(62,19,136)',
					'rgb(77,10,200)',
					'rgb(10,33,157)',
					'rgb(18,29,88)',
					'rgb(7,60,58)',
					'rgb(16,74,74)',
					'rgb(19,81,81)',
					'rgb(16,84,54)',
					'rgb(30,171,109)',
					'rgb(22,200,65)',
				],
				borderColor: 'rgba(0, 0, 0, 0)', // Цвет обводки
				borderWidth: 2, // Толщина обводки
				hoverOffset: 4,
				data: []
			},
		]
	};

	data.data.forEach((item) => {
		returnData.labels.push(item.name);
		returnData.datasets[0].data.push(item[dataKey]);
	});

	return returnData;
};

const chartOptions = ref({
	responsive: true,
	maintainAspectRatio: false,
	indexAxis: 'y',
});

const chartOptionsTime = {
	responsive: true,
	maintainAspectRatio: false,
	scales: {
		x: { // Для вертикальной диаграммы (для горизонтальной используйте x вместо y)
			ticks: {
				callback: function(value) {
					// Форматируем секунды обратно в HH:MM:SS
					const hours = Math.floor(value / 3600);
					const minutes = Math.floor((value % 3600) / 60);
					const seconds = Math.floor(value % 60);
					return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
				}
			}
		}
	},
	plugins: {
		tooltip: {
			callbacks: {
				label: function(context) {
					// Форматирование времени во всплывающих подсказках
					const value = context.raw;
					const hours = Math.floor(value / 3600);
					const minutes = Math.floor((value % 3600) / 60);
					const seconds = Math.floor(value % 60);
					return `${context.dataset.label}: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
				}
			}
		},
	},
	indexAxis: 'y',
}

/* Настройки для графика активности */
const charDataForActivity = (data, color = '#4700d8') => {
	const returnData = {
		labels: [],
		datasets: [
			{
				label: data.name,
				fill: false,
				borderColor: color,
				tension: 0.1,
				data: []
			},
		]
	};

	for (const date in data.data) {
		returnData.labels.push(date);
		returnData.datasets[0].data.push(data.data[date]);
	}

	return returnData;
};

const activityChartOptions = {
	responsive: true,
	maintainAspectRatio: false
}
</script>

<template>
	<ui-BigPreloader
			v-if="requestInProgress"
			class="h-full"
			theme="image"
			:themeType="9"
			description="Формирование статистики может потребовать времени, пожалуйста ожидайте"
	/>
	<template v-else-if="fetchedData && fetchedData.length">
		<div
				v-for="(data, key) in fetchedData"
				:key="key"
		>
			<div
					v-if="data?.data?.length > 0"
					class="parent-box"
			>
				<template v-if="key !== 'activity'">
					<div class="child-item">
						<span class="title">{{ data.name }}</span>
						<div
								v-for="(element, gameKey) in data.data"
								:key="gameKey"
						>
							<template
									v-if="key === 'mostCompletedGames'
									|| key === 'mostRerolledGames'
									|| key === 'shortestGames'
									|| key === 'longestGames'
							">
								{{ gameKey + 1 }}. <a
									:href="`/game/${element.game.game.slug}`"
									target="_blank"
							>
								{{ element.game.game.name }}
								<template
										v-if="element.additional_data"
								> - {{ element.additional_data }}</template>
								<template
										v-if="(key === 'shortestGames' || key === 'longestGames') && element.time"
								> - {{ getFormattedHoursFromSeconds(element.time) }}</template>
							</a>
							</template>
							<template
									v-else-if="key === 'maxBananaCount'
								|| key === 'kirovReporting'
								|| key === 'playersWhoMostCompleted'
								|| key === 'playersWhoMostRerolled'
								|| key === 'mostCompletedPlayers'
								|| key === 'mostRerolledPlayers'
								|| key === 'mostDroppedGamesPlayers'
						">
								{{ gameKey + 1 }}. <a
									:href="`/e/${route.params.slug}/player/${element.user.name}`"
									target="_blank"
							>
								{{ element.user.name }}
								<template
										v-if="element.additional_data"
								> - {{ element.additional_data }}</template>
							</a>
							</template>
							<template v-else-if="key === 'mostUsedItem'">
							<span class="items-list">{{ gameKey + 1 }}. {{ element.name }}
								<template
										v-if="element.additional_data"
								> - {{ element.additional_data }}</template>
							</span>
							</template>
						</div>
					</div>
					<div class="child-item">
						<BarChart
								v-if="key === 'mostCompletedGames' || key === 'mostRerolledGames'"
								:chart-data="charDataForMostCompletedGames(data)"
								:chart-options="chartOptions"
						/>
						<BarChart
								v-if="key === 'shortestGames' || key === 'longestGames'"
								:chart-data="charDataForMostCompletedGames(data, 'time')"
								:chart-options="chartOptionsTime"
						/>
						<PieChart
								v-if="
								key === 'maxBananaCount'
								|| key === 'kirovReporting'
								|| key === 'playersWhoMostCompleted'
								|| key === 'playersWhoMostRerolled'
								|| key === 'mostCompletedPlayers'
								|| key === 'mostRerolledPlayers'
								|| key === 'mostDroppedGamesPlayers'
							"
								:chart-data="charDataForMostCompletedPlayers(data)"
								:chart-options="chartOptions"
						/>
						<PieChart
								v-if="key === 'mostUsedItem'"
								:chart-data="charDataForItems(data)"
								:chart-options="chartOptions"
						/>
					</div>
				</template>
			</div>
		</div>
		<div v-if="fetchedData?.activity">
			<h1>Активность</h1>
			<div style="height: 300px">
				<LineChart
						:chart-data="charDataForActivity(fetchedData.activity)"
						:chart-options="activityChartOptions"
				/>
			</div>
		</div>
	</template>
	<ui-itemBox
			v-else
			classes="red"
			message="Статистика ещё не сформирована, она формируется за первые 24 часа после начала ивента"
	/>
</template>

<style lang="scss" scoped>
.parent-box {
	@apply mb-[1rem] block lg:flex lg:gap-2;

	.child-item {
		@apply w-full lg:w-1/2 mb-[1rem];
	}
}

.title {
	@apply block mb-[0.5rem];
}

a {
	@apply text-[var(--main-text-color)];
}

span.items-list {
	@apply cursor-pointer;
}
</style>
