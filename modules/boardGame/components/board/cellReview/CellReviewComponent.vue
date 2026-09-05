<script setup>
import CellReviewForm from '@/modules/boardGame/components/board/cellReview/CellReviewForm.vue';

</script>

<template>
	<CellReviewForm />


	<div>
<!--		<GameFinishForm-->
<!--				v-if="showForm && type !== 'coop'"-->
<!--				:game="currentGame.game.game"-->
<!--				:points="currentGame.game.computed_points ? currentGame.game.computed_points : currentGame.game.points"-->
<!--				:rerollPenalty="currentGame.rerollPenalty"-->
<!--				:streak="player.streak"-->
<!--				:type="type"-->
<!--				:pointsForFinishGame="currentGame.points_for_finish"-->
<!--				:gameType="currentGame.type"-->
<!--				@toggleFormVisible="toggleFormVisible"-->
<!--				@updateData="emit('updateData', $event)"-->
<!--		/>-->

<!--		<template v-if="currentGame?.game?.game?.slug">-->
<!--			<OtherPlayersActionsWithGame-->
<!--					:eventSlug="route.params.slug"-->
<!--					:gameSlug="currentGame.game.game.slug"-->
<!--			/>-->
<!--		</template>-->
	</div>
</template>

<style lang="scss" scoped />
