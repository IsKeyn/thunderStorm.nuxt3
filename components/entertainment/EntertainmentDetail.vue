<script setup>
import PageHeader from '@/components/layout/PageHeader.vue';
import TitleImage from '@/components/media/TitleImage.vue';
import EntertainmentInfo from '@/components/entertainment/EntertainmentInfo.vue';
import EntityUserActionsPanel from '@/components/actions/EntityUserActionsPanel.vue';
import SimpleTagsList from '@/components/tags/SimpleTagsList.vue';
import Head from '@/components/seo/Head.vue';
import MenuColumns from '@/components/menu/MenuColumns.vue';
import BlockWrapper from '@/components/blockEditor/editor/BlockWrapper.vue';

import { computed, provide, ref } from "vue";

import { api } from '@/composables/api.js'
const { sendApiRequest, show404pageFunc } = api();

import { helper } from '@/composables/helper.js'
const { route } = helper();

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

const requestName =  props.entity + 'EntertainmentDetail';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (!route.params.entertainment) {
				show404pageFunc();
			}

			const response = await Promise.resolve(
					sendApiRequest(
							`${props.entity}/${route.params.entertainment}`,
							'GET',
							{},
							requestName,
							'',
							'useAsyncData',
							false,
							true,
					)
			);

			return response || null;
		},
		{
			server: true,
			lazy: true,
		}
);

const fetchedData = computed(() => requestData.value || []);

if (process.client && !sessionStorage.getItem(`view_${fetchedData.value.entity_type}_${fetchedData.value.id}`)) {
	sessionStorage.setItem(`view_${fetchedData.value.entity_type}_${fetchedData.value.id}`, true);
}

const getBreadCrumbs = computed(() => {
	const splitedPath = route.path.split('/');

	return [
		{
			name: props.title,
			href: `/${splitedPath[1]}/`,
		},
		{
			name: fetchedData.value?.name,
			href: `/${splitedPath[1]}/${splitedPath[2]}`,
		},
	];
});

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
	<button @click="refresh">12345</button>
	<div v-if="fetchedData">
		<PageHeader :breadCrumbs="getBreadCrumbs" />
		<TitleImage
				v-if="fetchedData?.title_image"
				:image="fetchedData.title_image"
				:title="fetchedData?.name"
				:withoutBorder="true"
				parentClass="mb-[30px]"
		/>
		<EntertainmentInfo :item="fetchedData" />

		<div class="additional-info">
			<div class="left-box">
				<div class="line-block" v-html="fetchedData.description" />
				<SimpleTagsList
						class="tags-list"
						:tags="fetchedData.tags"
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
			</div>
		</div>

		<div class="article-footer">
			<BlockWrapper
					v-for="(block, blockIndex) in fetchedData.blocks"
					:name="block.name"
					:structure="block.structure"
			/>
			<div class="add-info">
				<div class="column-1" />
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
			<Head :seo="fetchedData.seo" />
		</div>
	</div>
	<ui-itemBox
			v-else
			borderColor="red"
	/>
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
