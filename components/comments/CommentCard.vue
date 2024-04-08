<script setup>
import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

const props = defineProps({
	comment: {
		type: Object,
		default: {},
	},
});
</script>

<template>
	<div class="comment-box">
		<div class="comment-box-head">Комментарий {{ comment.name }} от {{ getFormattedDate('d ru_mouths_name Y', comment.created_at) }}</div>
		<div class="message-box">{{ comment.message }}</div>
	</div>
</template>

<style lang="scss" scoped>
.comment-box {
	@apply mb-[40px];
}

.comment-box .comment-box-head {
	@apply pb-[10px];
}

.comment-box .message-box {
	@apply pb-[10px] pt-[10px];

	border-top: 1px solid var(--second-border-color);
}

.in-developing {
	@apply text-[22px] leading-[40px] tracking-[5px] mt-[20px];
}
</style>
