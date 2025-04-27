<script setup>
import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

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
</script>

<template>
	<div
			class="flex"
	>
		<div
				v-for="(player, key) in boardGameInfo.players.filter(item => item.user.id !== userStore.user.id)"
				:ley="key"
				class="wrapper"
		>
			<div class="avatar">
				<img
						:src="player.user.avatar ? getResizeImg(player.user.avatar) : '/images/system/no-avatar.png'"
						:alt="player.user.name"
						:title="player.user.name"
				/>
			</div>

			<span class="nickname">{{ player.user.name }}</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.wrapper {
	@apply text-center pl-[1rem] pr-[1rem] pb-[1rem];

	.avatar {
		@apply
			inline-block
			w-[4rem] h-[4rem]
			rounded-full object-cover
			relative
		;

		img {
			@apply w-[4rem] h-[4rem] rounded-full object-cover;
		}
	}

	.nickname {
		@apply block pt-2;
	}
}
</style>
