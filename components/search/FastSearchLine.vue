<script setup>
import { watch } from 'vue'

const emit = defineEmits(['showHideMenu']);

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
} = api();


const props = defineProps({
	placeholder: {
		type: String,
		default: 'Поиск',
	},
	clearButtonUseActivateLinkHandler: { // Не лучшее решение, но используется в MobileSearchPanel.vue
		type: Boolean,
		default: false,
	}
});

// const searchTrottle = ref(false);
const searchField = ref('');
const searchResult = ref({});
const showClearButton = ref(false);

if (props.clearButtonUseActivateLinkHandler) {
	showClearButton.value = true;
}

watch(searchField, (value) => {
	if (value) {
		if (!props.clearButtonUseActivateLinkHandler) {
			showClearButton.value = true;
		}

		fastSearchStart();
	} else {
		if (!props.clearButtonUseActivateLinkHandler) {
			showClearButton.value = false;
		}

		searchResult.value = {};
	}
});

const searchTimeout = ref(null);

const fastSearchStart = () => {
	clearTimeout(searchTimeout.value);

	searchTimeout.value = setTimeout(() => {
		sendSearchRequest();
	}, 500);
}

const requestInProgress = ref(false);
const responseErrors = ref({});

const sendSearchRequest = async () => {
	requestInProgress.value = true;

	const sessionCookie = useCookie(sessionCookieName.value);

	try {
		const response = await $fetch(
				`${apiUrl.value}search/${searchField.value}`,
				{
					method: 'GET',
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
						Referer: publicUrl.value,
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

const routerLinkHandler = () => {
	searchField.value = '';
	emit('parentHandler', false)
}

const router = useRouter();

const submitHandler = () => {
	const searchValue = searchField.value;
	routerLinkHandler();

	router.push({
		path: `/search/`,
		query: { q: searchValue }
	});
}

const clearField = () => {
	if (props.clearButtonUseActivateLinkHandler) {
		routerLinkHandler();
	}

	searchField.value = '';
}

const articleEntity = 'App\\Models\\Article';
const youTubeEntity = 'App\\Models\\YoutubeVideo';
</script>

<template>
	<div class="search-wrapper">
		<form @submit.prevent="submitHandler">
			<input
					type="text"
					:placeholder="placeholder"
					v-model="searchField"
			>
			<div class="icon-box">
				<font-awesome-icon
						v-if="showClearButton"
						:icon="['fas', 'xmark']"
						class="icon clear-button"
						@click="clearField"
				/>
				<button>
					<font-awesome-icon
							:icon="['fas', 'magnifying-glass']"
							class="icon search-icon"
					/>
				</button>
			</div>
		</form>
		<div
				v-if="searchField"
				class="search-result"
		>
			<template
					v-if="Object.keys(searchResult).length > 0 && (searchResult[articleEntity]?.data && searchResult[articleEntity]?.data.length > 0) || (searchResult[youTubeEntity]?.data && searchResult[youTubeEntity]?.data.length > 0)"
			>
				<div v-if="searchResult[articleEntity]?.data && searchResult[articleEntity]?.data.length > 0">
					<span class="title">Статьи</span>
					<div v-for="article in searchResult[articleEntity].data">
						<router-link
								:to="`/${article.type}/${article.slug}`"
								@click="$emit('showHideMenu', false)"
						>
							{{ article.name }}
						</router-link>
					</div>
				</div>
				<div v-if="searchResult[youTubeEntity]?.data && searchResult[youTubeEntity]?.data.length > 0">
					<span class="title">Видео</span>
					<div v-for="youtubeVideo in searchResult[youTubeEntity]?.data">
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
		@apply w-full pr-[55px];
	}

	.icon-box {
		@apply
			absolute top-0 right-0
			flex items-center
		;

		.icon {
			@apply cursor-pointer
			text-[28px]
			inline
			;
		}

		.clear-button {
			@apply mr-[10px];
		}

		button {
			.search-icon {
				@apply text-[20px];
			}
		}
	}
}

.search-result {
	@apply
		absolute z-[700] left-[-20px] lg:left-[-10px]
		bg-[var(--main-bg-color)]
		pr-[20px] lg:pr-[10px] pb-[10px] pl-[20px] lg:pl-[10px];

	width: calc(100% + 40px);

	@media (min-width: 1024px) {
		width: calc(100% + 20px);
	}

	top: calc(100% + 3px);

	.title {
		@apply font-semibold w-full block mb-[10px] pb-[10px] pt-[10px] text-[16px];

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
