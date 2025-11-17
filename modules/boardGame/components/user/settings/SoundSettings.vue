<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';

import { watch } from "vue";
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
	modelValue: {},
});

import { userFunctions } from '@/composables/userFunctions.js';
const {
	isAuth,
	userStore,
} = userFunctions();

import { system } from '@/composables/system.js'
const { funcDelay } = system();

const soundVolume = ref({
	name: 'Громкость звука',
	value: 50,
	type: 'range',
	min: 0,
	max: 100,
	step: 1,
	showTitle: false,
	classes: 'w-[5rem] text-[2.5rem] p-0',
});

watch(() => props.modelValue, (newValue, oldValue) => {
	if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
		soundVolume.value.value = newValue;
	}
}, { deep: true });

watch(() => soundVolume.value, () => {
	funcDelay(updateSoundVolume, 500);
}, { deep: true });

const updateSoundVolume = () => {
	if (isAuth) {
		userStore.user.settings.soundVolume = Number(soundVolume.value.value);
	}

	emit('update:modelValue', soundVolume.value.value);
}

const lastVolume = ref(null);

const toggleVolume = () => {
	if (Number(soundVolume.value.value) === 0) {
		soundVolume.value.value = lastVolume.value ? lastVolume.value : 50;
	} else {
		lastVolume.value = soundVolume.value.value;
		soundVolume.value.value = 0;
	}
}
</script>

<template>
	<div class="choice-volume-block">
		<div class="icon-box">
			<font-awesome-icon v-if="Number(soundVolume.value) === 0" icon="fa-solid fa-volume-xmark" class="sound-icon" @click="toggleVolume()" />
			<font-awesome-icon v-if="Number(soundVolume.value) > 0 && Number(soundVolume.value) <= 20" icon="fa-solid fa-volume-off" class="sound-icon" @click="toggleVolume()" />
			<font-awesome-icon v-if="Number(soundVolume.value) > 20 && Number(soundVolume.value) <= 40" icon="fa-solid fa-volume-low" class="sound-icon" @click="toggleVolume()" />
			<font-awesome-icon v-if="Number(soundVolume.value) > 40 && Number(soundVolume.value) <= 100" icon="fa-solid fa-volume-high" class="sound-icon" @click="toggleVolume()" />
		</div>

		<FormGenerator
				name="hours"
				:element="soundVolume"
				:showTitle="soundVolume.showTitle"
				validateErrorPosition="bottom"
				labelClasses="mt-[0.3rem]"
				fieldClasses="w-full"
				:fieldClasses="soundVolume.classes"
		/>

		<span class="percent">{{ soundVolume.value }}%</span>
	</div>
</template>

<style lang="scss" scoped>
.choice-volume-block {
	@apply flex justify-center items-center gap-3;

	.icon-box {
		@apply w-[1.5rem] cursor-pointer;

		.sound-icon {
			@apply lg:text-[1.2rem] text-[var(--main-text-color)];
		}
	}

	.percent {
		@apply text-[var(--main-text-color)];
	}
}
</style>
