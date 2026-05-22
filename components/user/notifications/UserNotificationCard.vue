<script setup>
const emit = defineEmits(['updateData', 'toggleModal']);

import { helper } from '@/composables/helper.js'
const { route, router } = helper();

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

const requestInProgress = ref(false);

const setViewed = async (id) => {
	requestInProgress.value = true;
	await sendApiRequest('auth/notification/set-viewed', 'POST', { id }, 'setUserNotificationLikeViewed', 'small');
	requestInProgress.value = false;
	emit('updateData');
}

const redirect = (page) => {
	emit('toggleModal');
	router.push({ path: page });
}
</script>

<template>
	<div	class="relative">
		<ui-fragments-DisableBox
				v-if="requestInProgress"
				:showIcon="false"
				message="Отмечаю как прочитанное..."
		/>
		<div :class="['item-box', notification.viewed ? '' : 'not-viewed']">
			<div class="info">
			<span class="header">
				<span class="date">
					{{ getFormattedDate('d.m.Y H:i', notification.created_at) }}
					<template v-if="notification.from">
						от {{ notification.from.name }}
					</template>
					<template v-if="notification.entity && notification.entity.name">
						({{ notification.entity.name }})
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
				<span class="block">{{ notification.message }}</span>
				<div v-if="notification.actions">
					<div
							v-for="(action, key) in notification.actions"
							:key="key"
							class="pt-2 pb-2"
					>
						<template v-if="action?.type === 'button'">
							<button
									v-if="action?.button"
									class="btn btn-simple notification-button"
									@click="redirect(action.button.href)"
							>
								{{ action.button.name }}
							</button>
						</template>
					</div>
				</div>
			</span>
			</div>
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
				block md:flex mb-2
			;

			.date {
				@apply w-full md:w-1/2;
			}

			.actions {
				@apply w-full md:w-1/2 flex md:justify-end;
			}
		}

		.description {
			@apply block;
		}

		button {
			&.notification-button {
				&:hover {
					@apply bg-[var(--second-hover-color)] no-underline;
				}
			}
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
