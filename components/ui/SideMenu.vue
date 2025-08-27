<script setup>
import { ref } from 'vue';

const props = defineProps({
	menu: {
		type: Array,
		default: [],
	},
	theme: {
		type: String,
		default: 'left',
	},
});

const isExpanded = ref(false);
const showHideText = ref(false);

const toggleSidebar = () => {
	if (!isExpanded.value) {
		setTimeout(() => {
			showHideText.value = true;
		},100);
	} else {
		showHideText.value = false;
	}

	isExpanded.value = !isExpanded.value;
};
</script>

<template>
	<div
			:class="['sidebar', isExpanded ? 'sidebar-expanded' : '']"
	>
		<div
				class="sidebar-header"
		>
			<button
					class="sidebar-toggle"
					@click="toggleSidebar">
				<font-awesome-icon v-if="isExpanded" :icon="['fas', 'circle-left']" />
				<font-awesome-icon v-else :icon="['fas', 'circle-right']" /> <span v-if="showHideText" class="sidebar__text">Скрыть</span>
			</button>
		</div>

		<nav class="sidebar-nav">
			<ul
					v-if="menu.length > 0"
					class="sidebar-list"
			>
				<li
						v-for="item in menu"
						:key="item.name"
						class="sidebar-item"
						:title="item.name"
				>
					<NuxtLink :to="item.path" class="sidebar-link">
						<font-awesome-icon
								v-if="theme === 'left'"
								:icon="item.icon"
						/>
						<span class="sidebar-text">{{ item.name }}</span>
					</NuxtLink>
				</li>
			</ul>
		</nav>
	</div>
</template>

<style lang="scss" scoped>
.sidebar {
	@apply
		w-[60px]
		bg-[var(--second-block-color)]
		overflow-hidden
	;

	transition: width 0.3s ease;

	&.sidebar-expanded {
		@apply w-[250px];

		.sidebar-nav {
			.sidebar-list {
				.sidebar-item {
					.sidebar-link {
						.sidebar-text {
							@apply opacity-100;
						}
					}
				}
			}
		}
	}

	.sidebar-header {
		@apply
			flex items-center justify-center
			h-[60px]
		;

		border-bottom: 1px solid rgba(255, 255, 255, 0.1);

		.sidebar-toggle {
			@apply cursor-pointer p-[1rem] text-[var(--main-dark-text-color)];
		}
	}

	.sidebar-nav {
		@apply pt-[1rem] pb-[1rem];

		.sidebar-list {
			@apply p-0 m-0;

			list-style: none;

			.sidebar-item {
				@apply mb-[5px];

				.sidebar-link {
					@apply
						flex items-center text-[var(--main-dark-text-color)]
						pt-[12px] pb-[12px] pr-[20px] pl-[20px]
					;

					text-decoration: none;
					transition: background-color 0.3s;
					white-space: nowrap;

					&:hover {
						@apply bg-[var(--main-hover-color)];
					}

					.sidebar-text {
						@apply ml-[1rem] opacity-0;

						transition: opacity 0.3s;
					}
				}
			}
		}
	}
}

.router-link-active {
	background-color: rgba(255, 255, 255, 0.2);
}
</style>
