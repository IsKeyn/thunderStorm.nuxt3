<script setup>
import { onMounted } from 'vue'

import AddCommentForm from '@/components/forms/AddCommentForm.vue';

const emit = defineEmits(['fetchComments']);

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

const props = defineProps({
	entityType: {
		type: String,
		required: true,
	},
	entityId: {
		type: Number,
		required: true,
	},
	comment: {
		type: Object,
		default: {},
	},
	isAnswer: {
		type: Boolean,
		default: false,
	},
	lastAnswer: {
		type: Boolean,
		default: false,
	},
	firstParent: {
		type: Number,
		default: null,
	},
	answerTo: {
		type: Number,
		default: null,
	},
	deepLvl: {
		type: Number,
		default: 0,
	},
	breakerLvl: {
		type: Number,
		default: 10,
	}
});

const lineBreakerRef = ref(null);
const commentRef = ref(null);
const answerRef = ref(null);
const returnToFirstPositionIndicatorRef = ref(null);

onMounted(() => {
	breakLineHeight();
	returnToFirstPosition();
});

const breakLineHeight = () => {
	if (props.lastAnswer) {
		const commentBlockHeight = commentRef.value.offsetHeight;
		const halfCommentBlockHeight = (commentBlockHeight / 2) + 20;

		lineBreakerRef.value.style.top = `${halfCommentBlockHeight}px`;
		lineBreakerRef.value.style.height = `calc(100% - ${halfCommentBlockHeight}px)`;
	}
}

const showAnswer = ref(false);
const sendAnswer = ref(false);

const fetchComments = () => {
	sendAnswer.value = false;
	emit('fetchComments');
}

const returnToFirstPosition = () => {
	if (props.deepLvl && props.deepLvl % props.breakerLvl === 0) {
		// 20 это сумма padding-left + margin-left каждого блока , 3 - это ширина border у нас из 3 по 1 px
		answerRef.value.style.marginLeft = `-${props.deepLvl * 20 - 3}px`;

		returnToFirstPositionIndicatorRef.value.style.display = 'block';
		returnToFirstPositionIndicatorRef.value.style.marginLeft = `-${props.deepLvl * 20 - 3}px`;
	}
}
</script>

<template>
	<div class="comment-main-box">
		<div
				v-if="lastAnswer"
				class="line-breaker"
				ref="lineBreakerRef"
		/>
		<div
				class="comment"
				ref="commentRef"
		>
			<div class="comment-box">
				<div class="comment-box-head">Комментарий {{ comment.name }} от {{ getFormattedDate('d ru_mouths_name Y', comment.created_at) }}</div>
				<div class="message-box">{{ comment.message }}</div>
				<div class="action-box">
					<a @click="sendAnswer = !sendAnswer">{{ sendAnswer ? 'Отменить' : 'Ответить' }}</a>
					<span v-if="!isAnswer && comment.answers"> | </span>
					<a v-if="comment.answers && !isAnswer" @click="showAnswer = !showAnswer">{{ showAnswer ? 'Скрыть' : 'Показать' }} ответы</a>
				</div>
				<div
						v-if="sendAnswer"
						class="answer-box"
				>
					<AddCommentForm
							:entityType="entityType"
							:entityId="entityId"
							:firstParent="firstParent"
							:answerTo="comment.id"
							@fetchComments="fetchComments"
					/>
				</div>
			</div>
			<div
					v-if="isAnswer"
					class="line"
			/>
		</div>
		<div
				class="return-to-first-position-indicator"
				ref="returnToFirstPositionIndicatorRef"
		/>
		<div
				v-if="comment.answers && (isAnswer ? true : showAnswer)"
				class="answers"
				ref="answerRef"
		>
			<CommentCard
					v-for="(answer, key) in comment.answers"
					:key="answer.id"
					:comment="answer"
					:isAnswer="true"
					:lastAnswer="comment.answers.length === ++key"
					:entityType="entityType"
					:entityId="entityId"
					:firstParent="firstParent"
					:answerTo="comment.id"
					:deepLvl="deepLvl + 1"
					:breakerLvl="breakerLvl"
					@fetchComments="fetchComments"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
// Стили на все комментарии и ответы (в том чилсе на первый)
.comment-main-box {
	@apply pt-[20px];

	.return-to-first-position-indicator {
		@apply hidden;
	}

	.comment-box {
		@apply pl-[20px];

		border-bottom: 1px solid var(--third-border-color);
		border-left: 1px solid var(--third-border-color);

		.comment-box-head {
			@apply pb-[10px];
		}

		.message-box {
			@apply pb-[10px] pt-[10px] whitespace-pre-wrap break-words;

			border-top: 1px solid var(--second-border-color);
		}

		.action-box {
			@apply pb-[10px] text-right;

			span {
				@apply text-[var(--main-href-color)];

				font-size: var(--text-small-text);
			}

			a {
				@apply cursor-pointer;

				font-size: var(--text-small-text);
			}
		}
	}
}

// Стили действуют только на ответы
.answers {
	@apply ml-[10px] pl-[10px];

	border-left: 1px solid var(--third-border-color);

	.comment-main-box {
		@apply relative;

		.return-to-first-position-indicator {
			@apply relative min-h-[30px] mr-[20px];

			border-right: 1px solid var(--third-border-color);
			border-bottom: 1px solid var(--third-border-color);
		}

		.line-breaker {
			@apply block absolute top-[22px] left-[-12px] w-[11px] bg-[var(--main-bg-color)];

			height: calc(100% - 22px);
		}

		.comment {
			@apply relative;

			.line {
				@apply absolute w-[10px] left-[-11px] top-[50%];

				border-top: 1px solid var(--third-border-color);
			}
		}
	}
}
</style>
