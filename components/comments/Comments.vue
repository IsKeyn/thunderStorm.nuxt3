<script setup>
import OpeningBox from '@/components/ui/OpeningBox.vue';
import AddCommentForm from '@/components/forms/AddCommentForm.vue';
import CommentsList from '@/components/comments/CommentsList.vue';

const emit = defineEmits(['refresh']);

const { getSettingFirstValue } = settings();

const props = defineProps({
	entityType: {
		type: String,
		required: true,
	},
	entityId: {
		type: Number,
		required: true,
	},
	showAnswer: {
		type: Boolean,
		default: false,
	},
	addCommentTitle: {
		type: String,
		default: 'Добавить комментарий',
	},
});

const commentsListRef = ref(null);

const fetchComments = () => {
	emit('refresh');
	commentsListRef.value.fetchComments()
}
</script>

<template>
	<div v-if="!getSettingFirstValue('disable-comments')">
		<OpeningBox :title="addCommentTitle">
			<AddCommentForm
					:entityType="entityType"
					:entityId="entityId"
					@fetchComments="fetchComments"
			/>
		</OpeningBox>
		<CommentsList
				:entityType="entityType"
				:entityId="entityId"
				:showAnswer="showAnswer"
				ref="commentsListRef"
		/>
	</div>
	<ui-itemBox
			v-else
			classes="red"
			message="Комментарии в данный момент отключены"
	/>
</template>
