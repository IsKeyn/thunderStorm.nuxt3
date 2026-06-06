<script setup>
import { onMounted } from 'vue'

import FastSearchLine from '@/components/search/FastSearchLine.vue';
import AuthIconComponent from '@/components/user/AuthIconComponent.vue';
import BurgerMenu from '@/components/menu/BurgerMenu.vue';
import MobileSearchPanel from '@/components/search/MobileSearchPanel.vue';

const props = defineProps({
	headType: {
		type: String,
		default: 'part-of-page-head',
	},
	easterEgg: {
		type: Boolean,
		default: false,
	},
	mainPageText: {
		type: String,
		default: 'На главную',
	},
});

const route = useRoute();
const isMainPage = computed(() => {
	return route.path === '/';
});

const siteName = computed(() => {
	return props.easterEgg ? 'InSilentHill.Ru' : 'В Silent Hill';
});

const headerHeight = computed(() => {
	return document.querySelector('header').offsetHeight;
});

const showBurger = ref(false);
const showHideMenu = (showMenu) => {
	showBurger.value = showMenu;
}

const headClass = ref(false);

onMounted(() => {
	headClass.value = props.headType;
	window.addEventListener("scroll", (event) => { scroll(event); });
})

const scroll = () => {
	headClass.value = window.scrollY === 0 ? 'part-of-page-head' : 'fixed-head';
}

const showMobileSearchPanel = ref(false);
const showHideMobileSearch = () => {
	showMobileSearchPanel.value = !showMobileSearchPanel.value;
}
</script>

<template>
	<header>
		<MobileSearchPanel
				v-if="showMobileSearchPanel"
				@showHideMobileSearch="showHideMobileSearch"
		/>
		<div
				class="float-header"
				:class="headClass"
		>
			<div class="wrapper">
				<div class="left-block">
					<template v-if="!showBurger">
						<template v-if="!isMainPage">
							<router-link
									to="/"
									class="main-page-link"
									@click="showBurger = false"
							>
								<span class="menu-element">{{ mainPageText }}</span>
								<font-awesome-icon
										:icon="['fas', 'house']"
										class="icon menu-element-mobile menu-button"
								/>
							</router-link>
						</template>
						<template v-else>
							<span class="menu-element" @click="easterEgg = !easterEgg">{{ siteName }}</span>
							<font-awesome-icon
									:icon="['fas', 'house']"
									class="icon menu-element-mobile menu-button"
							/>
						</template>
					</template>
					<template v-else>
						<span class="menu-element">Меню сайта</span>
						<font-awesome-icon
								:icon="['fas', 'house']"
								class="icon menu-element-mobile menu-button"
						/>
					</template>
<!--					<router-link-->
<!--							to="/about/"-->
<!--							class="hide-on-desktop"-->
<!--							@click="showBurger = false"-->
<!--					>-->
<!--						<i class="fas fa-info-circle menu-element-mobile menu-button"></i>-->
<!--					</router-link>-->
				</div>
				<div class="center-block">
<!--					<FastSearchLine-->
<!--							class="search-line"-->
<!--							placeholder="Начните вводить текст для поиска"-->
<!--							@parentHandler="showHideMenu(false)"-->
<!--					/>-->
				</div>
				<div class="right-block">
					<font-awesome-icon
							:icon="['fas', 'magnifying-glass']"
							class="icon search-icon"
							@click="showHideMobileSearch"
					/>
					<div class="w-[25px]">
						<font-awesome-icon
								v-if="!showBurger"
								:icon="['fas', 'bars']"
								class="icon"
								@click="showBurger = !showBurger"
						/>
						<font-awesome-icon
								v-else
								:icon="['fas', 'xmark']"
								class="icon"
								@click="showBurger = !showBurger"
						/>
					</div>
					<AuthIconComponent
							v-if="route.query.dev === 'true'"
							class="ml-[25px]"
							@showHideMenu="showHideMenu"
					/>
				</div>
			</div>
		</div>
	</header>
	<BurgerMenu
			v-if="showBurger"
			:headerHeight="headerHeight"
			@showHideMenu="showHideMenu"
	/>
</template>

<style lang="scss" scoped>
header {
	@apply min-h-[80px];

	.float-header {
		@apply w-full min-[1400px]:w-[var(--main-block-width)] bg-[var(--main-block-color)];

		.wrapper {
			@apply
				grid grid-cols-12
				pl-[--main-mobile-left-padding] lg:pl-0
				pr-[--main-mobile-right-padding] lg:pr-0
				pt-[20px] lg:pt-0
				pb-[20px] lg:pb-0
			;

			a {
				color: var(--third-text-color);

				&.hover {
					color: var(--third-text-color);
				}
			}

			.menu-element-mobile {
				@apply
					lg:hidden
					mr-[8px]
				;
			}

			.menu-element {
				@apply hidden lg:block;
			}
		}

		.left-block {
			@apply
				flex
				col-span-5 lg:col-span-3
				lg:pt-[25px] lg:pb-[25px] lg:pl-[60px]
			;
		}

		.center-block {
			@apply
				col-span-2 lg:col-span-6
				flex
				lg:pt-[25px] lg:pb-[25px]
			;

			.search-line {
				@apply hidden lg:block;
			}
		}

		.right-block {
			@apply
				relative
				col-span-5 lg:col-span-3
				justify-end flex
				lg:pt-[25px] lg:pr-[60px] lg:pb-[25px]
			;

			.search-icon {
				@apply
					block lg:hidden
					mr-[20px]
				;
			}
		}

		.menu-button {
			@apply text-[30px] cursor-pointer;

			color: var(--third-text-color);
		}

		&.fixed-head {
			@apply
				fixed
				top-[0]
				z-[700];
		}
	}
}

@media (max-width: 768px) {
	header {
		.float-header {
			.wrapper {
				//max-width: 100%;
				//
				//.left-block, .right-block {
				//	padding: 10px 10px;
				//}

				.menu-element {
					display: none;
				}

				.menu-element-mobile {
					display: block;
				}
			}
		}
	}
}
</style>
