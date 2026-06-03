<script setup>
import Settings from '@/components/games/gamblingGame/Settings.vue';

import ItemCard from '@/modules/boardGame/components/item/ItemCard.vue';
import GameGamblingCard from '@/modules/boardGame/components/game/GameGamblingCard.vue';
import Game from '@/components/games/gamblingGame/card/Game.vue';

import { ref } from 'vue'
const emit = defineEmits([
		'setStatus',
		'funcAfterRollWithDelay500',
		'funcAfterRollWithDelay1000'
]);

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { notifications } from '@/composables/notifications.js';
const { error } = notifications();

import { userFunctions } from '@/composables/userFunctions.js';
const { isAuth, userStore } = userFunctions();

import { animate } from '@/composables/animate.js';
const { scrollToElement } = animate();

const props = defineProps({
	items: { // Объект элементов для рулетки
		type: Object,
		default: {},
	},
	requestObj: { // Объект запроса, используется, если определение случайного элемента делегируется на бекенд
		type: Object,
		default: {},
	},

	itemHeight: { // Высота одного элемента рулетки
		type: Number,
		default: 91,
	},
	elementToShow: { // Количество элементов которые видны в окне рулетки
		type: Number,
		default: 3,
	},
	spinTime: { // Время крутки рулетки
		type: Number,
		default: 15000,
	},
	easeOutType: {
		type: Number,
		default: 1,
	},

	sounds: { // Список случайных звуков, которые выбирают в качестве фоновой музыки крутки рулетки
		type: Array,
		default: [
			{
				name: 'PokeDance',
				value: '/sounds/roll.wav',
			},
			{
				name: 'Поле Чудес',
				value: '/sounds/baraban_sg.mp3',
			},
			{
				name: 'Бенни Хилл',
				value: '/sounds/BennyHill.mp3',
			},
		],
	},

	requestParentData: { // Обновление данных в родительском компоненте
		type: Boolean,
		default: false,
	},

	roll_count: { // Доступное количество ролов рулетки
		type: Number,
		default: 0,
	},
	cardType: { // Тип карточки в рулетке
		type: String,
		default: 'itemCard',
	},

	showItemCount: { // Отображать количество элементов в рулетке
		type: Boolean,
		default: false,
	},
	showRollCount: { // Отображать доступное количество круток
		type: Boolean,
		default: false,
	},
	rollCountZeroMessage: { // Сообщение, если кколичество круток равно 0
		type: String,
		default: 'У вас не осталось круток, выполните условия для получения новой крутки',
	},

	windowClasses: { // Классы основного окна рулетки
		type: Array,
		default: [],
	}
});

const requestInProgress = ref(false);

const {
	items,
	repeatedItems,
	mainBlockHeight,
	translateY,
	canStop,
	spinning,
	resultId,
	createRepeatedItems,
	getRandomItem,
	stopSpin,
} = rollFunctions();

