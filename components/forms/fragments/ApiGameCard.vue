<script setup>
const emit = defineEmits(['addGame', 'checkGame']);

import { date } from '@/composables/date.js';
const {
	getFormattedDate,
} = date();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	theme: { // default , PlayerActionWithGame , CurrentGame
		type: String,
		default: 'default',
	},
	showCover: {
		type: Boolean,
		default: true,
	},
});

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

const apiMoreInfoLinks = [
	{
		key: 'gametypes',
		name: 'gametypes',
	},
	{
		key: 'platforms',
		name: 'Платформы',
	},
	{
		key: 'regions',
		name: 'Регионы',
	},
	{
		key: 'genres',
		name: 'Жанры',
	},
	{
		key: 'engines',
		name: 'Движки',
	},
	{
		key: 'developers',
		name: 'Разработчики',
	},
	{
		key: 'publishers',
		name: 'Издатели',
	},
];

const openInNewWindow = (url) => {
	window.open(url, '_blank');
}
</script>

<template>
	<div :class="['item-box',  getStatusClass(element.status), theme]">
		<div class="content-box">
			<img
					v-if="showCover && element.cover"
					:src="element.cover"
					:alt="element.name"
					:title="`Обложка ${element.name}`"
					@click="openInNewWindow(element.cover)"
			>

			<div class="info">
				<span
						v-if="theme === 'default' || theme === 'CurrentGame'"
						class="name"
				>
					{{ element.name }} <a v-if="element.id" :href="`https://www.speedrun.com/api/v1/games/${element.id}`" target="_blank" title="Открыть API ссылку">Открыть API ссылку</a>
				</span>
				<div
						v-if="theme === 'default' || theme === 'CurrentGame'"
						class="info-wrapper"
				>
					<div>
						<span class="line-info" v-if="element.date">Дата релиза: {{ getFormattedDate('d ru_mouths_name Y', element.date) }}</span>
						<span class="line-info" v-if="element.japanese_name">Название на японском: {{ element.japanese_name }}</span>
						<span class="line-info" v-if="element.twitch_name">Название на Twitch: {{ element.twitch_name }}</span>
						<span class="line-info" v-if="element.weblink">Ссылка на speedrun.com: <a :href="element.weblink" target="_blank">{{ element.weblink }}</a></span>
						<span class="line-info" v-if="element.romhack">Ромхак: {{ element.romhack }}</span>

						<template v-if="apiMoreInfoLinks && apiMoreInfoLinks?.length">
							<template
									v-for="(apiData, key) in apiMoreInfoLinks"
									:key="key"
							>
								<span
										class="mb-[0.3rem] flex flex-wrap gap-2"
										v-if="element[apiData.key] && element[apiData.key].length"
								>
									{{ apiData.name }}:
									<a
											v-for="(id, k) in element[apiData.key]"
											:key="k"
											:href="`https://www.speedrun.com/api/v1/${apiData.key}/${id}`"
											target="_blank"
											class="mr-2"
									>{{ id }}</a>
								</span>
							</template>
						</template>

					</div>
				</div>
			</div>

			<img
					v-if="element.foreground"
					:src="element.foreground"
					:alt="element.name"
					:title="`Картинка переднего плана ${element.name}`"
					class="mr-2"
					@click="openInNewWindow(element.foreground)"
			>

			<img
					v-if="element.background"
					:src="element.background"
					:alt="element.name"
					:title="`Бекграунд картинка ${element.name}`"
					@click="openInNewWindow(element.background)"
			>
		</div>
		<div>
			<button
					class="btn btn-simple flex-end mr-2"
					@click="$emit('checkGame', element.id)"
			>
				Проверить наличие игры на сайте
			</button>
			<button
					class="btn btn-simple flex-end"
					@click="$emit('addGame', element.id)"
			>
				Добавить
			</button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.item-box {
	@apply
		block p-0
		bg-[var(--second-bg-color)] w-full mb-2  p-[1rem]
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
		@apply lg:flex w-full;

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
