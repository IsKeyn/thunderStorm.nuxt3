<script setup>
import GamblingCard from '@/components/boardGame/inventory/GamblingCard.vue';

import { ref } from 'vue'

const emit = defineEmits(['addItemToInventory', 'setOpenedImage']);

import { boardGameLog } from '@/composables/BoardGame/boardGameLog.js'
const {
	setLog,
} = boardGameLog();

const props = defineProps({
	items: {
		type: Object,
		default: {},
	},
	boardGameId: {
		type: Number,
		default: 1,
	},
});

let items = props.items;

// Дублируем элементы для долгого кручения
const repeatedItems = Array(60).fill([...items]).flat()

const translateY = ref(0)
const spinning = ref(false)

const spinSound = ref(null)

const resultId = ref(null);

const startSpin = () => {
	if (spinning.value) return

	resultId.value = null;
	spinning.value = true

	spinSound.value.volume = 0.2
	spinSound.value.currentTime = 0
	spinSound.value.play()

	const itemHeight = 91         // высота одного элемента
	const windowHeight = 273      // высота окна рулетки
	const spinTime = 15000        // время крутки рулетки

	const totalItems = repeatedItems.length

	// Случайный выбор среди оригинальных элементов
	const randomIndex = Math.floor(Math.random() * items.length)

	// Центральный элемент массива repeatedItems (берём из середины, чтобы был запас)
	const baseIndex = Math.floor(totalItems / 2)

	const targetIndex = baseIndex + randomIndex

	// Куда крутим рулетку
	const centerOffset = (windowHeight / 2) - (itemHeight / 2)
	const targetTranslateY = targetIndex * itemHeight - centerOffset

	const start = performance.now()
	const startTranslateY = 0
	// const startTranslateY = translateY.value

	const animate = (now) => {
		const elapsed = now - start
		const progress = Math.min(elapsed / spinTime, 1)

		const easeOut = 1 - Math.pow(1 - progress, 3)
		// Используем более резкое easeOut
		// const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

		translateY.value = startTranslateY + (targetTranslateY - startTranslateY) * easeOut;

		if (elapsed < spinTime) {
			requestAnimationFrame(animate)
		} else {
			spinning.value = false
			spinSound.value.pause()
			spinSound.value.currentTime = 0

			/* Используется для выделения цветом выпавшего прдмета */
			resultId.value = items[randomIndex].id;

			const logBody = {
				board_game_id: props.boardGameId,
				message: `крутанул рулетку предметов и ему выпало "${items[randomIndex].name}"`
			};
			setLog(logBody);

			emit('addItemToInventory', { id: items[randomIndex].id, name: items[randomIndex].name });
		}
	}

	requestAnimationFrame(animate)
}
</script>

<template>
		<div class="roulette-container">
			<div class="roulette-window">
				<font-awesome-icon :icon="['fas', 'play']" class="left-triangle" />
				<font-awesome-icon :icon="['fas', 'play']" flip="horizontal" class="right-triangle" />
				<div
						class="roulette-content"
						:style="{ transform: `translateY(${-translateY}px)`, transition: spinning ? 'none' : 'transform 2s ease-out' }"
				>
					<div
							v-for="(element, index) in repeatedItems"
							:key="index"
							class="item"
					>
						<GamblingCard
								:element="element"
								:showControlPanel="false"
								:classes="element.id === resultId ? 'active' : ''"
						/>
					</div>
				</div>
			</div>

			<button
					:class="`btn ${spinning ? 'btn-disable' : 'btn-primary' }`"
					@click="startSpin"
			>
				Крутануть рулетку
			</button>
			<audio ref="spinSound" src="/sounds/roll.wav" preload="auto"></audio>
		</div>
</template>

<style lang="scss" scoped>
.roulette-container {
	@apply w-full flex flex-col items-center;

	.roulette-window {
		@apply relative w-full h-[273px] overflow-hidden;

		border: 4px solid var(--third-active-color);

		.left-triangle {
			@apply absolute left-0 z-[1] text-[var(--third-active-color)] text-[1.4rem];

			top: calc(50% - 0.7rem);
		}

		.right-triangle {
			@apply absolute right-[-1px] z-[1] text-[var(--third-active-color)] text-[1.4rem];

			top: calc(50% - 0.7rem);
		}

		.roulette-content {
			@apply flex flex-col;

			.item {
				@apply h-[86px] flex justify-center items-center mb-[5px];
			}
		}
	}
}
</style>
