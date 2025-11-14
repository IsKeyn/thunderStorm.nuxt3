<script setup>
import PublicAvatar from '@/components/user/avatar/PublicAvatar.vue';
import StatusEffectSmallCard from '@/modules/boardGame/components/statusEffect/StatusEffectSmallCard.vue';
import Timer from '@/modules/boardGame/components/timer/Timer.vue';

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

const route = useRoute();
const router = useRouter();

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

const statusEffectForShow = computed(() => {
	if (props.element.status_effects.length > 4) {
		return props.element.status_effects.slice(0, 3);
	} else {
		return props.element.status_effects;
	}
});
</script>

<template>
	<Nuxt-link
			:class="['player-box', bgClasses, getPlaceColor(place + 1)]"
			:to="openProfile ? `/e/${route.params.slug}/player/${element.user.name}` : null"
	>
		<div :class="['name-place-box', getPlaceColor(place + 1)]">
			{{ element.user.name }}
		</div>
		<PublicAvatar
				:user="element.user"
				:useLightBox="useLightBox"
				classes="w-[100%] aspect-square object-cover"
		/>
		<span :class="['place', getPlaceColor(place + 1)]">{{ place + 1 }}</span>
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
		@apply absolute rounded-full w-[2.5rem] h-[2.5rem] text-center flex items-center justify-center bottom-[-15px] text-[1.3rem];

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

