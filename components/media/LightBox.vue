<script setup>
import Overlay from '@/components/layout/Overlay.vue';
import SimpleTagsList from '@/components/tags/SimpleTagsList.vue';
import Likes from '@/components/voting/Likes.vue';

const emit = defineEmits(['setCurrentElement', 'updateLikes', 'selectThisElement']);

import { api } from '@/composables/api.js'
const {
	apiUrl,
	publicUrl,
	getCsrfCookie,
	sessionCookieName,
	errorHandler,
	handleBackendUrl,
} = api();

import { mobile } from '@/composables/mobile.js'
const {
	isMobile,
	onWindowResize,
} = mobile();

const props = defineProps({
	image: {
		type: Object,
		default: {},
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

	mediaId: {
		type: Number,
		default: null,
	},
	selected: {
		type: Boolean,
		default: false,
	}
});

const media = ref({});
const isLoading = ref(false);

const getMedia = async () => {
	isLoading.value = true;

	try {
		const sessionCookie = useCookie(sessionCookieName.value);

		const response = await $fetch(
				`${apiUrl.value}media/get/${props.mediaId}`,
				{
					method: 'GET',
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						Cookie: `${sessionCookieName.value}=${sessionCookie.value};`,
						Referer: publicUrl.value,
					},
					onResponse({response}) {
						isLoading.value = false;

						if (response.status === 200) {
							media.value = response._data.data;

							if (process.client && !sessionStorage.getItem(`view_${media.value.entity_type}_${media.value.id}`)) {
								sessionStorage.setItem(`view_${media.value.entity_type}_${media.value.id}`, true);
							}
						} else {
							// Возарщаем ошибку
						}
					}
				},
		);
	} catch (e) {
		const errorsPromise = errorHandler(e);

		errorsPromise.then((element) => {
			responseErrors.value = element;
		});

		isLoading.value = false;
	}
}

if (Object.keys(props.image).length > 0) {
	media.value = props.image;
} else if (props.mediaId) {
	getMedia();
}

const setView = async () => {
	if (props.setViewsLog && !sessionStorage.getItem(`view_${media.value.entity_type}_${media.value.id}`)) {
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
							entityType: media.value.entity_type,
							entityId: media.value.id,
						},
					},
			).then(() => {
				sessionStorage.setItem(`view_${media.value.entity_type}_${media.value.id}`, true);
			});
		} catch (e) {}
	}
}
setView();

watch(() => media.value, () => {
	setView();
});

watch(() => props.image, () => {
	media.value = props.image;
});


const activeInfoBlock = ref(false);

import { date } from '@/composables/date.js';
const { getFormattedDate } = date();

import {onMounted, onUnmounted, watch} from 'vue'
onMounted(() => {
	if (props.hideBodyScrollLine) {
		const body = document.querySelector('body');
		body.classList.add('overflow-hidden');
	}

	document.addEventListener('keydown', keydownHandler);

	onWindowResize();
	window.addEventListener('resize', onWindowResize);
});

onUnmounted(() => {
	if (props.hideBodyScrollLine) {
		const body = document.querySelector('body');
		body.classList.remove('overflow-hidden');
	}

	document.removeEventListener('keydown', keydownHandler);
	window.removeEventListener("resize", onWindowResize );
});

const isPined = ref(false);

const togglePin = () => {
	isPined.value = !isPined.value;

	if (isPined.value) {
		activeInfoBlock.value = true;
	}
}

const activeInfoBlockTimeout = ref(null);

