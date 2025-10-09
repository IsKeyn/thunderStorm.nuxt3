<script setup>
import Modal from '@/components/modals/Modal.vue';

import { computed, ref } from "vue";

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { media } from '@/composables/media.js'
const { getResizeImg } = media();

import { api } from '@/composables/api.js';
const { sendApiRequest } = api();

const props = defineProps({});

const route = useRoute();
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

/* НАЧАЛО Элементы таблицы */
const firstFieldIndex = computed(() => {
	return 1;
});
const lastFieldIndex = computed(() => {
	let maxIndex = 1;

	if (fetchedData.value && fetchedData.value?.board?.columns) {
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
/* КОНЕЦ Элементы таблицы */

/* НАЧАЛО  */
const currentPlayer = computed(() => {
	return fetchedData.value.players.filter((item) => item.user_id === userStore.user.id)[0];
});

const otherPlayers = computed(() => {
	return fetchedData.value.players.filter((item) => item.user_id !== userStore.user.id);
});

/* НАЧАЛО Функционал ручного переноса ячейки */
const tokenPosition = ref(1) // индекс ячейки, где находится фишка
const droppingIndex = ref(null)
/* КОНЕЦ: Функционал ручного переноса ячейки */

/* НАЧАЛО Получение класса ячейки */
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
/* КОНЕЦ Получение класса ячейки */

const getPlayerOnCol = (col) => {
	return otherPlayers.value.filter((player) => player.position === col);
}

const playersOnCols = ref([]);

watch(() => fetchedData.value, () => {
	if (fetchedData.value && fetchedData.value.players) {
		fetchedData.value.players.forEach((item) => {
			if (item.position) {
				playersOnCols.value[item.position] = item;
			}
		});
	}
}, { deep: true, immediate: true });

// Обновлять данные каждые 5 минут
// Ячейки из другой таблицы
// Кубики
// Анимация хождения, бекграунд на яейку с эффектом
// При клике на ячейке показывать попап с информацией об ячейке, игроках на ячейке и активных эффектах
</script>

<template>
	<div v-if="fetchedData">
		<span class="user-interface-title">Игровая доска</span>
		<table class="theme-4">
			<tr
					v-for="(row, rowNumber) in JSON.parse(fetchedData.board.columns)"
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
								v-if="currentPlayer && currentPlayer.position === col.index"
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
								v-if="playersOnCols[col.index]"
								class="other-players"
						>
							<!--Показывать всех игроков при нажатии, записывать куда ни будь -->
<!--							<img-->
<!--									v-for="(player, key) in playersOnCols[col.index]"-->
<!--									class="other-player-token"-->
<!--									:key="key"-->
<!--									:src="player.user.avatar ? getResizeImg(player.user.avatar) : '/images/system/no-avatar.png'"-->
<!--									:alt="player.user.name"-->
<!--									:title="player.user.name"-->
<!--									@click="emit('showPlayer', player.info.id)"-->
<!--							>-->
<!--							<font-awesome-icon-->
<!--									v-if="playersOnCols[col.index].length > 3"-->
<!--									:icon="['fas', 'ellipsis']"-->
<!--									class="more-players"-->
<!--							/>-->
						</div>
					</template>
				</td>
			</tr>
		</table>
	</div>
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
