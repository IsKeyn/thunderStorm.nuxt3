<script setup>
import BlockWrapper from '@/components/blockEditor/editor/BlockWrapper.vue';
import CountdownTimer from '@/components/additional/CountdownTimer.vue';

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { helper } from '@/composables/helper.js'
const { route } = helper();
</script>

<template>
	<template v-if="boardGameStore.boardGameInfo">
		<BlockWrapper
				v-for="(block, blockIndex) in boardGameStore.boardGameInfo.blocks"
				:name="block.name"
				:structure="block.structure"
		/>
		<CountdownTimer
				class="mt-6"
				:targetDate="boardGameStore.boardGameInfo.started_at"
				title="До начала ивента"
				endTitle="Ивент начался"
		/>
		<span class="user-interface-title">Дополнительная информация</span>
		<div class="add-info-box">
			Присоединяйтесь к нашему <nuxt-link to="https://t.me/game_events_tr" target="_blank" title="Телеграм канал">телеграм-каналу</nuxt-link>, чтобы узнавать свежие новости о новых ивентах, задать интересующие вас вопросы или обсудить ивент.<br/>
			Вы также можете посмотреть <nuxt-link :to="'/e/' + route.params.slug + '/game?tab=game-list'" target="_blank" title="Игры ивента">игры</nuxt-link>, которые участвуют в ивенте, посмотреть <nuxt-link :to="'/e/' + route.params.slug + '/inventory?tab=item-list'" target="_blank" title="Предметы ивента">предметы</nuxt-link>, которые можно будет использовать, а также ознакомиться с полными <nuxt-link :to="'/e/' + route.params.slug + '/rules'" target="_blank" title="Правила и описание ивента">правилами и описанием</nuxt-link> ивента.
		</div>
	</template>
</template>

<style lang="scss">
.event-main-page-video-block {
	@apply 2xl:max-w-[50%];
	margin: 0 auto;
}
</style>

<style lang="scss" scoped>
.add-info-box {
	a {
		@apply underline;
	}
}
</style>
