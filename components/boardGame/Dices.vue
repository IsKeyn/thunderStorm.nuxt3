<script setup>
import { ref } from "vue";

import { boardGameLog } from '@/composables/BoardGame/boardGameLog.js'
const {
	setLog,
} = boardGameLog();

import { notifications } from '@/composables/notifications.js';
const {
	alert,
	error,
	choiceAlert
} = notifications();

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
	sendApiRequest,
} = api();

const emit = defineEmits(['updateBoardGameInfo', 'fetchLogs']);

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
	size: {
		type: Number,
		default: 100,
	},
});

const d6Result = ref(6)
const d20Result = ref(20)

const isRollingD6 = ref(false)
const isRollingD20 = ref(false)

// const isRollingD6Interval = ref(false)
// const isRollingD20Interval = ref(false)

const diceSound = ref(null)

const d6Dots = {
	1: [{ top: `calc(50% - ${props.size/20}px)`, left: `calc(50% - ${props.size/20}px)`, width: `${props.size/10}px`, height: `${props.size/10}px`, }],
	2: [
		{ top: `calc(30% - ${props.size/20}px)`, left: `calc(30% - ${props.size/20}px)`, width: `${props.size/10}px`, height: `${props.size/10}px`, },
		{ top: `calc(70% - ${props.size/20}px)`, left: `calc(70% - ${props.size/20}px)`, width: `${props.size/10}px`, height: `${props.size/10}px`, },
	],
	3: [
		{ top: `calc(30% - ${props.size/20}px)`, left: `calc(30% - ${props.size/20}px)`, width: `${props.size/10}px`, height: `${props.size/10}px`, },
		{ top: `calc(50% - ${props.size/20}px)`, left: `calc(50% - ${props.size/20}px)`, width: `${props.size/10}px`, height: `${props.size/10}px`, },
		{ top: `calc(70% - ${props.size/20}px)`, left: `calc(70% - ${props.size/20}px)`, width: `${props.size/10}px`, height: `${props.size/10}px`, },
	],
	4: [
		{ top: `calc(30% - ${props.size/20}px)`, left: `calc(30% - ${props.size/20}px)`, width: `${props.size/10}px`, height: `${props.size/10}px`, },
		{ top: `calc(30% - ${props.size/20}px)`, left: `calc(70% - ${props.size/20}px)`, width: `${props.size/10}px`, height: `${props.size/10}px`, },
		{ top: `calc(70% - ${props.size/20}px)`, left: `calc(30% - ${props.size/20}px)`, width: `${props.size/10}px`, height: `${props.size/10}px`, },
		{ top: `calc(70% - ${props.size/20}px)`, left: `calc(70% - ${props.size/20}px)`, width: `${props.size/10}px`, height: `${props.size/10}px`, },
	],
	5: [
		{ top: `calc(30% - ${props.size/20}px)`, left: `calc(30% - ${props.size/20}px)`, width: `${props.size/10}px`, height: `${props.size/10}px`, },
		{ top: `calc(30% - ${props.size/20}px)`, left: `calc(70% - ${props.size/20}px)`, width: `${props.size/10}px`, height: `${props.size/10}px`, },
		{ top: `calc(50% - ${props.size/20}px)`, left: `calc(50% - ${props.size/20}px)`, width: `${props.size/10}px`, height: `${props.size/10}px`, },
		{ top: `calc(70% - ${props.size/20}px)`, left: `calc(30% - ${props.size/20}px)`, width: `${props.size/10}px`, height: `${props.size/10}px`, },
		{ top: `calc(70% - ${props.size/20}px)`, left: `calc(70% - ${props.size/20}px)`, width: `${props.size/10}px`, height: `${props.size/10}px`, },
	],
	6: [
		{ top: `calc(30% - ${props.size/20}px)`, left: `calc(30% - ${props.size/20}px)`, width: `${props.size/10}px`, height: `${props.size/10}px`, },
		{ top: `calc(30% - ${props.size/20}px)`, left: `calc(70% - ${props.size/20}px)`, width: `${props.size/10}px`, height: `${props.size/10}px`, },
		{ top: `calc(50% - ${props.size/20}px)`, left: `calc(30% - ${props.size/20}px)`, width: `${props.size/10}px`, height: `${props.size/10}px`, },
		{ top: `calc(50% - ${props.size/20}px)`, left: `calc(70% - ${props.size/20}px)`, width: `${props.size/10}px`, height: `${props.size/10}px`, },
		{ top: `calc(70% - ${props.size/20}px)`, left: `calc(30% - ${props.size/20}px)`, width: `${props.size/10}px`, height: `${props.size/10}px`, },
		{ top: `calc(70% - ${props.size/20}px)`, left: `calc(70% - ${props.size/20}px)`, width: `${props.size/10}px`, height: `${props.size/10}px`, },
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
		isRollingD6.value = true;
		d6Result.value = '?';
		// isRollingD6Interval.value = setInterval(() => {
		// 	clearInterval(isRollingD6Interval.value);
		// 	d6Result.value = Math.floor(Math.random() * 6) + 1;
		// }, 100);

		rollDiceRequest(6);
	} else if (type === 'd20') {
		isRollingD20.value = true;
		d20Result.value = '?';
		// isRollingD20Interval.value = setInterval(() => {
		// 	clearInterval(isRollingD20Interval.value);
		// 	d20Result.value = Math.floor(Math.random() * 20) + 1;
		// }, 100);

		rollDiceRequest(20);
	}
}

