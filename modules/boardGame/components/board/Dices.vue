<script setup>
import { ref } from "vue";
const route = useRoute();

const emit = defineEmits(['updateBoardGameInfo', 'fetchLogs', 'changePosition']);

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

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
	size: {
		type: Number,
		default: 100,
	},
	position: { // horizontal , vertical
		type: String,
		default: 'horizontal',
	},
	showTitle: {
		type: Boolean,
		default: false,
	},
	dices: {
		type: Array,
		default: ['d6', 'd20'],
	},
	type: { // Принцип расчета значения кубика. Значения: client - js рандом, server - отправка запроса на бек, для рандома значения, записи логов и выполнения доп. действий
		type: String,
		default: 'server',
	},
	rollCount: {
		type: Number,
		default: 1,
	}
});

const d6Result = ref(6)
const d20Result = ref(20)

const isRollingD6 = ref(false)
const isRollingD20 = ref(false)

const isRollingD6Interval = ref(false)
const isRollingD20Interval = ref(false)

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
	if (props.rollCount === 0) {
		alert('Вы не можете кидать кубик, так как у вас не осталось доступных ходов');
		return;
	}

	playSound();

	if (type === 'd6') {
		isRollingD6.value = true;

		if (props.type === 'client') {
			isRollingD6Interval.value = setInterval(() => {
				clearInterval(isRollingD6Interval.value);
				d6Result.value = Math.floor(Math.random() * 6) + 1;
			}, 100);
		}

		if (props.type === 'server') {
			d6Result.value = '?';
			rollDiceRequest(6);
		}
	} else if (type === 'd20') {
		isRollingD20.value = true;

		if (props.type === 'client') {
			isRollingD20Interval.value = setInterval(() => {
				clearInterval(isRollingD20Interval.value);
				d20Result.value = Math.floor(Math.random() * 20) + 1;
			}, 100);
		}

		if (props.type === 'server') {
			d20Result.value = '?';
			rollDiceRequest(20);
		}
	}
}

const requestInProgress = ref(false);

const rollDiceRequest = async (dice) => {
	requestInProgress.value = true;

	try {
		const body = {
			slug: route.params.slug,
			dice,
			useStep: true,
		}

		const response = await sendApiRequest(`board-game/v2/roll-dice`, 'POST', body, 'boardGameRollDice', '');

		if (response) {
			if (response.error) {
				error(response.error);
			} else {
				requestInProgress.value = false;

				if (dice === 6) {
					setTimeout(() => {
						d6Result.value = response.rollResult;
						isRollingD6.value = false;
					}, 1000)
				} else if (dice === 20) {
					setTimeout(() => {
						d20Result.value = response.rollResult;
						isRollingD20.value = false;
					}, 1000)
				}

				// Вызываем функцию, которая изменит позицию игрока на поле
				if (response.positionData) {
					emit('changePosition', response.positionData);
				}

				// Изменение статус эффектов
				if (response.updateData) {
					emit('updateBoardGameInfo');
				}
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
	<span
			v-if="showTitle"
			class="user-interface-title"
	>Кубики</span>
	<div
			:class="['dices-container', position]"
	>
		<!-- D20 -->
		<div
				v-if="dices.includes('d20')"
				class="dice-container d20-container"
				@click="rollDice('d20')"
				:style="`
							width: ${size}px;
							height: ${size + size/10}px;
				`"
		>
			<div
					:class="[
							'dice-container dice-d20',
							rollCount === 0 ? 'disable' : '',
							rolling ? isRollingD20 : '',
					]"
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
			>
			</div>
			<div class="face d20-face">
				{{ d20Result }}
			</div>
		</div>

		<!-- D6 -->
		<div
				v-if="dices.includes('d6')"
				:class="[
							'dice-d6',
							rollCount === 0 ? 'disable' : '',
							rolling ? isRollingD6 : '',
					]"
				:style="`width: ${size}px; height: ${size}px;`"
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
.dices-container {
	@apply
		justify-center items-center
	;

	&.horizontal {
		@apply flex gap-[3rem];
	}

	&.vertical {
		.dice-container {
			@apply mb-4;
		}
	}

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

	.disable {
		@apply bg-[var(--button-disable-color-1)] cursor-not-allowed;
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
