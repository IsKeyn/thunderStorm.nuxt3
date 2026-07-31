<script setup>
import PlayerShortCard from '@/modules/boardGame/components/user/player/PlayerShortCard.vue';

import { computed } from "vue";

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

const requestName = 'getBoardGamePlayerList';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const query = {
				page: 1,
				perPage: 3,
				filters: {
					sort: {
						field: 'place',
						sort: 'asc',
					},
				}
			};

			const response = await Promise.resolve(
					sendApiRequest(`board-game/v2/player/list/${route.params.slug}`, 'GET', query, requestName)
			);

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value?.data || []);
</script>

<template>
	<div class="relative">
		<div class="item-box">Ивент окончен, поздравляем победителей ивента! Благодарим участников ивента, спасибо, что вы были с нами!</div>
		<span class="user-interface-title">Победители ивента</span>
		<ui-BigPreloader
				v-if="requestInProgress"
				class="h-full"
				theme="image"
				:themeType="9"
		/>
		<div
				class="players-box"
				v-else-if="fetchedData && fetchedData.length"
		>
			<div
					v-for="(player, index) in fetchedData"
					:key="index"
			>
				<PlayerShortCard
						:element="player"
						bgClasses="my-0 mx-auto mb-4"
				/>
			</div>
		</div>
		<div class="item-box">
			Окончание одного - всегда начало чего-то нового. Присоединяйтесь к нашему <nuxt-link to="https://t.me/game_events_tr" target="_blank" title="Телеграм канал">телеграм-каналу</nuxt-link>, чтобы узнавать свежие новости о новых ивентах.</br>
			Вы также можете посмотреть <nuxt-link to="/e/" target="_blank" title="Список ивентов">список ивентов</nuxt-link>, чтобы посмотреть историю ивентов и проверить текущие активные ивенты.
		</div>
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
	@apply block sm:flex justify-center gap-2 mb-10;
}
</style>
