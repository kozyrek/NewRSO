<template>
  <div class="report__field-group" v-if="!isSecondTab && !isThirdTab">
    <div class="report__fieldset report__fieldset--left-block">
      <label class="form__label report__label" for="participants_number">
        Количество человек, входящих в&nbsp;группу РО&nbsp;РСО в&nbsp;социальной сети
        &laquo;ВКонтакте&raquo;&nbsp;<sup class="valid-red">*</sup>
      </label>
      <InputReport
        v-model:value="eleventhPanelData.participants_number"
        id="participants_number"
        name="participants_number"
        style="width: 100%"
        height="40px"
        type="number"
        placeholder="Введите число"
        :maxlength="10"
        :min="0"
        :max="2147483647"
        @focusout="focusOut"
        :disabled="(props.tab === 'Просмотр отправленного отчета' && reportStore.isReportRevision) || (isSent && !isRevision) || (props.centralExpert || props.districtExpert)"
        :is-error-panel="isErrorPanel"
      />
    </div>

    <div class="report__fieldset report__fieldset--right-block">
      <p class="form__label report__label">
        Скриншот численности <br />
        группы РО&nbsp;РСО&nbsp;<sup class="valid-red">*</sup>
      </p>
      <FileBoxComponent
        v-if="eleventhPanelData.scan_file"
        :file="eleventhPanelData.scan_file"
        :fileType="eleventhPanelData.file_type"
        :fileSize="eleventhPanelData.file_size"
        @click="deleteFile"
        :is-sent="(props.tab === 'Просмотр отправленного отчета' && reportStore.isReportRevision) || (isSent && !isRevision) || (props.centralExpert || props.districtExpert)"
        :is-error-file="isErrorFile"
      ></FileBoxComponent>
      <InputReport
        v-if="!eleventhPanelData.scan_file || isRevision && (props.tab !== 'Просмотр отправленного отчета')"
        isFile
        type="file"
        accept=".jpg, .jpeg, .png, .pdf"
        id="scan_file"
        name="scan_file"
        width="100%"
        height="auto"
        @change="uploadFile"
        :disabled="(props.tab === 'Просмотр отправленного отчета' && reportStore.isReportRevision) || (isSent && !isRevision) || (props.centralExpert || props.districtExpert)"
        :is-error-panel="isErrorPanel"
      />
    </div>

    <div
      class="report__fieldset report__fieldset--comment"
      v-if="(!isSent && !(props.centralExpert || props.districtExpert) && !reportStore.isReportRevision) ||
            (isSent && eleventhPanelData.comment) ||
            ((props.centralExpert || props.districtExpert) && eleventhPanelData.comment) ||
            (props.tab !== 'Просмотр отправленного отчета') && reportStore.isReportRevision ||
            (props.tab === 'Просмотр отправленного отчета' && reportStore.isReportRevision && eleventhPanelData.comment)"
    >
      <label class="form__label report__label" for="comment"> Комментарий </label>
      <TextareaReport
        v-model:value="eleventhPanelData.comment"
        id="comment"
        name="comment"
        placeholder="Напишите сообщение"
        :rows="1"
        autoResize
        counter-visible
        :maxlength="3000"
        :max-length-text="3000"
        @focusout="focusOut"
        :disabled="(props.tab === 'Просмотр отправленного отчета' && reportStore.isReportRevision) || (isSent && !isRevision) || (props.centralExpert || props.districtExpert)"
      >
      </TextareaReport>
    </div>
  </div>

  <div v-if="isSecondTab" class="report__field-group">
    <div class="report__fieldset report__fieldset--left-block">
      <label class="form__label report__label" for="participants_number">
        Количество человек, входящих в&nbsp;группу РО&nbsp;РСО в&nbsp;социальной сети
        &laquo;ВКонтакте&raquo;&nbsp;<sup class="valid-red">*</sup>
      </label>
      <InputReport
        v-model:value="eleventhPanelDataDH.participants_number"
        id="participants_number"
        name="participants_number"
        style="width: 100%"
        height="40px"
        type="number"
        placeholder="Введите число"
        :maxlength="10"
        :min="0"
        :max="2147483647"
        :disabled="centralExpert || !(districtExpert || centralExpert)"
        :is-error-panel="isErrorPanel"
      />
    </div>

    <CommentFileComponent
      v-model:value="eleventhPanelDataDH.comment"
      name="eleventhPanelData.comment"
      @change="uploadFileDH"
      @click="deleteFileDH"
      :file="fileDH.name"
      :fileType="fileDH.type"
      :fileSize="fileDH.size"
      :disabled="centralExpert || !(districtExpert || centralExpert)"
      :is-error-file="isErrorFile"
      :is-error-panel="isErrorPanel"
      :is-sent="centralExpert || !(districtExpert || centralExpert)"
    ></CommentFileComponent>
  </div>

  <div
    v-if="isThirdTab"
    class="report__field-group report__field-group--column"
  >
    <ReportTable
      label="Количество человек, входящих в&nbsp;группу РО&nbsp;РСО в&nbsp;социальной сети &laquo;ВКонтакте&raquo;"
      name="eleventhPanelData.participants_number"
      :dataRH="eleventhPanelData.participants_number"
      :dataDH="eleventhPanelDataDH.participants_number"
      v-model:value="eleventhPanelDataCH.participants_number"
      :maxlength="10"
      :min="0"
      :max="2147483647"
      :disabled="!(districtExpert || centralExpert) || reportStore.reportForCheckCH.eleventh.verified_by_chq !== null"
      :is-error-panel="isErrorPanel"
    ></ReportTable>

    <CommentFileComponent
      v-model:value="eleventhPanelDataCH.comment"
      name="eleventhPanelDataCH.comment"
      @change="uploadFileCH"
      @click="deleteFileCH"
      :file="fileCH.name"
      :fileType="fileCH.type"
      :fileSize="fileCH.size"
      :is-error-file="isErrorFile"
      :is-disabled="!(districtExpert || centralExpert) || reportStore.reportForCheckCH.eleventh.verified_by_chq !== null"
      :is-sent="!(districtExpert || centralExpert) || reportStore.reportForCheckCH.eleventh.verified_by_chq !== null"
      :is-error-panel="isErrorPanel"
    ></CommentFileComponent>

    <div>
      <v-checkbox 
        v-if="centralExpert ? !reportStore.reportForCheckCH.eleventh.verified_by_chq : !reportStore.isAllReportsVerifiedByCH"
        v-model="reportStore.returnReport.eleventh"
        label="Вернуть в&nbsp;РО на&nbsp;доработку" 
        :disabled="!(districtExpert || centralExpert) || reportStore.reportForCheckCH.eleventh.verified_by_chq !== null"
        @change="onReturnReport"/>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, watchPostEffect, watch } from "vue";
