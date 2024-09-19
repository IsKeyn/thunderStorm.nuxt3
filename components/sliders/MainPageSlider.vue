<script setup>
import ThunderSlider from '@/components/sliders/ThunderSlider.vue';

const slides = ref([
	{
		type: 'img',
		source: '/slides/top.png',
		title: 'Город, покрытый туманом',
	},
	// {
	// 	type: 'video',
	// 	source: '/slides/HoM&M_V.mp4',
	// 	title: 'Увлекательные прохождения на YouTube канале',
	// },
	// {
	// 	type: 'video',
	// 	source: '/slides/EldenRing.mp4',
	// 	title: 'Стримы каждые выходные на Twitch',
	// },
]);
</script>

<template>
	<ThunderSlider
			:autoLoop="{
          delay: 3000,
          restart: 10000,
        }"
			sliderHeight="406px"
			:withoutBorder="true"
	>
		<div
				class="slide w-full"
				v-for="(slide, index) in slides"
				:key="index"
		>
			<template v-if="slide.type === 'video'">
				<video :src="slide.source" autoplay loop muted></video>
				<span
						v-if="slide.title"
						class="flip-text-box left"
				>
						{{ slide.title }}
					</span>
			</template>
			<template v-else>
				<img :src="slide.source"
						 :alt="slide.title"
				>
				<span
						v-if="slide.title"
						class="flip-text-box left"
				>
						{{ slide.title }}
					</span>
			</template>
		</div>
	</ThunderSlider>
</template>

<style lang="scss" scoped>
.slide {
	@apply relative overflow-hidden;

	img,
	video {
		@apply w-full;
	}
}
</style>
