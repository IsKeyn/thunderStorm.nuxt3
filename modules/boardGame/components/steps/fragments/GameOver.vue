<script setup>
import PlayerShortCard from '@/modules/boardGame/components/user/player/PlayerShortCard.vue';

import { computed, ref } from "vue";

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { helper } from '@/composables/helper.js'
const { route } = helper();

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
	<div class="item-box">Ивент окончен, поздравляем победителей ивента! Благодарим участников ивента, спасибо, что вы были с нами!</div>
	<span class="user-interface-title">Победители ивента</span>
	<ui-BigPreloader v-if="requestInProgress" />
	<div
			class="players-box"
			v-else-if="fetchedData && fetchedData.length"
	>
		<div
				v-for="(player, index) in sortedPlayerList"
				:key="player.id || index"
		>
			<PlayerShortCard
					v-if="index <= 2"
					:element="player"
					:place="sortDirection === 'desc' ? index : sortedPlayerList.length - index - 1"
					:useLightBox="true"
			/>
		</div>
	</div>
	<div class="item-box">
		Окончание одного - всегда начало чего-то нового. Присоединяйтесь к нашему <nuxt-link to="https://t.me/game_events_tr" target="_blank" title="Телеграм канал">телеграм-каналу</nuxt-link>, чтобы узнавать свежие новости о новых ивентах.</br>
		Вы также можете посмотреть <nuxt-link to="/e/" target="_blank" title="Список ивентов">список ивентов</nuxt-link>, чтобы посмотреть историю ивентов и проверить текущие активные ивенты.
	</div>
</template>

<style lang="scss" scoped>
.item-box {
	@apply block;

	a {
		@apply underline;
	}
}

.players-box {
	@apply flex justify-center gap-2 mb-10;
}
</style>

