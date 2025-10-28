<script setup>
const props = defineProps({
	notification: {
		type: Object,
		default: {},
	},
});

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

import { api } from '@/composables/api.js'
const { sendApiRequest } = api();

const emit = defineEmits(['updateData']);

const setViewed = async (id) => {
 await sendApiRequest('auth/notification/set-viewed', 'POST', { id }, 'setUserNotificationLikeViewed', 'small');
 emit('updateData');
}
</script>

<template>
	<div :class="['item-box', notification.viewed ? '' : 'not-viewed']">
		<div class="info">
			<span class="header">
				<span class="date">
					{{ getFormattedDate('d.m.Y H:i', notification.created_at) }}
					<template v-if="notification.from">
						от {{ notification.from.name }}
					</template>
				</span>
				<span class="actions">
					<span
							v-if="!notification.viewed"
							class="cursor-pointer"
							@click="setViewed(notification.id)"
					>
						Отметить, как прочитанное
					</span>
				</span>
			</span>
			<span class="description">
				{{ notification.message }}
			</span>
		</div>
	</div>
</template>

<style lang="scss" scoped>

.item-box {
	@apply p-2 mb-2 bg-[var(--second-bg-color)] rounded flex;

	&.not-viewed {
		@apply bg-[var(--second-active-color)];

		.info {
			@apply text-[var(--main-text-color)];
		}
	}

	img {
		@apply w-[70px] h-[70px] object-cover;
	}

	.info {
		@apply pl-3 pr-3 text-[var(--main-dark-text-color)] w-full;

		.header {
			@apply
				flex
				block mb-1
			;

			.date {
				@apply w-1/2;
			}

			.actions {
				@apply w-1/2 flex justify-end;
			}
		}

		.description {
			@apply block;
		}
	}

	.use-button {
		@apply bg-[var(--success-color)] block pl-[0.6rem] pr-[0.6rem] pt-[0.3rem] pb-[0.3rem] text-center mb-[0.3rem];
	}

	.close-button {
		@apply bg-[var(--error-color)] block pl-[0.6rem] pr-[0.6rem] pt-[0.3rem] pb-[0.3rem] text-center;
	}
}
</style>
