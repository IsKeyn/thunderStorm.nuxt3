<script setup>
import Modal from '@/components/modals/Modal.vue';
import Dices from '@/modules/boardGame/components/board/Dices.vue';
import BoardCellInfo from '@/modules/boardGame/components/board/BoardCellInfo.vue';
import CellEffectCard from '@/modules/boardGame/components/board/CellEffectCard.vue';
import PlayerInteractionCard from '@/modules/boardGame/components/player-interactions/PlayerInteractionCard.vue';

import { computed, onMounted, ref } from "vue";

const { subscribe, unsubscribe } = useWebSocket();
const runtimeConfig = useRuntimeConfig();

import { helper } from '@/composables/helper.js'
const { route, hasWebSocked } = helper();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { refreshLayoutData } = boardGame();

import { media } from '@/composables/media.js'
const { getResizeImg } = media();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

import { animate } from '@/composables/animate.js';
const { scrollToElement } = animate();

import { userFunctions } from '@/composables/userFunctions.js';
const { isAuth, userStore } = userFunctions();

const props = defineProps({});

const requestName = 'getBoardGameBoard';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const response = await Promise.resolve(
					sendApiRequest(`board-game/v2/board/get/${route.params.slug}/`, 'GET', {}, requestName, '')
			);

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value || null);

/* Элементы таблицы */
const firstFieldIndex = computed(() => {
	return 1;
});

const lastFieldIndex = computed(() => {
	let maxIndex = 1;

	if (fetchedData.value?.board?.columns) {
		JSON.parse(fetchedData.value.board.columns).forEach((item) => {
			item.cols.forEach((col) => {
				if (col.index && col.index > maxIndex) {
					maxIndex = col.index;
				}
			});
		});
	}

	return maxIndex;
});

/* Игроки */
const currentPlayer = computed(() => {
	return fetchedData.value.players.filter((item) => item.user_id === userStore.user.id)[0];
});

const playersOnCols = computed(() => {
	let result = [];

	if (fetchedData.value?.players) {
		fetchedData.value.players.forEach((item) => {
			if (item.id !== playerForMove.value) {
				if (result[item.position]) {
					result[item.position].push(item);
				} else {
					result[item.position] = [item];
				}
			}
		});
	}

	return result;
});

const movePlayerConst = ref(null);

const showEffectsBox = ref(true);

const moveCurrentPlayer = (positionData) => {
	changePosition(positionData, currentPlayer.value);
}

const changePosition = (
		positionData,
		player,
		oldPositionNumber = null,
		toggleShowEffectsBox = true,
		scrollToMovedPlayer = true
) => {
	if (positionData) {
		if (toggleShowEffectsBox) {
			showEffectsBox.value = false;
		}

		const oldPosition = oldPositionNumber ? oldPositionNumber : player.position;
		const newPosition = positionData.firstPosition.position;
		let steps = newPosition - oldPosition;
		let direction = null;

		if (steps > 0) {
			direction = 'forward';
		} else if (steps < 0)  {
			direction = 'back';
		}

		if (direction) {
			movePlayerConst.value = fetchedData.value.players.filter((item) => item.id === player.id)[0];

			if (movePlayerConst.value) {
				setTimeout(() => {
					if (scrollToMovedPlayer) {
						scrollToElement('movedPlayer_' + player.id);
					}

					for (let i = 0; i < Math.abs(steps); i++) {
						if (direction === 'forward') {
							setTimeout(() => {
								movePlayerConst.value.position++;

								if (Math.abs(steps) - 1 === i) {
									if (positionData.firstPosition.position !== positionData.finalPosition.position) {
										changePosition(
												{ firstPosition: positionData.finalPosition, finalPosition: positionData.finalPosition},
												player,
												positionData.firstPosition.position,
												toggleShowEffectsBox,
												scrollToMovedPlayer,
										);
									} else {
										if (toggleShowEffectsBox) {
											showEffectsBox.value = true;
										}

										if (!hasWebSocked()) refreshLayoutData();
										playerForMove.value = null;
										moveQueue.value.shift();
										refresh();
									}
								}
							}, 500 + i * 500);
						}

						if (direction === 'back') {
							setTimeout(() => {
								movePlayerConst.value.position--;

								if (Math.abs(steps) - 1 === i) {
									if (positionData.firstPosition.position !== positionData.finalPosition.position) {
										changePosition(
												{ firstPosition: positionData.finalPosition, finalPosition: positionData.finalPosition},
												player,
												positionData.firstPosition.position,
												toggleShowEffectsBox,
												scrollToMovedPlayer,
										);
									} else {
										if (toggleShowEffectsBox) {
											showEffectsBox.value = true;
										}

										if (!hasWebSocked()) refreshLayoutData();
										playerForMove.value = null;
										moveQueue.value.shift();
										refresh();
									}
								}
							}, 500 + i * 500);
						}
					}
				}, 1500);
			}
		}
	}
}

