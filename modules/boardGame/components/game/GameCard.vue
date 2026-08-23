<script setup>
import Slider from '@/components/sliders/vueSlider/Slider.vue';
import PublicAvatar from '@/components/user/avatar/PublicAvatar.vue';
import Timer from '@/modules/boardGame/components/timer/Timer.vue';

import { helper } from '@/composables/helper.js'
const { route, findElementById } = helper();

import { date } from '@/composables/date.js';
const {
	getFormattedDate,
	getFormattedHoursFromSeconds,
	getHoursFromMinutes,
} = date();

import { userFunctions } from '@/composables/userFunctions.js';
const { userStore } = userFunctions();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const { addTextToPoints, getSettingValue } = boardGame();

import { bgGames } from '@/composables/BoardGame/bgGames.js'
const { getLongPlayLink, getStatusName, getStatusClass, getDifficultName } = bgGames();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	showInfoButtons: {
		type: Boolean,
		default: true,
	},
	showStatusBar: {
		type: Boolean,
		default: true,
	},
	/* default , PlayerActionWithGame , CurrentGame */
	theme: {
		type: String,
		default: 'default',
	},
	showCover: {
		type: Boolean,
		default: true,
	},
	showTimer: {
		type: Boolean,
		default: false,
	},
	streak: {
		type: Number,
		default: 0,
	},
	difficultInPercent: {
		type: Boolean,
		default: false,
	},
});

const platformDifficult = computed(() => {
	if (props?.element?.game?.platform.id) {
		const platforms = JSON.parse(getSettingValue('eventGamePlatforms'));

		const platform = (platforms && typeof platforms === 'object') ? findElementById(platforms, props.element.game.platform.id) : [];

		return getDifficultName(platform.difficult);
	}
});
</script>

