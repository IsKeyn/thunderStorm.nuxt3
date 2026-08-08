<script setup>
const isHovered = ref(false);
const isPressed = ref(false);

const imageNumber = computed(() => {
	if (isPressed.value) return 3;
	if (isHovered.value) return 2;
	return 1;
});

const imagePath = computed(
		() => `/images/board-games/games/mystery-button/${imageNumber.value}.png`
);

function onMouseEnter() {
	isHovered.value = true;
}

function onMouseLeave() {
	isHovered.value = false;
	isPressed.value = false;
}

function onMouseDown() {
	isPressed.value = true;
}

function onMouseUp() {
	isPressed.value = false;
}

const activateState = () => {
	console.log(111);
}
</script>

<template>
	<div
			class="image-box"
			@mouseenter="onMouseEnter"
			@mouseleave="onMouseLeave"
			@mousedown="onMouseDown"
			@mouseup="onMouseUp"
			@click="activateState"
	>

			<img
					:key="imagePath"
					:src="imagePath"
					class="article-image"
					alt="Mystery button"
			>


		<div class="quote-box">
			<Transition name="fade" mode="out-in">
        <span>
          Эльфийка предлагает вам выбрать одну из 3-х карт на выбор.
          Но предупреждает, что вы можете выбрать только 1 карту и эффект может быть
          как положительным, так и отрицательным.
          В принципе, ты можешь уйти, не переворачивая карт, но ведь любопытно,
          чего тебе уготовила судьба?
        </span>
			</Transition>
		</div>
	</div>
</template>

<style scoped>
.image-box {
	cursor: pointer;
}

.article-image {
	display: block;
	max-width: 100%;
	height: auto;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
