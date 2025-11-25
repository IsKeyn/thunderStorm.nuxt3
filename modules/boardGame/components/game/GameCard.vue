<script setup>
import PublicAvatar from '@/components/user/avatar/PublicAvatar.vue';
import Timer from '@/modules/boardGame/components/timer/Timer.vue';

import { inject } from "vue";

const route = useRoute();

const layoutMethods = inject('layoutMethods')

import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

import { date } from '@/composables/date.js';
const {
	getFormattedDate,
	getFormattedHoursFromSeconds,
	twoDigits,
} = date();

import { userFunctions } from '@/composables/userFunctions.js';
const {
	userStore,
} = userFunctions();

import { boardGame } from '@/composables/BoardGame/boardGame.js'
const {
	addTextToPoints
} = boardGame();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	classes: {
		type: String,
		default: '',
	},
	showInfoButtons: {
		type: Boolean,
		default: true,
	},
	showStatusBar: {
		type: Boolean,
		default: true,
	},
	theme: { // default , PlayerActionWithGame , CurrentGame
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
	pointsForFinishGame: {
		type: Number,
		default: 0,
	},
});

const getStatusName = (status) => {
	switch (status) {
		case 0: return 'Текущая';
		case 1: return 'Рерольнута';
		case 2: return 'Пройдена';
		case 3: return 'Отдана';
		case 4: return 'В очереди';
	}
}

const getStatusClass = (status) => {
	if (props.theme === 'CurrentGame') return;

	switch (status) {
		case 0: return 'violet';
		case 1: return 'red';
		case 2: return 'green';
		case 3: return 'blue';
		case 4: return 'yellow';
	}
}

const getLongPlayLink = () => {
	let urlSearch = 'https://www.youtube.com/results?search_query=';
	urlSearch += ' ' + props.element.game.game.name;

	if (props.element.game.platform) {
		urlSearch += ' ' + props.element.game.platform.name;
	}

	urlSearch += ' longplay';

	return urlSearch;
}

const getHours = (minutes) => {
	let formattedTime = '';

	formattedTime += twoDigits(Math.floor(minutes / 60)) + ':' + twoDigits(minutes % 60);

	return formattedTime;
}
</script>

<template>
	<div :class="['item-box',  getStatusClass(element.status), theme]">
		<div
				v-if="showStatusBar"
				:class="['status-bar']"
		>
			<span v-if="theme === 'PlayerActionWithGame'"><router-link
					:to="`/e/${route.params.slug}/player/${element.user.name}`"
					target="_blank"
					class="header-link"
					title="Открыть профайл"
			>{{ element.user.name }}</router-link> - </span>{{ getStatusName(element.status) }} <span v-if="getFormattedHoursFromSeconds(element.time)">(время прохождения {{ getFormattedHoursFromSeconds(element.time) }})</span> <span v-if="element.updated_at">({{ getFormattedDate('d.m.Y', element.updated_at) }})</span>
		</div>
		<div class="content-box">
			<img
					v-if="showCover && element.game.game.covers && element.game.game.covers[0]"
					:src="getResizeImg(element.game.game.covers[0], 300)"
					:alt="element.game.game.name"
					:title="element.game.game.name"
					@click="layoutMethods.setOpenedImage(element.game.game.covers[0])"
			>
			<PublicAvatar
					v-if="theme === 'PlayerActionWithGame'"
					:user="element.user"
					:useLightBox="true"
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
						<span class="line-info" v-if="element.game.game?.release_dates[0]?.date">Год релиза: {{ getFormattedDate('Y', element.game.game.release_dates[0].date) }}</span>
						<span class="line-info" v-if="element.game.points !== null && element.game.points !== undefined">Очки за игру: {{ element.game.computed_points ? element.game.computed_points : element.game.points }}</span>
						<span
								v-if="element.game.added_by && element.game.added_by_user.name"
								class="line-info"
						>
							Добавил: <router-link
								:to="`/e/${route.params.slug}/player/${element.game.added_by_user.name}`"
								class="hover-line"
								title="Открыть профайл"
						>{{ element.game.added_by_user.name }}</router-link>
						</span>
						<span class="line-info" v-if="element?.game?.source">Источник: {{ element.game.source }}</span>
						<span
								class="line-info"
								v-if="element?.game?.difficult && element.game.difficult !== '0'"
						>
							Сложность: {{ element.game.difficult }}%
						</span>
						<span
								class="line-info"
								v-if="element?.game?.game_completion_time && element.game.game_completion_time !== '0'"
						>
							Время прохождения (HLTB): {{ getHours(element.game.game_completion_time) }}
						</span>
						<span
								class="line-info"
								v-if="pointsForFinishGame"
						>
							С учетом вашего стрика x{{ streak }} за прохождение игры вы получите {{ addTextToPoints(pointsForFinishGame) }}
						</span>
						<span
								class="line-info mt-4"
								v-if="element.game.description"
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
										:href="getLongPlayLink()"
										target="_blank"
								>Лонгплей</a>
							</li>
							<li v-if="element.game.game.slug">
								<a
										class="mr-[1rem]"
										:href="`/game/${element.game.game.slug}`"
										target="_blank"
								>Открыть страницу игры</a>
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
		bg-[var(--second-bg-color)] rounded w-full mb-2
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

		img {
			@apply
				mx-auto mb-4 lg:m-0
				w-[150px] h-auto object-contain cursor-pointer
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
