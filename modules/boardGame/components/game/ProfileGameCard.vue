<script setup>
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
	getFormattedHoursFromSeconds
} = date();

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
});

const getStatusName = (status) => {
	switch (status) {
		case 0: return 'Текущая';
		case 1: return 'Рерольнута';
		case 2: return 'Пройдена';
		case 3: return 'Отдана';
	}
}

const getStatusClass = (status) => {
	switch (status) {
		case 0: return '';
		case 1: return 'red';
		case 2: return 'green';
		case 3: return 'blue';
	}
}

const getPlayerById = (id) => {
	if (props.players) {
		let player = props.players.filter((item) => item.user_id === id);

		if (player && player[0]) {
			return player[0];
		}
	}
};

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
	<div :class="['item-box',  getStatusClass(element.status)]">
		<div :class="['status-bar']">
			{{ getStatusName(element.status) }} <span v-if="getFormattedHoursFromSeconds(element.time)">(время прохождения {{ getFormattedHoursFromSeconds(element.time) }})</span> <span v-if="element.updated_at">({{ getFormattedDate('d.m.Y', element.updated_at) }})</span>
		</div>
		<div class="content-box">
			<img
					v-if="element.game.game.covers && element.game.game.covers[0]"
					:src="getResizeImg(element.game.game.covers[0], 300)"
					:alt="element.game.game.name"
					:title="element.game.game.name"
					@click="layoutMethods.setOpenedImage(element.game.game.covers[0])"
			>
			<div class="info">
				<span class="name">
					{{ element.game.game.name }} <span v-if="element.game.platform">({{ element.game.platform.name }})</span>
				</span>
				<div class="info-wrapper">
					<div>
						<span class="line-info" v-if="element.game.platform">Платформа: {{ element.game.platform.name }}</span>
						<span class="line-info" v-if="element.game.game?.release_dates[0]?.date">Год релиза: {{ getFormattedDate('Y', element.game.game.release_dates[0].date) }}</span>
						<span class="line-info" v-if="element.game.points !== null && element.game.points !== undefined">Очки за игру: {{ element.game.points }}</span>
						<span
								v-if="element.game.added_by && element.user"
								class="line-info"
								@click="$emit('showPlayer', element.game.added_by)"
						>
							Добавил: <router-link :to="`/e/${route.params.slug}/player/${element.user.name}`" class="hover-line">{{ element.user.name }}</router-link>
						</span>
						<span class="line-info" v-if="element.game.description">{{ element.game.description }}</span>
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
			</div>
		</div>
		<div
				v-if="element.comment"
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

	&.red {
		border-left: 8px solid #600000;
	}

	&.green {
		border-left: 8px solid #005d00;
	}

	&.blue {
		border-left: 8px solid #000460;
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
			@apply pl-3 pr-3 text-[var(--main-text-color)];

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