function rollFunctions() {
	const items = ref(null);

	/* Объявляем константы для рулетки */
	const translateY = ref(0);
	const spinning = ref(false);
	const resultId = ref(null);
	const repeatedItems = ref([]);

	const elapsed = ref(null);
	const stopped = ref(false);

	let animationFrameId = null;        // ID текущей анимации
	let targetTranslateY = null;        // Целевая позиция прокрутки
	let selectedRandomIndex = null;     // Индекс выпавшего элемента
	let spinStartTime = null;           // Время начала анимации
	let totalSpinDuration = null;       // Исходная длительность прокрутки
	let itemCount = null;

	/* Высота рулетки */
	const mainBlockHeight = computed(() => {
		return props.itemHeight * settings.value.elementToShow;
	});

	/* Можно ли остановить крутку */
	const canStop = computed(() => {
		return settings.value.spinTime - 3000 > elapsed.value && !stopped.value;
	});

	const createRepeatedItems = () => {
		/* Дублируем элементы для долгого кручения */
		itemCount = Object.keys(items.value).length;
		const repeatItemCount = itemCount >= 200 ? 2 : Math.round(100 / itemCount) * 2;

		// Создаем массив повторений, избегая проблемы с общими ссылками
		repeatedItems.value = Array.from(
				{ length: repeatItemCount },
				() => [...Object.values(items.value)]
		).flat();
	}

	const getRandomItem = async () => {
		if (spinning.value || requestInProgress.value) return

		let randomIndex = null;

		/*
		 * Существование requestObj означает, что компонент делегирует определение элемента, который должен выпасть в рулетке на бекенд
		 */
		if (Object.keys(props.requestObj).length) {
			requestInProgress.value = true;

			try {
				const response = await sendApiRequest(
						props.requestObj.url,
						props.requestObj.method,
						{},
						props.requestObj.requestName
				);

				if (response) {
					if (response.status === 'error' && response.status_message) {
						error(response.status_message);
					} else {
						/* Находим выпавший элемент в списке элементов */
						for (let i = 0; items.value.length > 0; i++) {
							if (items.value[i].id === response.data.id) {
								randomIndex = i;
								break;
							}
						}

						if (randomIndex !== null && randomIndex !== undefined) {
							startSpin(randomIndex);
						} else {
							error('Произошла ошибка, обратитесь к администратору');
						}
					}
				}

				requestInProgress.value = false;
			} catch (e) {
				error(e);
				requestInProgress.value = false;
			}
		} else {
			randomIndex = Math.floor(Math.random() * items.value.length);
			startSpin(randomIndex);
		}
	}

	const startSpin = (randomIndex) => {
		if (spinning.value) return;

		scrollToElement('roulette-window');
		emit('setStatus', 'start');

		resultId.value = null;
		spinning.value = true;

		// Сохраняем параметры для возможной остановки
		selectedRandomIndex = randomIndex;
		totalSpinDuration = settings.value.spinTime;
		spinStartTime = performance.now();

		if (settings.value.sounds.length) {
			const soundIndex = getRandomSound();
			const currentSound = audioElements.value[soundIndex];

			// Останавливаем все звуки перед воспроизведением нового
			audioElements.value.forEach(audio => {
				audio.pause();
				audio.currentTime = 0;
			});

			setVolume(currentSound);

			// Обработка ошибок воспроизведения звука
			currentSound.play().catch(e => {
				console.error('Ошибка воспроизведения звука:', e);

				// Пытаемся воспроизвести следующий звук в случае ошибки
				const fallbackIndex = (soundIndex + 1) % settings.value.sounds.length;
				const fallbackSound = audioElements.value[fallbackIndex];

				setVolume(fallbackSound);

				fallbackSound.play().catch(e2 => {
					console.error('Ошибка воспроизведения запасного звука:', e2);
				});
			});
		}

		const itemHeight = props.itemHeight;					// высота одного элемента
		const windowHeight = mainBlockHeight.value;   // высота окна рулетки
		const currentSpinTime = settings.value.spinTime;     	// время крутки рулетки

		const totalItems = repeatedItems.value.length;

		// Центральный элемент массива repeatedItems (берём из середины, чтобы был запас)
		const baseIndex = Math.floor(totalItems / 2);
		const targetIndex = baseIndex + randomIndex;

		// Куда крутим рулетку
		const centerOffset = (windowHeight / 2) - (itemHeight / 2);
		targetTranslateY = targetIndex * itemHeight - centerOffset;

		const start = performance.now();
		const startTranslateY = 0;

		const animate = (now) => {
			elapsed.value = now - start
			const progress = Math.min(elapsed.value / currentSpinTime, 1)

			let easeOut = null;

			if (props.easeOutType === 1) {
				easeOut = 1 - Math.pow(1 - progress, 3);
			}

			if (props.easeOutType === 2) {
				easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
			}

			if (typeof easeOut === 'number') {
				translateY.value = startTranslateY + (targetTranslateY - startTranslateY) * easeOut;

				if (elapsed.value < currentSpinTime) {
					animationFrameId = requestAnimationFrame(animate);
				} else {
					finishSpin(randomIndex);
				}
			} else {
				error('Проверьте наличие easeOutType');
			}
		}

		requestAnimationFrame(animate)
	}

	const finishSpin = (randomIndex) => {
		// Останавливаем звуки
		audioElements.value.forEach(audio => {
			audio.pause();
			audio.currentTime = 0;
		});

		resultId.value = items.value[randomIndex].id;

		emit('setStatus', 'finish');

		setTimeout(() => {
			emit('funcAfterRollWithDelay500', items.value[randomIndex]);
		}, 500);

		setTimeout(() => {
			spinning.value = false;
			stopped.value = false;
			emit('funcAfterRollWithDelay1000', items.value[randomIndex]);
		}, 1000);
	}

	const stopSpin = () => {
		stopped.value = true;

		// 1. Останавливаем текущую анимацию
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
		}

		// 2. Параметры для ускоренной анимации
		const remainingTime = 2000;
		const startTime = performance.now();
		const startTranslateYCurrent = translateY.value; // Текущая позиция
		const distance = targetTranslateY - startTranslateYCurrent;

		const animateFinish = (now) => {
			const elapsedFinish = now - startTime;
			const progress = Math.min(elapsedFinish / remainingTime, 1);

			let easeOut = null;
			if (props.easeOutType === 1) {
				easeOut = 1 - Math.pow(1 - progress, 3);
			}
			if (props.easeOutType === 2) {
				easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
			}

			if (typeof easeOut === 'number') {
				translateY.value = startTranslateYCurrent + distance * easeOut;

				if (progress < 1) {
					animationFrameId = requestAnimationFrame(animateFinish);
				} else {
					// 3. Завершаем спин
					translateY.value = targetTranslateY; // Финальная позиция
					elapsed.value = totalSpinDuration;   // Для корректной работы canStop
					finishSpin(selectedRandomIndex);     // Вызываем финализацию
				}
			}
		};

		animationFrameId = requestAnimationFrame(animateFinish);
	}

	return {
		items,
		repeatedItems,
		mainBlockHeight,
		translateY,
		canStop,
		spinning,
		resultId,
		createRepeatedItems,
		getRandomItem,
		stopSpin,
	};
}

