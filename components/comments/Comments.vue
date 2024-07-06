<script setup>
import OpeningBox from '@/components/ui/OpeningBox.vue';
import AddCommentForm from '@/components/forms/AddCommentForm.vue';
import CommentsList from '@/components/comments/CommentsList.vue';

const emit = defineEmits(['refresh']);

const props = defineProps({
	entityType: {
		type: String,
		required: true,
	},
	entityId: {
		type: Number,
		required: true,
	},
});

const commentsListRef = ref(null);

const fetchComments = () => {
	emit('refresh');
	commentsListRef.value.fetchComments()
}
</script>

<template>
	<div>
		<OpeningBox title="Добавить комментарий">
			<AddCommentForm
					:entityType="entityType"
					:entityId="entityId"
					@fetchComments="fetchComments"
			/>
		</OpeningBox>
		<CommentsList
				:entityType="entityType"
				:entityId="entityId"
				ref="commentsListRef"
		/>
	</div>
</template>
