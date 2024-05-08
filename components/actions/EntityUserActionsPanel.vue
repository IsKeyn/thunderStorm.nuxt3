<script setup>
import Likes from '@/components/voting/Likes.vue';
import Share from '@/components/actions/Share.vue';
import Tooltip from '@/components/interface/Tooltip.vue';

const emit = defineEmits(['updateLikes', 'openSendCommentForm']);

const props = defineProps({
	type: {
		type: String,
		default: 'full',
	},

	showDonat: {
		type: Boolean,
		default: false,
	},

	// Likes
	entityType: {
		type: String,
		required: true,
	},
	entityId: {
		type: Number,
		required: true,
	},
	voted: {
		type: Boolean,
		default: false,
	},
	likes: {
		type: Number,
		default: 0,
	},

	// Comments
	commentsCount: {
		type: Number,
		default: 0,
	},
	detailPageUrl: {
		type: String,
		default: null,
	},

	// Views
	views: {
		type: Number,
		default: 0,
	},

	// Share
	title: {
		type: String,
		default: '',
	},
	description: {
		type: String,
		default: '',
	},
	image: {
		type: String,
		default: '',
	},
});

const router = useRouter();
const likesComponent = ref(null);

const commentElementHandler = () => {
	props.type === 'full' ? emit('openSendCommentForm') : router.push({ path: `${props.detailPageUrl}?doType=sendComment` });
}
// TODO сделать подсказки для кнопок, title не работает
</script>

<template>
	<div
			:class="['action-panel', type]"
	>
		<div
				class="square-box"
				title="Поставить лайк"
				@click="likesComponent.likeHandler()"
		>
			<Tooltip>
				<div class="promt">{{ voted ? 'Отозвать лайк' : 'Поставить лайк' }}</div>
			</Tooltip>
			<span class="count">{{ likes ? likes : 0 }}</span>
			<Likes
					:entityType="entityType"
					:entityId="entityId"
					:voted="voted"
					theme="onlyHeart"
					:useInsideClickHandler="false"
					ref="likesComponent"
					@updateLikes="$emit('updateLikes', $event)"
			/>
		</div>
		<div
				class="square-box"
				title="Оставить комментарий"
				@click="commentElementHandler()"
		>
			<Tooltip>
				<div class="promt">Оставить комментарий</div>
			</Tooltip>
			<span class="count">{{ commentsCount ? commentsCount : 0 }}</span>
			<font-awesome-icon :icon="['fas', 'message']" />
		</div>
		<div class="square-box">
			<Tooltip>
				<div class="promt">Количество просмотров</div>
			</Tooltip>
			<span class="count">{{ views ? views : 0 }}</span>
			<font-awesome-icon :icon="['fas', 'eye']" />
		</div>
		<div
				v-if="type === 'full'"
				class="square-box"
		>
			<Share
					:title="title"
					:description="description"
					:image="image"
			/>
		</div>
		<div
				v-if="showDonat"
				class="square-box"
		>
			<a
					class="stretched-link"
					href="https://www.donationalerts.com/r/keyntr"
					target="_blank"
					title="Помощь материально"
			>
				<font-awesome-icon :icon="['fas', 'hand-holding-dollar']" />
			</a>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.action-panel {
	@apply flex justify-end;

	&.full {
		.square-box {
			@apply bg-[var(--second-bg-color)];
		}
	}

	&.simple {

	}

	.square-box {
		@apply
			flex relative
			justify-center items-center
			min-w-[40px] h-[40px]
			mr-[2px]
			pr-[10px] pl-[10px]
			cursor-pointer
		;

		&:hover {
			@apply bg-[var(--second-hover-color)];
		}

		.count {
			@apply mr-[10px];
		}
	}

	.promt {
		@apply bg-[var(--second-bg-color)] w-[120px] text-center mb-[2px] p-[5px];
	}
}
</style>