const setActiveInfoBlock = (value, useTimeout = false) => {
	if (isMobile.value) {
		activeInfoBlock.value = value;
	} else {
		if (value && activeInfoBlockTimeout.value) {
			clearTimeout(activeInfoBlockTimeout.value);
		}

		if (value && useTimeout && !activeInfoBlockTimeout.value) {
			activeInfoBlockTimeout.value = setTimeout(() => {
				activeInfoBlock.value = false;
			}, 3000);
		}

		if (!isPined.value) {
			activeInfoBlock.value = value;
		}
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
				:src="handleBackendUrl(media.webp ? media.webp : media.src)"
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
					class="btn-icon info-button"
					@click="setActiveInfoBlock(!activeInfoBlock, true)"
			>
				<font-awesome-icon
						:icon="['fas', 'info']"
						class="icon"
				/>
			</span>
			<span
					v-if="selectButton"
					:class="['btn-icon select-button', selected ? 'selected' : '']"
					@click="$emit('selectThisElement', media)"
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
					:src="handleBackendUrl(media.webp ? media.webp : media.src)"
					:alt="media.name"
					:title="media.name"
			>
			<span
					v-if="Number.isInteger(nextElementKey)"
					class="btn-icon btn-nav button-next"
					@click="$emit('setCurrentElement', nextElementKey)"
			>
				<font-awesome-icon :icon="['fas', 'angle-right']" />
			</span>
			<Likes
					v-if="media.entity_type && media.id"
					theme="forLightBox"
					:entityType="media.entity_type"
					:entityId="media.id"
					:voted="media.already_voted"
					@updateLikes="$emit('updateLikes', $event)"
			/>
			<div
					class="item-info-block"
					:class="activeInfoBlock ? 'active' : ''"
					@mouseenter="setActiveInfoBlock(true)"
					@mouseleave="setActiveInfoBlock(false)"
			>
				<div class="content">
					<div class="line-1">
						<div class="column">
							<span
									class="info-line"
									v-if="media.description"
									v-html="media.description"
							/>
							<span
									v-if="media.comments_count !== null && media.comments_count !== undefined"
									class="info-line"
							>
								Количество комментариев: {{ media.comments_count }}
							</span>
							<span
									v-if="media.views"
									class="info-line"
							>
								Просмотров: {{ media.views }}
							</span>
							<span
									v-if="media.likes"
									class="info-line"
							>
								Лайкнули: {{ media.likes }} раз
							</span>
						</div>
						<div class="column text-center">
							<span
									v-if="media.name"
									class="info-line"
							>
								{{ media.name }}
							</span>
							<span
									v-if="!hidenFields.includes('user_info.name') && media.user_info?.name"
									class="info-line"
							>
								<router-link :to="`/profile/${media.user_info.name}/`">{{ media.user_info.name }}</router-link>
							</span>
							<span
									v-if="!hidenFields.includes('user_info.name') && media.created_at"
									class="info-line"
							>
								{{ getFormattedDate('d.m.Y H:i:s', media.created_at) }}
							</span>
						</div>
						<div class="column">
							<SimpleTagsList
									:tags="media.tags"
									parentClasses="text-right"
							/>
						</div>
					</div>
					<div
							v-if="media.id"
							class="line-2"
					>
						<div class="column">
							<router-link
									v-if="showCommentBox"
									:to="`/media/${media.id}/`"
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

				<div class="btn-icon btn-close-mobile-more-info">
					<font-awesome-icon
							:icon="['fas', 'xmark']"
							@click="setActiveInfoBlock(false)"
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

			&.selected {
				@apply bg-[var(--second-active-color)];
			}

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

		.info-button {
			@apply
				top-[20px] left-[10px]
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
				hidden md:block
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

		.btn-close-mobile-more-info {
			@apply
				md:hidden
				absolute top-[20px] right-[28px]
				cursor-pointer text-[30px]
			;

			height: unset;
			width: unset;

			&:hover {
				@apply bg-inherit;
			}

			svg {
				&:hover {
					color: var(--main-hover-color);
				}
			}
		}

		img {
			@apply h-full w-full lg:max-h-[100vw] object-contain mb-0 relative;
		}

		.item-info-block {
			@apply
				absolute z-[800]
				bottom-0
				h-full md:h-[unset]
				hidden md:block
				w-full min-h-[90px]
				bg-[#000000]
				opacity-100 md:opacity-0
			;

			transition: 1s;

			&.active {
				@apply
					opacity-100 md:opacity-80
					block
				;
			}

			.content {
				@apply
					min-[1400px]:w-[var(--main-block-width)] min-h-[60px]
					m-auto
				;

				.line-1,
				.line-2 {
					@apply
						pr-[2rem] md:pr-[var(--main-right-padding)]
						pb-[10px]
						pl-[2rem] md:pl-[var(--main-left-padding)]
						md:grid grid-cols-12
					;
				}

				.line-1 {
					@apply grid grid-cols-12 pt-[10px] pb-[10px];
				}

				.line-2 {
					@apply absolute md:static bottom-0;
				}

				.column {
					@apply col-span-12 md:col-span-4 grid-cols-12;

					.info-line {
						display: block;
					}

					&:nth-child(1) {
						@apply order-2 md:order-1;

						.info-line {
							@apply md:text-[1rem] mb-2;
						}
					}

					&:nth-child(2) {
						@apply order-1 md:order-2;

						.info-line {
							@apply text-[2rem] md:text-[1rem] mb-2;
						}
					}

					&:nth-child(3) {
						@apply order-3 md:order-3;
					}
				}
			}
		}
	}
}
</style>
