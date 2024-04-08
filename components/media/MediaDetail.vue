<script setup>
import PageHeader from '@/components/layout/PageHeader.vue';
import LightBox from '@/components/media/LightBox.vue'
import SimpleTagsList from '@/components/tags/SimpleTagsList.vue';
import Comments from '@/components/comments/Comments.vue';
import Likes from '@/components/voting/Likes.vue';

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
} = api();

const route = useRoute();

const Authorization = useCookie('Authorization');

const fetchedData = ref('');

const { refresh } = await useAsyncData(
		async () => {
			let request = `${apiUrl.value}media/get`;

			if (Number.isInteger(Number(route.params.slug))) {
				request += `/${route.params.slug}`;
			} else {
				// Возвращаем 404
			}

			const sessionCookie = useCookie(sessionCookieName.value);

			await $fetch(
					request,
					{
						method: 'GET',
						credentials: 'include',
						headers: {
							// Authorization: Authorization.value,
							Accept: 'application/json',
							// 'X-Requested-With': 'XMLHttpRequest',
							Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
							Referer: publicUrl.value,
						},
						onResponse({response}) {
							if (response.status === 200) {
								fetchedData.value = response._data.data;

								if (!sessionStorage.getItem(`view_${fetchedData.value.entity_type}_${fetchedData.value.id}`)) {
									sessionStorage.setItem(`view_${fetchedData.value.entity_type}_${fetchedData.value.image.id}`, true);
								}
							} else {
								// Возарщаем 404
							}
						}
					},
			);
		}
);

const { getTitle, getBreadCrumbs } = pageHeader(fetchedData);
const { openedImage, setOpenedImage } = lightBox(fetchedData);

function lightBox(fetchedData) {
	const openedImage = ref(null);

	const setOpenedImage = (item = null) => {
		openedImage.value = item;
	}

	return {
		openedImage,
		setOpenedImage
	};
}

function pageHeader(fetchedData) {
	const getTitle = () => {
		let title = 'Детальная галереи'

		if (fetchedData.value?.name)
			title = fetchedData.value.name;

		return title;
	}

	const getBreadCrumbs = () => {
		const splitedPath = route.path.split('/');

		return [
			{
				name: 'Галерея',
				href: `/${splitedPath[1]}/`,
			},
			{
				name: `${fetchedData.value?.name ? fetchedData.value.name : 'Детальная'}`,
				href: `/${splitedPath[1]}/${splitedPath[2]}`,
			},
		];
	}

	return {
		getTitle,
		getBreadCrumbs,
	};
}
</script>

<template>
	<div v-if="fetchedData">
		<PageHeader
				:title="getTitle()"
				:breadCrumbs="getBreadCrumbs()"
		/>
		<div class="detail-parent">
			<div class="image-box">
				<img
						class="media"
						:src="fetchedData.src"
						:title="fetchedData.name"
						:alt="fetchedData.description"
						@click="setOpenedImage(fetchedData)"
				>
			</div>
			<div class="info-box">
				<div class="col-span-6">
					<div
							class="field"
							v-if="fetchedData.description"
					>
						<span class="font-semibold">Описание:</span> {{ fetchedData.description }}
					</div>
					<div
							class="field"
							v-if="fetchedData.user_info"
					>
						<span class="font-semibold">Автор:</span> 	<router-link :to="`/profile/${fetchedData.user_info.name}/`">{{ fetchedData.user_info.name }}</router-link>
					</div>
					<div
							class="field"
							v-if="fetchedData.created_at"
					>
						<span class="font-semibold">Дата добавления:</span> {{ getFormattedDate('d ru_mouths_name Y', fetchedData.created_at) }}
					</div>
					<div
							class="field"
							v-if="fetchedData.comments_count"
					>
						<span class="font-semibold">Количество комментариев:</span> {{ fetchedData.comments_count }}
					</div>
				</div>
				<div class="col-span-2">
					<Likes
							:entityType="fetchedData.entity_type"
							:entityId="fetchedData.id"
					/>
				</div>
				<div class="col-span-4">
					<div
							class="field"
							v-if="fetchedData.tags"
					>
						<SimpleTagsList
							:tags="fetchedData.tags"
							parentClasses="text-right"
						/>
					</div>
				</div>
			</div>
		</div>

		<Comments
				:entityType="fetchedData.entity_type"
				:entityId="fetchedData.id"
				class="mt-5"
				@refresh="refresh"
		/>
		<LightBox
				v-if="openedImage"
				:image="openedImage"
				:showCommentBox="false"
				@setCurrentElement="setOpenedImage"
		/>
	</div>
</template>

<style lang="scss" scoped>
.detail-parent {
	.image-box {
		@apply text-center;

		img.media {
			@apply inline-block max-h-[900px] max-w-full cursor-pointer;
		}
	}

	.info-box {
		@apply mt-3 grid grid-cols-12;

		.field {
			@apply mb-3;
		}
	}
}
</style>
