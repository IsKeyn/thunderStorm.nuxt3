<script setup>
import PublicAvatar from '@/components/user/avatar/PublicAvatar.vue';
import SmallCardsLine from '@/modules/boardGame/components/user/player/playerCards/fragments/SmallCardsLine.vue';
import GameGamblingCard from '@/modules/boardGame/components/game/GameGamblingCard.vue';

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
	hideItems: {
		type: Boolean,
		default: false,
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

const goToTwitch = (twitchChanel) => {
	window.open(`https://www.twitch.tv/${twitchChanel}`, '_blank');
}
</script>

<template>
	<Nuxt-link
			:class="['player-box', bgClasses, theme]"
			:to="openProfile ? `/e/${route.params.slug}/player/${element.user.name}` : null"
	>
		<div class="first-line">
			<div class="bg" />
			<PublicAvatar
					:user="element.user"
					:useLightBox="useLightBox"
					classes="w-[90%] aspect-square object-cover"
					borderType="gold"
			/>
			<div class="content line-content">
				<div class="field">
					<span class="wrapper default">{{ element.user.public_name ?? element.user.name }}</span>
					<span
							v-if="boardGameStore.playersOnline && boardGameStore.playersOnline[element.user.id]"
							class="wrapper twitch"
							@click.prevent="goToTwitch(boardGameStore.playersOnline[element.user.id])"
					>Онлайн <font-awesome-icon icon="fa-brands fa-twitch" fade /></span>
					<span class="wrapper default "><font-awesome-icon icon="fa-solid fa-envelope" /></span>
				</div>
				<div class="field">
					<span class="wrapper default shimmer">
						<font-awesome-icon icon="fa-solid fa-bullhorn" class="inline mr-2" /> Премиум сообщение
					</span>
				</div>

				<div class="field">
					<span v-if="element?.full_points" class="wrapper default">
						Результат: {{ element.full_points }}
					</span>
					<span class="wrapper default">
						Очков в час: {{ element.points_per_hour }}
					</span>
					<span class="wrapper default">На поле: {{ element.position ? element.position : 'Не ходил' }}</span>
					<span class="wrapper default">Стрик: x{{ element.streak }}</span>
				</div>
			</div>
			<div
					v-if="element.place !== null"
					class="absolute-place-box"
			>
				<span
						:class="['place', getPlaceColor(element.place)]"
						title="Место в ивенте"
				>
					{{ element.place }}
				</span>
			</div>
		</div>
		<div class="second-line">
			<div class="content line-content">
				<div class="box">
					<GameGamblingCard
							v-if="element?.current_game?.game"
							:element="element.current_game.game"
							:itemHeight="60"
							overlayClasses="!bg-black/60"
					/>
				</div>
				<div class="box">
					<SmallCardsLine
							v-if="!hideItems"
							:element="element.inventory"
							type="items"
					/>
				</div>
				<div class="box">
					<SmallCardsLine
							v-if="!hideStatusEffect"
							:element="element.statusEffects"
					/>
				</div>
			</div>
		</div>
	</Nuxt-link>
</template>

<style lang="scss" scoped>
.player-box {
	@apply block mb-4 cursor-pointer;

	&:hover {
		.first-line {
			.bg {
				@apply bg-[var(--second-active-color)];
			}
		}
	}

	.first-line {
		@apply min-h-[10rem] relative bg-[var(--main-bg-color)];

		.bg {
			@apply absolute z-[0] w-full h-full bg-[var(--body-bg-color)];

			transition: all 0.3s ease;
			mask-position: center center;
			mask-repeat: repeat;

			mask-size: 200px;
			mask-image: url('/images/board-games/player-bg.png');
		}

		.avatar-box {
			@apply absolute z-[1] left-[2rem] bottom-[-2rem] max-w-[12rem];
		}

		.content {
			.field {
				@apply mb-5;

				.wrapper {
					@apply mr-[0.5rem] pt-[0.5rem] pb-[0.5rem] pr-[1rem] pl-[1rem] font-bold rounded-full;
				}

				.default {
					@apply bg-[var(--second-bg-color)] text-[var(--main-dark-text-color)];
				}

				.twitch {
					@apply bg-[#9147ff] text-[#ffffff];
				}

				.shimmer {
					@apply relative overflow-hidden inline-flex items-center w-fit rounded-full;

					&::after {
						content: '';

						@apply absolute inset-0 -translate-x-full rounded-full;

						background: linear-gradient(
							90deg,
							transparent,
							rgba(255, 255, 255, 0.25),
							transparent
						);
						animation: shimmer 3s infinite ease-in-out;
						will-change: transform;
					}
				}
			}
		}

		.absolute-place-box {
			@apply absolute z-[1] right-[0.5rem] top-[0.5rem];

			.place {
				@apply
					bg-[var(--success-color)] text-[var(--main-dark-text-color)] text-[1.3rem]
					block w-[3rem] h-[3rem] rounded-full text-center mb-[0.3rem]
					flex items-center justify-center;

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

	.second-line {
		@apply min-h-[6rem] bg-[var(--second-bg-color)] text-[var(--main-dark-text-color)];

		.content {
			@apply lg:grid grid-cols-12;

			.box {
				@apply col-span-4;
			}
		}
	}

	.line-content {
		@apply relative z-[1] pt-[1rem] pb-[1rem] pl-[15rem];
	}
}

@keyframes shimmer {
	0% { transform: translateX(-100%); }
	100% { transform: translateX(100%); }
}
</style>

<style lang="scss" scoped>
.street-light-theme {
	.first-line {
		.bg {
			@apply bg-[var(--third-bg-color)];
		}
	}
}
</style>
