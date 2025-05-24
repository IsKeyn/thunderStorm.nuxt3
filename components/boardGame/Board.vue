<script setup>
import Modal from '@/components/modals/Modal.vue';

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

import { notifications } from '@/composables/notifications.js';
const { alert, error } = notifications();

import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

import { boardGameLog } from '@/composables/BoardGame/boardGameLog.js'
const {
	setLog,
} = boardGameLog();

import { onMounted, ref } from 'vue'

const emit = defineEmits(['fetchLogs', 'showPlayer']);

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
	boardGameInfo: {
		type: Object,
		default: {},
	},
});

const fields = ref(
		[
			{
				rowNumber: 1,
				cols: [
					{
						name: '1',
						index: 1,
						useThisField: true,
					},
					{
						name: '2',
						index: 2,
						useThisField: true,
					},
					{
						name: '3',
						index: 3,
						useThisField: true,
					},
					{
						name: '4',
						index: 4,
						useThisField: true,
					},					{
						name: '5',
						index: 5,
						useThisField: true,
					},
					{
						name: '6',
						index: 6,
						useThisField: true,
					},
					{
						name: '7',
						index: 7,
						useThisField: true,
					},
					{
						name: '8',
						index: 8,
						useThisField: true,
					},
					{
						name: '9',
						index: 9,
						useThisField: true,
					},					{
						name: '10',
						index: 10,
						useThisField: true,
					},
					{
						name: '11',
						index: 11,
						useThisField: true,
					},
					{
						name: '12',
						index: 12,
						useThisField: true,
					},					{
						name: '13',
						index: 13,
						useThisField: true,
					},
				],
			},
			{
				rowNumber: 2,
				cols: [
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						name: '14',
						index: 14,
						useThisField: true,
					},
				],
			},
			{
				rowNumber: 3,
				cols: [
					{
						name: '27',
						index: 27,
						useThisField: true,
					},
					{
						name: '26',
						index: 26,
						useThisField: true,
					},
					{
						name: '25',
						index: 25,
						useThisField: true,
						description: 'Шаг на 28 клетку',
					},
					{
						name: '24',
						index: 24,
						useThisField: true,
					},
					{
						name: '23',
						index: 23,
						useThisField: true,
					},
					{
						name: '22',
						index: 22,
						useThisField: true,
						description: 'Возьмите из инвентаря предмет крыса',
					},
					{
						name: '21',
						index: 21,
						useThisField: true,
					},
					{
						name: '20',
						index: 20,
						useThisField: true,
						description: 'Игра в ТМNT 4 c другим стримером за 20 очков',
					},
					{
						name: '19',
						index: 19,
						useThisField: true,
					},
					{
						name: '18',
						index: 18,
						useThisField: true,
					},
					{
						name: '17',
						index: 17,
						useThisField: true,
						description: 'Возврат на 14 клетку',
					},
					{
						name: '16',
						index: 16,
						useThisField: true,
					},					{
						name: '15',
						index: 15,
						useThisField: true,
					},
				],
			},
			{
				rowNumber: 4,
				cols: [
					{
						name: '28',
						index: 28,
						useThisField: true,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
				],
			},
			{
				rowNumber: 5,
				cols: [
					{
						name: '29',
						index: 29,
						useThisField: true,
					},
					{
						name: '30',
						index: 30,
						useThisField: true,
						description: 'Игра в Track & Field с другим стримером за 15 очков',
					},
					{
						name: '31',
						index: 31,
						useThisField: true,
					},
					{
						name: '32',
						index: 32,
						useThisField: true,
					},
					{
						name: '33',
						index: 33,
						useThisField: true,
						description: 'Получи 5 очков',
					},
					{
						name: '34',
						index: 34,
						useThisField: true,
					},
					{
						useThisField: false,
					},
					{
						name: '92',
						index: 92,
						useThisField: true,
					},
					{
						name: '93',
						index: 93,
						useThisField: true,
					},
					{
						name: '94',
						index: 94,
						useThisField: true,
					},
					{
						name: '95',
						index: 95,
						useThisField: true,
					},
					{
						name: '96',
						index: 96,
						useThisField: true,
						description: 'Игра в Teenage Mutant Ninja Turtles IV - Turtles in Time c другим стримером за 20 очков',
					},
					{
						name: '97',
						index: 97,
						useThisField: true,
						description: 'Ты достиг последней клетки, чего это стоило?',
					},
				],
			},
			{
				rowNumber: 6,
				cols: [
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						name: '35',
						index: 35,
						useThisField: true,
					},
					{
						useThisField: false,
					},
					{
						name: '91',
						index: 91,
						useThisField: true,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
				],
			},
			{
				rowNumber: 7,
				cols: [
					{
						name: '41',
						index: 41,
						useThisField: true,
					},
					{
						name: '40',
						index: 40,
						useThisField: true,
						description: 'Игра в Bomberman II с другим стримером за 35 очков',
					},
					{
						name: '39',
						index: 39,
						useThisField: true,
					},
					{
						name: '38',
						index: 38,
						useThisField: true,
					},
					{
						name: '37',
						index: 37,
						useThisField: true,
					},
					{
						name: '36',
						index: 36,
						useThisField: true,
					},
					{
						useThisField: false,
					},
					{
						name: '90',
						index: 90,
						useThisField: true,
						description: 'Игра в Ike Ike! Nekketsu Hockey-bu - Subette Koronde Dairantou с другим стримером за 20 очков',
					},
					{
						name: '89',
						index: 89,
						useThisField: true,
					},
					{
						name: '88',
						index: 88,
						useThisField: true,
					},
					{
						name: '87',
						index: 87,
						useThisField: true,
					},
					{
						name: '86',
						index: 86,
						useThisField: true,
					},
					{
						name: '85',
						index: 85,
						useThisField: true,
					},
				],
			},
			{
				rowNumber: 8,
				cols: [
					{
						name: '42',
						index: 42,
						useThisField: true,
						description: 'Минус 5 очков',
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						name: '84',
						index: 84,
						useThisField: true,
					},
				],
			},
			{
				rowNumber: 9,
				cols: [
					{
						name: '43',
						index: 43,
						useThisField: true,
					},
					{
						name: '44',
						index: 44,
						useThisField: true,
					},
					{
						name: '45',
						index: 45,
						useThisField: true,
					},
					{
						name: '46',
						index: 46,
						useThisField: true,
					},
					{
						name: '47',
						index: 47,
						useThisField: true,
					},
					{
						name: '48',
						index: 48,
						useThisField: true,
					},
					{
						useThisField: false,
					},
					{
						name: '78',
						index: 78,
						useThisField: true,
					},
					{
						name: '79',
						index: 79,
						useThisField: true,
					},
					{
						name: '80',
						index: 80,
						useThisField: true,
					},
					{
						name: '81',
						index: 81,
						useThisField: true,
						description: 'Шагай на 79 клетку',
					},
					{
						name: '82',
						index: 82,
						useThisField: true,
					},
					{
						name: '83',
						index: 83,
						useThisField: true,
					},
				],
			},
			{
				rowNumber: 10,
				cols: [
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						name: '49',
						index: 49,
						useThisField: true,
					},
					{
						useThisField: false,
					},
					{
						name: '77',
						index: 77,
						useThisField: true,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
				],
			},
			{
				rowNumber: 11,
				cols: [
					{
						name: '55',
						index: 55,
						useThisField: true,
					},
					{
						name: '54',
						index: 54,
						useThisField: true,
						description: 'Получи предмет "Сохрани жопу"',
					},
					{
						name: '53',
						index: 53,
						useThisField: true,
					},
					{
						name: '52',
						index: 52,
						useThisField: true,
					},
					{
						name: '51',
						index: 51,
						useThisField: true,
					},
					{
						name: '50',
						index: 50,
						useThisField: true,
						description: 'Игра в Circus Charlie с другим стримером за 30 очков',
					},
					{
						useThisField: false,
					},
					{
						name: '76',
						index: 76,
						useThisField: true,
					},
					{
						name: '75',
						index: 75,
						useThisField: true,
						description: 'Игра в Eliminator Boat Duel с другим стримером 15 очков',
					},
					{
						name: '74',
						index: 74,
						useThisField: true,
					},
					{
						name: '73',
						index: 73,
						useThisField: true,
					},
					{
						name: '72',
						index: 72,
						useThisField: true,
					},
					{
						name: '71',
						index: 71,
						useThisField: true,
					},
				],
			},
			{
				rowNumber: 12,
				cols: [
					{
						name: '56',
						index: 56,
						useThisField: true,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						useThisField: false,
					},
					{
						name: '70',
						index: 70,
						useThisField: true,
						description: 'Получи 10 очков',
					},
				],
			},
			{
				rowNumber: 13,
				cols: [
					{
						name: '57',
						index: 57,
						useThisField: true,
					},
					{
						name: '58',
						index: 58,
						useThisField: true,
					},
					{
						name: '59',
						index: 59,
						useThisField: true,
					},
					{
						name: '60',
						index: 60,
						useThisField: true,
						description: 'Игра в UMK 3 c другим стримером за 45 очков',
					},
					{
						name: '61',
						index: 61,
						useThisField: true,
					},
					{
						name: '62',
						index: 62,
						useThisField: true,
						description: 'Шагай на 65 клетку',
					},
					{
						name: '63',
						index: 63,
						useThisField: true,
					},
					{
						name: '64',
						index: 64,
						useThisField: true,
					},
					{
						name: '65',
						index: 65,
						useThisField: true,
					},
					{
						name: '66',
						index: 66,
						useThisField: true,
					},
					{
						name: '67',
						index: 67,
						useThisField: true,
					},
					{
						name: '68',
						index: 68,
						useThisField: true,
					},
					{
						name: '69',
						index: 69,
						useThisField: true,
					},
				],
			},
		],
);

