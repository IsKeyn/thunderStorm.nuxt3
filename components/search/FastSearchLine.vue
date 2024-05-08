<script setup>
import { watch } from 'vue'

const searchTrottle = ref(false);
const searchField = ref('');
const searchResult = ref({});

watch(searchField, () => {
	fastSearchStart();
});

const fastSearchStart = () => {
	if (!searchTrottle.value) {
		searchTrottle.value = true;

		setTimeout(() => {
			searchTrottle.value = false;
			sendSearchRequest();
		}, 500);
	}
}

import { api } from '@/composables/api.js';
const { apiUrl, errorHandler } = api();

const requestInProgress = ref(false);
const responseErrors = ref({});

const Authorization = useCookie('Authorization');

const sendSearchRequest = async () => {
	requestInProgress.value = true;

	try {
		const response = await $fetch(
				`${apiUrl.value}search/${searchField.value}`,
				{
					method: 'GET',
					headers: {
						Authorization: Authorization.value,
						Accept: 'application/json',
						'X-Requested-With': 'XMLHttpRequest',
					},
				},
		);

		if (response) {
			searchResult.value = response;

			requestInProgress.value = false;
		}
	} catch (e) {
		const errorsPromise = errorHandler(e);

		errorsPromise.then((element) => {
			responseErrors.value = element;
		});
		requestInProgress.value = false;
	}
}

const emit = defineEmits(['showHideMenu']);

const routerLinkHandler = () => {
	searchField.value = '';
	emit('showHideMenu', false)
}
</script>

<template>
	<div class="search-wrapper">
		<div>
			<input
					type="text"
					placeholder="Начните вводить текст для поиска"
					v-model="searchField"
			>
			<font-awesome-icon
					v-if="searchField"
					:icon="['fas', 'xmark']"
					class="clear-button"
					@click="searchField = ''"
			/>
			<router-link :to="`/search/?q=${searchField}`">
				<font-awesome-icon
						:icon="['fas', 'magnifying-glass']"
						class="search-icon"
						@click="routerLinkHandler"
				/>
			</router-link>
		</div>
		<div
				v-if="searchField"
				class="search-result"
		>
			<template v-if="Object.keys(searchResult).length > 0">
				<div v-if="searchResult.articles?.data">
					<span class="title">Статьи</span>
					<div v-for="article in searchResult.articles.data">
						<router-link
								:to="article.code"
								@click="$emit('showHideMenu', false)"
						>
							{{ article.title }}
						</router-link>
					</div>
				</div>
				<div v-if="searchResult.youtube_videos">
					<span class="title">Видео</span>
					<div v-for="youtubeVideo in searchResult.youtube_videos?.data">
						<router-link
								:to="`/youtube/${youtubeVideo.video_id}`"
								@click="routerLinkHandler"
						>
							{{ youtubeVideo.title }}
						</router-link>
					</div>
				</div>
				<router-link
						:to="`/search/?q=${searchField}`"
						class="show-all"
						@click="routerLinkHandler"
				>
					Показать все
				</router-link>
			</template>
			<template v-else>
				По вашему запросу ничего не найдено
			</template>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.search-wrapper {
	@apply w-full relative;

	input {
		@apply w-full pr-[25px];
	}

	.search-icon {
		@apply absolute top-[8px] right-[3px];
		color: var(--main-text-color);
	}

	.clear-button {
		@apply absolute top-[6px] right-[26px] text-[21px] cursor-pointer;
	}
}

.search-result {
	@apply absolute bg-[var(--main-bg-color)] pr-[10px] pb-[10px] pl-[10px] z-[700] left-[-10px];
	width: calc(100% + 20px);
	top: calc(100% + 3px);

	.title {
		@apply font-semibold w-full block mb-[10px] pb-[10px] pt-[10px];

		border-bottom: 1px solid  var(--second-border-color);
	}

	.show-all {
		@apply block text-center p-[5px] mt-[10px] cursor-pointer;
		color: var(--main-text-color);

		&:hover {
			@apply bg-[var(--second-bg-color)] no-underline;
		}
	}
}
</style>
