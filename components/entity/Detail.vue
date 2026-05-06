<script setup>
import PageHeader from '@/components/layout/PageHeader.vue';
import TitleImage from '@/components/media/TitleImage.vue';
import Info from '@/components/entity/Info.vue';
import EntityUserActionsPanel from '@/components/actions/EntityUserActionsPanel.vue';
import SimpleTagsList from '@/components/tags/SimpleTagsList.vue';
import Head from '@/components/seo/Head.vue';
import MenuColumns from '@/components/menu/MenuColumns.vue';
import BlockWrapper from '@/components/blockEditor/editor/BlockWrapper.vue';
import SliderWithSlots from '@/components/sliders/vueSlider/SliderWithSlots.vue';
import Card from '@/modules/boardGame/components/boardGame/Card.vue';
import PublicRecommendation from '@/components/recommendation/PublicRecommendation.vue';
import PeopleList from '@/components/entity/fragments/PeopleList.vue';
import SeriesList from '@/components/entity/fragments/SeriesList.vue';
import GamesList from '@/components/entity/fragments/GamesList.vue';

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

const requestName =  props.entity + 'EntityDetail';

const {
	data: requestData,
	pending: requestInProgress,
	refresh
} = await useAsyncData(
		requestName,
		async () => {
			if (!route.params.entity) {
				show404pageFunc();
			}

			const query = {};

			if (route.query?.preview) {
				query.preview = route.query.preview;
			}

			const response = await Promise.resolve(
					sendApiRequest(
							`${props.entity}/${route.params.entity}`,
							'GET',
							query,
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

const getSlotName = (n) => `slot-${n + 1}`;
</script>

<template>
	<ui-BigPreloader
			v-if="requestInProgress"
			class="h-full"
			theme="image"
			:themeType="9"
	/>
	<div v-else-if="fetchedData">
		<PageHeader :breadCrumbs="getBreadCrumbs" />
		<TitleImage
				v-if="fetchedData?.title_image"
				:image="fetchedData.title_image"
				:title="fetchedData?.name"
				:withoutBorder="true"
				parentClass="mb-[30px]"
		/>
		<Info :item="fetchedData" />

		<div class="additional-info">
			<div class="left-box">
				<div class="line-block" v-html="fetchedData.description" />

				<GamesList
						v-if="fetchedData.games && fetchedData.games.length"
						:data="fetchedData.games"
						:entity="entity"
				/>

				<PeopleList
						v-if="fetchedData.people && fetchedData.people.length"
						:data="fetchedData.people"
						:entity="entity"
				/>

				<SeriesList
					v-if="fetchedData.series && fetchedData.series.length"
					:data="fetchedData.series"
					:entity="entity"
					:excludedIds="[fetchedData.id]"
				/>

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
			<template v-if="fetchedData?.boardGames && fetchedData.boardGames.length > 0">
				<span class="field"><span class="strong">Присутствует в ивентах:</span></span>
				<SliderWithSlots :count="fetchedData.boardGames.length">
					<template
							v-for="(boardGame, key) in fetchedData.boardGames"
							:key="key"
							v-slot:[getSlotName(key)]
					>
						<Card :element="boardGame" />
					</template>
				</SliderWithSlots>
			</template>
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
					:key="`comments-${fetchedData.entity_type}-${fetchedData.id}`"
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
			classes="red"
	/>
	<PublicRecommendation />
</template>

<style lang="scss" scoped>
.additional-info {
	@apply md:grid grid-cols-5 pt-[var(--main-padding)] mb-2;

	.left-box {
		@apply col-span-4 pr-[15px];

		div.line-block {
			@apply mb-[var(--main-padding)];
		}

		.tags-list {
			@apply mt-4 mb-4;
		}
	}

	.right-block {
		@apply col-span-1;
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

	.field {
		@apply block pb-[0.8rem] text-[1.2rem];
	}
}
</style>