/* Получение класса ячейки */
const getTdClasses = (col) => {
	const returnData = [];

	if (col.useThisField) {
		returnData.push('playable-field');

		if (firstFieldIndex.value === col.index || lastFieldIndex.value === col.index) {
			returnData.push('color4');
		} else if (col.index % 2 === 0) {
			returnData.push('color2');
		} else {
			returnData.push('color3');
		}

		return returnData;
	}
};

/* Ячейки, эффекты и информация об ячейки */
const getEffectsByPosition = (position) => {
	return fetchedData.value.effects.filter((item) => item.position === position);
}

const selectedPositionNumber = ref(null);

const showCellInfo = (position) => {
	selectedPositionNumber.value = position;
	openCloseBoxFunc();
}

const boxOpen = ref(false);
const openCloseBoxFunc = () => {
	boxOpen.value = !boxOpen.value;
};

const cellBackgroundImage = (position) => {
	const effects = fetchedData.value.effects.filter((item) => item.position === position);

	if (effects.length > 0 && effects[0] && effects[0].boardPositionEffect) {
		return getResizeImg(effects[0].boardPositionEffect?.title_image);
	}
}

const hasUsed = (position) => {
	if (isAuth && fetchedData?.value?.current_player?.position_has_use_effect) {
		const filteredPositions = fetchedData.value.current_player.position_has_use_effect.filter((item) => item.position === position);

		if (filteredPositions && filteredPositions[0]) {
			return true;
		}
	} else {
		return false;
	}
}

/* Передвижение НЕ текущего игрока по игровому полю */
const moveQueue = ref([]);
const playerForMove = ref(null);

const movedPlayer = computed(() => {
	if (playerForMove.value) {
		return fetchedData.value.players.filter((item) => item.id === playerForMove.value)[0];
	}
});

/*
* Формат data
* {
		playerId: 45,
		positionData: {
			finalPosition: {
				position: 45,
			},
			firstPosition: {
				position: 45,
			}
		},
	}
*/
const movePlayer = (data) => {
	moveQueue.value.push(data);
}

/* Наблюдаем за очередью движений, если элеметов  */
const queueInterval = ref(null);

watch(() => moveQueue.value, () => {
	if (queueInterval.value && moveQueue.value.length === 0) {
		clearInterval(queueInterval.value);
	} else if (moveQueue.value.length) {
		queueInterval.value = setInterval(() => {
			if (!playerForMove.value && moveQueue.value[0]) {
				playerForMove.value = moveQueue.value[0].playerId;

				if (moveQueue.value[0]?.positionData) {
					changePosition(moveQueue.value[0].positionData, movedPlayer.value);
				}
			}
		}, 500);
	}
}, { deep: true, immediate: true });

