<script setup>
import PublicAvatar from '@/components/user/avatar/PublicAvatar.vue';

const props = defineProps({
	user: {
		type: Object,
		required: true,
	},
	classes: {
		type: String,
		default: '',
	},
	counterValue: {
		type: Number,
		default: 0,
	},
});
</script>

<template>
	<div
			:class="['simple-user-card', classes]"
			@click="$emit('parentFunction', user.id)"
	>
		<PublicAvatar
			:user="user"
			class="min-w-[50px]"
			classes="w-[50px] h-[50px]"
		/>
		<span class="name">{{ user.name }}</span>
		<span
				v-if="counterValue"
				class="notifications"
		>
			{{ counterValue }}
		</span>
	</div>
</template>

<style lang="scss" scoped>
.simple-user-card {
	@apply relative flex items-center cursor-pointer pl-1 pr-3;
	border-left: 4px solid var(--third-bg-color);

	&:hover {
		border-left: 4px solid var(--second-hover-color);
	}

	&.active {
		border-left: 4px solid var(--success-color);
	}

	.name {
		@apply ml-2;
	}

	.notifications {
		@apply
			w-[1.7rem] h-[1.7rem]
			flex rounded-full justify-center items-center
			bg-[var(--second-block-color)] text-[var(--main-dark-text-color)]
			absolute z-[10] left-[2rem] bottom-[-0.3rem]
		;
	}
}
</style>
