<script setup>
import { inject, watch } from "vue";

const props = defineProps({
	title: {
		type: String,
		default: 'Открыть контент',
	},
});

const contentStatus = ref(false);

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
	<div class="opening-box">
		<div
				class="header"
				@click="toggleContent(null)"
		>
			{{ title }}

			<div class="icon-box">
				<font-awesome-icon v-if="contentStatus" :icon="['fas', 'angle-up']" />
				<font-awesome-icon v-else :icon="['fas', 'angle-down']" />
			</div>
		</div>
		<div
				v-show="contentStatus"
				class="content"
		>
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.opening-box {
	@apply mb-4;

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
</style>
