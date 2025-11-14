<script setup>
import { inject, watch } from "vue";

const emit = defineEmits(['deleteItem', 'useItem']);

const layoutMethods = inject('layoutMethods')

import { useSoundStore } from '@/stores/sound';
const soundStore = useSoundStore();

import { media } from '@/composables/media.js'
const {
	getResizeImg,
} = media();

import { userFunctions } from '@/composables/userFunctions.js';
const {
	isAuth,
	userStore,
} = userFunctions();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	inventoryItem: {
		type: Object,
		default: {},
	},
	classes: {
		type: String,
		default: '',
	},
	showControlPanel: {
		type: Boolean,
		default: false,
	},
	cutDescription: {
		type: Boolean,
		default: false,
	},
	showFullDescription: {
		type: Boolean,
		default: true,
	},
	useLightBox: {
		type: Boolean,
		default: false,
	},
	theme: {
		type: String,
		default: 'default',
	},
	openFullDescription: {
		type: Boolean,
		default: false,
	},
	playSound: {
		type: Boolean,
		default: false,
	},
	showDropChance: {
		type: Boolean,
		default: true,
	},
});

const getTypeClass = (type) => {
	switch (type) {
		case 0: return 'green';
		case 1: return 'red';
		case 2: return '';
		case 3: return 'blue';
	}
}

// Watcher для props.playSound
watch(() => props.playSound, (newVal) => {
	if (props.element.item?.sound && newVal) {
		soundStore.soundObj = props.element.item.sound;
		soundStore.playSound = true;
	}
}, { immediate: true });
</script>

<template>
	<div :class="[
			'item-box',
			getTypeClass(element.item?.type),
			showControlPanel || element.quantity > 1 ? 'add-padding-right' : '',
			theme,
			classes,
	]">
		<img
				v-if="element.item.image"
				:src="getResizeImg(element.item.image)"
				:alt="element.item.name"
				:title="element.item.name"
				:class="[useLightBox ? 'cursor-pointer' : '']"
				@click="useLightBox ? layoutMethods.setOpenedImage(element.item.image) : false"
		>
		<div class="info">
			<span class="name">
				{{ element.item.name }}
			</span>
			<span
					:class="[
							'description',
							cutDescription ? 'cut-description' : '',
					]"
			>
				{{ element.item.short_description ? element.item.short_description : element.item.full_description }}
			</span>
			<ui-OpeningBox
					v-if="
						showFullDescription
						&& ((element.item.short_description && element.item.full_description) || element.item.authorUser)
					"
					classes="mb-0"
					theme="short"
					title="Подробное описание"
					:defaultContentStatus="openFullDescription"
			>
				{{ element.item.full_description }}

				<span class="additional-box">
					Автор: {{ element.item.authorUser ? element.item.authorUser.name : 'InSH Event Team' }}
				</span>
			</ui-OpeningBox>
			<span v-if="showDropChance" class="additional-box">
					Относительный шанс выпадения: {{ element.item.drop_chance }}%
			</span>
			<div v-if="showControlPanel">
				<button
						class="btn btn-simple mr-2"
						@click="emit('useItem', inventoryItem)"
				>Использовать</button>
			</div>
		</div>
<!--		<div-->
<!--				v-if="showControlPanel"-->
<!--				class="control-panel"-->
<!--		>-->
<!--			<span-->
<!--					class="use-button"-->
<!--					@click="emit('useItem', inventoryItem)"-->
<!--			>-->
<!--				<font-awesome-icon :icon="['fas', 'check']" />-->
<!--			</span>-->
<!--		</div>-->
		<div
				v-if="element.quantity > 1"
				class="count-panel"
		>
			x{{ element.quantity }}
		</div>
	</div>
</template>

<style lang="scss" scoped>

.item-box {
	@apply p-2 mb-2 bg-[var(--second-bg-color)] rounded-none flex relative min-h-[86px];

	&.gamblingGame {
		@apply w-full;
	}

	&.default {
		&.red {
			border-left: 8px solid #600000;
		}

		&.green {
			border-left: 8px solid #005d00;
		}

		&.blue {
			border-left: 8px solid #000460;
		}
	}

	&.active {
		@apply bg-[var(--second-active-color)];
	}

	&.add-padding-right {
		@apply pr-[3rem];
	}

	&.default {
		//&:hover {
		//	@apply bg-[var(--second-active-color)];
		//}
	}

	img {
		@apply w-[70px] h-[70px];
	}

	.info {
		@apply pl-3 pr-3 text-[var(--main-text-color)];

		.name {
			@apply block mb-1 uppercase;
		}

		.description {
			@apply block;

			&.cut-description {
				@apply w-[200ch];

				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}

		.additional-box {
			@apply block mt-2;
		}
	}

	.control-panel {
		@apply absolute right-[1rem];

		.use-button {
			@apply bg-[var(--success-color)] block pl-[0.6rem] pr-[0.6rem] pt-[0.3rem] pb-[0.3rem] text-center mb-[0.3rem] cursor-pointer;
		}

		.close-button {
			@apply bg-[var(--error-color)] block pl-[0.6rem] pr-[0.6rem] pt-[0.3rem] pb-[0.3rem] text-center;
		}
	}

	.count-panel {
		@apply absolute right-0 top-0 flex justify-between items-center text-[1.5rem] h-full p-[1rem];
	}
}
</style>

<style lang="scss" scoped>
.street-light-theme {
	.item-box {
		.info {
			@apply text-[var(--main-dark-text-color)];
		}
	}
}
</style>
