<script setup lang="ts">
import UserShortCard from '@/modules/boardGame/components/user/UserShortCard.vue';

interface User {
	id: string | number;
	name: string,
	public_name?: string,
	additional_fields?: object,
	avatar?: object,
}

interface Player {
	id: string | number;
	user_id: string | number;
	board_game_id: string | number;
	user: User;
}

interface Props {
	position?: number | null;
	playersOnCols?: Record<number | string, Player[]>;
}

const props = withDefaults(defineProps<Props>(), {
	position: null,
	playersOnCols: () => ({}),
});
</script>

<template>
	<div
			v-if="position && Object.keys(playersOnCols).length && playersOnCols[position]"
			class="players"
	>
		<span class="title">Игроки на этой клетке</span>
		<div class="players-wrap">
			<UserShortCard
					v-for="(player, key) in playersOnCols[position]"
					:key="key"
					:user="player.user"
					:player="player"
					theme="vertical"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.players {
	@apply mb-4;

	.title {
		@apply block normal-case mb-4;
	}

	.players-wrap {
		@apply flex flex-wrap gap-3 justify-center;
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
