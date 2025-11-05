<script setup>
import ThunderSlider from '@/components/sliders/ThunderSlider.vue';
import LightBox from '@/components/media/LightBox.vue'

import { lightBox } from '@/composables/lightBox.js';
const {
	openedImage,
	setOpenedImage
} = lightBox();

import { date } from '@/composables/date.js';
const {
	getFormattedDate
} = date();

const props = defineProps({
	game: {
		type: Object,
		default: {},
		required: true,
	},
});

const genres = computed(() => { return stringTransfer(props.game.genres); });
const platforms = computed(() => { return stringTransfer(props.game.platforms); });
const companies = computed(() => {
	let returnData = '';
	const obj = props.game.companies;

	for (let key in obj) {
		if (key > 0) returnData += ', ';
		returnData += `<span title="${obj[key].description ? obj[key].description : ''}">${obj[key].name} (${obj[key]?.company_role?.name})</span>`;
	}

	return returnData;
});
const anonsDates = computed(() => {
	let returnData = '';
	const obj = props.game.anons_dates;

	for (let key in obj) {
		if (key > 0) {
			returnData += ', ';
		}
		returnData += `<span title="${obj[key].description ? obj[key].description : ''}">${getFormattedDate('d ru_mouths_name Y', obj[key].date)}</span>`;

		/* Добавляем название платформы */
		if (obj[key]?.game_platform?.name) {
			returnData += ` (${obj[key]?.game_platform?.name})`;
		}

		if (obj[key].addInfo) {
			returnData += ` (${obj[key].addInfo})`;
		}
	}

	return returnData;
});
const releaseDates = computed(() => {
	let returnData = '';
	const obj = props.game.release_dates;

	for (let key in obj) {
		if (key > 0) {
			returnData += ', ';
		}
		returnData += `<span title="${obj[key].description ? obj[key].description : ''}">${getFormattedDate('d ru_mouths_name Y', obj[key].date)}</span>`;

		/* Добавляем название платформы */
		if (obj[key]?.game_platform?.name) {
			returnData += ` (${obj[key]?.game_platform?.name})`;
		}

		if (obj[key].addInfo) {
			returnData += ` (${obj[key].addInfo})`;
		}
	}

	return returnData;
});

const stringTransfer = (obj) => {
	let returnData = '';

	for (let key in obj) {
		if (key > 0) returnData += ', ';
		returnData += `<span title="${obj[key].description ? obj[key].description : ''}">${obj[key].name}</span>`;
	}

	return returnData;
}
</script>

<template>
	<div class="main-info">
		<div class="left-box">
			<span class="field" v-if="game.name"><b>Название:</b> {{ game.name }}</span>
			<span class="field" v-if="genres"><b>Жанр:</b> <span v-html="genres" /></span>
			<span class="field" v-if="platforms"><b>Платформа:</b> <span v-html="platforms" /></span>
			<span class="field" v-if="companies"><b>Компании:</b> <span v-html="companies" /></span>
			<span class="field" v-if="anonsDates"><b>Дата анонса:</b> <span v-html="anonsDates" /></span>
			<span class="field" v-if="releaseDates"><b>Дата выхода:</b> <span v-html="releaseDates" /></span>
			<template
					v-for="(field, key) in props.game.additional_fields"
					:key="key"
			>
				<span v-if="field.value" class="field">
					<b>{{ field.name }}:</b> {{ field.value }}
				</span>
			</template>
			<span
					v-if="game.links.length > 0"
					class="field"><b>Ссылки:</b>
				<ul>
					<li v-for="(link, key) in game.links" :key="key"><a :href="link.url" target="_blank" rel="nofollow">{{ link.name }}</a></li>
				</ul>
			</span>
		</div>
		<div class="right-box">
			<ThunderSlider
					:autoLoop="{
						delay: 10000,
						restart: 10000,
					}"
			>
				<template #nav-prev>
					<div id="nav-prev" class="nav-prev">
						<span><font-awesome-icon :icon="['fas', 'angle-left']" /></span>
					</div>
				</template>

				<template #nav-next>
					<div id="nav-next" class="nav-next">
						<span><font-awesome-icon :icon="['fas', 'angle-right']" /></span>
					</div>
				</template>

				<div
						class="slide w-full"
						v-for="(cover, index) in game.covers"
						:key="index"
				>
						<img
								:src="cover.src"
								:alt="cover.description"
								@click="setOpenedImage(cover)"
						>
				</div>
			</ThunderSlider>

			<LightBox
					v-if="openedImage"
					:image="openedImage"
					:setViewsLog="true"
					@setCurrentElement="setOpenedImage"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.main-info {
	@apply md:grid grid-cols-5;

	.left-box {
		@apply col-span-4;

		.field {
			@apply block pb-[0.8rem];

			ul {
				@apply ml-[1rem] mt-[0.5rem];

				li {
					@apply list-[disclosure-closed]
				}
			}

			a {
				@apply text-[var(--main-text-color)];
				//	Добавить стрелочку вверх к ссылке
			}
		}
	}

	.right-box {
		@apply col-span-1;

		.slider {
			.slide {
				@apply cursor-pointer;
			}

			.nav-next,
			.nav-prev {
				@apply
					absolute z-[1]
					cursor-pointer hidden
					text-[2rem]
				;

				top: calc(50% - 2rem);
				color: var(--main-text-color);

				&:hover {
					color: var(--third-hover-color);
				}

				span {
					@apply
						flex justify-center items-center
						bg-[var(--body-bg-color)]
						w-[3rem] h-[3rem] rounded-full;
				}
			}

			.nav-prev {
				@apply left-[10px];
			}

			.nav-next {
				@apply right-[10px];
			}

			&:hover .nav-prev,
			&:hover .nav-next {
				@apply block;
			}
		}
	}
}
</style>
