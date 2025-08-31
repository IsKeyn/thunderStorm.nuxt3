<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

import phrase from '@/assets/json/Phrase.json'

const props = defineProps({
	squareCountInLine: {
		type: Number,
		default: 16,
	},
});

const spaceForGame = ref(null);

const intervalId = ref(null);
const changePhraseInterval = ref(null);

const keyElement = ref(null);

const randomPhrase = ref(null);

const setRandomPhrase = () => {
	if (phrase.length <= 1) {
		randomPhrase.value = phrase[0] || "";
		return;
	}

	const currentIndex = phrase.indexOf(randomPhrase.value);
	let newIndex;

	do {
		newIndex = Math.floor(Math.random() * phrase.length);
	} while (newIndex === currentIndex && currentIndex !== -1);

	randomPhrase.value = phrase[newIndex];

	if (changePhraseInterval.value) {
		clearInterval(changePhraseInterval.value)
	}

	changePhraseInterval.value = setInterval(() => {
		setRandomPhrase();
	}, 10000)
};

setRandomPhrase();

const randomSquare = () => {
	if (!spaceForGame.value) return

	spaceForGame.value.innerHTML = ''; // Очищаем предыдущие элементы

	const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

	const size = Math.floor(width / props.squareCountInLine);
	const count = Math.floor(height / size) * props.squareCountInLine;

	const winElement = Math.floor(Math.random() * (count - 1) + 1);

	/* Создаем элементы */
	for (let i = 1; i < count + 1; i++) {
		const box = document.createElement('div')

		const randBgImg = Math.floor(Math.random() * 8) + 1;

		box.className = `square bit-${i} image-${randBgImg}`;

		box.style.width = `${size}px`;
		box.style.height = `${size}px`;
		box.style.maskSize = `${size}px`;

		if (i === winElement) {
			keyElement.value = box;
			box.addEventListener('click', handleWin);
		}

		spaceForGame.value.appendChild(box);
	}

	/* Запускаем анимаци */
	intervalId.value = setInterval(() => {
		const rand = Math.floor(Math.random() * (count - 1) + 1);

		const randElement = spaceForGame.value.querySelector(`.bit-${rand}`);
		const animateClassName = 'animate';

		if (randElement && randElement.classList.contains(animateClassName)) {
			randElement.classList.remove(animateClassName)
		} else if (randElement) {
			randElement.classList.add(animateClassName)
		}
	}, 100)
}

const handleWin = () => {
	// alert('Ты угадал, молодец!')
}

const cleanup = () => {
	if (intervalId.value) {
		clearInterval(intervalId.value)
	}

	if (changePhraseInterval.value) {
		clearInterval(changePhraseInterval.value)
	}

	if (keyElement.value) {
		keyElement.value.removeEventListener('click', handleWin)
	}
}

onMounted(() => {
	randomSquare();
})

onUnmounted(() => {
	cleanup();
})

// Для совместимости с deffered
if (typeof window !== 'undefined' && window.deffered) {
	window.deffered.games.resolve()
}

// TODO добавить авторов цитат как на https://onequote.ru/
</script>

<template>
	<div class="game-container">
		<div
				v-if="randomPhrase"
				class="center-block cursor-pointer"
				@click="setRandomPhrase()"
		>
			<div  class="text-block">
				<Transition name="fade" mode="out-in">
					<span :key="randomPhrase">
						{{ randomPhrase }}
					</span>
				</Transition>
			</div>
		</div>
		<layout-Overlay />
		<div ref="spaceForGame" class="space-for-game" />
	</div>
</template>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.game-container {
	@apply w-full h-[100vh] relative;

	.center-block {
		@apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000];

		.text-block {
			@apply bg-[var(--second-bg-color)] text-[var(--main-dark-text-color)] p-4 shadow-lg text-[2rem] text-center;
		}
	}

	.space-for-game {
		@apply flex flex-wrap justify-center gap-1 p-1;

		.square {
			@apply bg-[var(--third-bg-color)];

			transition: all 0.3s ease;
			mask-position: center center;
			mask-repeat: no-repeat;

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

			&.animate {
				@apply bg-[var(--body-bg-color)];

				&:hover {
					@apply bg-[var(--third-bg-color)];
				}
			}

			&:hover {
				@apply bg-[var(--body-bg-color)];
			}
		}
	}
}
</style>
