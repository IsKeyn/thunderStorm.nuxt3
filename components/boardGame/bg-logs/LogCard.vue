<script setup>
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

const emit = defineEmits(['setOpenedImage', 'deleteItem', 'useItem']);

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	showControlPanel: {
		type: Boolean,
		default: false,
	},
	boardGameInfo: {
		type: Object,
		default: {},
	},
});

// const avatar = computed(() => {
// 	const player = props.boardGameInfo.players.filter((item) => {
// 		if (item.user.id === props.element.user.id) {
// 			return true;
// 		} else {
// 			return false;
// 		}
// 	});
//
// 	if (player.length > 0) {
// 		return player[0].user.avatar;
// 	}
// });

</script>

<template>
	<div class="item-box">
<!--		<img-->
<!--				v-if="avatar"-->
<!--				:src="getResizeImg(avatar)"-->
<!--				:alt="element.user.name"-->
<!--				:title="element.user.name"-->
<!--				@click="emit('setOpenedImage', element.image)"-->
<!--		>-->
		<div class="info">
			<span class="name">
				{{ element.id }} {{ element.user.name }}
			</span>
			<span class="description">
				{{ element.message }}
			</span>
		</div>
		<div v-if="showControlPanel">
			<span
					class="use-button"
					@click="emit('useItem', element)"
			>
				<font-awesome-icon :icon="['fas', 'check']" />
			</span>
			<span
					class="close-button"
					@click="emit('deleteItem', element)"
			>
				<font-awesome-icon :icon="['fas', 'xmark']" />
			</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>

.item-box {
	@apply p-2 mb-2 bg-[var(--second-bg-color)] rounded flex;

	&:hover {
		@apply bg-[var(--second-active-color)];
	}

	img {
		@apply w-[70px] h-[70px] object-cover;
	}

	.info {
		@apply pl-3 pr-3 text-[var(--main-text-color)];

		.name {
			@apply block mb-1;
		}

		.description {
			@apply block;
		}
	}

	.use-button {
		@apply bg-[var(--success-color)] block pl-[0.6rem] pr-[0.6rem] pt-[0.3rem] pb-[0.3rem] text-center mb-[0.3rem];
	}

	.close-button {
		@apply bg-[var(--error-color)] block pl-[0.6rem] pr-[0.6rem] pt-[0.3rem] pb-[0.3rem] text-center;
	}
}
</style>