const requestInProgress = ref(false);

const rollDiceRequest = async (dice) => {
	requestInProgress.value = true;

	try {
		const body = {
			dice,
		}

		const response = await sendApiRequest('board-game/roll-dice', 'POST', body);

		if (response) {
			requestInProgress.value = false;

			if (dice === 6) {
				setTimeout(() => {
					// clearInterval(isRollingD6Interval.value);
					d6Result.value = response.rollResult;

					const logBody = {
						board_game_id: props.boardGameId,
						message: `бросил кубик D6, выпало ${d6Result.value}`
					};
					setLog(logBody);

					isRollingD6.value = false;
				}, 1000)
			} else if (dice === 20) {
				setTimeout(() => {
					// clearInterval(isRollingD20Interval.value);
					d20Result.value = response.rollResult;

					const logBody = {
						board_game_id: props.boardGameId,
						message: `бросил кубик D20, выпало ${d20Result.value}`
					};
					setLog(logBody);

					isRollingD20.value = false;
				}, 1000)
			}

			if (response.updateData) {
				emit('updateBoardGameInfo');
			}
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
};

const getD6SizeClasses = () => {
	return `w-[${props.size}px] h-[${props.size}px]`;
}

const getD20SizeClasses = () => {
	return `w-[${props.size}px] h-[${props.size + props.size/10}px]`;
}

const getDotSizeClasses = () => {

}
</script>

<template>
	<span class="user-interface-title">Кубики</span>
	<div class="dice-container">
		<!-- D20 -->
		<div
				class="d20-container"
				@click="rollDice('d20')"
				:style="`
							width: ${size}px;
							height: ${size + size/10}px;
				`"
		>
			<div
					class="dice-d20"
					:style="`
							width: ${size}px;
							height: ${size + size/10}px;
							background-color: var(--button-color-1);
							-webkit-mask-image: url('/images/board-games/d20.png');
							-webkit-mask-position: center center;
							-webkit-mask-size: ${size}px;
							-webkit-mask-repeat: no-repeat;
							mask-image: url('/images/board-games/d20.png');
							mask-position: center center;
							mask-size: ${size}px;
							mask-repeat: no-repeat;
					`"
					:class="{ rolling: isRollingD20 }"
			>
			</div>
			<div class="face d20-face">
				{{ d20Result }}
			</div>
		</div>

		<!-- D6 -->
		<div
				class="dice-d6"
				:style="`width: ${size}px; height: ${size}px;`"
				:class="{ rolling: isRollingD6 }"
				@click="rollDice('d6')"
		>

			<div :class="['face', d6Result === '?' ? 'd6-face' : '']">
				<template v-if="d6Result === '?'">
					{{ d6Result }}
				</template>
				<template v-else
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

	.d20-container {
		@apply relative;

		.dice-d20 {
			@apply
			cursor-pointer
			absolute top-0 left-0
			;

			transition: transform 0.5s;

			&.rolling {
				animation: roll 1s ease;
			}
		}

		.d20-face {
			@apply
				text-[2rem] text-[var(--main-text-color)]
				flex
				justify-center items-center
				relative z-[10]
			;

			text-shadow: 0 0 5px #000;
		}
	}

	.dice-d6 {
		@apply
			flex
			cursor-pointer
			bg-[var(--button-color-1)]
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
				bg-[var(--main-text-color)]
				absolute
			;

			border-radius: 50%;
		}

		.d6-face {
			@apply
				text-[2rem] text-[var(--main-text-color)]
				flex
				justify-center items-center
			;

			text-shadow: 0 0 5px #000;
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
