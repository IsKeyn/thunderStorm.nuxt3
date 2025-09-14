<script setup>
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

const emit = defineEmits(['setOpenedImage', 'deleteItem', 'useItem', 'showPlayer']);

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
	theme: {
		type: String,
		default: 'default',
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
	<div class="item-box" @click="emit('showPlayer', element.user.id)">
<!--		<img-->
<!--				v-if="avatar"-->
<!--				:src="getResizeImg(avatar)"-->
<!--				:alt="element.user.name"-->
<!--				:title="element.user.name"-->
<!--				@click="emit('setOpenedImage', element.image)"-->
<!--		>-->
		<div class="info">
			<template v-if="theme === 'default'">
				<span class="name">
					{{ element.user.name }} [{{ getFormattedDate('d.m.Y H:i', element.created_at) }}]
				</span>
					<span class="description">
					{{ element.message }}
				</span>
			</template>
			<template v-if="theme === 'simple'">
				<span class="description">
					{{ getFormattedDate('d.m.Y H:i', element.created_at) }} : {{ element.message }}
				</span>
			</template>
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
	@apply p-2 mb-2 bg-[var(--second-bg-color)] rounded flex cursor-pointer;

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
