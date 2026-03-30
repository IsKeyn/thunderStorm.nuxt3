<script setup>
import SliderWithSlots from '@/components/sliders/vueSlider/SliderWithSlots.vue';
import DefaultCard from '@/components/recommendation/cards/DefaultCard.vue';

import { computed } from "vue";

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { helper } from '@/composables/helper.js'
const { route, router } = helper();

const requestName =  'getRecommendationList';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const query = {};

			const response = await Promise.resolve(
					sendApiRequest('recommendation/get', 'GET', query, requestName, '')
			);

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value?.data || null);

const getSlotName = (n) => `slot-${n + 1}`;

const carouselConfig = {
	wrapAround: true,
	pauseAutoplayOnHover: true,
	autoplay: 5000,
	mouseWheel: true,
	transition: 750,

	itemsToShow: 1,
	gap: 20,
	snapAlign: 'center',

	// 'breakpointMode' determines how the carousel breakpoints are calculated
	// Acceptable values: 'viewport' (default) | 'carousel'
	// 'viewport' - breakpoints are based on the viewport width
	// 'carousel' - breakpoints are based on the carousel width
	breakpointMode: 'carousel',

	// Breakpoints are mobile-first
	// Any settings not specified will fall back to the carousel's default settings
	breakpoints: {
		// 300px and up
		300: {
			itemsToShow: 2,
			snapAlign: 'center',
		},
		// 400px and up
		400: {
			itemsToShow: 3,
			snapAlign: 'start',
		},
		// 500px and up
		500: {
			itemsToShow: 4,
			snapAlign: 'start',
		},
	},
};
</script>

<template>
	<div v-if="!requestInProgress && fetchedData">
		<span class="block title mt-4 mb-4">Рекомендации</span>
		<SliderWithSlots
				:count="fetchedData.length"
				:carouselConfig="carouselConfig"
				:usePagination="false"
		>
			<template
					v-for="(recommendation, key) in fetchedData"
					:key="key"
					v-slot:[getSlotName(key)]
			>
				<DefaultCard :data="recommendation" />
			</template>
		</SliderWithSlots>
	</div>
</template>

<style lang="scss" scoped></style>
