<script setup>
import Modal from '@/components/modals/Modal.vue';
import PlayersList from '@/modules/boardGame/components/pages/PlayersList.vue';
import PlayerCardV2 from '@/modules/boardGame/components/user/player/playerCards/PlayerCardV2.vue';

import { ref } from 'vue'

const emit = defineEmits(['update:modelValue', 'onClickFunc']);

import { helper } from '@/composables/helper.js'
const { route } = helper();

const props = defineProps({
	modelValue: {
		type: Object,
		default: {},
	},
	bgClasses: {
		type: String,
		default: '',
	},
	target: {
		type: String,
		default: '',
	},
	currentPlayer: {
		type: Object,
		default: {},
	},
	expectedPlayers: {
		type: Array,
		default: [],
	},
	selectedPlayerTheme: {
		type: String,
		default: 'default',
	},
});

const selectedOption = ref(null);
const isOpen = ref(false);

const toggleOptions = () => {
	isOpen.value = !isOpen.value;
}

const selectOption = (option) => {
	selectedOption.value = option
	isOpen.value = false

	emit('update:modelValue', option);
}

const showPagination = ref(true);
const showFilters = ref(true);

const defaultFiltersProp = computed(() => {
	const returnData = {};

	if (props.expectedPlayers) {
		returnData.exceptPlayer = props.expectedPlayers;
	}

	if (props.target === 'nearestPlayer') {
		returnData.nearestOnly = {
			user_id: props.currentPlayer.user.id,
			bg_slug: route.params.slug,
		};
	}

	if (props.target.includes('noFurther')) {
		const maxDistance = Number(props.target.split('_')[1]);

		if (maxDistance) {
			returnData.distance = {
				user_id: props.currentPlayer.user.id,
				max_distance: maxDistance,
			};
		}
	}

	if (props.target === 'notPlayBattleForPoints') {
		returnData.notPlayBattleForPoints = {
			user_id: props.currentPlayer.user.id,
			bg_slug: route.params.slug,
		};
	}

	if (props.target === 'notInvitedToCoop') {
		returnData.notInvitedToCoop = {
			user_id: props.currentPlayer.user.id,
			bg_slug: route.params.slug,
		};
	}

	return returnData;
});

const usedFiltersProp = [
	{
		name: 'exceptPlayer',
		langName: 'За исключением игроков',
		type: 'hidden',
	},
	{
		name: 'limit',
		langName: 'Лимит',
		type: 'hidden',
	},
	{
		name: 'distance',
		langName: 'Лимит',
		type: 'hidden',
	},
	{
		name: 'nearestOnly',
		langName: 'Только ближайщие',
		type: 'hidden',
	},
	{
		name: 'notPlayBattleForPoints',
		langName: 'Игроки, с которыми ещё не играли в битву за очки',
		type: 'hidden',
	},
	{
		name: 'notInvitedToCoop',
		langName: 'Игроки, с которыми вы ещё не играли в кооп',
		type: 'hidden',
	},
];
</script>

<template>
	<div class="select-wrapper">
		<div
				:class="['selected']"
				@click="toggleOptions"
		>
			<PlayerCardV2
					v-if="selectedOption"
					:element="selectedOption"
					:theme="selectedPlayerTheme"
					:bgClasses="bgClasses"
					:hideStatusEffect="true"
					:openProfile="false"
			/>
			<span
					v-else
					:class="['choice-player', bgClasses]"
			>Выберите игрока</span>
		</div>

		<Modal
				:showOpenModal="isOpen"
				size="full-width"
				:fullCloseModal="true"
				@toggleModal="toggleOptions"
		>
			<div class="modal-parent">
				<h3 class="modal-title">Выбор игрока, на кого применить</h3>
				<div class="link-parent-box">
					<PlayersList
							filterNamePostfix="select_players"
							:showPageHeader="false"
							:usedFiltersProp="usedFiltersProp"
							:defaultFiltersProp="defaultFiltersProp"
							:showPagination="showPagination"
							:showFilters="showFilters"
							clickDoType="emit"
							:showSelectRandomPlayer="true"
							@onClickFunc="selectOption($event)"
					/>
				</div>
			</div>
		</Modal>
	</div>
</template>

<style lang="scss" scoped>
.select-wrapper {
	@apply relative select-none;

	.selected {
		@apply pt-[10px] pb-[10px] cursor-pointer;

		.choice-player {
			@apply p-2 pr-[3rem] mb-2 bg-[var(--second-bg-color)] rounded flex relative cursor-pointer;
		}
	}

	.options {
		@apply
			absolute z-[10]
			w-full max-h-[20rem] overflow-auto
			bg-[var(--third-bg-color)]
		;

		.option {
			@apply
				pr-[10px] pl-[10px]
				cursor-pointer
			;

			&:hover {}
		}
	}
}
</style>