const firstFieldIndex = ref(1);
const lastFieldIndex = ref(97);

/* Функционал перетаскивания */
const tokenPosition = ref(1) // индекс ячейки, где находится фишка
const droppingIndex = ref(null)

function onDragStart(e) {
	e.dataTransfer.setData('text/plain', 'token')
}

function onDragEnd() {
	// нужно для восстановления отображения
}

function onDrop(index) {
	droppingIndex.value = index

	if (tokenPosition.value !== index) {
		tokenPosition.value = index
		addPlayerPosition(index);
	}

	// Убираем класс анимации после завершения
	setTimeout(() => {
		droppingIndex.value = null
	}, 300)
}

const fetchedData = ref([]);
const requestInProgress = ref(false);

const otherPlayers = ref({});

const { refresh } = await useAsyncData(
		async () => {
			let request = `${apiUrl.value}board-game/getBoardInfo`;

			const query = {
				board_game_id: props.boardGameId,
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
									fetchedData.value = response._data;

									tokenPosition.value = 1;
									otherPlayers.value = [];

									if (fetchedData.value && fetchedData.value?.player?.position) {
										tokenPosition.value = fetchedData.value.player.position;
									}

									for (const key in fetchedData.value.otherPlayers) {
										let position = 1;

										if (fetchedData.value.otherPlayers[key].position) {
											position = fetchedData.value.otherPlayers[key].position;
										}

										if (!otherPlayers.value[position]) {
											otherPlayers.value[position] = [];
										}

										otherPlayers.value[position].push(fetchedData.value.otherPlayers[key]);
									}
								} else {
									error('Log request error', 5000);
								}

								requestInProgress.value = false;
							}
						},
				);
			} catch (e) {
				errorHandler(e);
				requestInProgress.value = false;
			}
		}
);

