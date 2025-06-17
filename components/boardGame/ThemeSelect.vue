<script setup>
import { onMounted, watch } from "vue";

const showThemeSettings = ref(false);

const toggleThemeSettingsFunc = () => {
	showThemeSettings.value = !showThemeSettings.value;

	if (showSvgAnimation.value && showThemeSettings.value) {
		showSvgAnimation.value = false;

		if (themeFromLocalStore.value === null) {
			localStorage.setItem('dashboard-theme', selectedTheme.value);
		}
	}
}

const selectedTheme = ref('');
const showSvgAnimation = ref(true);

const themeList = ref(
		[
			{ value: 'green', name: 'Зеленая', },
			{ value: 'ocean', name: 'Океан', },
			{ value: 'street', name: 'Улица', },
			{ value: 'street-light', name: 'Улица (светлая)', },
		],
);

const setTheme = (theme) => {
	localStorage.setItem('dashboard-theme', theme);

	themeList.value.forEach((item) => {
		if (item.value !== theme) {
			document.documentElement.classList.remove(item.value + '-theme');
		} else {
			document.documentElement.classList.add(item.value + '-theme');
		}
	});
};

watch(() => selectedTheme, (newValue) => {
	setTheme(newValue.value);
}, { deep: true });

onMounted(() => {
	getThemeConst();
});

const themeFromLocalStore = ref('');

const getThemeConst = () => {
	if (process.client) {
		themeFromLocalStore.value = localStorage.getItem('dashboard-theme');

		if (themeFromLocalStore.value !== null) {
			showSvgAnimation.value = false;
			selectedTheme.value = themeFromLocalStore.value;
		}
	}
}
</script>

<template>
	<div class="choice-theme-block">
		<div
				class="icon-box"
				@click="toggleThemeSettingsFunc()"
		>
			<font-awesome-icon
					v-if="showSvgAnimation"
					:icon="['fas', 'palette']"
					bounce
					class="choice-theme-icon"
			/>
			<font-awesome-icon
					v-else
					:icon="['fas', 'palette']"
					class="choice-theme-icon"
			/>
		</div>

		<div class="choice-theme-data" v-if="showThemeSettings">
			<select v-model="selectedTheme">
				<option value="">По умолчанию</option>
				<option
						v-for="theme in themeList"
						:value="theme.value"
				>{{ theme.name }}</option>
			</select>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.choice-theme-block {
	@apply
		fixed bottom-[1rem] lg:bottom-[5rem] left-[1rem] lg:left-[5rem] z-[99999]
		flex bg-[var(--button-color-1)] rounded-full p-[1rem]
	;

	.icon-box {
		@apply flex justify-center items-center cursor-pointer;

		.choice-theme-icon {
			@apply lg:text-[3rem];
		}
	}

	.choice-theme-data {
		@apply ml-[1rem] flex justify-center items-center;

		select {
			@apply pr-[1rem] pl-[1rem];
		}
	}
}
</style>
