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
			Присоединяйтесь к нашему <a href="https://t.me/game_events_tr" target="_blank" title="Телеграм канал">телеграм-каналу</a>, чтобы узнавать свежие новости о новых ивентах, задать интересующие вас вопросы или обсудить ивент.<br/>
			Вы также можете посмотреть <a :href="'/e/' + route.params.slug + '/game?tab=game-list'" target="_blank" title="Игры ивента">игры</a>, которые участвуют в ивенте, изучить <a :to="'/e/' + route.params.slug + '/inventory?tab=item-list'" target="_blank" title="Предметы ивента">предметы</a>, которые можно будет использовать, а также ознакомиться с полными <a :to="'/e/' + route.params.slug + '/rules'" target="_blank" title="Правила и описание ивента">правилами и описанием</a> ивента.
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
