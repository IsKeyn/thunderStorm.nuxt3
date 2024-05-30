<script setup>
import ThunderSlider from '@/components/sliders/ThunderSlider.vue';

const slides = ref([
	{
		type: 'img',
		source: '/slides/header_1.jpg',
		title: 'А ты точно подписан на KeynTR?',
	},
	{
		type: 'video',
		source: '/slides/HoM&M_V.mp4',
		title: 'Увлекательные прохождения на YouTube канале',
	},
	{
		type: 'video',
		source: '/slides/EldenRing.mp4',
		title: 'Стримы каждые выходные на Twitch',
	},
]);
</script>

<template>
	<ThunderSlider
			:autoLoop="{
          delay: 3000,
          restart: 10000,
        }"
			sliderHeight="406px"
			:slides="slides"
	>
		<div
				class="element w-full"
				v-for="(slide, index) in slides"
				:key="index"
		>
			<template v-if="slide.type === 'video'">
				<video :src="slide.source" autoplay loop muted></video>
				<span
						v-if="slide.title"
						class="text-box left"
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
						class="text-box left"
				>
						{{ slide.title }}
					</span>
			</template>
		</div>
	</ThunderSlider>
</template>

<style lang="scss" scoped>
.element {
	@apply relative overflow-hidden;

	img,
	video {
		@apply w-full;
	}

	span.text-box {
		@apply
		absolute bottom-[30px]
		bg-[var(--main-bg-color)]
		text-[25px] uppercase
		;

		&.right {
			@apply
			right-[0]
			pt-[10px] pr-[15px] pb-[10px] pl-[5px]
			;
		}

		&.left {
			@apply
			left-[0]
			pt-[10px] pr-[50px] pb-[10px] pl-[15px]
			;
		}
	}
}
</style>
