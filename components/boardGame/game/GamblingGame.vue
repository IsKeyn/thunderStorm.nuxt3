<script setup>
import GameGamblingCard from '@/components/boardGame/game/GameGamblingCard.vue';
import CurrentGameCard from '@/components/boardGame/game/CurrentGameCard.vue';
import EditorForPlayerGamesList from '@/components/boardGame/game/EditorForPlayerGamesList.vue';

import { ref, watch } from 'vue'

const emit = defineEmits(['updateBoardGameInfo', 'showPlayer']);

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
	sendApiRequest,
} = api();

import { boardGameLog } from '@/composables/BoardGame/boardGameLog.js'
const {
	setLog,
} = boardGameLog();

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
	boardGameInfo: {
		type: Object,
		default: {},
	},
	spinTime: {
		type: Number,
		default: 27000,
	},
	itemHeight: {
		type: Number,
		default: 130,
	},
	elementCount: {
		type: Number,
		default: 3,
	},
	repeaterItemsCount: {
		type: Number,
		default: 20,
	},
});

const items = ref([]);
const repeatedItems = ref([]);

const requestInProgress = ref(false);

const platforms = ref({});
const selectedPlatform = ref(null);

const setPlatforms = () => {
	items.value.forEach((item) => {
		platforms.value[item.platform.slug] = {
			id: item.platform.id,
			name: item.platform.name,
			sort: item.platform.sort,
		};
	});

	// 1. Получаем массив пар [key, value]
	const entries = Object.entries(platforms.value);

	// 2. Сортируем по полю `sort` (по возрастанию)
	const sortedEntries = entries.sort((a, b) => a[1].sort - b[1].sort);

	// 3. Собираем обратно в объект (в современных JS порядок сохранится)
	platforms.value = Object.fromEntries(sortedEntries);
}

/* Получение данных */
const { refresh } = await useAsyncData(
		async () => {
			let request = `${apiUrl.value}board-game/player-game/get-player-list`;

			const query = {
				board_game_id: props.boardGameId,
				platform_id: selectedPlatform.value,
			};

			const sessionCookie = useCookie(sessionCookieName.value);

			requestInProgress.value = true;

			try {
				await $fetch(
						request,
						{
							method: 'GET',
							credentials: 'include',
							query,
							headers: {
								Accept: 'application/json',
								Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
								Referer: publicUrl.value,
							},
							onResponse({response}) {
								if (response.status === 200) {
									items.value = response._data.data;

									// Дублируем элементы для долгого кручения
									if (Object.keys(items.value).length > 0) {
										/* Перемешиваем элементы */
										items.value = items.value.sort(() => Math.random() - 0.5);

										let repeatItemCount = Math.round(100 / Object.keys(items.value).length) * 2;

										repeatedItems.value = Array(repeatItemCount).fill([...items.value]).flat();
									}

									if (Object.keys(platforms.value).length === 0) {
										setPlatforms();
									}
								} else {
									error('Request error', 5000);
								}

								requestInProgress.value = false;
								emit('loadingToggle', false);
							}
						},
				);
			} catch (e) {
				errorHandler(e);
				requestInProgress.value = false;
				emit('loadingToggle', false);
			}
		}
);

