<script setup>
import { provide, markRaw } from 'vue'

import PageHeader from '@/components/layout/PageHeader.vue';
import EntityUserActionsPanel from '@/components/actions/EntityUserActionsPanel.vue';
import TitleImage from '@/components/media/TitleImage.vue';
import SimpleTagsList from '@/components/tags/SimpleTagsList.vue';
import Head from '@/components/seo/Head.vue';
import BlockWrapper from '@/components/blockEditor/editor/BlockWrapper.vue';

const props = defineProps({
	type: {
		type: Number,
		default: 0,
	},
	sendFullPath: {
		type: Boolean,
		default: true,
	},
	title: {
		type: String,
		default: 'Статьи',
	},
	showTags: {
		type: Boolean,
		default: true,
	},
	entityType: {
		type: String,
		required: true,
	},
	entityId: {
		type: Number,
		required: true,
	},
});

import { date } from '@/composables/date.js';
const {
	getFormattedDate
} = date();

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	sessionCookieName,
} = api();

const route = useRoute();

const fetchedData = ref();

// TODO обработка ошибок в запросе
const { refresh } = await useAsyncData(
		async () => {
			let request = `${apiUrl.value}article/get`;

			if (route.params.slug) {
				request += `/${route.params.slug}`;
			} else {
				// Возвращаем 404
			}

			const query = {};

			if (Number.isInteger(props.type)) {
				query.type = props.type;
			}

			if (props.sendFullPath) {
				query.full_path = route.fullPath;
			}

			if (props.entityType) {
				query.entity_type = props.entityType;
			}

			if (props.entityId) {
				query.entity_id = props.entityId;
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
							if (response.status === 200) {
								fetchedData.value = response._data;

								if (process.client && !sessionStorage.getItem(`view_${fetchedData.value.entity_type}_${fetchedData.value.id}`)) {
									sessionStorage.setItem(`view_${fetchedData.value.entity_type}_${fetchedData.value.id}`, true);
								}
							} else {
								// Возарщаем 404
							}
						}
					},
			);
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

const updateLikes = (params) => {
	const { entityType, entityId, count } = params;
	fetchedData.value.likes = count;
}

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
				:title="fetchedData.name"
				:breadCrumbs="getBreadCrumbs()"
		/>
		<div class="article-box">
			<TitleImage
				v-if="fetchedData.image"
				:image="fetchedData.image"
				parentClass="mt-[30px] mb-[30px]"
			/>
			<div class="article-header">
				<div class="column-1">
					<SimpleTagsList
							class="tags-list"
							v-if="showTags"
							:tags="fetchedData.tags"
							theme="string"
					/>
				</div>
				<div class="column-2"><span class="publisher-time">{{ getFormattedDate('d ru_mouths_name Y', fetchedData.created_at) }}</span></div>
			</div>
			<div class="article-body">
				<div v-html="fetchedData.text_full" />
				<BlockWrapper
						v-for="(block, blockIndex) in fetchedData.blocks"
						:name="block.name"
						:structure="block.structure"
				/>
				<div
						v-if="fetchedData.show_author && fetchedData.author"
						class="author"
				>
					<b>Автор:</b> {{ fetchedData.author.name }}
				</div>
				<div
						v-if="fetchedData.show_editor && fetchedData.editor"
						class="editor"
				>
					<b>Редактор:</b> {{ fetchedData.editor.name }}
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
								:description="fetchedData.name"
								:image="fetchedData.image"

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
			</div>
		</div>
		<Head
				:seo="fetchedData.seo"
		/>
	</div>
</template>

<style lang="scss" scoped>
.article-box {
	.article-header {
		@apply grid grid-cols-12;

		.column-1 {
			@apply col-span-8;
		}

		.column-2 {
			@apply col-span-4 text-right;
		}
	}

	.article-body {
		@apply mb-4;
		//@apply min-h-[350px];

		.author, .editor {
			@apply text-right;
		}
	}

	.article-footer {
		.add-info {
			@apply w-full block lg:grid grid-cols-12;

			.column-1 {
				@apply col-span-6;
			}

			.column-2 {
				@apply col-span-6 text-right;
			}
		}
	}
}
</style>
