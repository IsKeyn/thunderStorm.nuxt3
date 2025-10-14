<script setup>
import UserShortCard from '@/modules/boardGame/components/user/UserShortCard.vue';
import CellEffectCard from '@/modules/boardGame/components/board/CellEffectCard.vue';

const props = defineProps({
	position: {
		type: Number,
		required: true,
	},
	playersOnCols: {
		type: Object,
		default: {},
	},
	effects: {
		type: Object,
		required: true,
	},
});
</script>

<template>
	<div
			v-if="playersOnCols[position]"
			class="players mb-4"
	>
		<span class="title">Игроки на этой клетке</span>
		<div class="players-wrap">
			<UserShortCard
					v-for="(player, key) in playersOnCols[position]"
					:key="key"
					:user="player.user"
					theme="vertical"
			/>
		</div>
	</div>
	<div
			v-if="effects.length > 0"
			class="mb-4"
	>
		<span class="title">Эффекты клетки</span>
		<CellEffectCard
				v-for="(element, key) in effects"
				:key="key"
				:element="element"
		/>
	</div>
</template>

<style lang="scss" scoped>
.title {
	@apply block normal-case mb-4;
}

.players {
	.players-wrap {
		@apply flex gap-3 justify-center;
	}
}
</style>

<style lang="scss">
.players-wrap {
	.user-box {
		&.vertical {
			.avatar-box {
				@apply justify-center;
			}
		}
	}
}
</style>
