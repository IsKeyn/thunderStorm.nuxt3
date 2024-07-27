<script setup>
import ImageBlock from '@/components/media/ImageBlock.vue';

import { date } from '@/composables/date.js';
const {
	getFormattedDate
} = date();

const props = defineProps({
	cardData: {
		type: Object,
		default: {},
	},
});

const youTubeVideoUrl = computed(() => {
	return `https://www.youtube.com/watch?v=${props.cardData.video_id}`;
});

const imageObj = computed(() => {
	return {
		src: props.cardData.thumbnails.medium.url,
		name: props.cardData.title,
		// description: props.cardData.description,
	};
});
</script>

<template>
	<div class="card">
		<div class="header">
			<div class="header-line">
				<div class="card-title">
					<a
							:href=youTubeVideoUrl
							class="title"
							target="_blank"
					>
						{{ cardData.title }}
					</a>
				</div>
				<span class="published-time">{{ getFormattedDate('d ru_mouths_name Y', cardData.published_at) }}</span>
			</div>
		</div>

		<div class="body">
			<div
					class="column-1"
			>
				<div v-html="cardData.description" />
			</div>
			<ImageBlock
					v-if="imageObj"
					:image="imageObj"
					class="column-2"
			/>
		</div>

		<div class="footer">
			<div class="column-1">
				<a
						:href="youTubeVideoUrl"
						target="_blank"
				>
					<button class="btn btn-primary">Открыть на YouTube <font-awesome-icon :icon="['fas', 'arrow-right']" /></button>
				</a>
			</div>
			<div class="column-2">
<!--				<EntityUserActionsPanel-->
<!--						type="simple"-->

<!--						:entityType="cardData.entity_type"-->
<!--						:entityId="cardData.id"-->
<!--						:voted="cardData.already_voted"-->
<!--						:likes="cardData.likes"-->

<!--						:commentsCount="cardData.comments_count"-->
<!--						:detailPageUrl="articleUrl"-->

<!--						:views="cardData.views"-->

<!--						:title="cardData.name"-->
<!--						:description="cardData.name"-->
<!--						:image="cardData.image"-->

<!--						@updateLikes="updateLikes"-->
<!--						@openSendCommentForm="openSendCommentForm"-->
<!--				/>-->
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.card {
	@apply mt-[25px] mb-[25px];

	.header {
		.header-line {
			@apply grid grid-cols-12;

			.card-title {
				@apply col-span-10;

				a.title {
					@apply text-[var(--main-href-color)];
				}
			}

			.published-time {
				@apply col-span-2 text-right;
			}
		}
	}

	.body {
		@apply
			grid grid-cols-12
			min-h-[140px] pt-[10px] pb-[10px]
		;

		.column-1 {
			@apply col-span-10 flex flex-col;

			.tags-list {
				@apply mt-auto;
			}
		}

		.column-2 {
			@apply col-span-2;
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
