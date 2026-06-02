<script setup>
import SliderWithSlots from '@/components/sliders/vueSlider/SliderWithSlots.vue';
import WildCard from '@/components/entity/card/WildCard.vue';

const props = defineProps({
	entity: {
		type: String,
		required: true,
	},
	data: {
		type: Array,
		required: true,
	},
});

const getSlotName = (n) => `slot-${n + 1}`;

const preparationData = (incomingData) => {
	let returnData = [];

	if (incomingData && typeof incomingData === 'object') {
		returnData = incomingData.filter((item) => item.id && !props.excludedIds.includes(item.id));
	}

	return returnData;
}

const carouselConfig = {
	wrapAround: false,
	pauseAutoplayOnHover: true,
	autoplay: 0,
	mouseWheel: false,
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
	<div class="mb-6">
		<nuxt-link
				to="person/"
				class="block title mt-4 mb-4"
				target="_blank"
		>
			Персоны
		</nuxt-link>
		<SliderWithSlots
				:count="data.length"
				:carouselConfig="carouselConfig"
				:usePagination="false"
		>
			<template
					v-for="(item, key) in data"
					:key="key"
					v-slot:[getSlotName(key)]
			>
				<WildCard
						:data="item"
						:entity="entity"
						listPage="person"
				/>
			</template>
		</SliderWithSlots>
	</div>
</template>

<style lang="scss" scoped />