const {
	audioElements,
	initializeSounds,
	getRandomSound,
	setVolume,
} = soundFunctions();

function soundFunctions() {
	// Массив для хранения всех звуков
	const audioElements = ref([]);

	// Инициализация звуков
	const initializeSounds = () => {
		audioElements.value = settings.value.sounds.map(soundUrl => {
			const audio = new Audio(soundUrl);
			audio.preload = 'auto';
			return audio;
		});

		// Предзагрузка звуков
		audioElements.value.forEach(audio => {
			audio.load();
		});
	};

	const getRandomSound = () => {
		return Math.floor(Math.random() * settings.value.sounds.length);
	}

	const setVolume = (audioElement) => {
		if (isAuth && userStore.user?.settings?.soundVolume !== undefined) {
			const volume = userStore.user.settings.soundVolume > 0
					? Math.round(userStore.user.settings.soundVolume / 2)
					: userStore.user.settings.soundVolume;
			if (typeof volume === 'number' && !isNaN(volume) && isFinite(volume)) {
				audioElement.volume = volume ? volume / 100 : 0;
			} else {
				audioElement.volume = 0.2;
			}
		} else {
			audioElement.volume = 0.2;
		}
	}

	return {
		audioElements,
		initializeSounds,
		getRandomSound,
		setVolume,
	};
}

const getCardType = () => {
	switch (props.cardType) {
		case 'ItemCard': return ItemCard;
		case 'GameGamblingCard': return GameGamblingCard;
		case 'Game': return Game;
	}
}

const {
	settingPanelStatus,
	toggleSettingPanel,
	selectedSettings,
	settings,
	setSettings,
} = settingFunctions();

function settingFunctions() {
	const settingPanelStatus = ref(false);

	const toggleSettingPanel = () => {
		settingPanelStatus.value = !settingPanelStatus.value;
	};

	const selectedSettings = ref({});

	const settings = computed(() => {
		const data = {};

		data.spinTime = selectedSettings.value.spinTime ?? props.spinTime;
		data.sounds = [ ...selectedSettings.value.sounds ];
		data.elementToShow = selectedSettings.value.elementToShow ?? props.elementToShow;

		return data;
	});

	const setSettings = () => {
		selectedSettings.value.spinTime = props.spinTime;

		selectedSettings.value.sounds = [];
		props.sounds.forEach((item) => {
			selectedSettings.value.sounds.push(item.value);
		});

		selectedSettings.value.elementToShow = props.elementToShow;
	};

	return {
		settingPanelStatus,
		toggleSettingPanel,
		selectedSettings,
		settings,
		setSettings,
	};
}

/* Инициализация */
onMounted(() => {
	// Добавляем элементы из свойста и перемешиваем
	items.value = props.items.sort(() => Math.random() - 0.5);
	createRepeatedItems();

	// Инициализируем звуки при монтировании компонента
	initializeSounds();
});

