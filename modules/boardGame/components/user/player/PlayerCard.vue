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
			class="item-box"
			:to="openProfile ? `/e/${route.params.slug}/player/${element.user.name}` : null"
	>
		<PublicAvatar
				:user="element.user"
				:useLightBox="useLightBox"
				classes="w-[90%] aspect-square object-cover"
		/>
		<div class="info">
			<span class="field name">
				{{ element.user.name }}
				<template v-if="boardGameStore.playersOnline[element.user.id]">
					<a :href="`https://www.twitch.tv/${boardGameStore.playersOnline[element.user.id]}`" target="_blank">Онлайн <font-awesome-icon icon="fa-brands fa-twitch" fade /></a>
				</template>
			</span>
			<span
					v-if="element.full_points && element.seconds"
					class="field"
			>
				Очков в час: {{ Math.round((element.full_points / element.seconds) * 3600) }}
			</span>
			<span class="field">
				Итоговый результат: {{ element.full_points }}
			</span>
			<span
					v-if="theme === 'default'"
					class="field"
			>
				Количество очков: {{ element.points }}
			</span>
			<span
					v-if="theme === 'default'"
					class="field"
			>
				Позиция на поле: {{ element.position ? element.position : 'Ходы не осуществлялись' }}
			</span>
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
		lg:grid grid-cols-12 relative cursor-pointer rounded-none
		p-4 pr-[3rem] mb-2
		bg-[var(--second-bg-color)]
	;

	&:hover {
		@apply no-underline bg-[var(--second-active-color)];
	}

	.avatar-box {
		@apply col-span-1 flex items-center justify-center;
	}

	.info {
		@apply
			lg:col-span-4 2xl:col-span-4
			pl-3 pr-3
			text-[var(--main-text-color)]
		;

		.field {
			@apply block mb-1;

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
		@apply lg:col-span-7 2xl:col-span-7 flex gap-1 items-center justify-end;
	}

	.control-panel {
		@apply absolute right-[0.5rem] top-[0.5rem];

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

