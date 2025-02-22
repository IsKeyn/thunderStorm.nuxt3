<script setup>
import GalleryType1Component from '@/components/media/GalleryType1Component.vue';
import ArticleDetail from '@/components/articles/ArticleDetail.vue';

const props = defineProps({
	getArticle: {
		type: Boolean,
		default: false,
	},
});

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
} = api();

const route = useRoute();

const fetchedData = ref();
const isLoading = ref(false);

// TODO обработка ошибок в запросе
const { refresh } = await useAsyncData(
		async () => {
			isLoading.value = true;

			let request = `${apiUrl.value}page/get/getByPath`;

			const query = {};

			if (route.fullPath) {
				query.full_path = route.fullPath;
			} else {
				// Возвращаем 404
			}

			const sessionCookie = useCookie(sessionCookieName.value);

			await $fetch(
					request,
					{
						method: 'GET',
						credentials: 'include',
						query,
						headers: {
							Accept: 'application/json',
							Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
							Referer: publicUrl.value,
						},
						onResponse({response}) {
							isLoading.value = false;

							if (response.status === 200) {
								fetchedData.value = response._data;

								// if (process.client && !sessionStorage.getItem(`view_${fetchedData.value.entity_type}_${fetchedData.value.id}`)) {
								// 	sessionStorage.setItem(`view_${fetchedData.value.entity_type}_${fetchedData.value.id}`, true);
								// }
							} else {
								// Возарщаем 404
							}
						}
					},
			);
		}
);
</script>

<template>
	<template v-if="!isLoading">
		<div v-if="fetchedData">
			<div v-if="fetchedData.type === 3">
				<GalleryType1Component
						v-if="fetchedData.mediaGroup"
						:groupID="fetchedData.mediaGroup"
						:loadOnScroll="false"
						:useFilter="true"
				/>
			</div>
		</div>
		<ArticleDetail v-else-if="getArticle" />
	</template>
</template>
