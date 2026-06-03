<script setup>
import PageHeader from '@/components/layout/PageHeader.vue';
import ArticleCard from '@/components/articles/ArticleCard.vue';
import ActionButton from '@/components/layout/buttons/ActionButton.vue';

import { onMounted, onUnmounted, ref } from "vue";

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

import { helper } from '@/composables/helper.js'
const { route } = helper();

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
		default: null,
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

const perPage = ref(4);
const page = ref(1);
const filters = ref({
	type: props.type,
});

const requestName = props.id;

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			const query = {
				perPage: perPage.value,
				page: page.value,
				filter: {},
			};

			const rawFilters = toRaw(filters.value);

			for (let key in rawFilters) {
				if (key === 'tags') {
					if (rawFilters[key].length > 0) {
						query.filter[key] = rawFilters[key];
					}
				} else {
					query.filter[key] = rawFilters[key];
				}
			}

			const requestUrl = 'article/get';

			const response = await Promise.resolve(
					sendApiRequest(requestUrl, 'POST', query, requestName, '')
			);

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const articles = ref([]);
const meta = ref({});

watch(() => requestData.value, (newData) => {
	if (newData?.data) {
		articles.value = articles.value.concat(newData.data);
		meta.value = newData.meta;
	}
}, { immediate: true })

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
	const block = document.getElementById(props.id);

	if (block) {
		let bottomOfBlock = (block.offsetHeight + block.offsetTop) - (window.pageYOffset + window.innerHeight);

		if (bottomOfBlock <= 100 && !requestInProgress.value) {
			getNextPage();
		}
	}
}

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
				v-for="cardData in articles"
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
