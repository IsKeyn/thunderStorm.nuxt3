<script setup>
const props = defineProps({
	imageNumber: {
		type: Number,
		default: 1,
		validator: (value) => value >= 1 && value <= 9
	},
	size: {
		type: Number,
		default: 120, // размер в пикселях
	},
	animateType: { // animate-spin, animate-[spin_1s_linear_infinite]
		type: String,
		default: 'animate-spin',
	},
});
</script>

<template>
	<div class="preloader">
		<div
				:class="['square', `image-${imageNumber}`, animateType]"
				:style="{
					width: `${size}px`,
					height: `${size}px`
				}"
		/>
	</div>
</template>

<style lang="scss" scoped>
.preloader {
	@apply flex flex-col items-center justify-center min-h-[200px];

	.square {
		@apply bg-[var(--main-title-color)];

		transition: all 0.3s ease;
		mask-position: center center;
		mask-repeat: no-repeat;
		mask-size: contain; /* важно для масштабирования маски */

		/* Общие стили для всех масок */
		display: block; /* важно для отображения */

		&.image-1 {
			mask-image: url('/images/board-games/gamepads/gamepad-1.png');
		}

		&.image-2 {
			mask-image: url('/images/board-games/gamepads/gamepad-2.png');
		}

		&.image-3 {
			mask-image: url('/images/board-games/gamepads/gamepad-3.png');
		}

		&.image-4 {
			mask-image: url('/images/board-games/gamepads/gamepad-4.png');
		}

		&.image-5 {
			mask-image: url('/images/board-games/gamepads/gamepad-5.png');
		}

		&.image-6 {
			mask-image: url('/images/board-games/gamepads/gamepad-6.png');
		}

		&.image-7 {
			mask-image: url('/images/board-games/gamepads/gamepad-7.png');
		}

		&.image-8 {
			mask-image: url('/images/board-games/gamepads/gamepad-8.png');
		}

		&.image-9 {
			mask-image: url('/images/silent-hill/sh-emblem-of-religion.png');
		}
	}
}
</style>
