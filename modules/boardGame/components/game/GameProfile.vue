<script setup>
import GamblingGame from '@/components/games/GamblingGame.vue'
import CurrentGameCard from '@/modules/boardGame/components/game/CurrentGameCard.vue';
import EditorForPlayerGamesList from '@/components/boardGame/game/EditorForPlayerGamesList.vue';

import { ref } from "vue";
const route = useRoute();

import { api } from '@/composables/api.js';
const { sendApiRequest, preparedRequestBody } = api();

/* Получение данных */
const requestName = 'getBoardGameGamblingGameGameList';

const selectedPlatform = ref(null);
const hiddenRefresh = ref(false);

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const query = {
				platform_id: selectedPlatform.value,
			};

			const response = await Promise.resolve(
					sendApiRequest(`board-game/v2/player-game/get-player-list/${route.params.slug}/`, 'GET', query, requestName, '')
			);

			hiddenRefresh.value = false;
			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value || null);

const refreshGameList = () => {
	refresh();
}

/* Рулетка */
const requestObj = ref({
	url: `board-game/v2/player/rollItem/${route.params.slug}/`,
	method: 'POST',
	requestName: 'boardGameRollItem',
});

/* Платформы */
const allPlatforms = ref({});

const platforms =  computed(() => {
	const platformsData = {};

	fetchedData.value.games.forEach((item) => {
		platformsData[item.platform.slug] = {
			id: item.platform.id,
			name: item.platform.short_name ? item.platform.short_name : item.platform.name,
			sort: item.platform.sort,
		};
	});

	// 1. Получаем массив пар [key, value]
	const entries = Object.entries(platformsData);

	// 2. Сортируем по полю `sort` (по возрастанию)
	const sortedEntries = entries.sort((a, b) => a[1].sort - b[1].sort);

	// 3. Собираем обратно в объект (в современных JS порядок сохранится)
	if (Object.keys(allPlatforms.value).length === 0) {
		allPlatforms.value = Object.fromEntries(sortedEntries);
	}

	return allPlatforms.value;
});

const selectPlatform = (platformId) => {
	selectedPlatform.value = platformId;
	refresh();
}

/* Редактирование списка */
const editListShow = ref(false);
const editListToggle = () => {
	editListShow.value = !editListShow.value;
}
</script>

<template>
	<ui-BigPreloader
			v-if="requestInProgress && !hiddenRefresh"
	/>
	<div
			class="item-box"
			v-else-if="fetchedData && fetchedData.status === 'error'
			&& fetchedData.status_message"
	>
		{{ fetchedData.status_message }}
	</div>
	<div
			v-else-if="fetchedData && fetchedData.games && fetchedData.games.length > 0"
			class="relative"
	>
		<div
				class="platforms-container"
				v-if="!fetchedData.player.current_game || (fetchedData.player.current_game && editListShow === true)"
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
				:items="fetchedData.games"
				@editListToggle="editListToggle"
				@updateBoardGameInfo="emit('updateBoardGameInfo')"
				@refreshGameList="refreshGameList"
		/>
		<template v-else>
			<CurrentGameCard
					v-if="fetchedData.player.current_game"
					:currentGame="fetchedData.player.current_game"
					:showActionButtons="true"
					:showOtherPlayersActions="true"
					:showTitle="false"
					@showPlayer="$emit('showPlayer', $event)"
					@updateBoardGameInfo="emit('updateBoardGameInfo')"
					@showEditList="editListToggle"
			/>
			<template v-else>
				<GamblingGame
						:items="fetchedData.games"
						:roll_count="fetchedData.player.item_roll_count"
						:requestObj="requestObj"
						:easeOutType="1"
						:requestParentData="requestInProgress"
						cardType="GameGamblingCard"
						:itemHeight="130"
				/>
				<button
						:class="`btn mr-[1rem] ${spinning || requestInProgress ? 'btn-disable' : 'btn-simple-1' }`"
						@click="editListToggle()"
				>
					Редактировать список
				</button>
			</template>
		</template>
	</div>
</template>

<style lang="scss" scoped>
.loading-box {
	@apply absolute z-[10] justify-center items-center w-full h-full bg-black/50;
}

.platforms-container {
	@apply block lg:flex gap-[10px] pt-[20px] pb-[20px] flex-wrap;

	.platform {
		@apply
		w-full lg:w-[8rem] h-[5rem] bg-[var(--second-bg-color)]
		flex items-center justify-center cursor-pointer
		p-[0.3rem] lg:p-[2rem]
		mb-[2px]
		;

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

