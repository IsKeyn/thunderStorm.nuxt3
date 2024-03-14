<script setup>
import FastSearchLine from '@/components/search/FastSearchLine.vue';
import AuthIconComponent from '@/components/user/AuthIconComponent.vue';
import BurgerMenu from '@/components/menu/BurgerMenu.vue';

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
import { onMounted } from 'vue'
onMounted(() => {
	headClass.value = props.headType;
	window.addEventListener("scroll", (event) => { scroll(event); });
})

const scroll = () => {
	headClass.value = window.scrollY === 0 ? 'part-of-page-head' : 'fixed-head';
}
</script>

<template>
	<header>
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
								<i class="fas fa-home menu-element-mobile menu-button"></i>
							</router-link>
						</template>
						<template v-else>
							<span class="menu-element" @click="easterEgg = !easterEgg">{{ siteName }}</span>
							<i class="fas fa-home menu-element-mobile menu-button"></i>
						</template>
					</template>
					<template v-else>
						<span class="menu-element">Меню сайта</span>
					</template>
					<router-link
							to="/about/"
							class="hide-on-desktop"
							@click="showBurger = false"
					>
						<i class="fas fa-info-circle menu-element-mobile menu-button"></i>
					</router-link>
				</div>
				<div class="center-block">
					<FastSearchLine
							@showHideMenu="showHideMenu"
					/>
				</div>
				<div class="right-block">
					<AuthIconComponent
							@showHideMenu="showHideMenu"
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
		@apply w-[var(--main-block-width)] bg-[var(--main-block-color)];

		.wrapper {
			@apply grid grid-cols-12;

			a {
				color: var(--third-text-color);

				&.hover {
					color: var(--third-text-color);
				}
			}

			.menu-element-mobile {
				@apply hidden mr-[8px];
			}
		}

		.left-block {
			@apply col-span-3 flex pt-[25px] pb-[25px] pl-[60px];
		}

		.center-block {
			@apply col-span-6 flex pt-[25px] pb-[25px];
		}

		.right-block {
			@apply col-span-3 justify-end flex pt-[25px] pr-[60px] pb-[25px];
		}

		.menu-button {
			@apply text-[30px] cursor-pointer;

			color: var(--third-text-color);
		}

		&.fixed-head {
			@apply fixed top-[0] z-[700];
		}
	}
}

@media (max-width: 768px) {
	header {
		height: unset;

		.float-header {
			.wrapper {
				max-width: 100%;

				.left-block, .right-block {
					padding: 10px 10px;
				}

				.menu-element {
					display: none;
				}

				.menu-element-mobile {
					display: block;
				}
			}

			&.fixed-head {
				position: unset;
			}
		}
	}
}
</style>