import { InputReport, TextareaReport } from "@shared/components/inputs";
import {
  CommentFileComponent,
  FileBoxComponent,
  ReportTable,
} from "@entities/RatingRoComponents/components";
import { reportPartTwoService } from "@services/ReportService.ts";
import { fileValidate } from "@pages/ReportRegionalHQPartTwoPage/ReportHelpers.ts";
import {useReportPartTwoStore} from "@pages/ReportRegionalHQPartTwoPage/store.ts";

const reportStore = useReportPartTwoStore();

const props = defineProps({
  districtExpert: {
    type: Boolean,
  },
  centralExpert: {
    type: Boolean,
  },
  isSecondTab: {
    type: Boolean,
    default: false,
  },
  isThirdTab: {
    type: Boolean,
    default: false,
  },
  data: Object,
  isErrorPanel: {
    type: Boolean,
  },
  tab: {
    type: String,
  }
});

const ID_PANEL = "11";
const isFirstSent = ref(true);
const isRevision = ref(false);
let isErrorFile = ref(false);

const eleventhPanelData = ref({
  participants_number: null,
  scan_file: "",
  file_size: null,
  file_type: "",
  comment: "",
});

const eleventhPanelDataDH = ref({
  participants_number: null,
  scan_file: "",
  file_size: null,
  file_type: "",
  comment: "",
});

const fileDH = ref({
  name: '',
  type: '',
  size: null,
})

const eleventhPanelDataCH = ref({
  participants_number: null,
  scan_file: "",
  file_size: null,
  file_type: "",
  comment: "",
});

const fileCH = ref({
  name: '',
  type: '',
  size: null,
})