onMounted(() => {
	/* Если подключен WebSocked */
	if (runtimeConfig.public.hasWebSockedServer) {
		const { unsubscribe: stop, subscriptionId } = subscribe(
				'MovePlayer',
				'MovePlayer',
				(data) => {
					if (data.playerId === userStore.player.id) {
						return;
					}
					movePlayer(data);
				},
				'public'
		);

		if (isAuth.value && userStore?.user?.id) {
			subscribe(
					`App.Models.User.${userStore.user.id}`,
					'BoardGame.PlayerInteractions',
					(data) => {
						if (data.status === 'update') {
							refresh();
						}
					}
			);
		}
	}
});
</script>

<template>
	<div v-if="fetchedData">
		<div
				v-if="isAuth && currentPlayer"
				class="dice-and-info-block"
		>
			<Dices
					:size="80"
					position="vertical"
					:dices="['d6']"
					:rollCount="currentPlayer.step_count"
					@changePosition="movePlayer"
			/>
			<div class="item-box player-position-info">
				<span class="block">Текущая позиция на поле: {{ currentPlayer.position }}</span>
				<span class="block">Доступное количество бросков кубика: {{ currentPlayer.step_count }}</span>
				<PlayerInteractionCard
						v-if="fetchedData?.current_player?.board_interaction && fetchedData.current_player.board_interaction.length"
						v-for="(element, key) in fetchedData.current_player.board_interaction"
						:key="key"
						class="mt-4"
						:user_id="userStore.user.id"
						:element="element"
						@update="refresh"
				/>
				<CellEffectCard
						v-else-if="showEffectsBox"
						class="mt-4"
						name="head"
						:hasUsed="hasUsed(currentPlayer.position)"
						:showControlPanel="true"
						:element="getEffectsByPosition(currentPlayer.position)[0]"
						:useLightBox="true"
				/>
			</div>
		</div>
		<div class="board-wrapper">
			<table class="theme-4">
			<tr
					v-for="(row, rowNumber) in JSON.parse(fetchedData.board.columns)"
					:key="rowNumber"
			>
				<td
						v-for="(col, colNumber) in row.cols"
						:key="col.index"
						:data-index="col.index"
						:class="[getTdClasses(col)]"
				>
					<template v-if="col.useThisField">
						<div
								v-if="cellBackgroundImage(col.index)"
								class="cell-image"
								:style="[
								`
									background-image: url('${cellBackgroundImage(col.index)}');
									background-size: cover;
									background-position: center;
									background-repeat: no-repeat;
								`,
								hasUsed(col.index) ? 'filter: grayscale(100%)' : '',
						]"
						/>
						<div v-if="isAuth && currentPlayer && currentPlayer.position > col.index" class="veil" />
						<nuxt-link
								v-if="isAuth && currentPlayer"
								target="_blank"
								:to="`/e/${route.params.slug}/player/${currentPlayer.user.name}`"
								:title="currentPlayer.user.name"
						>
							<img
									v-if="currentPlayer && currentPlayer.position === col.index"
									:id="`movedPlayer_${currentPlayer.id}`"
									class="player-token"
									:src="userStore.user.avatar ? getResizeImg(userStore.user.avatar) : '/images/system/no-avatar.png'"
									:title="currentPlayer.user.name"
							>
						</nuxt-link>

						<nuxt-link
								v-if="movedPlayer"
								target="_blank"
								:to="`/e/${route.params.slug}/player/${movedPlayer.user.name}`"
								:title="movedPlayer.user.name"
						>
							<img
									v-if="movedPlayer && movedPlayer.position === col.index"
									:id="`movedPlayer_${movedPlayer.id}`"
									class="player-token"
									:src="movedPlayer.user.avatar ? getResizeImg(movedPlayer.user.avatar) : '/images/system/no-avatar.png'"
									:title="movedPlayer.user.name"
							>
						</nuxt-link>

						<span class="field-number">{{ col.name }}</span>
						<font-awesome-icon
								v-if="getEffectsByPosition(col.index).length > 0"
								:icon="['fas', 'circle-info']"
								class="info-button"
								@click="showCellInfo(col.index)"
						/>
						<div
								v-if="playersOnCols[col.index]"
								class="other-players"
						>
							<nuxt-link
									v-for="(player, key) in playersOnCols[col.index].filter((item) => item.user.id !== userStore.user.id).slice(0, 2)"
									:key="key"
									target="_blank"
									:to="`/e/${route.params.slug}/player/${player.user.name}`"
									:title="player.user.name"
							>
								<img
										class="other-player-token"
										:src="player.user.avatar ? getResizeImg(player.user.avatar) : '/images/system/no-avatar.png'"
										:alt="player.user.name"
										:title="player.user.name"
								>
							</nuxt-link>
							<font-awesome-icon
									v-if="playersOnCols[col.index].length > 2"
									:icon="['fas', 'ellipsis']"
									class="more-players"
									@click="showCellInfo(col.index)"
							/>
						</div>
					</template>
				</td>
			</tr>
		</table>
		</div>
	</div>
	<ui-BigPreloader
			v-else-if="requestInProgress"
			class="h-full"
			theme="image"
			:themeType="9"
	/>
	<ui-itemBox
			v-else
			message="Ошибка получения игрового поля"
			classes="red"
	/>

	<Modal
			:showOpenModal="boxOpen"
			size="small"
			@toggleModal="openCloseBoxFunc"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Информация о ячейке №{{ selectedPositionNumber }}</h3>
			<div class="link-parent-box">
				<BoardCellInfo
						:position="selectedPositionNumber"
						:playersOnCols="playersOnCols"
						:effects="getEffectsByPosition(selectedPositionNumber)"
				/>
			</div>
		</div>
	</Modal>
