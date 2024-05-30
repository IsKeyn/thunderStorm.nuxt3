<script setup>
import { onMounted, onUnmounted, ref } from "vue";

import ArticleCard from '@/components/articles/ArticleCard.vue';
import PageHeader from '@/components/layout/PageHeader.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';

const props = defineProps({
	id: {
		type: String,
		default: 'article_list',
	},
	infinityScroll: {
		type: Boolean,
		default: false,
	},
	type: {
		type: Number,
		default: '',
	},
	title: {
		type: String,
		default: 'Статьи',
	},
	showPageHeader: {
		type: Boolean,
		default: true,
	},
});

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	getCsrfCookie,
	errorHandler,
} = api();

const fetchedData = ref([]);
const meta = ref({});
const perPage = ref(4);
const page = ref(1);
const filters = ref({
	type: props.type,
});

const requestInProgress = ref(false);

const { refresh } = await useAsyncData(
		async () => {
			let request = `${apiUrl.value}article/get`;

			const body = {
				perPage: perPage.value,
				page: page.value,
				filter: {},
			};

			const rawFilters = toRaw(filters.value);

			for (let key in rawFilters) {
				if (key === 'tags') {
					if (rawFilters[key].length > 0) {
						body.filter[key] = rawFilters[key];
					}
				} else {
					body.filter[key] = rawFilters[key];
				}
			}

			const sessionCookie = useCookie(sessionCookieName.value);
			requestInProgress.value = true;

			try {
				const csrfCookie = await getCsrfCookie();

				await $fetch(
						request,
						{
							method: 'POST',
							credentials: 'include',
							headers: {
								Accept: 'application/json',
								'X-XSRF-TOKEN': csrfCookie.value,
								Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
								Referer: publicUrl.value,
							},
							body,
							onResponse({response}) {
								if (response.status === 200) {
									console.log(response);
									fetchedData.value = fetchedData.value.concat(response._data.data);

									meta.value = response._data.meta;
								} else {
									// Возарщаем 404
								}

								requestInProgress.value = false;
							}
						},
				);
			} catch (e) {
				errorHandler(e);
				requestInProgress.value = false;
			}
		}
);

const getNextPage = async () => {
	if (meta.value.current_page < meta.value.last_page) {
		page.value = meta.value.current_page + 1
		refresh();
	}
}

onMounted(() => {
	if (props.infinityScroll) {
		window.addEventListener('scroll', scrollHandler);
	}
});

onUnmounted(() => {
	if (props.infinityScroll) {
		window.removeEventListener('scroll', scrollHandler);
	}
});

const scrollHandler = () => {
	const gallery = document.getElementById(props.id);

	if (gallery) {
		let bottomOfBlock = (gallery.offsetHeight + gallery.offsetTop) - (window.pageYOffset + window.innerHeight);

		if (bottomOfBlock <= 100 && !requestInProgress.value) {
			getNextPage();
		}
	}
}

const route = useRoute();

const getBreadCrumbs = () => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: props.title,
			href: `/${splitedPath[1]}/`,
		},
	];
}
</script>

<template>
	<PageHeader
			v-if="showPageHeader"
			:title="title"
			:breadCrumbs="getBreadCrumbs()"
	/>
	<div :id="id">
		<ArticleCard
				v-for="cardData in fetchedData"
				:cardData="cardData"
		/>
	</div>
	<div
			v-if="meta?.current_page < meta?.last_page"
			class="text-center"
	>
		<ActionButton
				buttonName="Показать ещё"
				:actionInProgress="requestInProgress"
				@startAction="getNextPage"
		/>
	</div>
</template>