const isSent = ref(false);

const emit = defineEmits([
  'getData', 
  'getDataDH', 
  'getDataCH', 
]);

const focusOut = async () => {
  let formData = new FormData();

  formData.append("participants_number", eleventhPanelData.value.participants_number || '');
  formData.append("comment", eleventhPanelData.value.comment || '');

  try {
    if (isFirstSent.value) {
      if (isRevision.value) {
        formData.append("scan_file", eleventhPanelData.value.scan_file || '');
        formData.append("file_size", eleventhPanelData.value.file_size || '');
        formData.append("file_type", eleventhPanelData.value.file_type || '');
      }
      const { data } = await reportPartTwoService.createReport(formData, ID_PANEL, true);
      emit('getData', data, Number(ID_PANEL));
      
    } else {
      const { data } = await reportPartTwoService.createReportDraft(formData, ID_PANEL, true);
      emit('getData', data, Number(ID_PANEL));
    }
  } catch (e) {
    console.log('focusOut error:', e)
  }
};

const uploadFile = async (event) => {
  fileValidate(event.target.files[0], 7, isErrorFile);
  
  eleventhPanelData.value.scan_file = event.target.files[0].name;
  eleventhPanelData.value.file_size = (event.target.files[0].size / Math.pow(1024, 2));
  eleventhPanelData.value.file_type = event.target.files[0].type.split('/').at(-1);

  if(!isErrorFile.value) {
    let formData = new FormData();
    formData.append("scan_file", event.target.files[0]);
    formData.append("participants_number", eleventhPanelData.value.participants_number || '');
    formData.append("comment", eleventhPanelData.value.comment || '');

    try {
      if (isFirstSent.value) {
        let { data } = await reportPartTwoService.createReport(formData, ID_PANEL, true);
        eleventhPanelData.value.scan_file = data.scan_file.split('/').at(-1);
        emit('getData', data, Number(ID_PANEL));
      } else {
        let { data } = await reportPartTwoService.createReportDraft(formData, ID_PANEL, true);
        eleventhPanelData.value.scan_file = data.scan_file.split('/').at(-1);
        emit('getData', data, Number(ID_PANEL));
      }
    } catch (e) {
      console.log('uploadFile error:', e);
    }
  }
};

const uploadFileDH = async (event) => {
  if (event.target.files) {
    fileValidate(event.target.files[0], 7, isErrorFile);

    if (isErrorFile.value) {
      reportStore.reportDataDHFile.eleventh = null;
      fileDH.value.name = event.target.files[0].name;
      fileDH.value.type = event.target.files[0].type.split('/').at(-1);
      fileDH.value.size = event.target.files[0].size / Math.pow(1024, 2);
    } else {
      reportStore.reportDataDHFile.eleventh = event.target.files[0];
    }
  }
}

const uploadFileCH = async (event) => {
  if (event.target.files) {
    fileValidate(event.target.files[0], 7, isErrorFile);

    if (isErrorFile.value) {
      reportStore.reportDataCHFile.eleventh = null;
      fileCH.value.name = event.target.files[0].name;
      fileCH.value.type = event.target.files[0].type.split('/').at(-1);
      fileCH.value.size = event.target.files[0].size / Math.pow(1024, 2);
    } else {
      reportStore.reportDataCHFile.eleventh = event.target.files[0];
    }
  }
}

const deleteFile = async () => {
  eleventhPanelData.value.scan_file = '';

  if(!isErrorFile.value) {
    let formData = new FormData();
    formData.append("scan_file", "");
    formData.append("participants_number", eleventhPanelData.value.participants_number || '');
    formData.append("comment", eleventhPanelData.value.comment || '');

    try {
      if (isFirstSent.value) {
        let { data : scan_file } = await reportPartTwoService.createReport(formData, ID_PANEL, true);
        emit('getData', scan_file, Number(ID_PANEL));
      } else {
        let { data : scan_file } = await reportPartTwoService.createReportDraft(formData, ID_PANEL, true);
        emit('getData', scan_file, Number(ID_PANEL));
      }
    } catch (e) {
      console.log('deleteFile error:', e);
    }
  }
};

const deleteFileDH = async () => {
  fileDH.value.name = null;
  reportStore.reportDataDHFile.eleventh = null;
}

