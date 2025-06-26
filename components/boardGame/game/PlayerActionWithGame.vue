<script setup>
import { computed } from "vue";

const emit = defineEmits(['setOpenedImage', 'showPlayer']);

import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

import { date } from '@/composables/date.js';
const {
	getFormattedDate,
	getFormattedHoursFromSeconds
} = date();

const props = defineProps({
	boardGameId: {
		type: Number,
		default: 1,
	},
	boardGameInfo: {
		type: Object,
		default: {},
	},
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
});

const getStatusName = (status) => {
	switch (status) {
		case 0: return 'Текущая';
		case 1: return 'Рерольнута';
		case 2: return 'Пройдена';
		case 3: return 'Отдана';
	}
}

const getPlayerById = (id) => {
	let player = props.boardGameInfo.players.filter((item) => item.user_id === id);

	if (player && player[0]) {
		return player[0];
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
</script>

<template>
	<div
			:class="['item-box', classes]"
			@click="$emit('showPlayer', element.user_id)"
	>
		<div class="status-bar">
			{{ getPlayerById(element.user_id).user.name }} - {{ getStatusName(element.status) }} <span v-if="getFormattedHoursFromSeconds(element.time)">(время прохождения {{ getFormattedHoursFromSeconds(element.time) }})</span> <span v-if="element.updated_at">({{ getFormattedDate('d.m.Y', element.updated_at) }})</span>
		</div>
		<div class="content-box">
			<div v-if="getPlayerById(element.user_id)">
				<img
						v-if="element.user_id && getPlayerById(element.user_id).user.avatar && getPlayerById(element.user_id).user.avatar"
						:src="getResizeImg(getPlayerById(element.user_id).user.avatar, 300)"
						:alt="getPlayerById(element.user_id).user.name"
						:title="getPlayerById(element.user_id).user.name"
						@click="emit('setOpenedImage', getPlayerById(element.user_id).user.avatar)"
				>
			</div>
			<div class="info">
				<div class="comment-box">
					<div class="message">
						{{ element.comment ? element.comment.message : 'Игрок не оставил комментария об игре' }}
					</div>
				</div>
<!--				<span class="name">-->
<!--					{{ element.game.game.name }} <span v-if="element.game.platform">({{ element.game.platform.name }})</span>-->
<!--				</span>-->
<!--				<div class="info-wrapper">-->
<!--					<div>-->
<!--						<span class="line-info" v-if="element.game.platform">Платформа: {{ element.game.platform.name }}</span>-->
<!--						<span class="line-info" v-if="element.game.game?.release_dates[0]?.date">Год релиза: {{ getFormattedDate('Y', element.game.game.release_dates[0].date) }}</span>-->
<!--						<span class="line-info" v-if="element.game.points !== null && element.game.points !== undefined">Очки за игру: {{ element.game.points }}</span>-->
<!--						<span-->
<!--								v-if="element.game.added_by && getPlayerById(element.game.added_by)"-->
<!--								class="line-info"-->
<!--								@click="$emit('showPlayer', element.game.added_by)"-->
<!--						>-->
<!--						Добавил: <span class="hover-line">{{ getPlayerById(element.game.added_by).user.name }}</span>-->
<!--					</span>-->
<!--						<span class="line-info" v-if="element.game.description">{{ element.game.description }}</span>-->
<!--					</div>-->
<!--					<div v-if="showInfoButtons">-->
<!--						<div class="mb-2">Ссылки:</div>-->
<!--						<ul>-->
<!--							<li>-->
<!--								<a-->
<!--										class="mr-[1rem]"-->
<!--										:href="getLongPlayLink()"-->
<!--										target="_blank"-->
<!--								>Лонгплей</a>-->
<!--							</li>-->
<!--							<li v-if="element.game.game.slug">-->
<!--								<a-->
<!--										class="mr-[1rem]"-->
<!--										:href="`/game/${element.game.game.slug}`"-->
<!--										target="_blank"-->
<!--								>Открыть страницу игры</a>-->
<!--							</li>-->
<!--						</ul>-->
<!--					</div>-->
<!--				</div>-->
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

	.content-box {
		@apply lg:flex w-full p-[1rem];

		img {
			@apply
				mx-auto mb-4 lg:m-0
				w-[150px] h-auto object-contain cursor-pointer
			;
		}

		.info {
			@apply w-full pl-3 pr-3 text-[var(--main-text-color)];

			.info-wrapper {
				@apply block lg:flex gap-6;
			}

			.name {
				@apply block mb-[1rem] uppercase;
			}

			.line-info {
				@apply block mb-[0.3rem];
			}
		}

		a {
			@apply text-[var(--main-text-color)];
		}
	}

	.status-bar {
		@apply w-full p-2 text-center bg-[var(--button-color-1)];
	}

	.comment-box {
		@apply pl-4 pr-4 pt-4 pb-4;

		.message {
			@apply bg-[var(--button-color-1)] p-4;
		}
	}
}
</style>
