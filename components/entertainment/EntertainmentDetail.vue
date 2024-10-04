<script setup>
import PageHeader from '@/components/layout/PageHeader.vue';
import TitleImage from '@/components/media/TitleImage.vue';
import EntertainmentInfo from '@/components/entertainment/EntertainmentInfo.vue';
import EntityUserActionsPanel from '@/components/actions/EntityUserActionsPanel.vue';
import SimpleTagsList from '@/components/tags/SimpleTagsList.vue';
import Head from '@/components/seo/Head.vue';
import MenuColumns from '@/components/menu/MenuColumns.vue';
import BlockWrapper from '@/components/blockEditor/editor/BlockWrapper.vue';

const props = defineProps({
	entity: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		default: 'Игры',
	},
});

import { api } from '@/composables/api.js'
import {provide, ref} from "vue";
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
	errorHandler,
} = api();

const route = useRoute();

const requestInProgress = ref(false);
const fetchedData = ref();

const { refresh } = await useAsyncData(
		async () => {
			let request = `${apiUrl.value}${props.entity}`;

			if (route.params.slug) {
				request += `/${route.params.slug}`;
			} else {
				throw createError({
					statusCode: 404,
					statusMessage: 'Page Not Found'
				});
			}

			const query = {};
			const sessionCookie = useCookie(sessionCookieName.value);

			requestInProgress.value = true;

			try {
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
								if (response.status === 200) {
									fetchedData.value = response._data.data;

									if (process.client && !sessionStorage.getItem(`view_${fetchedData.value.entity_type}_${fetchedData.value.id}`)) {
										sessionStorage.setItem(`view_${fetchedData.value.entity_type}_${fetchedData.value.id}`, true);
									}
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

const getBreadCrumbs = () => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: props.title,
			href: `/${splitedPath[1]}/`,
		},
		{
			name: fetchedData.value.name,
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
	];
}

// Обновление количества лайков
const updateLikes = (params) => {
	const { entityType, entityId, count } = params;
	fetchedData.value.likes = count;
}

// Открытие формы отправки комментариев
const commentsRef = ref(null);

const injectToggleContent = ref(null);
provide('injectToggleContent', injectToggleContent);

const openSendCommentForm = () => {
	commentsRef.value.$el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth', });
	injectToggleContent.value = true;
}
</script>

<template>
	<div v-if="fetchedData">
		<PageHeader
				:breadCrumbs="getBreadCrumbs()"
		/>
		<TitleImage
				v-if="fetchedData.title_image"
				:image="fetchedData.title_image"
				:title="fetchedData.name"
				:withoutBorder="true"
				parentClass="mb-[30px]"
		/>
		<EntertainmentInfo
			:game="fetchedData"
		/>

		<div class="additional-info">
			<div class="left-box">
				<div class="line-block" v-html="fetchedData.description" />
<!--				<ShortGallery-->
<!--						class="line-block"-->
<!--				/>-->

<!--				<ArticleShortList-->
<!--						class="line-block"/>-->
				<BlockWrapper
						v-for="(block, blockIndex) in fetchedData.blocks"
						:name="block.name"
						:structure="block.structure"
				/>
			</div>
			<div class="right-block">
				<div v-if="fetchedData.menu">
					<MenuGroup
							v-for="(group, key) in fetchedData.menu"
							:key="key"
							:group="group"
					/>
				</div>

<!--				<OpenCloseBox-->
<!--						:fields="menuItems"-->
<!--				/>-->
<!--				<OpenCloseBox-->
<!--						title="Руководства"-->
<!--						:fields="menuItems"-->
<!--				/>-->
				<SimpleTagsList
						class="tags-list"
						:tags="fetchedData.tags"
				/>
			</div>
		</div>

		<div class="article-footer">
			<div class="add-info">
				<div class="column-1"></div>
				<div class="column-2">
					<EntityUserActionsPanel
							:entityType="fetchedData.entity_type"
							:entityId="fetchedData.id"
							:voted="fetchedData.already_voted"
							:likes="fetchedData.likes"

							:commentsCount="fetchedData.comments_count"

							:views="fetchedData.views"

							:title="fetchedData.name"
							:description="fetchedData.description"
							:image="fetchedData.title_image?.src ? fetchedData.title_image?.src : null"

							@updateLikes="updateLikes"
							@openSendCommentForm="openSendCommentForm"
					/>
				</div>
			</div>
			<Comments
					:entityType="fetchedData.entity_type"
					:entityId="fetchedData.id"
					class="mt-5"
					ref="commentsRef"
					@refresh="refresh"
			/>
			<Head
				:seo="fetchedData.seo"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.additional-info {
	@apply md:grid grid-cols-5 pt-[var(--main-padding)];

	.left-box {
		@apply col-span-4 pr-[15px];

		div.line-block {
			@apply mb-[var(--main-padding)];
		}
	}

	.right-block {
		@apply col-span-1;

		.tags-list {
			@apply mt-4 mb-4;
		}
	}
}

.article-footer {
	.add-info {
		@apply w-full grid grid-cols-12;

		.column-1 {
			@apply col-span-6;
		}

		.column-2 {
			@apply col-span-6 text-right;
		}
	}
}
</style>
