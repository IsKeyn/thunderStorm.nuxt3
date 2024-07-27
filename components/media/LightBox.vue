<script setup>
import Overlay from '@/components/layout/Overlay.vue';
import SimpleTagsList from '@/components/tags/SimpleTagsList.vue';
import Likes from '@/components/voting/Likes.vue';

const emit = defineEmits(['setCurrentElement', 'updateLikes', 'selectThisElement']);

import { api } from '@/composables/api.js'
const {
	apiUrl,
	getCsrfCookie,
} = api();

const props = defineProps({
	image: {
		type: String,
		default: '',
	},
	prevElementKey: {
		type: Number,
		default: null,
	},
	nextElementKey: {
		type: Number,
		default: null,
	},
	hidenFields: {
		type: Array,
		default: [
				'user_info.name',
				'created_at',
		],
	},
	showCommentBox: {
		type: Boolean,
		default: true,
	},
	setViewsLog: {
		type: Boolean,
		default: false,
	},
	/* Скрывать/показывать кнопку выбора картинки, используется для выбора медиа в FormGenerator.vue */
	selectButton: {
		type: Boolean,
		default: false,
	},
	/* Скрывать/показывать полосу прокрутки на элементе body */
	hideBodyScrollLine: {
		type: Boolean,
		default: true,
	},
});

const setView = async () => {
	if (props.setViewsLog && !sessionStorage.getItem(`view_${props.image.entity_type}_${props.image.id}`)) {
		try {
			const csrfCookie = await getCsrfCookie();

			await $fetch(
					`${apiUrl.value}views/set`,
					{
						method: 'POST',
						credentials: 'include',
						headers: {
							Accept: 'application/json',
							'X-XSRF-TOKEN': csrfCookie.value,
						},
						body: {
							entityType: props.image.entity_type,
							entityId: props.image.id,
						},
					},
			).then(() => {
				sessionStorage.setItem(`view_${props.image.entity_type}_${props.image.id}`, true);
			});
		} catch (e) {}
	}
}
setView();

watch(() => props.image, () => {
	setView();
});

const hover = ref(false);

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

import {onMounted, onUnmounted, watch} from 'vue'
onMounted(() => {
	if (props.hideBodyScrollLine) {
		const body = document.querySelector('body');
		body.classList.add('overflow-hidden');
	}

	document.addEventListener('keydown', keydownHandler);
});

onUnmounted(() => {
	if (props.hideBodyScrollLine) {
		const body = document.querySelector('body');
		body.classList.remove('overflow-hidden');
	}

	document.removeEventListener('keydown', keydownHandler);
});

const isPined = ref(false);

const togglePin = () => {
	isPined.value = !isPined.value;

	if (isPined.value) {
		hover.value = true;
	}
}

const setHover = (value) => {
	if (!isPined.value) {
		hover.value = value;
	}
}
const keydownHandler = (event) => {
	switch (event.key) {
		case 'Escape': emit('setCurrentElement'); break;
		case 'ArrowDown': props.nextElementKey ? emit('setCurrentElement', props.nextElementKey) : ''; break;
		case 'ArrowRight': props.nextElementKey ? emit('setCurrentElement', props.nextElementKey) : ''; break;
		case 'ArrowUp': props.prevElementKey ? emit('setCurrentElement', props.prevElementKey) : ''; break;
		case 'ArrowLeft': props.prevElementKey ? emit('setCurrentElement', props.prevElementKey): ''; break;
	}
}
</script>

