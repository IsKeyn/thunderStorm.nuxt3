<script setup>
import GameListCard from '@/components/entertainment/card/GameListCard.vue';

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
});

import { ref } from "vue";

/* Получение данных */
const gameList = ref([]);

const requestInProgress = ref(false);

const platforms = ref({});

const setPlatforms = () => {
	gameList.value.forEach((item) => {
		platforms.value[item.platform.slug] = {
			id: item.platform.id,
			name: item.platform.name,
			sort: item.platform.sort,
			items: [],
		};
	});

	// 1. Получаем массив пар [key, value]
	const entries = Object.entries(platforms.value);

	// 2. Сортируем по полю `sort` (по возрастанию)
	const sortedEntries = entries.sort((a, b) => a[1].sort - b[1].sort);

	// 3. Собираем обратно в объект (в современных JS порядок сохранится)
	platforms.value = Object.fromEntries(sortedEntries);
}

const { refresh } = await useAsyncData(
		async () => {
			let request = `${apiUrl.value}board-game/game-list/list/`;

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
									gameList.value = response._data.data;
									setPlatforms();
								} else {
									error('Request error', 5000);
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

const dataByGroups = computed(() => {
	let groups = platforms.value;

	if (gameList.value) {
		gameList.value.forEach((item) => {
			if (item.platform.slug && groups[item.platform.slug]) {
				groups[item.platform.slug].items.push(item);
			}
		});
	}

	return groups;
});
</script>

<template>
	<div v-if="gameList.length > 0">
		<div v-if="dataByGroups">
			<div class="group" v-for="(group, key) in dataByGroups">
				<span class="title">{{ group.name }}</span>
				<div class="game-list">
					<GameListCard
							v-for="(item, index) in group.items"
							:key="key"
							:game="item.game"
							target="_blank"
							entity="game"
					/>
				</div>
			</div>
		</div>
<!--		<div class="game-list">-->
<!--			<GameListCard-->
<!--					v-for="(item, index) in gameList"-->
<!--					:key="index"-->
<!--					:game="item.game"-->
<!--					entity="game"-->
<!--			/>-->
<!--		</div>-->
	</div>
	<div v-else class="item-box">
		Игр нет
	</div>
</template>

<style lang="scss" scoped>
.item-box {
	@apply p-2 mb-2 bg-[var(--second-bg-color)] rounded flex;
}

.group {
	@apply mb-10;
}

.game-list {
	@apply grid grid-cols-12 gap-x-[1rem] gap-y-[1rem];
}
</style>
