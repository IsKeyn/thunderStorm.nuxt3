<script setup>
import { inject, watch } from "vue";

import { helper } from '@/composables/helper.js'
const {
	cutText,
} = helper();

const props = defineProps({
	title: {
		type: String,
		default: 'Открыть контент',
	},
	classes: {
		type: String,
		default: 'mb-4',
	},
	titleClasses: {
		type: String,
		default: '',
	},
	openIconClasses: {
		type: String,
		default: '',
	},
	contentClasses: {
		type: String,
		default: '',
	},
	maxTitleSize: {
		type: Number,
		default: null,
	},
	theme: {
		type: String,
		default: 'default',
	},
	faIcon: {
		type: Array,
		default: null,
	},
	defaultContentStatus: {
		type: Boolean,
		default: false,
	},
	useHardDisable: {
		type: Boolean,
		default: false,
	},
	// Позиция иконки открытия: right, left
	openIconPosition: {
		type: String,
		default: 'right',
	},
});

const contentStatus = ref(props.defaultContentStatus);

const toggleContent = (newStatus) => {
	if (newStatus === undefined || newStatus === null) {
		contentStatus.value = !contentStatus.value;
	} else {
		contentStatus.value = newStatus;
	}
}

const injectToggleContent = inject('injectToggleContent', null);

if (injectToggleContent !== null) {
	watch(injectToggleContent, () => {
		toggleContent(injectToggleContent.value);
	});
}
</script>

<template>
	<div :class="['opening-box', classes, theme]">
		<div
				:class="['header', openIconPosition]"
				@click="toggleContent(null)"
		>
			<font-awesome-icon v-if="faIcon" :icon="faIcon"/><span :class="titleClasses">{{ maxTitleSize ? cutText(title, maxTitleSize) : title }}</span>
			<div :class="['icon-box', openIconPosition]">
				<font-awesome-icon v-if="contentStatus" :icon="['fas', 'angle-up']" :class="openIconClasses" />
				<font-awesome-icon v-else :icon="['fas', 'angle-down']" :class="openIconClasses" />
			</div>
		</div>
		<div
				v-show="contentStatus"
				:class="['content', contentClasses]"
		>
			<slot v-if="useHardDisable ? contentStatus : true" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.opening-box {
	&.default {
		.header {
			@apply
				relative
				w-full
				pt-[10px] pb-[10px]
				bg-[var(--second-bg-color)]
				text-[18px]
				cursor-pointer
			;

			&.right {
				@apply pr-[50px]  pl-[15px];
			}

			&.left {
				@apply pr-[15px]  pl-[50px];
			}

			.icon-box {
				@apply
					absolute top-0
					w-[50px] h-[50px]
					text-[20px] text-center leading-[45px]
				;

				&.right {
					@apply right-0;
				}

				&.left {
					@apply left-0;
				}
			}
		}

		.content {
			@apply
				pt-[10px] pb-[10px]
			;
		}
	}

	&.short {
		.header {
			@apply cursor-pointer;
		}

		.icon-box {
			@apply leading-[45px] inline ml-[0.5rem];
		}
	}
}
</style>
