<script setup>
import FragmentMedia from '@/components/blockEditor/editor/blockFragments/FragmentMedia.vue';

const props = defineProps({
	blockStructure: {
		type: Object,
		default: null,
	},
	blockIndex: { // Index блока в массиве, который находится в store
		type: Number,
		default: null,
	},
	previewMode: { // Режим редактирования
		type: Boolean,
		default: false,
	},
});
</script>

<template>
	<FragmentMedia
			v-model="blockStructure.fields.image"
			:editMode="!previewMode"
	/>
	<div class="header">
		<span class="eng-title">
			<template v-if="!previewMode">
				<input v-model="blockStructure.fields.engTitle">
			</template>
			<template v-else-if="blockStructure.fields.engTitle">
				{{ blockStructure.fields.engTitle }}
			</template>
		</span>
		<span class="rus-title">
			<template v-if="!previewMode">
				<input v-model="blockStructure.fields.rusTitle">
			</template>
			<template v-else-if="blockStructure.fields.rusTitle">
				{{ blockStructure.fields.rusTitle }}
			</template>
		</span>
	</div>
	<div>
		<div>
			<span class="field-title">Возраст: </span>
			<template v-if="!previewMode">
				<input v-model="blockStructure.fields.age">
			</template>
			<template v-else-if="blockStructure.fields.age">
				{{ blockStructure.fields.age }}
			</template>
		</div>
		<div>
			<span class="field-title">Пол: </span>
			<template v-if="!previewMode">
				<input v-model="blockStructure.fields.sex">
			</template>
			<template v-else-if="blockStructure.fields.sex">
				{{ blockStructure.fields.sex }}
			</template>
		</div>
		<div>
			<span class="field-title">Профессия: </span>
			<template v-if="!previewMode">
				<input v-model="blockStructure.fields.work">
			</template>
			<template v-else-if="blockStructure.fields.work">
				{{ blockStructure.fields.work }}
			</template>
		</div>
		<div>
			<span class="field-title">Искание: </span>
			<template v-if="!previewMode">
				<input v-model="blockStructure.fields.target">
			</template>
			<template v-else-if="blockStructure.fields.target">
				{{ blockStructure.fields.target }}
			</template>
		</div>
		<div>
			<span class="field-title">Описание: </span>
			<template v-if="!previewMode">
				<textarea v-model="blockStructure.fields.description" />
			</template>
			<template v-else-if="blockStructure.fields.description">
				{{ blockStructure.fields.description }}
			</template>
		</div>
	</div>
</template>

<style lang="scss">
.Character {
	@apply mt-4 mb-4 overflow-auto;

	img {
		@apply float-right w-[10rem];
	}

	.header {
		@apply text-center;

		.eng-title,
		.rus-title {
			@apply block;
		}

		.eng-title {
			@apply font-bold text-[1.2rem];

			color: var(--main-title-color);
		}
	}

	.field-title {
		@apply font-bold;
	}
}
</style>
