<script setup>
import SearchLine from '@/components/search/SearchLine.vue';
import ArticleCard from '@/components/articles/ArticleCard.vue';
import YouTubeCard from '@/components/youtube/YouTubeCard.vue';
import Pagination from '@/components/navigation/Pagination.vue';

import { watch } from 'vue'
const route = useRoute();

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
} = api();

import { notifications } from '@/composables/notifications.js';
const {
	alert,
	error
} = notifications();

const searchQuery = ref(null);
const searchError = ref(null);
const searchResult = ref({});

const entityList = ref(
		{
			Article: {
				title: 'Результат поиска по материалам',
				entity_type: 'App\\Models\\Article',
				card: ArticleCard,
				isLoading: false,
			},
			YouTube: {
				title: 'Результат поиска по видео',
				entity_type: 'App\\Models\\YoutubeVideo',
				card: YouTubeCard,
				isLoading: false,
			},
		}
);

watch(() => route.query.q,(newValue) => {
	if (searchQuery.value !== newValue) {
		searchQuery.value = newValue;
		initSearch();
	}
}, { deep: true });

const initSearch = () => {
	searchError.value = null;
	getSearchData();
}

const requestInProgress = ref(false);
const responseErrors = ref({});

const getSearchData = async (table = null, useScroll) => {
	if (searchQuery.value) {
		requestInProgress.value = true;

		const sessionCookie = useCookie(sessionCookieName.value);

		const query = {
			page: 1,
			perPage: 5,
		};

		if (table) {
			entityList.value[table].isLoading = true;

			query.entity = entityList.value[table].entity_type;

			if (entityList.value[table].page) {
				query.page = entityList.value[table].page;
			}

			if (entityList.value[table].perPage) {
				query.perPage = entityList.value[table].perPage;
			}
		}

		try {
			const response =	await $fetch(
					`${apiUrl.value}search/${searchQuery.value}`,
					{
						method: 'GET',
						credentials: 'include',
						headers: {
							Accept: 'application/json',
							Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
							Referer: publicUrl.value,
							'X-Requested-With': 'XMLHttpRequest',
						},
						query,
					},
			);

			if (response) {
				if (table) {
					searchResult.value[entityList.value[table].entity_type] = response;
					entityList.value[table].isLoading = false;

					if (useScroll) {
						document.getElementById(table).scrollIntoView({ behavior: 'smooth', block: 'start' });
					}
				} else {
					searchResult.value = response;
				}

				requestInProgress.value = false;
			}
		} catch (e) {
			const errorsPromise = errorHandler(e);

			errorsPromise.then((element) => {
				responseErrors.value = element;
			});

			if (table) {
				entityList.value[table].isLoading = false;
			}
			requestInProgress.value = false;
		}
	} else {
		searchError.value = 'Строка поиска пуста'
	}
}

if (route.query.q) {
	searchQuery.value = route.query.q;
	let useSplitRequest = false;

	for (const key in route.query) {
		if (key !== 'q') {
			if (key.includes('page')) {
				const table = key.split('_')[0];

				if (entityList.value[table]) {
					entityList.value[table].page = route.query[key];
					useSplitRequest = true;
				}
			}

			if (key.includes('perPage')) {
				const table = key.split('_')[0];

				if (entityList.value[table]) {
					entityList.value[table].perPage = route.query[key];
					useSplitRequest = true;
				}
			}
		}
	}

	if (useSplitRequest) {
		for (const key in entityList.value) {
			getSearchData(key);
		}
	} else {
		initSearch();
	}
}

const changePage = async (page, table) => {
	entityList.value[table].page = page;
	getSearchData(table, true);
}

const setPerPage = (count, table) => {
	entityList.value[table].perPage = count;
	getSearchData(table);
}

const perPageOptionsProp = ref([
	{
		count: 5,
		active: false,
	},
	{
		count: 10,
		active: false,
	},
	{
		count: 25,
		active: false,
	},
	{
		count: 50,
		active: false,
	},
],);
</script>

<template>
	<div>
		<SearchLine />
		<div class="search-result">
			<div v-for="(entity, key) in entityList">
				<div v-if="searchResult[entity.entity_type] && searchResult[entity.entity_type].data.length > 0">
					<div :id="key">
						<h3 class="title">{{ entity.title }}</h3>
						<template v-if="!entity.isLoading">
							<div
									v-for="(search, index) in searchResult[entity.entity_type].data"
									:key="index"
							>
								<Component
										v-if="entity.card"
										:is="entity.card"
										:cardData="search"
								/>
							</div>
						</template>
						<font-awesome-icon
								v-else
								:icon="['fas', 'spinner']"
								spin-pulse
						/>
						<Pagination
								v-if="searchResult[entity.entity_type].pagination"
								:pagination="searchResult[entity.entity_type].pagination"
								:table="key"
								:navigationButtons="true"
								:perPageOptionsProp="perPageOptionsProp"
								@changePage="changePage"
								@setPerPage="setPerPage"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.search-result {
	.title {
		@apply uppercase mt-[20px] mb-[20px];
	}
}
</style>
