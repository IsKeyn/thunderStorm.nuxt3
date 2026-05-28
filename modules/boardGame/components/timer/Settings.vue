<script setup>
import FormGenerator from '@/components/forms/FormGenerator/FormGenerator.vue';
import TimerObs from '@/modules/boardGame/components/timer/TimerObs.vue';

import { ref } from "vue";

const props = defineProps({
	modelValue: {},
	bg_slug: {
		type: String,
		default: '',
	},
	user_id: {
		type: Number,
		default: null,
	},
	slug: {
		type: String,
		default: '',
	},
});

const form = ref({});

form.value.font = {
	name: 'Шрифт',
	value: props.modelValue?.font ?? 'Digital-7',
	type: 'select',
	options: [
		{
			name: 'Digital-7',
			value: 'Digital-7',
		},
		{
			name: 'PFCentroSansPro-Light',
			value: 'PFCentroSansPro-Light',
		},
		{
			name: 'PFCentroSansPro-Medium',
			value: 'PFCentroSansPro-Medium',
		},
		{
			name: 'Verdana',
			value: 'Verdana',
		},
		{
			name: 'Verdana-Bold',
			value: 'Verdana-Bold',
		},
		{
			name: 'Verdana-BoldItalic',
			value: 'Verdana-BoldItalic',
		},
		{
			name: 'Verdana-Italic',
			value: 'Verdana-Italic',
		},
	],
	placeholder: 'Время крутки рулетки',
	showTitle: true,
	classes: 'w-full md:min-w-[10rem] mt-2',
};

form.value.animation = {
	name: 'Мигание',
	value: props.modelValue?.animation ?? true,
	type: 'checkbox',
	showTitle: false,
	classes: 'w-full md:min-w-[10rem] mt-2',
};

form.value.showTitle = {
	name: 'Отображать заголовок',
	value: props.modelValue?.showTitle ?? true,
	type: 'checkbox',
	showTitle: false,
	classes: 'w-full md:min-w-[10rem] mt-2',
};
</script>

<template>
	<div>
		<FormGenerator
				key="font"
				:name="form.font.name"
				:element="form.font"
				:showTitle="form.font.showTitle"
				:showValidateError=true
				validateErrorPosition="bottom"
				:labelClasses="['block', 'mb-[10px]']"
				:fieldClasses="form.font.classes"
		/>
	</div>
	<div class="md:flex gap-5">
		<div class="w-full md:min-w-[30%]">
			<FormGenerator
					key="font"
					:name="form.animation.name"
					:element="form.animation"
					:showTitle="form.animation.showTitle"
					:showValidateError=true
					validateErrorPosition="bottom"
					:labelClasses="['block', 'mb-[10px]']"
					:fieldClasses="form.animation.classes"
			/>
		</div>
		<div class="w-full md:min-w-[30%]">
			<FormGenerator
					key="font"
					:name="form.showTitle.name"
					:element="form.showTitle"
					:showTitle="form.showTitle.showTitle"
					:showValidateError=true
					validateErrorPosition="bottom"
					:labelClasses="['block', 'mb-[10px]']"
					:fieldClasses="form.showTitle.classes"
			/>
		</div>
	</div>

	<TimerObs
			:bg_slug="bg_slug"
			:user_id="user_id"
			:slug="slug"
	/>
</template>

<style lang="scss" scoped />
