<script setup>
import AddCommentForm from '@/components/forms/AddCommentForm.vue';

import { userFunctions } from '@/composables/userFunctions.js';
const { userStore } = userFunctions();

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

const props = defineProps({
	messages: {
		type: Object,
		required: true,
	},
});

const sendAnswer = () => {

}
</script>

<template>
	<div class="messages-parent-box">
		<div class="message-list">
			<div class="messages-container">
				<div
						v-for="(message, key) in messages"
						:key="key"
						:class="['message', userStore.user.id === message.recipient ? 'to' : 'from']"
				>
					<div class="wrapper">
						<span class="message-header">{{ getFormattedDate('d ru_mouths_name Y', message.created_at) }}</span>
						<span class="message-text">{{ message.message }}</span>
						<span>Прочитано</span>
					</div>
				</div>
			</div>
		</div>
		<div class="mt-4">
			<AddCommentForm
					@fetchComments="sendAnswer"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.messages-parent-box {
	.message-list {
		@apply flex flex-col w-full pl-3;
		height: calc(100vh - 300px);

		.messages-container {
			//@apply mt-auto flex flex-col justify-end overflow-auto; /* Основное изменение - размещаем контент внизу */
			@apply mt-auto flex flex-col overflow-auto; /* Основное изменение - размещаем контент внизу */
			min-height: 100%; /* Занимает всю высоту родителя */
		}

		.message {
			@apply flex justify-between items-end;

			&.to {
				@apply justify-end;
			}

			&.from {
				@apply justify-start;
			}

			.wrapper {
				@apply w-[70%] p-4 mb-2 bg-[var(--second-block-color)] text-[var(--main-dark-text-color)];

				.message-header {
					@apply block pb-1;
					border-bottom: 1px solid var(--four-border-color);
				}

				.message-text {
					@apply block pt-1;
				}
			}
		}
	}
}
</style>
