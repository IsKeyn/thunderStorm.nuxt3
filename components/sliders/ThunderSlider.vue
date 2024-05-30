<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
	id: {
		type: String,
		default: 'slider_1',
	},
	slides: {
		type: Array,
		required: true,
	},
	slidesPerPage: {
		type: Number,
		default: 1,
	},
	returnToFirst: {
		type: Boolean,
		default: false,
	},
	autoLoop: {
		type: Object,
		default: null,
	},
	sliderHeight: {
		type: String,
		default: '500px'
	}
});

// TODO возможно лучше заменить ref'ы на обычные objStyle
const wrapper = ref(null);

const currentSlide = ref(1);
const elementWidth = ref(0);

const calcFinished = ref(false);

const changeSlide = (direction) => {
	let slideNumber = null;

	if (direction === 'next') {
		slideNumber = currentSlide.value + 1;
	} else if (direction === 'prev') {
		slideNumber = currentSlide.value - 1;
	}

	if (canChangeSlide(slideNumber)) {
		// Отключаем авто-смену слайдов при ручной смене
		if (props.autoLoop) {
			clearInterval(autoLoopInterval.value);
			autoLoopInterval.value = null;
			restartAutoLoop();
		}

		toSlide(slideNumber);
	} else if (props.returnToFirst) {
		if (direction === 'next') {
			toSlide(1);
		} else if (direction === 'prev') {
			toSlide(props.slides.length - props.slidesPerPage + 1);
		}
	}
}

const canChangeSlide = (slideNumber) => {
	return slideNumber > 0 && slideNumber <= props.slides.length;
}

const toSlide = (slideNumber) => {

	/*
	 * Переход к слайду по его порядковому номеру
	 *
	 * @slideNumber Number номер слайда 1 слайд 0
	 */

	currentSlide.value = Number(slideNumber);

	if (canChangeSlide(slideNumber)) {
		wrapper.value.style.marginLeft = -elementWidth.value * (slideNumber - 1) + 'px';
	}
}

const calcSize = () => {
	const mainElement = document.getElementById(props.id);
	const slideElements = mainElement.querySelectorAll('.wrapper>.element');

	if (slideElements.length > 0) {
		elementWidth.value = mainElement.offsetWidth;

		const wrapperWidth = elementWidth.value * props.slides.length;

		wrapper.value.style.width = `${wrapperWidth}px`;
		wrapper.value.style.height = `${props.sliderHeight}`;
	}

	calcFinished.value = true;
}

const autoLoopDirection = ref('right');
const autoLoopInterval = ref(null);
const autoLoopRestartInterval = ref(null);

const restartAutoLoop = () => {
	// Перезапуск авто-смены слайдов при остановке
	clearInterval(autoLoopRestartInterval.value);
	if (props.autoLoop.restart) {
		autoLoopRestartInterval.value = setInterval(() => {
			if (!autoLoopInterval.value) {
				autoLoopInit();
			}
		}, props.autoLoop.restart);
	}
}

const autoLoopInit = () => {
	// Авто смена слайдов
	autoLoopInterval.value = setInterval(() => {
		if (currentSlide.value === 1) {
			autoLoopDirection.value = 'right';
		} else if (currentSlide.value === props.slides.length) {
			autoLoopDirection.value = 'left';
		}

		switch (autoLoopDirection.value) {
			case 'right':
				toSlide(currentSlide.value + 1);
				break;
			case 'left':
				toSlide(currentSlide.value - 1);
				break;
		}
	}, props.autoLoop.delay);
}

onMounted(() => {
	calcSize();

	if (props.autoLoop) {
		autoLoopInit();
	}
})
</script>

<template>
	<div
			class="slider"
			:id="id"
	>
		<template v-if="slides.length > 1">
			<span
					v-if="currentSlide !== 1 || returnToFirst"
					class="nav-prev"
					@click="changeSlide('prev')"
			>
				<font-awesome-icon :icon="['fas', 'angle-left']" />
			</span>
			<span
					v-if="currentSlide !== slides.length || returnToFirst"
					class="nav-next"
					@click="changeSlide('next')"
			>
				<font-awesome-icon :icon="['fas', 'angle-right']" />
			</span>
		</template>
		<div
				class="wrapper"
				ref="wrapper"
		>
			<div
					class="cap"
					v-show="!calcFinished"
			>
				<span class="text-box left">
					Загружаю слайдер
				</span>
			</div>
			<slot/>
		</div>
	</div>
</template>

<style scoped lang="scss">
.slider {
	@apply
		relative
		mr-[var(--main-without-right-padding)] ml-[var(--main-without-left-padding)]
		overflow-hidden
	;

	.cap {
		@apply
			absolute top-[0] left-[0] z-[1]
			w-full
			h-full
			bg-[var(--second-bg-color)]
		;

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

	.nav-next,
	.nav-prev {
		@apply
			absolute z-[1]
			h-[65px] cursor-pointer hidden
			text-[65px]
		;

		top: calc(50% - 32px);
		color: var(--main-text-color);

		&:hover {
			color: var(--second-hover-color);
		}
	}

	.nav-prev {
		@apply left-[10px];
	}

	.nav-next {
		@apply right-[10px];
	}

	&:hover .nav-prev,
	&:hover .nav-next {
		@apply block;
	}
}

.slider > .wrapper {
	@apply relative inline-flex;

	transition: 1s;
}
</style>
