<script setup>
const emit = defineEmits(['setOpenedImage']);

import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	place: {
		type: Number,
		default: null,
	},
	theme: {
		type: String,
		default: 'default',
	},
	useLightBox: {
		type: Boolean,
		default: false,
	},
});

const getPlaceColor = (place) => {
	switch (place) {
		case 1: return 'gold';
		case 2: return 'silver';
		case 3: return 'bronze';
	}
}
</script>

<template>
	<div
			class="item-box"
			@click="emit('showPlayerInfo', element.user.id)"
	>
		<img
				v-if="element.user.avatar"
				:src="getResizeImg(element.user.avatar)"
				:alt="element.user.name"
				:title="element.user.name"
				@click="useLightBox ? emit('setOpenedImage', element.user.avatar) : false"
		>
		<div class="info">
			<template v-if="theme === 'short'">
				<span class="name">
					{{ element.user.name }}
				</span>
				<span class="description">
					Итоговый результат: {{ element.full_points }}
				</span>
				<span
						v-if="element.full_points && element.seconds"
						class="description"
				>
					Очков в час: {{ Math.round((element.full_points / element.seconds) * 3600) }}
				</span>
			</template>
			<template v-else>
				<span class="name">
					{{ element.user.name }}
				</span>
				<span class="description">
					Количество очков: {{ element.points }}
				</span>
					<span class="description">
					Позиция на поле: {{ element.position ? element.position : 'Не делал ходов' }}
				</span>
					<span class="description">
					Итоговый результат: {{ element.full_points }}
				</span>
			</template>
		</div>
		<div
				v-if="place !== null"
				class="control-panel"
		>
			<span :class="['place', getPlaceColor(place + 1)]">
				{{ place + 1 }}
			</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>

.item-box {
	@apply p-2 pr-[3rem] mb-2 bg-[var(--second-bg-color)] rounded flex relative cursor-pointer;

	&:hover {
		@apply bg-[var(--second-active-color)];
	}

	img {
		@apply w-[70px] h-[70px] object-cover cursor-pointer;
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

	.control-panel {
		@apply absolute right-[0.5rem];

		.place {
			@apply bg-[var(--success-color)] rounded-full block text-center mb-[0.3rem] w-[2rem] h-[2rem] flex items-center justify-center;

			&.gold {
				@apply bg-[#FFD700] text-[#000000];
			}

			&.silver {
				@apply bg-[#C0C0C0] text-[#000000];
			}

			&.bronze {
				@apply bg-[#CD7F32];
			}
		}
	}
}
</style>
