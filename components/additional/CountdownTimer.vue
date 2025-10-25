<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['activeParentFunc']);

const props = defineProps({
	targetDate: {
		type: String,
		default: '2077-12-31T23:59:59'
	},
	title: {
		type: String,
		default: 'До киберпанка осталось'
	},
	endTitle: {
		type: String,
		default: 'Время истекло!'
	},
	showColumns: {
		type: Array,
		default: {
			days: true,
			hours: true,
			minutes: true,
			seconds: true,
		},
	},
})

const timeRemaining = ref(0);
let timerInterval = null;

// Вычисляем оставшееся время
const calculateTimeRemaining = () => {
	const target = new Date(props.targetDate).getTime();
	const now = new Date().getTime();
	timeRemaining.value = Math.max(0, target - now);

	if (timeRemaining.value === 0) {
		emit('activeParentFunc');
	}
}

// Форматируем время для отображения
const formattedTime = computed(() => {
	if (timeRemaining.value <= 0) {
		return {
			days: '00',
			hours: '00',
			minutes: '00',
			seconds: '00'
		}
	}

	const days = Math.floor(timeRemaining.value / (1000 * 60 * 60 * 24))
	const hours = Math.floor((timeRemaining.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
	const minutes = Math.floor((timeRemaining.value % (1000 * 60 * 60)) / (1000 * 60))
	const seconds = Math.floor((timeRemaining.value % (1000 * 60)) / 1000)

	return {
		days: days.toString().padStart(2, '0'),
		hours: hours.toString().padStart(2, '0'),
		minutes: minutes.toString().padStart(2, '0'),
		seconds: seconds.toString().padStart(2, '0')
	}
})

// Запускаем таймер
const startTimer = () => {
	calculateTimeRemaining()
	timerInterval = setInterval(calculateTimeRemaining, 1000)
}

// Останавливаем таймер
const stopTimer = () => {
	if (timerInterval) {
		clearInterval(timerInterval)
		timerInterval = null
	}
}

onMounted(() => {
	startTimer()
})

onUnmounted(() => {
	stopTimer()
})
</script>

<template>
	<div class="countdown-timer">
		<template v-if="timeRemaining > 0">
			<h2 v-if="title">{{ title }}</h2>
			<div class="timer-display">
				<div
						v-if="showColumns.days"
						class="time-unit"
				>
					<span class="time-value">{{ formattedTime.days }}</span>
					<span class="time-label">дней</span>
				</div>
				<div
						class="time-unit"
						v-if="showColumns.hours"
				>
					<span class="time-value">{{ formattedTime.hours }}</span>
					<span class="time-label">часов</span>
				</div>
				<div
						class="time-unit"
						v-if="showColumns.minutes"
				>
					<span class="time-value">{{ formattedTime.minutes }}</span>
					<span class="time-label">минут</span>
				</div>
				<div
						class="time-unit"
						v-if="showColumns.seconds"
				>
					<span class="time-value">{{ formattedTime.seconds }}</span>
					<span class="time-label">секунд</span>
				</div>
			</div>
		</template>
		<div v-else-if="timeRemaining <= 0" class="expired-message">
			{{ endTitle }}
		</div>
	</div>
</template>

<style lang="scss" scoped>
.countdown-timer {
	@apply bg-[var(--second-block-color)] text-[var(--main-dark-text-color)];

	text-align: center;
	padding: 2rem;
}

.countdown-timer h2 {
	margin-bottom: 1.5rem;
	font-size: 1.5rem;
	font-weight: 300;
}

.timer-display {
	display: flex;
	justify-content: center;
	gap: 1.5rem;
	flex-wrap: wrap;
}

.time-unit {
	display: flex;
	flex-direction: column;
	align-items: center;
	background: rgba(255, 255, 255, 0.1);
	padding: 1rem;
	min-width: 80px;
	backdrop-filter: blur(10px);
}

.time-value {
	font-size: 2.5rem;
	font-weight: bold;
	font-family: 'Courier New', monospace;
}

.time-label {
	font-size: 0.9rem;
	margin-top: 0.5rem;
	opacity: 0.9;
}

.expired-message {
	font-size: 2rem;
	font-weight: bold;
	animation: pulse 1.5s infinite;
}

@keyframes pulse {
	0% { opacity: 1; }
	50% { opacity: 0.7; }
	100% { opacity: 1; }
}

/* Адаптивность */
@media (max-width: 768px) {
	.timer-display {
		gap: 1rem;
	}

	.time-unit {
		min-width: 70px;
		padding: 0.8rem;
	}

	.time-value {
		font-size: 2rem;
	}
}

@media (max-width: 480px) {
	.timer-display {
		gap: 0.5rem;
	}

	.time-unit {
		min-width: 60px;
		padding: 0.6rem;
	}

	.time-value {
		font-size: 1.5rem;
	}

	.time-label {
		font-size: 0.8rem;
	}
}
</style>
