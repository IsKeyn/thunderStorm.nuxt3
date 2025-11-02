<script setup>
import Tabs from '@/components/ui/tabs/Tabs.vue';
import SideMenuItem from '@/components/ui/SideMenu/SideMenuItem.vue';

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
	widthClass: {
		type: String,
		default: 'width450',
	},
	isExpandedProps: {
		type: Boolean,
		default: true,
	},
});

const isExpanded = ref(props.isExpandedProps);
const showHideText = ref(props.isExpandedProps);

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

const textCutSize = computed(() => {
	switch (props.widthClass) {
		case 'width250': return 10;
		case 'width350': return 15;
		case 'width450': return 28;
	}
});
</script>

<template>
	<div
			:class="['sidebar', isExpanded ? ['sidebar-expanded', props.widthClass] : '']"
	>
		<div
				class="sidebar-header"
		>
			<button
					class="sidebar-toggle"
					@click="toggleSidebar"
			>
				<font-awesome-icon v-if="isExpanded" :icon="['fas', 'circle-left']" />
				<font-awesome-icon v-else :icon="['fas', 'circle-right']" /> <span v-if="showHideText" class="sidebar__text">Меню</span>
			</button>
		</div>

		<nav class="sidebar-nav">
			<SideMenuItem
					:menu="menu"
					:theme="theme"
					:textCutSize="textCutSize"
			/>
		</nav>
	</div>
</template>

<style lang="scss">
.sidebar {
	@apply
		w-[60px]
		bg-[var(--second-block-color)]
		overflow-hidden
	;

	transition: width 0.3s ease;

	&.sidebar-expanded {
		&.width250 {
			@apply w-[250px];
		}

		&.width350 {
			@apply w-[350px];
		}

		&.width450 {
			@apply w-[450px];
		}

		.sidebar-nav {
			.sidebar-list {
				.sidebar-item {
					.sidebar-link {
						.sidebar-text {
							@apply opacity-100;
						}
					}

					.header {
						.sidebar-text-op {
							@apply opacity-100;
						}

						.icon-box {
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
			@apply cursor-pointer p-[1rem] text-[var(--third-dark-text-color)];
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
						flex items-center text-[var(--third-dark-text-color)]
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

						white-space: nowrap;
						transition: opacity 0.3s;
					}
				}

				.header {
					@apply text-[1rem] pl-[20px] pr-[20px] bg-[var(--second-block-color)] flex items-center;

					.sidebar-text-op {
						@apply ml-[1rem] opacity-0;

						white-space: nowrap;
					}

					.icon-box {
						@apply opacity-0;
					}
				}
			}
		}
	}

	.router-link-active {
		background-color: rgba(255, 255, 255, 0.2);
	}
}
</style>
