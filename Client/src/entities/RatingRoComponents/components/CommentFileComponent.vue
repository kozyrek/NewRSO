<template>
    <div class="report__fieldset report__fieldset--comment-expert">
        <label class="form__label report__label" :for="name">Комментарий&nbsp; <sup v-show="!props.CH" class="valid-red">*</sup></label>

        <InputReport v-show="!props.isSix" is-file-district type="file" accept=".jpg, .jpeg, .png, .pdf" id="scan_file"
            name="scan_file" width="20px" height="20px" :disabled="isDisabled" @change="onChange" />

        <TextareaReport :value="value" :id="name" :name="name" placeholder="Примечания, ссылки" :rows="rows" autoResize
            counter-visible :maxlength="3000" :max-length-text="3000" :disabled="isDisabled" v-bind="$attrs">
        </TextareaReport>
        <FileBoxComponent v-if="file" :file="file" :fileType="fileType" :fileSize="fileSize" @click="clickOnButton"
            :is-error-file="isErrorFile" :is-sent="isSent"></FileBoxComponent>
    </div>
</template>

<script setup>
import { InputReport, TextareaReport } from '@shared/components/inputs';
import { FileBoxComponent } from '@entities/RatingRoComponents/components';

const emit = defineEmits(['onChange', 'click', 'focusOut']);
const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        default: '',
    },
    isDisabled: {
        type: Boolean,
        default: false,
    },
    file: {
        type: String,
        default: null,
    },
    fileType: {
        type: String,
        default: null,
    },
    isSix: {
        type: Boolean,
        default: false,
    },
    fileSize: {
        type: [Number, String],
        default: null,
    },
    isErrorFile: {
        type: Boolean,
        default: false,
    },
    CH: {
        type: Boolean,
        default: false,
    },
    isSent: {
        type: Boolean,
    },
    rows: {
      type: Number,
      default: 1
    }
});

const onChange = (event) => {
    emit('onChange', event.target.value);
};

const clickOnButton = () => {
    emit('click');
};
</script>

<style lang="scss" scoped>
.valid-red {
    color: #db0000;
}
</style>