/* Получаем случайную игру */
const getRandomGame = async () => {
	if (spinning.value || requestInProgress.value) return

	await refresh();
	requestInProgress.value = true;

	try {
		const body = {
			board_game_id: props.boardGameId,
			platform_id: selectedPlatform.value,
		}

		const response = await sendApiRequest('board-game/player-game/roll', 'POST', body);

		if (response) {
			requestInProgress.value = false;

			let randomIndex = null;

			for (let i = 0; items.value.length > 0; i++) {
				if (items.value[i].id === response.data.id) {
					randomIndex = i;
					break;
				}
			}

			if (randomIndex !== null && randomIndex !== undefined) {
				startSpin(randomIndex);
			}
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}

/* Высота рулетки */
const mainBlockHeight = computed(() => {
	return props.itemHeight * props.elementCount;
});

const translateY = ref(0)
const spinning = ref(false)

const spinSound = ref(null)

const resultId = ref(null);

const startSpin = (randomIndex) => {
	if (spinning.value) return

	resultId.value = null;
	spinning.value = true

	spinSound.value.volume = 0.2
	spinSound.value.currentTime = 0
	spinSound.value.play()

	const itemHeight = props.itemHeight;					// высота одного элемента
	const windowHeight = mainBlockHeight.value;   // высота окна рулетки
	const spinTime = props.spinTime;     					// время крутки рулетки

	const totalItems = repeatedItems.value.length

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

		// const easeOut = 1 - Math.pow(1 - progress, 3)
		// Используем более резкое easeOut
		const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

		translateY.value = startTranslateY + (targetTranslateY - startTranslateY) * easeOutExpo

		if (elapsed < spinTime) {
			requestAnimationFrame(animate)
		} else {
			spinning.value = false;
			spinSound.value.pause()
			spinSound.value.currentTime = 0

			/* Используется для выделения цветом выпавшего прдмета */
			resultId.value = items.value[randomIndex].id;

			const logBody = {
				board_game_id: props.boardGameId,
				message: `крутанул рулетку игр и ему выпала "${items.value[randomIndex].game.name}"`
			};
			setLog(logBody);
			emit('updateBoardGameInfo');
		}
	}

	requestAnimationFrame(animate);
}

const currentPlayer = computed(() => {
	let curPlayer = props.boardGameInfo.players.filter((item) => item.user_id === userStore.user.id);

	if (curPlayer && curPlayer[0]) {
		return curPlayer[0];
	}
});

const editListShow = ref(false);
const editListToggle = () => {
	editListShow.value = !editListShow.value;
}

const selectPlatform = (platformId) => {
	selectedPlatform.value = platformId;
	refresh();
}

const refreshGameList = () => {
	refresh();
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
				class="platforms-container"
				v-if="!currentPlayer.current_game || (currentPlayer.current_game && editListShow === true)"
		>
			<div
					:class="['platform', selectedPlatform === null ? 'active' : '']"
					@click="selectPlatform(null)"
			>Все платформы</div>
			<div
					v-for="(platform, key) in platforms"
					:key="key"
					:class="['platform', selectedPlatform === platform.id ? 'active' : '']"
					@click="selectPlatform(platform.id)"
			>
				{{ platform.name }}
			</div>
		</div>

		<EditorForPlayerGamesList
				v-if="editListShow === true"
				:boardGameId="boardGameId"
				:items="items"
				@editListToggle="editListToggle"
				@updateBoardGameInfo="emit('updateBoardGameInfo')"
				@refreshGameList="refreshGameList"
		/>
		<template v-else>
			<CurrentGameCard
					v-if="currentPlayer.current_game"
					:boardGameId="boardGameId"
					:currentGame="currentPlayer.current_game"
					:players="boardGameInfo.players"
					:showActionButtons="true"
					@showPlayer="$emit('showPlayer', $event)"
					@updateBoardGameInfo="emit('updateBoardGameInfo')"
					@showEditList="editListToggle"
			/>
			<template v-else>
				<div
						v-if="items.length > 0"
						class="roulette-container"
				>
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
								<GameGamblingCard
										:element="element"
										:showControlPanel="false"
										:itemHeight="itemHeight"
										:classes="element.id === resultId ? 'active' : ''"
								/>
							</div>
						</div>
					</div>

					<div class="count-info">
						Количество игр: {{ items.length }}
					</div>

					<div class="flex">
						<button
								:class="`btn mr-[1rem] ${spinning || requestInProgress ? 'btn-disable' : 'btn-simple-1' }`"
								@click="getRandomGame"
						>
							{{ currentPlayer.current_game ? 'Реролить' : 'Крутануть рулетку' }}
						</button>
						<button
								:class="`btn mr-[1rem] ${spinning || requestInProgress ? 'btn-disable' : 'btn-simple-1' }`"
								@click="editListToggle()"
						>
							Редактировать список
						</button>
					</div>
					<!--				<audio ref="spinSound" src="/sounds/roll.wav" preload="auto"></audio>-->
					<audio ref="spinSound" src="/sounds/baraban_sg.mp3" preload="auto"></audio>
				</div>
				<div v-else class="item-box">
					Игр больше нет *(
				</div>
			</template>
		</template>
	</div>
</template>

<style lang="scss" scoped>
.loading-box {
	@apply absolute z-[10] justify-center items-center w-full h-full bg-black/50;
}

.platforms-container {
	@apply flex gap-[10px] pt-[20px] pb-[20px] flex-wrap;

	.platform {
		@apply w-[8rem] h-[5rem] bg-[var(--second-bg-color)] flex items-center justify-center cursor-pointer p-[2rem];

		&.active,
		&:hover {
			@apply bg-[var(--second-active-color)];
		}
	}
}

.roulette-container {
	@apply w-full flex flex-col items-center;

	.roulette-window {
		@apply relative w-full overflow-hidden;

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
				@apply flex justify-center items-center mb-[5px];
			}
		}
	}

	.count-info {
		@apply mt-[1rem] mb-[1rem] text-[1.2rem];
	}
}
</style>