</template>

<style lang="scss" scoped>
.dice-and-info-block {
	@apply flex mb-[2rem];

	.player-position-info {
		@apply block ml-4 w-full rounded-none mb-0 p-4;
	}
}

.board {
	@apply block lg:grid grid-cols-12;

	.left-block {
		@apply lg:col-span-2 2xl:col-span-2;
	}

	.board-block {
		@apply lg:col-span-11 2xl:col-span-11;
	}
}

.theme-1 {
	td {
		&.color4 {
			@apply bg-[var(--color4-or)];

			&:hover {
				@apply bg-[var(--color4-hov-or)];
			}
		}

		&.color2 {
			@apply bg-[var(--color1-or)];

			&:hover {
				@apply bg-[var(--color1-hov-or)];
			}
		}

		&.color3 {
			@apply bg-[var(--color2-or)];

			&:hover {
				@apply bg-[var(--color2-hov-or)];
			}
		}

		&.playable-field {
			//border: 1px solid var(--color1-or);
		}

		.player-token {
			@apply bg-[var(--color5-or)];

			border: 2px solid var(--color5-or);
		}

		img,
		.more-players {
			@apply bg-[var(--color5-or)];

			border: 2px solid var(--color5-or);
		}
	}
}

.theme-2 {
	td {
		&.color4 {
			@apply bg-[var(--color4)];

			&:hover {
				@apply bg-[var(--color4-hov)];
			}
		}

		&.color2 {
			@apply bg-[var(--color1)];

			&:hover {
				@apply bg-[var(--color1-hov)];
			}
		}

		&.color3 {
			@apply bg-[var(--color2)];

			&:hover {
				@apply bg-[var(--color2-hov)];
			}
		}

		&.playable-field {
			//border: 1px solid var(--color1);
		}

		.player-token {
			@apply bg-[var(--color5)];

			border: 2px solid var(--color5);
		}

		img,
		.more-players {
			@apply bg-[var(--color5)];

			border: 2px solid var(--color5);
		}
	}
}

