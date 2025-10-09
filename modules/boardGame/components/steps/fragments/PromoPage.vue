<script setup>
import BlockWrapper from '@/components/blockEditor/editor/BlockWrapper.vue';
import CountdownTimer from '@/components/additional/CountdownTimer.vue';

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();
</script>

<template>
	<template v-if="boardGameStore.boardGameInfo">
		<BlockWrapper
				v-for="(block, blockIndex) in boardGameStore.boardGameInfo.blocks"
				:name="block.name"
				:structure="block.structure"
		/>
		<CountdownTimer
				:targetDate="boardGameStore.boardGameInfo.started_at"
				title="До начала ивента"
				endTitle="Ивет начался"
		/>
		<span class="user-interface-title">Дополнительная информация</span>
		<div>
			Вступайте в наш ТГ канал, там вы сможете получить получать новости об ивенте, задавать все интересующие вас вопросы об ивенте и а также обсудить его
		</div>

		Ознакомиться с польными правилами ивента
		Игры в ивенте
		Предметы ивента
	</template>
</template>

<style lang="scss" scoped>

</style>