const alreadyInGame = computed(() => {
	const player = props.boardGameInfo.players.filter((item) => {
		if (item.user.id === userStore.user.id) {
			return true;
		} else {
			return false;
		}
	});

	return player.length > 0;
});

const addPlayerPosition = async (position) => {
	const body = {};

	requestInProgress.value = true;

	try {
		body.board_game_id = props.boardGameId;
		body.position = position;

		const response = await sendApiRequest('board-game/position/add', 'POST', body);

		if (response) {
			requestInProgress.value = false;

			emit('fetchLogs');

			const logBody = {
				board_game_id: props.boardGameId,
				message: `перешел на ячейку №"${position}"`
			};
			setLog(logBody);

			emit('updateBoardGameInfo');
		}
	} catch (e) {
		error(e);
		requestInProgress.value = false;
	}
}

const getTdClasses = (col) => {
	const returnData = [];

	if (col.useThisField) {
		returnData.push('playable-field');

		droppingIndex.value === col.index ? returnData.push('dropping') : '';

		if (firstFieldIndex.value === col.index || lastFieldIndex.value === col.index ) {
			returnData.push('color4');
		} else if (col.index % 2 === 0) {
			returnData.push('color2');
		} else {
			returnData.push('color3');
		}

		return returnData;
	}
};

const modalContent = ref('');

const showCellDescription = (description) => {
	modalContent.value = description;
	openCloseBoxFunc();
}

const boxOpen = ref(false);
const openCloseBoxFunc = () => {
	boxOpen.value = !boxOpen.value;
};


onMounted(() => {
	// getThemeConst();
});

const currentTheme = ref('theme-4');

const getThemeConst = () => {
	if (process.client) {
		const boardTheme = localStorage.getItem('board-theme');

		if (boardTheme) {
			currentTheme.value = boardTheme;
		}
	}
}

const setTheme = (theme) => {
	localStorage.setItem('board-theme', theme);
	currentTheme.value = theme;
}

/*
* Наблюдает за данными о пользователе, когда пользователь авторизуется
* обновляем данные доски, чтобы корректно выставить его позицию
*/
watch(() => userStore.user, () => {
	if (userStore.user && Object.keys(userStore.user).length > 0) {
		refresh();
	}
});
</script>

<template>
	<div>
		<span class="user-interface-title">Игровая доска</span>