const deleteFileCH = async () => {
  fileCH.value.name = null;
  reportStore.reportDataCHFile.eleventh = null;
  if (reportStore.reportForCheckCH.eleventh.central_version) {
    reportStore.reportForCheckCH.eleventh.central_version.scan_file = null;
  }
}

const onReturnReport = (event) => {
  let formData = new FormData();
  formData.append('participants_number', eleventhPanelDataCH.value.participants_number);
  formData.append('comment', eleventhPanelDataCH.value.comment || '');
  formData.append('scan_file', reportStore.reportDataCHFile.eleventh || reportStore.reportForCheckCH.eleventh.central_version?.scan_file || '');
  
  if (event.target.checked) {
    reportStore.returnReport.eleventh = true;
    formData.append('reasons[comment]', eleventhPanelDataCH.value.comment);
  } else {
    reportStore.returnReport.eleventh = false;
  }

  emit('getDataCH', formData, Number(ID_PANEL));
}

watchEffect(() => {
  if (props.centralExpert || props.districtExpert) {
    if (reportStore.reportDataCH.eleventh) {
      eleventhPanelDataCH.value.comment = reportStore.reportDataCH.eleventh.comment;
      eleventhPanelDataCH.value.participants_number = reportStore.reportDataCH.eleventh.participants_number;
    }
    if (reportStore.reportDataDH.eleventh) {
      eleventhPanelDataDH.value.comment = reportStore.reportDataDH.eleventh.comment;
      eleventhPanelDataDH.value.participants_number = reportStore.reportDataDH.eleventh.participants_number;
    }
  } else {
    if (props.data) {
      isFirstSent.value = false;
      isRevision.value = reportStore.isReportReject.eleventh;
      eleventhPanelData.value.participants_number = props.data.participants_number;
      eleventhPanelData.value.comment = props.data.comment;
      eleventhPanelData.value.scan_file = props.data.scan_file;
      eleventhPanelData.value.file_size = props.data.file_size;
      eleventhPanelData.value.file_type = props.data.file_type;
      isSent.value = props.data.is_sent;

      isFirstSent.value = reportStore.isReportReject.eleventh && !props.data.central_version;
    }
  }
  if (props.districtExpert) {
    if (reportStore.reportDataDHFile.eleventh) {
      fileDH.value.name = reportStore.reportDataDHFile.eleventh.name;
      fileDH.value.type = reportStore.reportDataDHFile.eleventh.type.split('/').at(-1);
      fileDH.value.size = reportStore.reportDataDHFile.eleventh.size / Math.pow(1024, 2);
    }
  } else if (props.centralExpert) {
    if (reportStore.reportDataDH.eleventh) {
      fileDH.value.name = reportStore.reportDataDH.eleventh.scan_file;
      fileDH.value.type = reportStore.reportDataDH.eleventh.file_type;
      fileDH.value.size = reportStore.reportDataDH.eleventh.file_size;
    }
    if (reportStore.reportForCheckCH.eleventh.verified_by_chq === true) {
      fileCH.value.name = reportStore.reportForCheckCH.eleventh.scan_file;
      fileCH.value.type = reportStore.reportForCheckCH.eleventh.file_type;
      fileCH.value.size = reportStore.reportForCheckCH.eleventh.file_size;
    }  else
    if (reportStore.reportForCheckCH.eleventh.rejecting_reasons && !reportStore.reportDataCHFile.eleventh) {
      fileCH.value.name = reportStore.reportForCheckCH.eleventh.central_version.scan_file || '';
      fileCH.value.type = reportStore.reportForCheckCH.eleventh.central_version.file_type || '';
      fileCH.value.size = reportStore.reportForCheckCH.eleventh.central_version.file_size || '';
    } else
    if (reportStore.reportDataCHFile.eleventh) {
      fileCH.value.name = reportStore.reportDataCHFile.eleventh.name;
      fileCH.value.type = reportStore.reportDataCHFile.eleventh.type.split('/').at(-1);
      fileCH.value.size = reportStore.reportDataCHFile.eleventh.size / Math.pow(1024, 2);
    }
  }
  if (reportStore.reportReject.eleventh && reportStore.isReportReject.eleventh) {
    reportStore.returnReport.eleventh = true;
  }
}, {
  flush: 'post'
});

