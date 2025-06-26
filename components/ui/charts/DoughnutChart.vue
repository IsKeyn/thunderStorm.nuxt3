<script setup>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
	chartData: {
		type: Object,
		required: true
	},
	chartOptions: {
		type: Object,
		default: () => {}
	}
})
</script>

<template>
	<div style="height: 300px; width: 400px">
		<Doughnut :data="chartData" :options="chartOptions" />
	</div>
</template>
