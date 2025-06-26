<script setup>
import { Bubble } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LinearScale, PointElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LinearScale, PointElement)

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
	<div style="height: 400px">
		<Bubble :data="chartData" :options="chartOptions" />
	</div>
</template>
