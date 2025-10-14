<script setup>
import ItemCard from '@/modules/boardGame/components/item/ItemCard.vue';
import GameGamblingCard from '@/modules/boardGame/components/game/GameGamblingCard.vue';

import { ref } from 'vue'

const emit = defineEmits(['funcAfterRollWithDelay1', 'funcAfterRollWithDelay2']);

const route = useRoute();

import { userFunctions } from '@/composables/userFunctions.js';
const {
	isAuth,
	userStore,
} = userFunctions();

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

import { notifications } from '@/composables/notifications.js';
const { error } = notifications();

const props = defineProps({
	items: {
		type: Object,
		default: {},
	},
	roll_count: {
		type: Number,
		default: 0,
	},
	requestObj: {
		type: Object,
		default: {},
	},
	itemHeight: {
		type: Number,
		default: 91,
	},
	elementCount: {
		type: Number,
		default: 3,
	},
	spinTime: {
		type: Number,
		default: 15000,
	},
	cardType: {
		type: String,
		default: 'itemCard',
	},
	easeOutType: {
		type: Number,
		default: 1,
	},
	showItemCount: {
		type: Boolean,
		default: false,
	},
	requestParentData: {
		type: Boolean,
		default: false,
	},
	sounds: {
		type: Array,
		default: [
			'/sounds/roll.wav',
			'/sounds/baraban_sg.mp3',
			'/sounds/BennyHill.mp3',
		],
	},
});

const items = ref(props.items);

/* Получаем случайный элемент, который должен выпасть */
const requestInProgress = ref(false);

const getRandomItem = async () => {
	if (spinning.value || requestInProgress.value) return

	let randomIndex = null;

	if (Object.keys(props.requestObj).length) {
		requestInProgress.value = true;

		try {
			const response = await sendApiRequest(props.requestObj.url, props.requestObj.method, {}, props.requestObj.requestName);

			if (response) {
				if (response.status === 'error' && response.status_message) {
					error(response.status_message);
				} else {
					requestInProgress.value = false;

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
		} catch (e) {
			error(e);
			requestInProgress.value = false;
		}
	} else {
		randomIndex = Math.floor(Math.random() * items.value.length);
		startSpin(randomIndex);
	}
}

/* Перемешиваем элементы */
items.value = items.value.sort(() => Math.random() - 0.5);

/* Дублируем элементы для долгого кручения */
const repeatItemCount = Math.round(100 / Object.keys(items.value).length) * 2;
const repeatedItems = Array(repeatItemCount).fill([...items.value]).flat();

/* Высота рулетки */
const mainBlockHeight = computed(() => {
	return props.itemHeight * props.elementCount;
});

/* Объявляем константы для рулетки */
const translateY = ref(0);
const spinning = ref(false);
const spinSound = ref({});
const resultId = ref(null);

// Массив для хранения всех звуков
const audioElements = ref([]);

// Инициализация звуков
const initializeSounds = () => {
	audioElements.value = props.sounds.map(soundUrl => {
		const audio = new Audio(soundUrl);
		audio.preload = 'auto';
		return audio;
	});

	// Предзагрузка звуков
	audioElements.value.forEach(audio => {
		audio.load();
	});
};

// Инициализируем звуки при монтировании компонента
onMounted(() => {
	initializeSounds();
});

const setVolume = (audioElement) => {
	if (isAuth && userStore.user?.settings?.soundVolume !== undefined) {
		const volume = userStore.user.settings.soundVolume;
		if (typeof volume === 'number' && !isNaN(volume) && isFinite(volume)) {
			audioElement.volume = volume ? volume / 100 : 0;
		} else {
			audioElement.volume = 0.2;
		}
	} else {
		audioElement.volume = 0.2;
	}
}

watch(() => userStore.user?.settings?.soundVolume, () => {
	// Обновляем громкость для всех звуков
	audioElements.value.forEach(audio => {
		setVolume(audio);
	});
}, { deep: true });

const getRandomSound = () => {
	const randomIndex = Math.floor(Math.random() * props.sounds.length);
	return randomIndex;
}

const startSpin = (randomIndex) => {
	if (spinning.value) return;

	resultId.value = null;
	spinning.value = true;

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
		const fallbackIndex = (soundIndex + 1) % props.sounds.length;
		const fallbackSound = audioElements.value[fallbackIndex];
		setVolume(fallbackSound);
		fallbackSound.play().catch(e2 => {
			console.error('Ошибка воспроизведения запасного звука:', e2);
		});
	});

	const itemHeight = props.itemHeight;					// высота одного элемента
	const windowHeight = mainBlockHeight.value;   // высота окна рулетки
	const spinTime = props.spinTime;     					// время крутки рулетки

	const totalItems = repeatedItems.length;

	// Центральный элемент массива repeatedItems (берём из середины, чтобы был запас)
	const baseIndex = Math.floor(totalItems / 2);
	const targetIndex = baseIndex + randomIndex;

	// Куда крутим рулетку
	const centerOffset = (windowHeight / 2) - (itemHeight / 2);
	const targetTranslateY = targetIndex * itemHeight - centerOffset;

	const start = performance.now();
	const startTranslateY = 0;

	const animate = (now) => {
		const elapsed = now - start
		const progress = Math.min(elapsed / spinTime, 1)

		let easeOut = null;

		if (props.easeOutType === 1) {
			easeOut = 1 - Math.pow(1 - progress, 3);
		}

		if (props.easeOutType === 2) {
			easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
		}

		if (typeof easeOut === 'number') {
			translateY.value = startTranslateY + (targetTranslateY - startTranslateY) * easeOut;

			if (elapsed < spinTime) {
				requestAnimationFrame(animate)
			} else {
				// Останавливаем все звуки
				audioElements.value.forEach(audio => {
					audio.pause();
					audio.currentTime = 0;
				});

				/* Используется для выделения цветом выпавшего предмета */
				resultId.value = items.value[randomIndex].id;

				setTimeout(() => {
					emit('funcAfterRollWithDelay1', items.value[randomIndex]);
				}, 500);

				setTimeout(() => {
					spinning.value = false;
					emit('funcAfterRollWithDelay2', items.value[randomIndex]);
				}, 1000);
			}
		} else {
			error('Проверьте наличие easeOutType');
		}
	}

	requestAnimationFrame(animate)
}
</script>

