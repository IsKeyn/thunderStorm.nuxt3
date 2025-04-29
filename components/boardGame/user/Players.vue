<script setup>
import PlayerCard from '@/components/boardGame/user/PlayerCard.vue';
import LightBox from '@/components/media/LightBox.vue'

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
	boardGameInfo: {
		type: Object,
		default: {},
	},
});

import { lightBox } from '@/composables/lightBox.js';
const {
	openedImage,
	setOpenedImage
} = lightBox();
</script>

<template>
	<span class="user-interface-title">Игроки</span>
	<div class="wrapper">
		<div
				v-for="(player, key) in boardGameInfo.players.sort((a, b) => b.full_points - a.full_points)"
				:key="key"
		>
			<PlayerCard
				:element="player"
				:place="key"
				@setOpenedImage="setOpenedImage"
			/>
		</div>
	</div>

	<LightBox
			v-if="openedImage"
			:image="openedImage"
			:setViewsLog="true"
			@setCurrentElement="setOpenedImage"
	/>
</template>

<style lang="scss" scoped>
.wrapper {
	@apply max-h-[500px];

	overflow: auto;
	scrollbar-width: none; /* Firefox */
	-ms-overflow-style: none; /* IE и Edge */

	&::-webkit-scrollbar {
		display: none; /* Chrome, Safari, Opera */
	}

	.log-title {
		@apply block mb-2 text-[1.5rem];
	}
}
</style>
