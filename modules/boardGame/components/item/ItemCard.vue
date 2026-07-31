<script setup>
const emit = defineEmits(['useItem', 'sellItem', 'buyItem', 'withdrawnItem']);

import { useSoundStore } from '@/stores/sound';
const soundStore = useSoundStore();

import { bgPlayer } from '@/composables/boardGame/bgPlayer.js'
const { player, isActivePlayer } = bgPlayer();

import { media } from '@/composables/media.js'
const { getResizeImg } = media();

import { helper } from '@/composables/helper.js'
const { route } = helper();

import { bgItems } from '@/composables/boardGame/bgItems.js'
const { calcShopPrice } = bgItems();

const props = defineProps({
	element: {
		type: Object,
		default: {},
	},
	inventoryItem: {
		type: Object,
		default: {},
	},
	shopItem: {
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
	salesman: {
		type: Object,
		default: {},
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

const togglePlay = () => {
	if (props.element.item?.sound) {
		soundStore.soundObj = props.element.item.sound;
		soundStore.playSound = true;
	}
}

watch(() => props.playSound, (newVal) => {
	if (newVal) {
		togglePlay();
	}
}, { immediate: true });

const getItemQuality = (dropChance) => {
	if (Number(dropChance) >= 10) {
		return 'uncommon';
	} else if (Number(dropChance) >= 8) {
		return 'rare';
	} else if (Number(dropChance) >= 6) {
		return 'epic shimmer'
	} else if (Number(dropChance) >= 4) {
		return 'legendary shimmer';
	} else if (Number(dropChance) >= 2) {
		return 'mythic shimmer';
	} else if (Number(dropChance) === 0) {
		return 'artifact shimmer';
	}
}
</script>

<template>
	<div :class="[
			'item-box',
			getTypeClass(element.item?.type),
			element.quantity > 1 ? 'add-padding-right' : '',
			theme,
			classes,
	]">
		<div :class="['item-quality-color', getItemQuality(element?.item?.drop_chance)]">
			<span class="name">{{ element.item.name }}</span>
			<template v-if="props.element.item?.sound">
				<font-awesome-icon v-if="!soundStore.playSound" class="cursor-pointer" icon="fa-solid fa-circle-play" @click="togglePlay" />
				<font-awesome-icon v-else icon="fa-solid fa-circle-play" beat-fade />
			</template>
		</div>
		<div class="wrapper">
			<template v-if="element.item.image">
				<img
						v-if="useLightBox"
						:src="getResizeImg(element.item.image)"
						:alt="element.item.name"
						:title="element.item.name"
						:class="['cursor-pointer media-obj']"
						:media-id="element.item.image.id"
				>
				<img
						v-else
						:src="getResizeImg(element.item.image)"
						:alt="element.item.name"
						:title="element.item.name"
				>
			</template>

			<div class="info">
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
						Автор: <router-link
								v-if="element.item.authorUser"
								:to="`/e/${route.params.slug}/player/${element.item.authorUser.name}`"
								class="hover-line"
								title="Открыть профайл"
								target="_blank"
						>{{ element.item.authorUser.name ?? element.item.authorUser.public_name }}</router-link>
						<span v-else>InSH Event Team</span>
					</span>
				</ui-OpeningBox>
				<span v-if="showDropChance" class="additional-box">
						Относительный шанс выпадения: {{ element.item.drop_chance }}%
				</span>
				<span v-if="price" class="additional-box">
						Цена продажи: {{ element.item.price }} очков
				</span>
				<div v-if="showControlPanel">
					<button
							class="btn btn-simple mr-2"
							@click="emit('useItem', inventoryItem)"
					>Использовать</button>
					<button
							v-if="element.item.price"
							class="btn btn-simple mr-2"
							@click="emit('sellItem', inventoryItem)"
					><font-awesome-icon icon="fa-solid fa-cart-shopping" /> Продать</button>
				</div>
				<div
						v-if="theme === 'shopItem'"
						class="mt-2"
				>
					<div
							v-if="Object.keys(salesman).length"
							class="mb-2"
					>
						Продавец: <router-link
							:to="`/e/${route.params.slug}/player/${salesman.name}`"
							class="hover-line"
							title="Открыть профайл"
							target="_blank"
					>{{ salesman.name ?? salesman.public_name }}</router-link>
					</div>
					<div class="mb-2">
						Стоимость: {{ calcShopPrice(element.item.price) }}
					</div>
					<div v-if="isActivePlayer">
						<button
								v-if="element.item.price && salesman.id !== player.user_id"
								class="btn btn-simple mr-2"
								@click="emit('buyItem', shopItem)"
						><font-awesome-icon icon="fa-solid fa-cart-shopping" /> Купить</button>
						<button
								v-if="salesman.id === player.user_id"
								class="btn btn-simple mr-2"
								@click="emit('withdrawnItem', shopItem)"
						><font-awesome-icon icon="fa-solid fa-arrow-rotate-left" /> Отозвать</button>
					</div>
				</div>
			</div>
			<div
					v-if="element.quantity > 1"
					class="count-panel"
			>
				x{{ element.quantity }}
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.item-box {
	@apply bg-[var(--second-bg-color)] rounded-none relative min-h-[86px] p-2 mb-2 ;

	&.gamblingGame {
		@apply w-full;
	}

	&.default,
	&.shopItem {
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

	.item-quality-color {
		@apply absolute top-0 left-0 w-full h-[2.6rem] z-0 pl-2 flex items-center text-[var(--main-dark-text-color)];

		.name {
			@apply block uppercase relative z-10 mr-2;
		}

		&.uncommon {
			background-color: #237a09;
		}

		&.rare {
			background-color: #193480;
		}

		&.epic {
			background-color: #4e1e75;
		}

		&.legendary {
			background-color: #c45f00;
		}

		&.mythic {
			background-color: #10757e;
		}

		&.artifact {
			background-color: #9d1f1f;
		}

		/* ИСПРАВЛЕННЫЙ КЛАСС */
		&.shimmer {
			@apply overflow-hidden;

			&::after {
				content: '';

				@apply absolute inset-0 -translate-x-full;

				background: linear-gradient(
								90deg,
								transparent,
								rgba(255, 255, 255, 0.25),
								transparent
				);
				animation: shimmer 3s infinite ease-in-out;
				will-change: transform;
				pointer-events: none; /* Чтобы блик не перехватывал клики */
			}
		}
	}

	.wrapper {
		@apply z-0 flex mt-[2.6rem];

		img {
			@apply w-[70px] h-[70px];
		}

		.info {
			@apply pl-3 pr-3 text-[var(--main-text-color)];

			.description {
				@apply block;

				&.cut-description {
					@apply w-[30ch] md:w-[55ch] lg:w-[75ch] 2xl:w-[100ch] fhd:w-[130ch];

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
}

@keyframes shimmer {
	0% { transform: translateX(-100%); }
	100% { transform: translateX(100%); }
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
