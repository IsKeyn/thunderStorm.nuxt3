<script setup>
import Timer from '@/modules/boardGame/components/timer/Timer.vue';
import SmallCardsLine from '@/modules/boardGame/components/user/player/playerCards/fragments/SmallCardsLine.vue';
import GameGamblingCard from '@/modules/boardGame/components/game/GameGamblingCard.vue';

import { computed } from "vue";
const emit = defineEmits(['refresh', 'showNotificationModal', 'showUserMessagesModal']);

import { useBoardGameStore } from '@/stores/boardGame';
const boardGameStore = useBoardGameStore();

import { useUserStore } from '@/stores/user';
const userStore = useUserStore();

import { userFunctions } from '@/composables/userFunctions.js';
const {
	isAuth,
	logout,
	sendLogoutRequest,
} = userFunctions();

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	/* list, detail */
	type: {
		type: String,
		default: 'detail',
	},
	hideItems: {
		type: Boolean,
		default: false,
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

const goToTwitch = (twitchChanel) => {
	window.open(`https://www.twitch.tv/${twitchChanel}`, '_blank');
}

const isCurrentUser = computed(() => { return isAuth && props.element && userStore.user.id === props.element.user_id; });

const twitch = computed(() => {
	if (props.element?.user?.additional_fields) {
		const twitchField = props.element.user.additional_fields.filter((item) => item.slug === 'twitch_channel');

		if (twitchField.length > 0 && twitchField[0]) return twitchField[0];
	}

	return false;
});

const otherStreamPlatform = computed(() => {
	if (props.element?.user?.additional_fields) {
		const otherStreamPlatform = props.element.user.additional_fields.filter((item) => item.slug === 'other_stream_platform');

		if (otherStreamPlatform.length > 0 && otherStreamPlatform[0]) return otherStreamPlatform[0];
	}

	return false;
});
</script>

<template>
	<div
			v-if="element && element.user"
			:class="['player-box', type]"
	>
		<div class="first-line">
			<div class="bg" />
			<div class="avatar-box-main">
				<UserAvatar
						:user="element.user"
						:useLightBox="type === 'detail'"
						:canChange="type === 'detail'"
						classes="w-[90%] aspect-square object-cover"
						borderType="gold"
						@afterChangeAvatar="$emit('refresh')"
				/>
				<div
						v-if="element.place !== null"
						class="absolute-place-box"
				>
					<span
							v-if="element.place"
							:class="['place', getPlaceColor(element.place)]"
							title="Место в ивенте"
					>
						{{ element.place }}
					</span>
				</div>
			</div>
			<div v-if="type === 'detail'" class="timer-box">
				<Timer
						:userId="element.user_id"
						:showName="false"
						:showControlButtons="false"
				/>
			</div>
			<div class="content line-content">
				<div class="field">
					<span class="wrapper default">{{ element.user.public_name ?? element.user.name }}</span>
					<span
							v-if="boardGameStore.playersOnline && boardGameStore.playersOnline[element.user.id]"
							class="wrapper twitch"
							@click.prevent="goToTwitch(boardGameStore.playersOnline[element.user.id])"
					>Онлайн <font-awesome-icon icon="fa-brands fa-twitch" fade /></span>
					<span v-if="!isCurrentUser" class="wrapper default message"><font-awesome-icon icon="fa-solid fa-envelope" /></span>
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
					<span class="wrapper default">Очков в час: {{ element.points_per_hour ?? 0 }}</span>
					<span class="wrapper default">На поле: {{ element.position ? element.position : 'Не ходил' }}</span>
					<span class="wrapper default">Стрик: x{{ element.streak }}</span>
					<span
							v-if="type === 'detail' && element.created_at"
							class="wrapper default"
					>В ивенте с {{ getFormattedDate('d ru_mouths_name Y', element.created_at) }}</span>
					<span
							v-if="type === 'detail'"
							class="wrapper default"
					>
						<template v-if="element.active">
							Участвует
						</template>
						<template v-else>
							Не участвует
						</template>
					</span>
				</div>
			</div>
		</div>
		<div :class="['second-line', type]">
			<div class="content line-content">
				<template v-if="type === 'detail'">
					<div class="box">
						<NuxtLink
								v-if="twitch.value"
								class="btn btn-simple-1 mr-2 inline-block"
								:to="`https://www.twitch.tv/${twitch.value}`"
								target="_blank"
								:title="`Twitch канал ${element?.user?.public_name}`"
						>
							Twitch канал <font-awesome-icon icon="fa-brands fa-twitch" />
						</NuxtLink>
						<NuxtLink
								v-if="otherStreamPlatform.value"
								class="btn btn-simple-1 mr-2 inline-block"
								:to="otherStreamPlatform.value"
								target="_blank"
								title="Платформа стрима"
						>
							Платформа стрима <font-awesome-icon icon="fa-regular fa-circle-play" />
						</NuxtLink>
					</div>
					<div class="box">
						<template v-if="isCurrentUser">
							<button
									class="btn btn-simple-1 mr-2"
									@click="s$emit('showUserMessagesModal')"
							>
								<font-awesome-icon icon="fa-solid fa-envelope" class="mr-2" /> Мои сообщения
							</button>
							<button
									class="btn btn-simple-1 mr-2"
									@click="$emit('showNotificationModal')"
							>
								<font-awesome-icon icon="fa-solid fa-bell" class="mr-2" /> Мои уведомления
							</button>
							<button
									class="btn btn-simple-1 mr-2"
									@click="logout"
							>
								<font-awesome-icon :icon="['fas', 'right-from-bracket']" class="mr-2" /> Выйти
							</button>
						</template>
					</div>
				</template>
				<template v-else-if="type === 'list'">
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
				</template>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.player-box {
	@apply block mb-4;

	&.line {
		@apply cursor-pointer;
	}

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

		.avatar-box-main {
			@apply absolute z-[2] left-[2rem] bottom-[-2rem] max-w-[12rem];

			.absolute-place-box {
				@apply absolute z-10;

				bottom: -1.5rem;
				left: calc(50% - 1.5rem);

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
					@apply cursor-pointer bg-[#9147ff] text-[#ffffff];
				}

				.message {
					@apply cursor-pointer;
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

		.timer-box {
			@apply w-[30%] p-[0.5rem] absolute top-0 right-[0.5rem];
		}
	}

	.second-line {
		@apply min-h-[6rem];

		&.list {
			@apply bg-[var(--second-bg-color)] text-[var(--main-dark-text-color)];
		}

		.content {
			@apply lg:grid grid-cols-12;

			.box {
				@apply col-span-4;

				a {
					&:hover {
						@apply no-underline;
					}
				}
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

.street-light-theme {
	.first-line {
		.bg {
			@apply bg-[var(--third-bg-color)];
		}
	}
}
</style>
