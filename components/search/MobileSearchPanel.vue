<script setup>
import FastSearchLine from '@/components/search/FastSearchLine.vue';

const emit = defineEmits(['showHideMobileSearch']);
</script>

<template>
	<div class="search-panel">
		<FastSearchLine
				:clearButtonUseActivateLinkHandler="true"
				@parentHandler="$emit('showHideMobileSearch')"
		/>
	</div>
</template>

<style lang="scss" scoped>
.search-panel {
	@apply
		fixed z-[701]
		w-full
		p-[var(--main-mobile-padding)]
		bg-[var(--main-block-color)]
	;
}
</style>
