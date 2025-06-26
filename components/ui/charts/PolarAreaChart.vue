<script setup>
import { PolarArea } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, RadialLinearScale, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, RadialLinearScale, ArcElement)

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
		<PolarArea :data="chartData" :options="chartOptions" />
	</div>
</template>
