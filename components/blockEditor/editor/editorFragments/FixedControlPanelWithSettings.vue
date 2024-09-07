<script setup>
import FixedControlPanel from '@/components/ui/FixedControlPanel.vue';
import SettingByType from '@/components/blockEditor/editor/editorFragments/SettingByType.vue';
import OpeningBox from '@/components/ui/OpeningBox.vue';

const props = defineProps({
	title: {
		type: String,
		default: 'Панель настроек',
	},
	settings: {
		type: Object,
		default: {},
	},
	settingGroups: {
		type: Object,
		default: {},
	},
});

const showPanel = ref(false);
const togglePanel = () => {
	showPanel.value = !showPanel.value;
}

defineExpose({
	togglePanel,
});
</script>

<template>
	<FixedControlPanel
			:showPanel="showPanel"
			:title="title"
			@togglePanel="togglePanel"
	>
		<div v-if="settings">
			<div
					v-for="(setting, key) in settings"
					:key="key"
					:class="['mb-2 text-left']"
			>
				<template v-if="!setting.group">
					<SettingByType :setting="setting" />
				</template>
			</div>

			<div v-for="(group, key1) in settingGroups" :key="key1">
				<OpeningBox
						:title="group.name"
						classes="mb-1"
				>
					<div v-for="(settingKey, key2) in group.settingsKeys" :key="key2">
						<SettingByType :setting="settings[settingKey]" />
					</div>
				</OpeningBox>
			</div>
		</div>
	</FixedControlPanel>
</template>
