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

const goToTwitch = (twitchChanel) => {
	window.open(`https://www.twitch.tv/${twitchChanel}`, '_blank');
}
</script>

<template>
	<Nuxt-link
			:class="['item-box', bgClasses, theme]"
			:to="openProfile ? `/e/${route.params.slug}/player/${element.user.name}` : null"
	>
		<PublicAvatar
				:class="[theme === 'short' ? 'max-w-[120px]' : 'max-w-[240px]', 'my-0 mx-auto']"
				:user="element.user"
				:useLightBox="useLightBox"
				classes="w-[90%] aspect-square object-cover"
		/>
		<div class="info">
			<span class="field name">
				{{ element.user.name }}
				<span
						v-if="boardGameStore.playersOnline && boardGameStore.playersOnline[element.user.id]"
						class="twitch"
						@click.prevent="goToTwitch(boardGameStore.playersOnline[element.user.id])"
				>Онлайн <font-awesome-icon icon="fa-brands fa-twitch" fade /></span>
			</span>
			<span class="field">
				Итоговый результат: {{ element.full_points }}
			</span>
			<span
					v-if="element.full_points && element.seconds"
					class="field"
			>
				Очков в час: {{ Math.round((element.full_points / element.seconds) * 3600) }}
			</span>
			<span
					v-if="theme === 'default'"
					class="field"
			>
				Позиция на поле: {{ element.position ? element.position : 'Ходы не осуществлялись' }}
			</span>
			<span
					v-if="theme === 'default'"
					class="field"
			>
				Стрик: x{{ element.streak }}
			</span>
<!--			<span-->
<!--					v-if="theme === 'default'"-->
<!--					class="field"-->
<!--			>-->
<!--				Количество очков: {{ element.points }}-->
<!--			</span>-->
			<span class="field">
				Статус: <template v-if="element.active">Участвует</template><template v-else>Не участвует <span v-if="element.active.not_active_reason">{{ element.active.not_active_reason }}</span></template>
			</span>
		</div>
		<div
				v-if="!hideStatusEffect && element.status_effects.length > 0"
				class="status-effects"
		>
			<StatusEffectSmallCard
					v-for="(statusEffect, key) in statusEffectForShow"
					:key="key"
					:element="statusEffect"
			/>
			<div
					v-if="element.status_effects.length > 4"
					class="status-effect-small-card-count"
			>
				+{{ element.status_effects.length - 3 }}
			</div>
		</div>
		<div
				v-if="place !== null"
				class="control-panel"
		>
			<span :class="['place', getPlaceColor(place + 1)]">{{ place + 1 }}</span>
		</div>
	</Nuxt-link>
</template>

<style lang="scss" scoped>
.item-box {
	@apply
		block lg:grid grid-cols-12 relative cursor-pointer rounded-none
		p-4 pr-[3rem] mb-2
		bg-[var(--second-bg-color)]
	;

	&:hover {
		@apply no-underline bg-[var(--second-active-color)];
	}

	.short {
		@apply col-span-1;
		}

	.default {
		@apply col-span-2 ;
		}

	.avatar-box {
		@apply flex items-center justify-center;
	}

	.info {
		@apply
			lg:col-span-4 2xl:col-span-4
			pl-3 pr-3
			text-[var(--main-text-color)]
		;

		.field {
			@apply block mb-1;

			.twitch {
				@apply bg-[#9147ff] text-[#ffffff] p-1 pl-4 pr-4 rounded-full;
			}

			a {
				@apply bg-[var(--main-bg-color)] rounded-full p-1;

				&:hover {
					@apply no-underline;
				}
			}
		}

		.name {
			@apply font-bold mb-3;
		}
	}

	.status-effects {
		@apply lg:col-span-6 2xl:col-span-6 flex gap-1 justify-start lg:justify-end pl-3 pr-3 mt-4 lg:mt-0;
	}

	.control-panel {
		@apply absolute right-[0.5rem] top-[0.5rem];

		.place {
			@apply bg-[var(--success-color)] text-[var(--main-dark-text-color)] rounded-full block text-center mb-[0.3rem] w-[2rem] h-[2rem] flex items-center justify-center;

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

.status-effect-small-card-count {
	@apply relative w-[60px] h-[60px] bg-[var(--third-block-color)] text-[1.5rem] text-[var(--main-dark-text-color)] flex items-center justify-center;

	border: 2px solid var(--third-block-color);
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

