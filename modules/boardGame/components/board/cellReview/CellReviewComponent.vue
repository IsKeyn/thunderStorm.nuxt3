<script setup>
import CellReviewForm from '@/modules/boardGame/components/board/cellReview/CellReviewForm.vue';
import OtherPlayersActionsWithCell from '@/modules/boardGame/components/board/cellReview/OtherPlayersActionsWithCell.vue';

import { helper } from '@/composables/helper.js'
const { route } = helper();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
});
</script>

<template>
	<CellReviewForm
			:eventSlug="route.params.slug"
			:element="element"
	/>

	<OtherPlayersActionsWithCell
			v-if="element?.boardPositionEffect"
			:eventSlug="route.params.slug"
			:element="element"
	/>
</template>

<style lang="scss" scoped />
