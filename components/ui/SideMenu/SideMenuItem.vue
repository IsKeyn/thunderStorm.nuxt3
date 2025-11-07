<script setup>
import SideMenuItem from '@/components/ui/SideMenu/SideMenuItem.vue';

const emit = defineEmits(['onClickEmit']);

import { helper } from '@/composables/helper.js'
const {
	cutText,
} = helper();

const props = defineProps({
	menu: {
		type: Array,
		default: [],
	},
	theme: {
		type: String,
		default: 'left',
	},
	textCutSize: {
		type: Number,
		default: 10,
	},
});

</script>

<template>
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
			<ui-OpeningBox
					v-if="item.group"
					:title="item.name"
					:faIcon="item.icon"
					:maxTitleSize="textCutSize"
					classes=""
					titleClasses="sidebar-text-op"
					openIconClasses="text-[1rem]"
					contentClasses="pt-0 pb-0 bg-[var(--third-block-color)]"
			>
				<SideMenuItem
						:menu="item.group"
						:theme="theme"
						:textCutSize="textCutSize"
						@click="emit('onClickEmit')"
				/>
			</ui-OpeningBox>
			<NuxtLink
					v-else
					:to="item.path"
					:target="item.target"
					class="sidebar-link"
					@click="emit('onClickEmit')"
			>
				<font-awesome-icon
						v-if="theme === 'left'"
						:icon="item.icon ? item.icon : 'fa-solid fa-circle'"
				/>
				<span class="sidebar-text">{{ cutText(item.name, textCutSize) }}</span>
			</NuxtLink>
		</li>
	</ul>
</template>

<style lang="scss" scoped>

</style>