watch(() => userStore.user?.settings?.soundVolume, () => {
	// Обновляем громкость, при её изменении пользователем
	audioElements.value.forEach(audio => {
		setVolume(audio);
	});
}, { deep: true });

setSettings();

watch(() => settings.value.sounds, (newValue, oldValue) => {
	if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
		initializeSounds();
	}
}, { deep: true });
</script>

<template>
	<div class="gambling-game">
		<ui-BigPreloader
				v-if="requestInProgress"
				class="loading-box"
				theme="image"
				:themeType="9"
		/>
		<div
				v-if="repeatedItems.length > 0"
				class="roulette-container"
		>
			<div
					id="roulette-window"
					:class="['roulette-window default', windowClasses]"
					:style="`height: ${mainBlockHeight}px;`"
			>
				<ui-fragments-DisableBox
						v-if="roll_count === 0"
						:message="rollCountZeroMessage"
				/>

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
							:style="`height: ${itemHeight - 5}px;`"
					>
						<component
								:is="getCardType()"
								:element="element"
								:showControlPanel="false"
								:cutDescription="true"
								:showFullDescription="false"
								:showDropChance="false"
								theme="gamblingGame"
								:classes="element.id === resultId ? 'active' : ''"
						/>
					</div>
				</div>
			</div>

			<div class="flex justify-between items-center w-full">
				<div
						v-if="showItemCount"
						class="count-info"
				>
					Элементов в рулетке: {{ items.length }}
				</div>
				<button
						class="btn btn-simple"
						@click="toggleSettingPanel"
				>
					<font-awesome-icon icon="fa-solid fa-gear" /> Настройки
				</button>
			</div>

			<div
					v-show="settingPanelStatus"
					class="w-full relative"
			>
				<ui-fragments-DisableBox v-if="spinning" />
				<Settings
						v-model="selectedSettings"
						:sounds="props.sounds"
				/>
			</div>

			<button
					v-if="spinning"
					:disabled="!canStop || requestInProgress || requestParentData"
					:class="`btn ${!canStop || requestInProgress || requestParentData ? 'btn-disable' : 'btn-simple' }`"
					@click="stopSpin"
			>
				Быстрее
			</button>
			<button
					v-else-if="roll_count > 0"
					:class="`btn ${spinning || requestInProgress || requestParentData ? 'btn-disable' : 'btn-simple' }`"
					:disabled="spinning || requestInProgress || requestParentData"
					@click="getRandomItem"
			>
				Крутануть рулетку<template v-if="showRollCount"> x{{ roll_count }}</template>
			</button>
		</div>
		<ui-itemBox
				v-else
				classes="red"
				message="Отсутствуют элементы для крутки"
		/>
	</div>
</template>

<style lang="scss" scoped>
.gambling-game {
	@apply relative;

	.loading-box {
		@apply absolute z-[10] justify-center items-center w-full h-full bg-black/50;
	}

	.roulette-container {
		@apply w-full flex flex-col items-center;

		.control-panel {
			@apply flex justify-between items-center w-full;
		}

		.roulette-window {
			@apply relative w-full overflow-hidden;

			&.default {
				border: 4px solid var(--third-active-color);

				.left-triangle {
					@apply text-[var(--third-active-color)];
				}

				.right-triangle {
					@apply text-[var(--third-active-color)];
				}
			}

			&.gold {
				border: 4px solid var(--gold-color-1);

				.left-triangle {
					@apply text-[var(--gold-color-1)];
				}

				.right-triangle {
					@apply text-[var(--gold-color-1)];
				}
			}

			&.shit {
				border: 4px solid var(--shit-color-1);

				.left-triangle {
					@apply text-[var(--shit-color-1)];
				}

				.right-triangle {
					@apply text-[var(--shit-color-1)];
				}
			}

			.left-triangle {
				@apply absolute left-[-2px] z-[1] text-[1.4rem];
				top: calc(50% - 0.7rem);
			}

			.right-triangle {
				@apply absolute right-[-2px] z-[1] text-[1.4rem];
				top: calc(50% - 0.7rem);
			}

			.roulette-content {
				@apply flex flex-col;

				.item {
					@apply h-[86px] flex justify-center items-center mb-[5px];
				}
			}
		}

		.count-info {
			@apply mt-[1rem] mb-[1rem] text-[1.2rem];
		}
	}
}
</style>
