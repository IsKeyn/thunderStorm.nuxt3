<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
	headerHeight: {
		type: Number,
		required: true,
	},
});

const burgerMenuClasses = computed(() => {
	return `burger-menu`;
});

const mainStyle = computed(() => {
	return `top: ${document.querySelector('header').offsetHeight}px`;
});

onMounted(() => {
	const body = document.querySelector('body');
	body.classList.add('overflow-hidden');
});

onUnmounted(() => {
	const body = document.querySelector('body');
	body.classList.remove('overflow-hidden');
});
</script>

<template>
	<div
			:class="burgerMenuClasses"
			:style="mainStyle"
		>
		<div class="wrapper">
			<div class="flex">
				<div class="menu-parent-block">
					<div class="main-menu">
						<MenuByTypes
								fetchUrl="menu/getArticlesMenu"
								:showTitles="true"
								parentClass="menu-block"
						/>
					</div>
					<footer>
						<MenuByTypes
								parentClass="menu-block"
						/>
					</footer>
				</div>
<!--				<div class="media-parent-block">-->
<!--					&lt;!&ndash;		Сюда поставить слайдер			&ndash;&gt;-->
<!--					<a href="https://vk.com/keyntr" target="_blank">-->
<!--						<img src="https://sun9-70.userapi.com/impf/c624329/v624329145/1a3c6/o3VoQRbGFjc.jpg?size=819x2048&quality=96&sign=d13f427252c4d393f4b6624db246996d&type=album">-->
<!--					</a>-->
<!--				</div>-->
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.menu-parent-block {
	.main-menu {
		.menu-block {
			@apply col-span-6 md:col-span-3;
		}
	}

	footer {
		.menu-block {
			@apply col-span-6 md:col-span-3;
		}
	}
}
</style>

<style lang="scss" scoped>
.burger-menu {
	@apply fixed left-0 z-[600] w-full h-full overflow-hidden;
	color: var(--second-text-color);

	.wrapper {
		@apply
			relative
			w-full md:w-[var(--main-block-width)] h-full
			mt-0 mr-auto mb-[300px] ml-auto
			pt-[25px] pr-[1rem] md:pr-[60px] pb-[25px] md:pl-[60px] pl-[1rem]
			overflow-auto
			bg-[var(--main-block-color)]
		;

		.menu-parent-block {
			@apply w-full;

			.main-menu {
				@apply h-[70%] grid grid-cols-12 mb-4;

				.menu-block {
					@apply col-span-6 md:col-span-3;
				}
			}

			footer {
				@apply h-[30%] grid grid-cols-12;
			}
		}

		.media-parent-block {
			@apply hidden md:block w-[20%];

			img {
				@apply w-full;
			}
		}
	}
}

@media (max-width: 768px) {
	.burger-menu {
		.wrapper {

			.close-button {
				margin-top: 15px;
				margin-right: 15px;
			}

			.main-menu {
				display: block;
				height: unset;

				.menu-block {
					margin-bottom: 20px;
				}
			}

			.menu-block {
				width: 100%;
			}

			footer {
				display: block;

				.menu-block {
					margin-bottom: 20px;
				}
			}
		}
	}
}
</style>
