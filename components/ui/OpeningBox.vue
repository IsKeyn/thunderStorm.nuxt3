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
});

const contentStatus = ref(props.defaultContentStatus);

const toggleContent = (newStatus) => {
	if (newStatus === undefined || newStatus === null) {
		contentStatus.value = !contentStatus.value;
	} else {
		contentStatus.value = newStatus;
	}
}

const injectToggleContent = inject('injectToggleContent');

watch(injectToggleContent, () => {
	toggleContent(injectToggleContent.value);
})
</script>

<template>
	<div :class="['opening-box', classes, theme]">
		<div
				class="header"
				@click="toggleContent(null)"
		>
			<font-awesome-icon v-if="faIcon" :icon="faIcon"/><span :class="titleClasses">{{ maxTitleSize ? cutText(title, maxTitleSize) : title }}</span>
			<div class="icon-box">
				<font-awesome-icon v-if="contentStatus" :icon="['fas', 'angle-up']" :class="openIconClasses" />
				<font-awesome-icon v-else :icon="['fas', 'angle-down']" :class="openIconClasses" />
			</div>
		</div>
		<div
				v-show="contentStatus"
				:class="['content', contentClasses]"
		>
			<slot />
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
				pt-[10px] pr-[50px] pb-[10px] pl-[15px]
				bg-[var(--second-bg-color)]
				text-[18px]
				cursor-pointer
			;

			.icon-box {
				@apply
					absolute right-0 top-0
					w-[50px] h-[50px]
					text-[20px] text-center leading-[45px]
				;
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
