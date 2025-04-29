<script setup>
import { ref } from "vue";

import { boardGameLog } from '@/composables/BoardGame/boardGameLog.js'
const {
	setLog,
} = boardGameLog();

const emit = defineEmits(['fetchLogs']);

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
});

const d6Result = ref(6)
const d20Result = ref(20)

const isRollingD6 = ref(false)
const isRollingD20 = ref(false)

const diceSound = ref(null)

const d6Dots = {
	1: [{ top: 'calc(50% - 5px)', left: 'calc(50% - 5px)' }],
	2: [
		{ top: 'calc(30% - 5px)', left: 'calc(30% - 5px)' },
		{ top: 'calc(70% - 5px)', left: 'calc(70% - 5px)' },
	],
	3: [
		{ top: 'calc(30% - 5px)', left: 'calc(30% - 5px)' },
		{ top: 'calc(50% - 5px)', left: 'calc(50% - 5px)' },
		{ top: 'calc(70% - 5px)', left: 'calc(70% - 5px)' },
	],
	4: [
		{ top: 'calc(30% - 5px)', left: 'calc(30% - 5px)' },
		{ top: 'calc(30% - 5px)', left: 'calc(70% - 5px)' },
		{ top: 'calc(70% - 5px)', left: 'calc(30% - 5px)' },
		{ top: 'calc(70% - 5px)', left: 'calc(70% - 5px)' },
	],
	5: [
		{ top: 'calc(30% - 5px)', left: 'calc(30% - 5px)' },
		{ top: 'calc(30% - 5px)', left: 'calc(70% - 5px)' },
		{ top: 'calc(50% - 5px)', left: 'calc(50% - 5px)' },
		{ top: 'calc(70% - 5px)', left: 'calc(30% - 5px)' },
		{ top: 'calc(70% - 5px)', left: 'calc(70% - 5px)' },
	],
	6: [
		{ top: 'calc(30% - 5px)', left: 'calc(30% - 5px)' },
		{ top: 'calc(30% - 5px)', left: 'calc(70% - 5px)' },
		{ top: 'calc(50% - 5px)', left: 'calc(30% - 5px)' },
		{ top: 'calc(50% - 5px)', left: 'calc(70% - 5px)' },
		{ top: 'calc(70% - 5px)', left: 'calc(30% - 5px)' },
		{ top: 'calc(70% - 5px)', left: 'calc(70% - 5px)' },
	],
}

function playSound() {
	if (diceSound.value) {
		diceSound.value.currentTime = 0
		diceSound.value.play()
	}
}

function rollDice(type) {
	playSound();

	if (type === 'd6') {
		isRollingD6.value = true
		setTimeout(() => {
			d6Result.value = Math.floor(Math.random() * 6) + 1

			const logBody = {
				board_game_id: props.boardGameId,
				message: `бросил кубик D6, выпало ${d6Result.value}`
			};
			setLog(logBody);

			isRollingD6.value = false
		}, 1000)
	} else if (type === 'd20') {
		isRollingD20.value = true
		setTimeout(() => {
			d20Result.value = Math.floor(Math.random() * 20) + 1

			const logBody = {
				board_game_id: props.boardGameId,
				message: `бросил кубик D20, выпало ${d20Result.value}`
			};
			setLog(logBody);

			isRollingD20.value = false
		}, 1000)
	}
}
</script>

<template>
	<span class="user-interface-title">Кубики</span>
	<div class="dice-container">
		<!-- D20 -->
		<div
				class="dice-d20"
				:class="{ rolling: isRollingD20 }"
				@click="rollDice('d20')"
		>
			<div class="face d20-face">
				{{ d20Result }}
			</div>
		</div>

		<!-- D6 -->
		<div
				class="dice-d6"
				:class="{ rolling: isRollingD6 }"
				@click="rollDice('d6')"
		>
			<div class="face">
				<template
						v-for="(dot, index) in d6Dots[d6Result]"
						:key="index"
				>
					<div class="dot" :style="dot"></div>
				</template>
			</div>
		</div>
	</div>

	<audio ref="diceSound" src="/sounds/dice-roll.mp3"></audio>
</template>


<style lang="scss" scoped>
.dice-container {
	@apply
		flex gap-[3rem]
		justify-center items-center
	;

	.face {
		@apply w-full h-full;
	}

	.dice-d20 {
		@apply
			w-[100px] h-[110px]
			cursor-pointer
		;

		transition: transform 0.5s;
		background: url("/images/board-games/d20.png") center center / 100px no-repeat;

		&.rolling {
			animation: roll 1s ease;
		}

		.d20-face {
			@apply
				text-[2rem] text-[var(--main-text-color)]
				flex
				justify-center items-center
			;
		}
	}

	.dice-d6 {
		@apply
			flex
			w-[100px] h-[100px]
			cursor-pointer
			bg-[var(--error-color)]
			justify-center items-center
			cursor-pointer
			relative
		;

		border-radius: 15px;
		transition: transform 0.5s;

		&.rolling {
			animation: roll 1s ease;
		}

		.dot {
			@apply
				w-[10px] h-[10px]
				bg-[var(--main-text-color)]
				absolute
			;

			border-radius: 50%;
		}
	}
}

@keyframes roll {
	0% {
		transform: rotate(0deg) scale(1);
	}
	50% {
		transform: rotate(720deg) scale(1.2);
	}
	100% {
		transform: rotate(1440deg) scale(1);
	}
}
</style>