.theme-3 {
	td {
		&.color4 {
			@apply bg-[var(--color4-t2)];

			&:hover {
				@apply bg-[var(--color4-hov-t2)];
			}
		}

		&.color2 {
			@apply bg-[var(--color1-t2)];

			&:hover {
				@apply bg-[var(--color1-hov-t2)];
			}
		}

		&.color3 {
			@apply bg-[var(--color2-t2)];

			&:hover {
				@apply bg-[var(--color2-hov-t2)];
			}
		}

		&.playable-field {
			//border: 1px solid var(--color1-t2);
		}

		.player-token {
			@apply bg-[var(--color5-t2)];

			border: 2px solid var(--color5-t2);
		}

		img,
		.more-players {
			@apply bg-[var(--color5-t2)];

			border: 2px solid var(--color5-t2);
		}
	}
}

.theme-4 {
	td {
		&.color4 {
			@apply bg-[var(--color4-t3)];

			&:hover {
				@apply bg-[var(--color4-hov-t3)];
			}
		}

		&.color2 {
			@apply bg-[var(--color1-t3)];

			&:hover {
				@apply bg-[var(--color1-hov-t3)];
			}
		}

		&.color3 {
			@apply bg-[var(--color2-t3)];

			&:hover {
				@apply bg-[var(--color2-hov-t3)];
			}
		}

		&.playable-field {
			//border: 1px solid var(--color1-t3);
		}

		.player-token {
			@apply bg-[var(--color5-t3)];

			border: 2px solid var(--color5-t3);
		}

		img,
		.more-players {
			@apply bg-[var(--color5-t3)];

			border: 2px solid var(--color5-t3);
		}
	}
}

td {
	@apply
	w-[100px] h-[100px]
	p-1
	relative
	;

	.cell-image {
		@apply absolute top-0 left-0 w-full h-full;
	}

	.veil {
		@apply absolute top-0 left-0 w-full h-full bg-black/40;
	}

	span.field-number {
		@apply
			absolute top-[0.2rem] left-[0.2rem]
		;

		text-shadow:
				-1px -1px 0 #000,
				1px -1px 0 #000,
				-1px 1px 0 #000,
				1px 1px 0 #000;
	}

	&.playable-field {
		@apply relative;
	}

	.player-token {
		@apply
		object-cover
		w-[68px] h-[68px]
		rounded-full
		absolute top-[15px] left-[15px] z-[8]
		cursor-grab
		;

		transition: top 0.3s ease, left 0.3s ease, transform 0.2s ease;
	}

	.info-button {
		@apply
			absolute top-[5px] right-[5px]
			text-[1.4rem]
			cursor-pointer
		;

		text-shadow:
				-1px -1px 0 #000,
				1px -1px 0 #000,
				-1px 1px 0 #000,
				1px 1px 0 #000;
	}

	.other-players {
		@apply flex absolute bottom-[5px] left-[5px];

		.other-player-token {
			@apply cursor-pointer;
		}

		a {
			&:nth-child(2),
			&:nth-child(3),
			&:nth-child(4) {
				@apply ml-[-15px];
			}
		}

		img,
		.more-players {
			@apply object-cover rounded-full;
		}

		img {
			@apply w-[40px] h-[40px];
		}

		.more-players {
			@apply w-[36px] h-[36px] cursor-pointer ml-[-15px];
		}
	}
}

// Мобильная версия
.board-wrapper {
	@apply lg:flex lg:items-center lg:justify-center;

	width: 100%;
	overflow-x: auto;

	// Чтобы не ломалось на iOS
	-webkit-overflow-scrolling: touch;
}

table {
	min-width: max-content; // Таблица не сжимается слишком сильно
}

@media (max-width: 1800px) {
	td {
		width: 80px !important;
		height: 80px !important;
		padding: 2px !important;
	}

	.player-token {
		width: 60px !important;
		height: 60px !important;
		top: 8px !important;
		left: 8px !important;
	}

	.other-player-token {
		width: 28px !important;
		height: 28px !important;
	}
}

@media (max-width: 1400px) {
	td {
		width: 60px !important;
		height: 60px !important;
		padding: 2px !important;
	}

	.player-token {
		width: 40px !important;
		height: 40px !important;
		top: 8px !important;
		left: 8px !important;
	}

	.other-player-token {
		width: 28px !important;
		height: 28px !important;
	}
}
</style>
