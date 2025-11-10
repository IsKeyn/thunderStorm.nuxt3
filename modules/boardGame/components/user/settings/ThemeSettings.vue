<script setup>
import { onMounted, watch } from "vue";

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
	defaultTheme: {
		type: String,
		default: 'InSilentHill',
	},
	modelValue: {},
});

const themeList = ref(
		[
			{ value: 'InSilentHill', name: 'InSilentHill', },
			{ value: 'green', name: 'Зеленая', },
			{ value: 'ocean', name: 'Океан', },
			{ value: 'street', name: 'Улица', },
			{ value: 'street-light', name: 'Улица (светлая)', },
			// { value: 'winter-light', name: 'Зима (светлая)', },
		],
);

const selectedTheme = ref(props.defaultTheme);

const setTheme = (theme) => {
	themeList.value.forEach((item) => {
		if (item.value !== theme) {
			document.documentElement.classList.remove(item.value + '-theme');
		} else {
			document.documentElement.classList.add(item.value + '-theme');
		}
	});
};

onMounted(() => {
	setTheme(selectedTheme.value);
});

watch(() => props.modelValue, (newValue, oldValue) => {
	if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
		selectedTheme.value = newValue;
	}
}, { deep: true });

watch(() => selectedTheme, (newValue) => {
	setTheme(newValue.value);
	emit('update:modelValue', newValue.value);
}, { deep: true });
</script>

<template>
	<div class="choice-theme-block">
		<div class="icon-box">
			<font-awesome-icon
					:icon="['fas', 'palette']"
					class="choice-theme-icon"
			/>
		</div>

		<div class="choice-theme-data">
			<select v-model="selectedTheme">
				<option :value="defaultTheme">По умолчанию</option>
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
	@apply flex;

	.icon-box {
		@apply flex justify-center items-center;

		.choice-theme-icon {
			@apply lg:text-[1.2rem] text-[var(--main-text-color)];
		}
	}

	.choice-theme-data {
		@apply ml-[1rem] w-full;

		select {
			@apply w-full;
		}
	}
}
</style>
