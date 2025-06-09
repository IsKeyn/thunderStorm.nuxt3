<script setup>
import GameListCard from '@/components/entertainment/card/GameListCard.vue';
import BigPreloader from '@/components/ui/BigPreloader.vue';
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

const emit = defineEmits(['loadingToggle']);

import { ref, watch } from "vue";

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

const form = ref(
		{
			searchLine: {
				name: 'Поиск',
				value: '',
				type: 'text',
				placeholder: 'Начните вводить название игры, для фильтрации',
				validateRules: 'required, minLength_2, maxLength_50',
				classes: 'w-full',
			},
		},
);

const gameList = ref([]);

const requestInProgress = ref(false);

const platforms = ref({});

const setPlatforms = () => {
	platforms.value = {};

	filteredItems.value.forEach((item) => {
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

const dataByGroups = ref(null);
const filteredItems = ref(null);

const useFilter = () => {
	filteredItems.value = gameList.value.filter((item) => {
		return item.game.name.toLowerCase().includes(form.value.searchLine.value.toLowerCase());
	});

	filteredItems.value = filteredItems.value.sort((a, b) => {
		const dateA = a.game.release_dates[0]?.date;
		const dateB = b.game.release_dates[0]?.date;

		if (dateA && dateB) {
			return dateB - dateA; // для сортировки по убыванию (новые сначала)
			// или return dateA - dateB; для сортировки по возрастанию (старые сначала)
		}

		// Если у одного из элементов нет даты, размещаем его в конце
		if (!dateA && !dateB) return 0;
		if (!dateA) return 1;
		if (!dateB) return -1;

		return 0;
	});

	setPlatforms();

	let groups = platforms.value;

	filteredItems.value.forEach((item) => {
		if (item.platform.slug && groups[item.platform.slug]) {
			groups[item.platform.slug].items.push(item);
		}
	});

	dataByGroups.value = groups;
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
									useFilter();
								} else {
									error('Request error', 5000);
								}
								requestInProgress.value = false;
								emit('loadingToggle');
							}
						},
				);
			} catch (e) {
				errorHandler(e);
				requestInProgress.value = false;
				emit('loadingToggle');
			}
		}
);

watch(form.value.searchLine, () => {
	useFilter();
}, { deep: true });
</script>

<template>
	<BigPreloader v-if="requestInProgress" />
	<template v-else>
		<FormGenerator
				v-if="form.searchLine"
				name="search"
				class="w-1/2"
				:element="form.searchLine"
				:showTitle="false"
				validateErrorPosition="bottom"
				labelClasses="mr-4 mt-[10px] mb-[10px]"
				:fieldClasses="form.searchLine.classes"
		/>
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

</template>

<style lang="scss">
input[name="search"] {
	@apply bg-[var(--third-bg-color)];
}
</style>

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