<template>
	<div class="light-box" style="">
		<img
				class="background-img"
				:src="image.src"
		>
		<div class="wrapper">
			<span
					class="btn-icon close-button"
					@click="$emit('setCurrentElement')"
			>
				<font-awesome-icon
						:icon="['fas', 'xmark']"
						class="icon"
				/>
			</span>
			<span
					v-if="selectButton"
					class="btn-icon select-button"
					@click="$emit('selectThisElement', image)"
			>
				<font-awesome-icon :icon="['fas', 'check']"/>
			</span>
			<span
					v-if="Number.isInteger(prevElementKey)"
					class="btn-icon btn-nav button-prev"
					@click="$emit('setCurrentElement', prevElementKey)"
			>
				<font-awesome-icon :icon="['fas', 'angle-left']" />
			</span>
			<img
					:src="image.src"
					:alt="image.name"
					:title="image.name"
			>
			<span
					v-if="Number.isInteger(nextElementKey)"
					class="btn-icon btn-nav button-next"
					@click="$emit('setCurrentElement', nextElementKey)"
			>
				<font-awesome-icon :icon="['fas', 'angle-right']" />
			</span>
			<Likes
					v-if="image.entity_type && image.id"
					theme="forLightBox"
					:entityType="image.entity_type"
					:entityId="image.id"
					:voted="image.already_voted"
					@updateLikes="$emit('updateLikes', $event)"
			/>
			<div
					class="item-info-block"
					:class="hover ? 'active' : ''"
					@mouseenter="setHover(true)"
					@mouseleave="setHover(false)"
			>
				<div class="content">
					<div class="line-1">
						<div class="column">
							<span
									class="info-line"
									v-if="image.description"
									v-html="image.description"
							/>
							<span
									v-if="image.comments_count !== null && image.comments_count !== undefined"
									class="info-line"
							>
								Количество комментариев: {{ image.comments_count }}
							</span>
							<span
									v-if="image.views"
									class="info-line"
							>
								Просмотров: {{ image.views }}
							</span>
							<span
									v-if="image.likes"
									class="info-line"
							>
								Лайкнули: {{ image.likes }} раз
							</span>
						</div>
						<div class="column text-center">
							<span
									v-if="image.name"
									class="info-line"
							>
								{{ image.name }}
							</span>
							<span
									v-if="!hidenFields.includes('user_info.name') && image.user_info?.name"
									class="info-line"
							>
								<router-link :to="`/profile/${image.user_info.name}/`">{{ image.user_info.name }}</router-link>
							</span>
							<span
									v-if="!hidenFields.includes('user_info.name') && image.created_at"
									class="info-line"
							>
								{{ getFormattedDate('d.m.Y H:i:s', image.created_at) }}
							</span>
						</div>
						<div class="column">
							<SimpleTagsList
									:tags="image.tags"
									parentClasses="text-right"
							/>
						</div>
					</div>
					<div
							v-if="image.id"
							class="line-2"
					>
						<div class="column">
							<router-link
									v-if="showCommentBox"
									:to="`/media/${image.id}/`"
							>
								<button class="btn btn-primary">Оставить комментарий</button>
							</router-link>
						</div>
					</div>
				</div>
				<div class="btn-icon btn-pin">
					<font-awesome-icon
							:icon="['fas', 'thumbtack']"
							rotation=45
							:class="isPined ? 'active' : ''"
							@click="togglePin"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.light-box {
	@apply fixed left-0 top-0 z-[700] w-full h-full;
	color: var(--second-text-color);

	.background-img {
		@apply absolute top-0 left-0 w-full h-full object-cover scale-[1.2] z-0;
		filter: blur(24px);
	}

	.wrapper {
		@apply
			relative
			h-full
			mt-0 mr-auto ml-auto
			overflow-auto
		;

		.btn-icon {
			@apply
				absolute z-[700]
				text-[40px] text-center
				cursor-pointer
				bg-black
				w-[60px] h-[60px]
				rounded-full
			;

			&:hover {
				@apply bg-[var(--second-hover-color)];
			}
		}

		.close-button {
			@apply
				top-[20px] right-[10px]
			;
		}

		.select-button {
			@apply
			top-[20px] right-[80px]
			;
		}

		.btn-nav {
			top: calc(50% - 30px);
		}

		.button-prev {
			@apply left-[10px];
		}

		.button-next {
			@apply right-[10px];
		}

		//.btn-like {
		//	@apply
		//		absolute z-[701]
		//		right-[10px] bottom-[20px]
		//		text-[35px] leading-[60px]
		//	;
		//
		//	&.voted {
		//		@apply bg-[var(--second-hover-color)];
		//	}
		//}

		.btn-pin {
			@apply
				absolute top-[20px] right-[28px]
				cursor-pointer text-[30px]
			;

			height: unset;
			width: unset;

			&:hover {
				@apply bg-inherit;
			}

			svg {
				rotate: 45deg;

				&.active {
					rotate: 0deg;
				}

				&:hover {
					color: var(--main-hover-color);
				}
			}
		}

		img {
			@apply h-full w-full max-h-[100vw] object-contain mb-0 relative;
		}

		.item-info-block {
			@apply
				absolute z-[700]
				bottom-0
				w-full min-h-[90px]
				bg-[#000000] opacity-0
			;

			transition: 1s;

			&.active {
				@apply opacity-80;
			}

			.content {
				@apply
					w-[var(--main-block-width)] min-h-[60px]
					m-auto
				;

				.line-1,
				.line-2 {
					@apply
					pr-[var(--main-right-padding)] pb-[10px] pl-[var(--main-left-padding)]
						grid grid-cols-12
					;
				}

				.line-1 {
					@apply pt-[10px] pb-[10px];
				}

				.line-1 {
					@apply pb-[10px];
				}

				.column {
					@apply col-span-4;

					.info-line {
						display: block;
					}
				}
			}
		}
	}
}
</style>
