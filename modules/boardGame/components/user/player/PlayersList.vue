<script setup>
import PlayerCard from '@/modules/boardGame/components/user/player/PlayerCard.vue';

import { computed, ref } from "vue";

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { api } from '@/composables/api.js'
const { sendApiRequest, responseErrors } = api();

const route = useRoute();
const requestName = 'getBoardGamePlayerList';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const response = await Promise.resolve(
					sendApiRequest(`board-game/v2/player/list/${route.params.slug}`, 'GET', {}, requestName)
			);

			return response?.data || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value || []);

/* Сортировка списка игроков */
const sortType = ref('byFullPoints');
const sortDirection = ref('desc');

const sortedPlayerList = computed(() => {
	// Создаем копию массива для сортировки
	const dataToSort = [...fetchedData.value];

	return dataToSort.sort((a, b) => {
		if (sortType.value === 'byFullPoints') {
			return sortDirection.value === 'desc' ? b.full_points - a.full_points : a.full_points - b.full_points;
		}

		if (sortType.value === 'pointsPerSeconds') {
			// Если у обоих seconds = 0, сохраняем их исходный порядок
			if (a.seconds === 0 && b.seconds === 0) return 0;
			// Если у a seconds = 0, помещаем его ниже
			if (a.seconds === 0) return sortDirection.value === 'desc' ? 1 : -1;
			// Если у b seconds = 0, помещаем его ниже
			if (b.seconds === 0) return sortDirection.value === 'desc' ? -1 : 1;

			const ppSecondA = a.full_points ? (a.full_points / a.seconds) : 0;
			const ppSecondB = b.full_points ? (b.full_points / b.seconds) : 0;

			return sortDirection.value === 'desc' ? ppSecondB - ppSecondA : ppSecondA - ppSecondB;
		}

		return 0; // Добавляем возврат по умолчанию
	});
});
</script>

<template>
	<div class="flex justify-end mb-4">
		<div class="sort-box">
			<select v-model="sortType" class="w-full mr-4">
				<option value="byFullPoints">По количеству очков</option>
				<option value="pointsPerSeconds">По соотношению очки/время</option>
			</select>
		</div>
		<button>
			<font-awesome-icon
					v-if="sortDirection === 'desc'"
					:icon="['fas', 'arrow-down-wide-short']"
					@click="sortDirection = 'asc'"
			/>
			<font-awesome-icon
					v-if="sortDirection === 'asc'"
					:icon="['fas', 'arrow-up-short-wide']"
					@click="sortDirection = 'desc'"
			/>
		</button>
	</div>
	<ui-BigPreloader v-if="requestInProgress" />
	<template v-else-if="fetchedData && fetchedData.length">
		<div
				v-for="(player, index) in sortedPlayerList"
				:key="player.id || index"
		>
			<PlayerCard
					:element="player"
					:place="sortDirection === 'desc' ? index : sortedPlayerList.length - index - 1"
					:useLightBox="true"
			/>
		</div>
	</template>
	<span v-else>
		Участников пока нет
	</span>
</template>

<style lang="scss" scoped>
.sort-box {
	@apply flex items-center;
}
</style>