<!--		<div class="choice-theme-box">-->
<!--			<span>Цветовая схема</span>-->
<!--			<div class="theme-control">-->
<!--				<div @click="setTheme('theme-1')" :class="['choice-theme theme-1', currentTheme === 'theme-1' ? 'active' : '']" />-->
<!--				<div @click="setTheme('theme-2')" :class="['choice-theme theme-2', currentTheme === 'theme-2' ? 'active' : '']" />-->
<!--				<div @click="setTheme('theme-3')" :class="['choice-theme theme-3', currentTheme === 'theme-3' ? 'active' : '']" />-->
<!--				<div @click="setTheme('theme-4')" :class="['choice-theme theme-4', currentTheme === 'theme-4' ? 'active' : '']" />-->
<!--			</div>-->
<!--		</div>-->
		<table :class="[currentTheme]">
			<tr
					v-for="(row, rowNumber) in fields"
					:key="rowNumber"
			>
				<td
						v-for="(col, colNumber) in row.cols"
						:key="col.index"
						:data-index="col.index"
						:class="getTdClasses(col)"
						@dragover.prevent
						@drop="col.useThisField ? onDrop(col.index) : false"
				>
					<template v-if="col.useThisField">
						<img
								v-if="alreadyInGame && tokenPosition === col.index"
								class="player-token"
								draggable="true"
								@dragstart="onDragStart"
								@dragend="onDragEnd"
								:src="userStore.user.avatar ? getResizeImg(userStore.user.avatar) : '/images/system/no-avatar.png'"
								@click="emit('showPlayer', userStore.user.id)"
						>
						<span class="field-number">{{ col.name }}</span>
						<font-awesome-icon
								v-if="col.description"
								:icon="['fas', 'circle-info']"
								class="info-button"
								@click="showCellDescription(col.description)"
						/>
						<div
								v-if="otherPlayers[col.index]"
								class="other-players"
						>
							<img
									v-for="(player, key) in otherPlayers[col.index].slice(0, 3)"
									class="other-player-token"
									:key="key"
									:src="player.info.avatar ? getResizeImg(player.info.avatar) : '/images/system/no-avatar.png'"
									:alt="player.info.name"
									:title="player.info.name"
									@click="emit('showPlayer', player.info.id)"
							>
							<font-awesome-icon
									v-if="otherPlayers[col.index].length > 3"
									:icon="['fas', 'ellipsis']"
									class="more-players"
							/>
						</div>
					</template>
				</td>
			</tr>
		</table>
	</div>

	<Modal
			:showOpenModal="boxOpen"
			size="small"
			@toggleModal="openCloseBoxFunc"
	>
		<div class="modal-parent">
			<h3 class="modal-title">Информация о ячейке</h3>
			<div class="link-parent-box">
				{{ modalContent }}
			</div>
		</div>
	</Modal>
</template>

<style lang="scss" scoped>
.choice-theme-box {
	@apply flex items-center mb-[1rem];

	span {
		@apply mr-[1rem];
	}

	.choice-theme {
		@apply w-[2rem] h-[2rem] mr-[1rem] cursor-pointer;

		&.theme-1 {
			@apply bg-[var(--color4-or)];
		}

		&.theme-2 {
			@apply bg-[var(--color1)];
		}

		&.theme-3 {
			@apply bg-[var(--color1-t2)];
		}

		&.theme-4 {
			@apply bg-[var(--color1-t3)];
		}

		&.active {
			border: 3px solid var(--second-active-color);
		}
	}
}

.theme-control {
	@apply flex;
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
			border: 1px solid var(--color1-or);
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
			border: 1px solid var(--color1);
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
			border: 1px solid var(--color1-t2);
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
			border: 1px solid var(--color1-t3);
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

	span.field-number {
		@apply
			absolute top-[0.2rem] left-[0.2rem]
		;
	}

	&.playable-field {
		@apply relative;
	}

	&.dropping {
		.player-token {
			animation: dropEffect 0.3s ease;
		}
	}

	.player-token {
		@apply
			object-cover
			w-[68px] h-[68px]
			rounded-full
			absolute top-[15px] left-[15px] z-[100]
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
	}

	.other-players {
		@apply flex absolute bottom-[5px] left-[5px];

		.other-player-token {
			@apply cursor-pointer;
		}

		img,
		.more-players {
			@apply object-cover rounded-full;

			&:nth-child(2),
			&:nth-child(3),
			&:nth-child(4) {
				@apply ml-[-15px];
			}
		}

		img {
			@apply w-[40px] h-[40px];
		}

		.more-players {
			@apply w-[21px] h-[21px];
		}
	}
}

@keyframes dropEffect {
	0% {
		transform: scale(1.3);
	}
	100% {
		transform: scale(1);
	}
}
</style>
