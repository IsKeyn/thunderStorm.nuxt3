<script setup>
import EntityUserActionsPanel from '@/components/actions/EntityUserActionsPanel.vue';
import ImageBlock from '@/components/media/ImageBlock.vue';
import SimpleTagsList from '@/components/tags/SimpleTagsList.vue';

import { date } from '@/composables/date.js';
const {
	getFormattedDate
} = date();

const props = defineProps({
	cardData: {
		type: Object,
		default: {},
	},
	showTags: {
		type: Boolean,
		default: true,
	},
	showFooter: {
		type: Boolean,
		default: true,
	},
	simpleImage: {
		type: Boolean,
		default: false,
	},
});

const articleUrl = computed(() => {
	return `/${props.cardData.type ? props.cardData.type : 'article'}/${props.cardData.slug}/`;
});

const updateLikes = (params) => {
	const { entityType, entityId, count } = params;
	props.cardData.likes = count;
}
</script>

<template>
	<div
			v-if="cardData"
			class="card"
	>
		<div class="header">
      <div class="header-line">
				<div class="card-title">
					<router-link
							:to=articleUrl
							class="title"
					>
						{{ cardData.name }}
					</router-link>
				</div>
				<span class="published-time">{{ getFormattedDate('d ru_mouths_name Y', cardData.created_at) }}</span>
      </div>
		</div>

		<div class="body">
			<ImageBlock
					v-if="cardData.image"
					:image="cardData.image"
					class="column-2"
					:simpleImage="simpleImage"
			/>
			<div
					class="column-1"
			>
				<div v-html="cardData.text_preview" />
				<SimpleTagsList
						class="tags-list"
						v-if="showTags"
						:tags="cardData.tags"
						theme="string"
				/>
			</div>
		</div>
		<div
				v-if="showFooter"
				class="footer"
		>
			<div class="column-1">
				<router-link :to=articleUrl>
					<button class="btn btn-primary">Читать полностью <font-awesome-icon :icon="['fas', 'arrow-right']" /></button>
				</router-link>
			</div>
			<div class="column-2">
				<EntityUserActionsPanel
						type="simple"

						:entityType="cardData.entity_type"
						:entityId="cardData.id"
						:voted="cardData.already_voted"
						:likes="cardData.likes"

						:commentsCount="cardData.comments_count"
						:detailPageUrl="articleUrl"

						:views="cardData.views"

						:title="cardData.name"
						:description="cardData.name"
						:image="cardData.image"

						@updateLikes="updateLikes"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.card {
	@apply
		mt-[25px] mb-[25px]
	;

	.header {
		.header-line {
			@apply md:grid md:grid-cols-12;

			.card-title {
				@apply md:col-span-10 mb-[0.5rem];

				a.title {
					@apply text-[var(--main-href-color)];
				}
			}

			.published-time {
				@apply mb-[0.5rem] block md:col-span-2 md:text-right ;
			}
		}
	}

	.body {
		@apply
			//grid grid-cols-12
			min-h-[140px] pt-[10px] pb-[10px]
		;

		.column-1 {
			@apply flex flex-col md:min-h-[17rem];

			.tags-list {
				@apply mt-auto;
			}
		}

		.column-2 {
			@apply
				mb-[1rem]
				md:float-right
			;
		}
	}

	.footer {
		@apply grid grid-cols-12;

		.column-1 {
			@apply col-span-8;
		}

		.column-2 {
			@apply col-span-4;
		}
	}
}
</style>