watchPostEffect(() => {
  if (props.data) {
    isFirstSent.value = false;
    eleventhPanelData.value.participants_number = props.data.participants_number;
    eleventhPanelData.value.comment = props.data.comment;
    eleventhPanelData.value.scan_file = props.data.scan_file;
    eleventhPanelData.value.file_size = props.data.file_size;
    eleventhPanelData.value.file_type = props.data.file_type;
    isSent.value = props.data.is_sent;

    isFirstSent.value = reportStore.isReportReject.eleventh && !props.data.central_version;
  }
  if (!(props.centralExpert || props.districtExpert)) {
    eleventhPanelDataDH.value = reportStore.reportDataDH.eleventh;
    fileDH.value.name = reportStore.reportDataDH.eleventh.scan_file;
    fileDH.value.type = reportStore.reportDataDH.eleventh.file_type;
    fileDH.value.size = reportStore.reportDataDH.eleventh.file_size;

    eleventhPanelDataCH.value = reportStore.reportDataCH.eleventh;
    fileCH.value.name = reportStore.reportDataCH.eleventh.scan_file;
    fileCH.value.type = reportStore.reportDataCH.eleventh.file_type;
    fileCH.value.size = reportStore.reportDataCH.eleventh.file_size;

    if (reportStore.isReportReject.eleventh) {
      reportStore.returnReport.eleventh = true;
    } else {
      reportStore.returnReport.eleventh = false;
    }
  }
  
});

watch(eleventhPanelDataDH.value, () => {
  if (props.districtExpert) {
    reportStore.reportDataDH.eleventh = eleventhPanelDataDH.value;

    let formData = new FormData();
    formData.append('participants_number', eleventhPanelDataDH.value.participants_number);
    formData.append('comment', eleventhPanelDataDH.value.comment || '');
    formData.append('scan_file', reportStore.reportDataDHFile.eleventh || '');
    emit('getDataDH', formData, Number(ID_PANEL));
  }
});

watch(fileDH.value, ()=> {
    if (props.districtExpert) {
      reportStore.reportDataDH.eleventh = eleventhPanelDataDH.value;

      let formData = new FormData();
      formData.append('participants_number', eleventhPanelDataDH.value.participants_number);
      formData.append('comment', eleventhPanelDataDH.value.comment || '');
      formData.append('scan_file', reportStore.reportDataDHFile.eleventh || '');
      emit('getDataDH', formData, Number(ID_PANEL));
    }
});

watch(eleventhPanelDataCH.value, () => {
  if (props.centralExpert) {
    reportStore.reportDataCH.eleventh = eleventhPanelDataCH.value;
    
    let formData = new FormData();
    formData.append('participants_number', eleventhPanelDataCH.value.participants_number);
    formData.append('comment', eleventhPanelDataCH.value.comment || '');
    formData.append('scan_file', reportStore.reportDataCHFile.eleventh || reportStore.reportForCheckCH.eleventh.central_version?.scan_file || '');
    if (reportStore.returnReport.eleventh) formData.append('reasons[comment]', eleventhPanelDataCH.value.comment);
    emit('getDataCH', formData, Number(ID_PANEL));
  }
});

watch(fileCH.value, ()=> {
  if (props.centralExpert) {
    reportStore.reportDataCH.eleventh = eleventhPanelDataCH.value;
  
    let formData = new FormData();
    formData.append('participants_number', eleventhPanelDataCH.value.participants_number);
    formData.append('comment', eleventhPanelDataCH.value.comment || '');
    formData.append('scan_file', reportStore.reportDataCHFile.eleventh || reportStore.reportForCheckCH.eleventh.central_version?.scan_file || '');
    if (reportStore.returnReport.eleventh) formData.append('reasons[comment]', eleventhPanelDataCH.value.comment);
    emit('getDataCH', formData, Number(ID_PANEL));
  }
});
</script>

<style lang="scss" scoped>
.valid-red {
  color: #db0000;
}
.v-tab-item--selected {
  background: #f3f4f5;
}
.v-tab.v-tab.v-btn {
  min-width: 280px;
  border-radius: 10px 10px 0 0;
  letter-spacing: initial;
  border: none;
}
</style>