<template>
	<div class="relative">
		<div
				v-if="requestInProgress"
				class="loading-box"
		>
			<ui-BigPreloader class="h-full" />
		</div>
		<div
				v-if="items.length > 0"
				class="roulette-container"
		>
			<div
					v-if="roll_count === 0"
					class="item-box w-full p-5"
			>
				У вас не осталось круток, выполните условия для получения новой крутки
			</div>

			<div
					class="roulette-window"
					:style="`height: ${mainBlockHeight}px;`"
			>
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
						<ItemCard
								v-if="cardType === 'itemCard'"
								:element="element"
								:showControlPanel="false"
								:cutDescription="true"
								:showFullDescription="false"
								theme="gamblingGame"
								:classes="element.id === resultId ? 'active' : ''"
						/>
						<GameGamblingCard
								v-if="cardType === 'GameGamblingCard'"
								:element="element"
								:itemHeight="itemHeight"
								:classes="element.id === resultId ? 'active' : ''"
						/>
					</div>
				</div>
			</div>

			<div
					v-if="showItemCount"
					class="count-info"
			>
				Элементов в рулетке: {{ items.length }}
			</div>

			<button
					v-if="roll_count > 0"
					:class="`!mt-4 btn ${spinning || requestInProgress || requestParentData ? 'btn-disable' : 'btn-simple' }`"
					:disabled="spinning || requestInProgress || requestParentData"
					@click="getRandomItem"
			>
				Крутануть рулетку x{{ roll_count }}
			</button>
		</div>
		<div v-else class="item-box">Больше нечего крутить *(</div>
	</div>
</template>

<style lang="scss" scoped>
.loading-box {
	@apply absolute z-[10] justify-center items-center w-full h-full bg-black/50;
}

.roulette-container {
	@apply w-full flex flex-col items-center;

	.roulette-window {
		@apply relative w-full overflow-hidden;

		border: 4px solid var(--third-active-color);

		.left-triangle {
			@apply absolute left-[-2px] z-[1] text-[var(--third-active-color)] text-[1.4rem];

			top: calc(50% - 0.7rem);
		}

		.right-triangle {
			@apply absolute right-[-2px] z-[1] text-[var(--third-active-color)] text-[1.4rem];

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
</style>
