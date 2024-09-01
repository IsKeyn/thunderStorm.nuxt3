<script setup>
import Repeater from '@/components/repeaters/Repeater.vue';
import WysiwygEditor from '@/components/ui/WysiwygEditor.vue';

const props = defineProps({
	repeaterItem: {
		type: Object,
		default: null,
	},
	blockStructure: {
		type: Object,
		default: null,
	},
	blockIndex: { // Index блока в массиве, который находится в store
		type: Number,
		default: null,
	},
	editMode: { // Режим редактирования
		type: Boolean,
		default: false,
	},
});

const repeaterComponent = ref(null);
</script>

<template>
	<ul>
		<Repeater
				ref="repeaterComponent"
				:repeaterItem="repeaterItem"
				v-model="blockStructure.fields.elements"
				#default="{repeaterItems}"
		>
			<li
					v-for="(item, index) in repeaterItems"
					:key="index"
					class="mb-1"
			>
				<template v-if="editMode">
					<WysiwygEditor
							v-if="blockStructure.settings.editType.value === 'wysiwyg'"
							v-model="repeaterItems[index].item"
							:editMode="editMode"
					/>
					<input
							v-else
							v-model="repeaterItems[index].item"
					/>
				</template>
				<template v-else-if="repeaterItems[index].item">
					{{ repeaterItems[index].item }}
				</template>
				<button
						v-if="editMode && repeaterItems.length > 1"
						class="btn btn-primary"
						@click="repeaterComponent.deleteRepeaterItem(index)"
				>
					<font-awesome-icon :icon="['fas', 'xmark']" />
				</button>
			</li>
			<button
					v-if="editMode"
					class="btn btn-primary block"
					@click="repeaterComponent.addRepeaterItem()"
			>
				Добавить
			</button>
		</Repeater>
	</ul>
</template>
