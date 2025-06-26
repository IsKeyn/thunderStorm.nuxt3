<script setup>
import BarChart from '@/components/ui/charts/BarChart.vue';
import LineChart from '@/components/ui/charts/LineChart.vue';
import PieChart from '@/components/ui/charts/PieChart.vue';
import DoughnutChart from '@/components/ui/charts/DoughnutChart.vue';
import RadarChart from '@/components/ui/charts/RadarChart.vue';
import PolarAreaChart from '@/components/ui/charts/PolarAreaChart.vue';
import BubbleChart from '@/components/ui/charts/BubbleChart.vue';
import ScatterChart from '@/components/ui/charts/ScatterChart.vue';

import { ref } from "vue";

useHead({
	title: 'Город, Покрытый Туманом - фан. сайт по вселенной Silent Hill',
	meta: [
		{
			name: 'robots',
			content: 'noindex, nofollow'
		}
	]
})

const chartData = ref({
	labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май'],
	datasets: [
		{
			label: 'Продажи 2023',
			backgroundColor: '#f87979',
			data: [40, 20, 12, 39, 10]
		}
	]
})

const chartOptions = ref({
	responsive: true,
	maintainAspectRatio: false,
});

const chartDatal = {
	labels: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май'],
	datasets: [
		{
			label: 'Продажи 2023',
			data: [65, 59, 80, 81, 56],
			fill: false,
			borderColor: 'rgb(75, 192, 192)',
			tension: 0.1
		}
	]
}

const chartOptionsl = {
	responsive: true,
	maintainAspectRatio: false
}

const chartDatap = {
	labels: ['Красный', 'Синий', 'Желтый'],
	datasets: [
		{
			label: 'Цвета',
			data: [300, 50, 100],
			backgroundColor: [
				'rgb(255, 99, 132)',
				'rgb(54, 162, 235)',
				'rgb(255, 205, 86)'
			],
			hoverOffset: 4
		}
	]
}

const chartOptionsp = {
	responsive: true,
	maintainAspectRatio: false
}

const chartDatad = {
	labels: ['Доход', 'Расход', 'Инвестиции'],
	datasets: [
		{
			label: 'Финансы',
			data: [300, 200, 100],
			backgroundColor: [
				'rgb(54, 162, 235)',
				'rgb(255, 99, 132)',
				'rgb(255, 205, 86)'
			],
			hoverOffset: 4
		}
	]
}

const chartOptionsd = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: 'right'
		}
	}
}

const chartDatar = {
	labels: ['Еда', 'Транспорт', 'Жилье', 'Развлечения', 'Одежда'],
	datasets: [
		{
			label: 'Бюджет',
			data: [65, 59, 90, 81, 56],
			backgroundColor: 'rgba(255, 99, 132, 0.2)',
			borderColor: 'rgba(255, 99, 132, 1)',
			pointBackgroundColor: 'rgba(255, 99, 132, 1)',
			pointBorderColor: '#fff'
		}
	]
}

const chartOptionsr = {
	responsive: true,
	maintainAspectRatio: false,
	scales: {
		r: {
			angleLines: {
				display: true
			},
			suggestedMin: 0,
			suggestedMax: 100
		}
	}
}

const chartDatapa = {
	labels: ['Красный', 'Зеленый', 'Желтый', 'Синий', 'Фиолетовый'],
	datasets: [
		{
			label: 'Цвета',
			data: [11, 16, 7, 3, 14],
			backgroundColor: [
				'rgb(255, 99, 132)',
				'rgb(75, 192, 192)',
				'rgb(255, 205, 86)',
				'rgb(54, 162, 235)',
				'rgb(153, 102, 255)'
			]
		}
	]
}

const chartOptionspa = {
	responsive: true,
	maintainAspectRatio: false,
	scales: {
		r: {
			pointLabels: {
				display: true
			}
		}
	}
}

const chartDatab = {
	datasets: [
		{
			label: 'Набор 1',
			data: [
				{ x: 20, y: 30, r: 15 },
				{ x: 40, y: 10, r: 10 },
				{ x: 30, y: 20, r: 20 }
			],
			backgroundColor: 'rgb(255, 99, 132)'
		},
		{
			label: 'Набор 2',
			data: [
				{ x: 10, y: 40, r: 10 },
				{ x: 30, y: 30, r: 15 },
				{ x: 40, y: 10, r: 5 }
			],
			backgroundColor: 'rgb(54, 162, 235)'
		}
	]
}

const chartOptionsb = {
	responsive: true,
	maintainAspectRatio: false,
	scales: {
		y: {
			beginAtZero: true
		}
	}
}

const chartDatas = {
	datasets: [
		{
			label: 'Точки A',
			data: [
				{ x: 10, y: 20 },
				{ x: 15, y: 10 },
				{ x: 12, y: 25 }
			],
			backgroundColor: 'rgb(255, 99, 132)'
		},
		{
			label: 'Точки B',
			data: [
				{ x: 20, y: 30 },
				{ x: 25, y: 20 },
				{ x: 22, y: 35 }
			],
			backgroundColor: 'rgb(54, 162, 235)'
		}
	]
}

const chartOptionss = {
	responsive: true,
	maintainAspectRatio: false,
	scales: {
		x: {
			type: 'linear',
			position: 'bottom'
		}
	}
}
</script>

<template>
	<div>
		<h1>Моя диаграмма</h1>
		<div style="height: 300px">
			<BarChart :chart-data="chartData" :chart-options="chartOptions" />
		</div>
	</div>

	<div>
		<h1>Моя диаграмма</h1>
		<div style="height: 300px">
			<LineChart :chart-data="chartDatal" :chart-options="chartOptionsl" />
		</div>
	</div>

	<div>
		<h1>Моя диаграмма</h1>
		<div style="height: 300px">
			<PieChart :chart-data="chartDatap" :chart-options="chartOptionsp" />
		</div>
	</div>

	<div>
		<h1>Моя диаграмма</h1>
		<div style="height: 300px">
			<DoughnutChart :chart-data="chartDatad" :chart-options="chartOptionsd" />
		</div>
	</div>

	<div>
		<h1>Моя диаграмма</h1>
		<div style="height: 300px">
			<RadarChart :chart-data="chartDatar" :chart-options="chartOptionsr" />
		</div>
	</div>

	<div>
		<h1>Моя диаграмма</h1>
		<div style="height: 300px">
			<PolarAreaChart :chart-data="chartDatapa" :chart-options="chartOptionspa" />
		</div>
	</div>

	<div>
		<h1>Моя диаграмма</h1>
		<div style="height: 300px">
			<BubbleChart :chart-data="chartDatab" :chart-options="chartOptionsb" />
		</div>
	</div>

	<div>
		<h1>Моя диаграмма</h1>
		<div style="height: 300px">
			<ScatterChart :chart-data="chartDatas" :chart-options="chartOptionss" />
		</div>
	</div>
</template>
