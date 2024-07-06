<script setup>
import { onMounted, onUnmounted } from 'vue'

import Preloader from '@/components/ui/Preloader.vue';

const props = defineProps({
	id: {
		type: String,
		default: 'slider_1',
	},
	slideSelectorClass: {
		type: String,
		default: 'slide',
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
		default: null
	},
	withoutBorder: {
		type: Boolean,
		default: false,
	},
});

/* DOM элементы слайдера */
const wrapper = ref(null); // TODO возможно лучше заменить ref'ы на обычные objStyle
const navPrev = ref(null);
const navNext = ref(null);

const currentSlide = ref(1); // id текущего слайда
const slidesCount = ref(0); // Общее количество слайдов
const elementWidth = ref(0); // Ширина одного элемента
const calcFinished = ref(false); // Отметка о конце инициализации

const {
	hasSlot,
} = slotsFn();

const {
	calcSize,
	setVisibleForNavigationButtons,
	deInitNavigation,
} = initSliderFn();

const {
	toSlide,
	changeSlide,
} = changeSlidesFn();

const {
	autoLoopInit,
	restartAutoLoop,
	autoLoopInterval,
} = autoLoopFn();

function slotsFn() {
	const slots = useSlots();

	const hasSlot = (name) => {
		return !!slots[name];
	}

	return {
		slots,
		hasSlot,
	}
}

function initSliderFn() {
	const calcSize = () => {
		const mainElement = document.getElementById(props.id);
		const slideElements = mainElement.querySelectorAll(`.wrapper>.${props.slideSelectorClass}`);

		slidesCount.value = slideElements.length;

		if (slidesCount.value > 0) {
			elementWidth.value = mainElement.offsetWidth;

			wrapper.value.style.width = `${elementWidth.value * slidesCount.value}px`;
			if (props.sliderHeight) { wrapper.value.style.height = `${props.sliderHeight}`; }
		}

		initNavigation();
		setVisibleForNavigationButtons();

		calcFinished.value = true;
	}

	const initNavigation = () => {
		if (hasSlot('nav-prev')) {
			navPrev.value = document.getElementById('nav-prev');
			if (navPrev.value)  navPrev.value.addEventListener('click', () => { changeSlide('prev'); });
		}

		if (hasSlot('nav-next')) {
			navNext.value = document.getElementById('nav-next');
			if (navNext.value) navNext.value.addEventListener('click', () => { changeSlide('next'); });
		}
	}

	const deInitNavigation = () => {
			if (navPrev.value) navPrev.value.removeEventListener('click', () => { changeSlide('prev'); });
			if (navNext.value) navNext.value.removeEventListener('click', () => { changeSlide('next'); });
	}

	const setVisibleForNavigationButtons = () => {
		if (navPrev.value) {
			navPrev.value.style.display = currentSlide.value !== 1 || props.returnToFirst ? '' : 'none';
		}

		if (navNext.value) {
			navNext.value.style.display = currentSlide.value !== slidesCount.value || props.returnToFirst ? '' : 'none';
		}
	}

	return {
		calcSize,
		deInitNavigation,
		setVisibleForNavigationButtons,
	}
}

function changeSlidesFn() {
	const toSlide = (slideNumber) => {

		/*
		 * Переход к слайду по его порядковому номеру
		 *
		 * @slideNumber Number номер слайда 1 слайд 0
		 */

		if (canChangeSlide(slideNumber)) {
			currentSlide.value = Number(slideNumber);
			wrapper.value.style.marginLeft = -elementWidth.value * (slideNumber - 1) + 'px';
			setVisibleForNavigationButtons();
		}
	}

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
				toSlide(slidesCount.value - props.slidesPerPage + 1);
			}
		}
	}

	const canChangeSlide = (slideNumber) => {
		return slideNumber > 0 && slideNumber <= slidesCount.value;
	}

	return {
		toSlide,
		changeSlide,
	}
}

function autoLoopFn() {
	const autoLoopInterval = ref(null);
	const autoLoopDirection = ref('right');
	const autoLoopRestartInterval = ref(null);

	const autoLoopInit = () => { // Авто смена слайдов
		autoLoopInterval.value = setInterval(() => {
			if (currentSlide.value === 1) {
				autoLoopDirection.value = 'right';
			} else if (currentSlide.value === slidesCount.value) {
				autoLoopDirection.value = 'left';
			}

			if (autoLoopDirection.value === 'right') {
				toSlide(currentSlide.value + 1);
			} else if (autoLoopDirection.value === 'left') {
				toSlide(currentSlide.value - 1);
			}
		}, props.autoLoop.delay);
	}

	const restartAutoLoop = () => { // Перезапуск авто-смены слайдов при остановке
		clearInterval(autoLoopRestartInterval.value);
		if (props.autoLoop.restart) {
			autoLoopRestartInterval.value = setInterval(() => {
				if (!autoLoopInterval.value) {
					autoLoopInit();
				}
			}, props.autoLoop.restart);
		}
	}

	return {
		autoLoopInit,
		restartAutoLoop,
		autoLoopInterval,
	};
}

onMounted(() => {
	calcSize();

	if (props.autoLoop) {
		autoLoopInit();
	}
});

onUnmounted(() => {
	deInitNavigation();
});
</script>

<template>
	<div
			:id="id"
			:class="['slider', withoutBorder ? 'without-border' : '']"
	>
		<template v-if="!calcFinished || slidesCount > 1">
			<slot name="nav-prev" />
			<slot name="nav-next"/>

			<!--	Стандартные элементы навигации	-->
			<template v-if="!(hasSlot('nav-prev') || hasSlot('nav-next'))">
				<span
						v-show="currentSlide !== 1 || returnToFirst"
						class="nav-prev"
						@click="changeSlide('prev')"
				>
					<font-awesome-icon :icon="['fas', 'angle-left']" />
				</span>
				<span
						v-show="currentSlide !== slidesCount || returnToFirst"
						class="nav-next"
						@click="changeSlide('next')"
				>
					<font-awesome-icon :icon="['fas', 'angle-right']" />
				</span>
			</template>
		</template>
		<div class="wrapper" ref="wrapper">
			<div v-if="!calcFinished" class="cap flex justify-center items-center text-[5rem]">
				<Preloader />
<!--				<span class="text-box left">-->
<!--					Загружаю слайдер-->
<!--				</span>-->
			</div>
			<slot/>
		</div>
	</div>
</template>

<style scoped lang="scss">
.slider {
	@apply
		relative
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
			cursor-pointer hidden
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
