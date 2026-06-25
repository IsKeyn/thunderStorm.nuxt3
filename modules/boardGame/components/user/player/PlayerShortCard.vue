<script setup>
import PublicAvatar from '@/components/user/avatar/PublicAvatar.vue';
import StatusEffectSmallCard from '@/modules/boardGame/components/statusEffect/StatusEffectSmallCard.vue';
import Timer from '@/modules/boardGame/components/timer/Timer.vue';

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { helper } from '@/composables/helper.js'
const { route, router } = helper();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	theme: {
		type: String,
		default: 'default',
	},
	useLightBox: {
		type: Boolean,
		default: false,
	},
	openProfile: {
		type: Boolean,
		default: true,
	},
	hideStatusEffect: {
		type: Boolean,
		default: false,
	},
	bgClasses: {
		type: String,
		default: '',
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
	<Nuxt-link
			:class="['player-box', bgClasses, getPlaceColor(element.place)]"
			:to="openProfile ? `/e/${route.params.slug}/player/${element.user.name}` : null"
	>
		<div :class="['name-place-box', getPlaceColor(element.place)]">
			{{ element.user.public_name }}
		</div>
		<PublicAvatar
				:user="element.user"
				classes="w-[100%] aspect-square object-cover"
		/>
		<span :class="['place', getPlaceColor(element.place)]">{{ element.place }}</span>
	</Nuxt-link>
</template>

<style lang="scss" scoped>
.player-box {
	@apply block max-w-[10rem] relative;

	.name-place-box {
		@apply text-center rounded-full pl-5 pr-5 pt-2 pb-2 mb-1 shadow;

		&.gold {
			@apply bg-[#FFD700] text-[#000000];
		}

		&.silver {
			@apply bg-[#c3c3c3] text-[#000000];
		}

		&.bronze {
			@apply bg-[#CD7F32];
		}
	}

	.place {
		@apply absolute rounded-full w-[2.5rem] h-[2.5rem] text-center flex items-center justify-center bottom-[-15px] text-[1.3rem] z-[10];

		left: calc(50% - 1.5rem);

		&.gold {
			@apply bg-[#FFD700] text-[#000000];
		}

		&.silver {
			@apply bg-[#c3c3c3] text-[#000000];
		}

		&.bronze {
			@apply bg-[#CD7F32];
		}
	}
}
</style>

<style lang="scss">
.player-box {
	&.gold {
		.avatar-box {
			img {
				@apply shadow;
				border: 4px solid #FFD700;
			}
		}
	}

	&.silver {
		.avatar-box {
			img {
				@apply shadow;
				border: 4px solid #c3c3c3;
			}
		}
	}

	&.bronze {
		.avatar-box {
			img {
				@apply shadow;
				border: 4px solid #CD7F32;
			}
		}
	}

	&:hover {
		@apply no-underline;
	}
}
</style>

<style lang="scss" scoped>
.street-light-theme {
	.item-box {
		.info {
			@apply text-[var(--main-dark-text-color)];
		}
	}
}
</style>