<template>
	<div :class="['item-box',  getStatusClass(element.status, theme), theme]">
		<div
				v-if="showStatusBar"
				:class="['status-bar']"
		>
			<span v-if="theme === 'PlayerActionWithGame'"><router-link
					:to="`/e/${route.params.slug}/player/${element.user.name}`"
					target="_blank"
					class="header-link"
					title="Открыть профайл"
			>{{ element.user.name }}</router-link> - </span>{{ getStatusName(element.status) }} <span v-if="element.board_game"><nuxt-link :to="`/e/${element.board_game.slug}`" target="_blank" class="event">({{ element.board_game.name }})</nuxt-link></span> <span v-if="getFormattedHoursFromSeconds(element.time)">(время в игре {{ getFormattedHoursFromSeconds(element.time) }})</span> <span v-if="element.finished_at">({{ getFormattedDate('d.m.Y', element.finished_at) }})</span>
		</div>
		<div class="content-box">
			<PublicAvatar
					v-if="theme === 'PlayerActionWithGame'"
					:user="element.user"
					:useLightBox="true"
			/>
			<Slider
					v-else-if="showCover && element.game.game.covers"
					:items="element.game.game.covers"
					class="slider"
			/>
			<div class="info">
				<span
						v-if="theme === 'default' || theme === 'CurrentGame'"
						class="name"
				>
					{{ element.game.game.name }} <span v-if="element.game.platform">({{ element.game.platform.name }})</span>
				</span>
				<div
						v-if="theme === 'default' || theme === 'CurrentGame'"
						class="info-wrapper"
				>
					<div>
						<span class="line-info" v-if="element.game.platform">Платформа: {{ element.game.platform.name }}</span>
						<span class="line-info" v-if="element.game.game?.release_dates?.[0]?.date">Год релиза: {{ getFormattedDate('Y', element.game.game.release_dates[0].date) }}</span>

						<span class="line-info" v-if="element.points">Получил очков за игру: {{ element.points }}</span>
						<span class="line-info" v-else-if="element.game.computed_points || element.game.points">Очки за игру: {{ element.game.computed_points ? element.game.computed_points : element.game.points }}</span>

						<span
								v-if="element.game.added_by && element.game.added_by_user.name"
								class="line-info"
						>
							Добавил: <router-link
								:to="`/e/${route.params.slug}/player/${element.game.added_by_user.name}`"
								class="hover-line"
								title="Открыть профайл"
						>{{ element.game.added_by_user.public_name ? element.game.added_by_user.public_name : element.game.added_by_user.name }}</router-link>
						</span>
						<span class="line-info" v-if="element?.game?.source">Источник: {{ element.game.source }}</span>
						<span
								class="line-info"
								v-if="element?.game?.difficult"
						>
							<template v-if="difficultInPercent">
								Сложность: {{ element.game.difficult }}%
							</template>
							<template v-else>
								Сложность: {{ getDifficultName(element.game.difficult) }}
							</template>
						</span>
						<span
								class="line-info"
								v-if="platformDifficult"
						>
							Сложность платформы: {{ platformDifficult }}
						</span>
						<span
								class="line-info"
								v-if="element?.game?.game_completion_time && element.game.game_completion_time !== '0'"
						>
							Время прохождения (HLTB): {{ getHoursFromMinutes(element.game.game_completion_time) }}
						</span>
						<span
								v-if="element.points_for_finish"
								class="line-info mt-4"
						>
							Со стриком x{{ streak }} и модификаторами вы получите {{ addTextToPoints(element.points_for_finish) }} за прохождение
						</span>
						<span
								v-if="element.game.description"
								class="line-info mt-4"
						>
							Условия прохождения: {{ element.game.description }}
						</span>
					</div>

					<div v-if="showInfoButtons">
						<div class="mb-2">Ссылки:</div>
						<ul>
							<li>
								<a
										class="mr-[1rem]"
										:href="getLongPlayLink(element.game)"
										target="_blank"
								>Открыть лонглей (YouTube)</a>
							</li>
							<li v-if="element.game.game.slug">
								<a
										class="mr-[1rem]"
										:href="`/game/${element.game.game.slug}`"
										target="_blank"
								>Открыть детальную страницу игры на сайте</a>
							</li>
						</ul>
					</div>
				</div>
				<div
						v-if="theme === 'PlayerActionWithGame'"
						class="comment-box"
				>
					<div class="message">
						{{ element.comment ? element.comment.message : 'Игрок не оставил комментария об игре' }}
					</div>
				</div>
			</div>
			<Timer
					v-if="showTimer && userStore.user"
					class="lg:w-2/3 text-[var(--main-text-color)]"
					:userId="userStore.user.user_id"
					:showName="false"
			/>
		</div>
		<div
				v-if="theme === 'default' && element.comment"
				class="comment-box"
		>
			<div class="message">
				{{ element.comment.message }}
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.item-box {
	@apply
		block p-0
		bg-[var(--second-bg-color)] w-full mb-2
	;

	&.violet {
		border-left: 8px solid #270062;
	}

	&.red {
		border-left: 8px solid #600000;
	}

	&.green {
		border-left: 8px solid #005d00;
	}

	&.blue {
		border-left: 8px solid #000460;
	}

	&.yellow {
		border-left: 8px solid #bea300;
	}

	.content-box {
		@apply lg:flex w-full p-[1rem];

		img,
		.slider {
			@apply
				mx-auto mb-4 lg:m-0
				w-[300px] h-auto object-contain cursor-pointer
			;
		}

		.info {
			@apply w-full pl-3 pr-3 text-[var(--main-dark-text-color)] mb-4 lg:mb-2;

			.info-wrapper {
				@apply block lg:flex gap-6;
			}

			.name {
				@apply block mb-[1rem] uppercase;
			}

			.line-info {
				@apply block mb-[0.3rem];

				.router-link-active {
					@apply bg-[initial];
				}
			}
		}

		a {
			@apply text-[var(--main-text-color)];
		}
	}

	.status-bar {
		@apply w-full p-2 text-center bg-[var(--button-color-1)];

		.header-link {
			@apply text-[var(--main-dark-text-color)];
		}
	}

	.comment-box {
		@apply pl-4 pr-4 pt-4 pb-4;

		.message {
			@apply bg-[var(--button-color-1)] p-4;
		}
	}

	&.CurrentGame {
		@apply bg-[initial];

		.content-box {
			@apply p-0;

			.info {
				@apply text-[var(--main-text-color)];

				a {
					@apply text-[var(--main-text-color)];
				}
			}
		}
	}
}
</style>
