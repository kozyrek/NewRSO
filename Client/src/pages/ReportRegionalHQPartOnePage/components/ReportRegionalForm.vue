<template>
  <form class="form__field-group Report-Regional-Form__style" @submit.prevent="sentReport">
    <h2 v-if="isSecondReport" class="report_title-h3">Свод статистических данных по&nbsp;трудоустройству бойцов
      студенческих
      отрядов РО&nbsp;за&nbsp;2024 год на&nbsp;15&nbsp;октября 2024 года</h2>
    <h2 v-else-if="!isNewReport" class="report_title-h3">Свод статистических данных по&nbsp;трудоустройству бойцов
      студенческих
      отрядов РО&nbsp;за&nbsp;2024 год на&nbsp;1&nbsp;сентября 2024 года</h2>
    <div class="form__field">
      <label class="form__label" for="participants_number">Количество членов РО <sup class="valid-red">*</sup></label>
      <InputReport
          v-model:value="reportDataChildren.participants_number"
          id="participants_number"
          name="participants_number"
          class="form__input"
          type="number"
          placeholder="Введите число"
          aria-required="true"
          @focusout="focusOut"
          :disabled="blockEditFirstReport"
      />
    </div>
    <p>Количество трудоустроенных по направлениям:</p>
    <div class="form-container">
      <div class="form-col">
        <div class="form__field">
          <label class="form__label" for="sso">ССО <sup class="valid-red">*</sup></label>
          <InputReport
              v-model:value="reportDataChildren.employed_sso"
              id="sso"
              name="sso"
              class="form__input"
              type="number"
              placeholder="Введите число"
              @focusout="focusOut"
              :disabled="blockEditFirstReport"
          />
        </div>
        <div class="form__field">
          <label class="form__label" for="smo">СМО <sup class="valid-red">*</sup></label>
          <InputReport
              v-model:value="reportDataChildren.employed_smo"
              id="smo"
              name="smo"
              class="form__input"
              type="number"
              placeholder="Введите число"
              @focusout="focusOut"
              :disabled="blockEditFirstReport"
          />
        </div>
        <div class="form__field">
          <label class="form__label" for="specialized_detachment">Профильные отряды <sup
              class="valid-red">*</sup></label>
          <InputReport
              v-model:value="reportDataChildren.employed_specialized_detachments"
              id="specialized_detachment"
              name="specialized_detachment"
              class="form__input" type="number"
              placeholder="Введите число"
              @focusout="focusOut"
              :disabled="blockEditFirstReport"
          />
        </div>
        <div class="form__field">
          <label class="form__label" for="spo">СПО <sup class="valid-red">*</sup></label>
          <InputReport
              v-model:value="reportDataChildren.employed_spo"
              id="spo"
              name="spo"
              class="form__input"
              type="number"
              placeholder="Введите число"
              @focusout="focusOut"
              :disabled="blockEditFirstReport"
          />
        </div>
        <div class="form__field">
          <label class="form__label" for="sservo">ССервО <sup class="valid-red">*</sup></label>
          <InputReport
              v-model:value="reportDataChildren.employed_sservo"
              id="sservo"
              name="sservo"
              class="form__input"
              type="number"
              placeholder="Введите число"
              @focusout="focusOut"
              :disabled="blockEditFirstReport"
          />
        </div>
        <div class="form__field">
          <label class="form__label" for="production_detachments">Производственные отряды <sup
              class="valid-red">*</sup></label>
          <InputReport
              v-model:value="reportDataChildren.employed_production_detachments"
              id="production_detachments"
              name="production_detachments"
              class="form__input"
              type="number"
              placeholder="Введите число"
              @focusout="focusOut"
              :disabled="blockEditFirstReport"
          />
        </div>
        <div class="form__field">
          <label class="form__label" for="sop">СОП <sup class="valid-red">*</sup></label>
          <InputReport
              v-model:value="reportDataChildren.employed_sop"
              id="sop"
              name="sop"
              class="form__input"
              type="number"
              placeholder="Введите число"
              @focusout="focusOut"
              :disabled="blockEditFirstReport"
          />
        </div>
        <div class="form__field">
          <label class="form__label" for="ssho">ССхО <sup class="valid-red">*</sup></label>
          <InputReport
              v-model:value="reportDataChildren.employed_ssho"
              id="ssho"
              name="ssho"
              class="form__input"
              type="number"
              placeholder="Введите число"
              @focusout="focusOut"
              :disabled="blockEditFirstReport"
          />
        </div>
        <div class="form__field">
          <label class="form__label" for="top">ТОП <sup class="valid-red">*</sup></label>
          <InputReport
              v-model:value="reportDataChildren.employed_top"
              id="top"
              name="top"
              class="form__input"
              type="number"
              placeholder="Введите число"
              @focusout="focusOut"
              :disabled="blockEditFirstReport"
          />
        </div>
      </div>
    </div>

    <div v-if="isSecondReport">
      <p>Количество работников:</p>
      <div class="form-container">
        <div class="form-col">
          <div class="form__field">
            <label class="form__label" for="employed_so_poo">Штабы СО ПОО <sup class="valid-red">*</sup></label>
            <InputReport
                v-model:value="reportDataChildren.employed_so_poo"
                id="employed_so_poo"
                name="employed_so_poo"
                class="form__input"
                type="number"
                placeholder="Введите число"
                @focusout="focusOut"
                :disabled="blockEditFirstReport"
            />
          </div>
          <div class="form__field">
            <label class="form__label" for="employed_so_oovo">Штабы СО ООВО <sup class="valid-red">*</sup></label>
            <InputReport
                v-model:value="reportDataChildren.employed_so_oovo"
                id="employed_so_oovo"
                name="employed_so_oovo"
                class="form__input"
                type="number"
                placeholder="Введите число"
                @focusout="focusOut"
                :disabled="blockEditFirstReport"
            />
          </div>
          <div class="form__field">
            <label class="form__label" for="employed_ro_rso">Штабы РО РСО <sup class="valid-red">*</sup></label>
            <InputReport
                v-model:value="reportDataChildren.employed_ro_rso"
                id="employed_ro_rso"
                name="employed_ro_rso"
                class="form__input"
                type="number"
                placeholder="Введите число"
                @focusout="focusOut"
                :disabled="blockEditFirstReport"
            />
          </div>
        </div>
      </div>

      <p>Свой вариант:</p>
      <Button
          v-if="!blockEditFirstReport"
          class="form__add-link-button"
          label="+ Добавить свой вариант"
          @click="addAdditionalStatistics"
      />
      <div class="form-container" v-for="(statistic, i) in reportDataChildren.additional_statistics" :key="i"
           style="align-items: end">
        <div class="form-col">
          <div class="form__field">
            <label class="form__label" for="statisticName">Название подразделения: <sup
                class="valid-red">*</sup></label>
            <InputReport
                v-model:value="statistic.name"
                id="statisticName"
                name="statisticName"
                class="form__input"
                placeholder="название подразделения"
                @focusout="focusOut"
                :disabled="blockEditFirstReport"
            />
          </div>
        </div>
        <div class="form-col">
          <div class="form__field">
            <label class="form__label" for="statisticName">Количество: <sup class="valid-red">*</sup></label>
            <InputReport
                v-model:value="statistic.value"
                id="statisticQuantity"
                name="statisticQuantity"
                class="form__input"
                type="number"
                placeholder="количество"
                @focusout="focusOut"
                :disabled="blockEditFirstReport"
            />
          </div>
        </div>
        <div class="form-col">
          <div class="form__field">
            <Button
                v-if="!blockEditFirstReport"
                class="form__add-link-button"
                label="Удалить свой вариант"
                @click="deleteAdditionalStatistics(i)"
            />
          </div>
        </div>
      </div>
    </div>

  </form>
  <Button
      v-if="isNewReport && (roleStore.experts.is_central_expert === false && roleStore.experts.is_district_expert === false)"
      variant="text"
      label="Отправить отчет"
      size="large"
      :onclick="sentReport"
      :disabled="isButtonDisabled"
  />
</template>

<script setup>
import { InputReport } from '@shared/components/inputs';
import { Button } from '@shared/components/buttons';
import { ref, watchEffect } from "vue";
import { useRoleStore } from '@layouts/store/role';
import { useRoute } from "vue-router";
import { editReport } from "@services/ReportService.ts";

const roleStore = useRoleStore();
const route = useRoute();

const emit = defineEmits(['sentReport']);
const props = defineProps({
  reportData: {
    type: Object,
  },
  isNewReport: {
    type: Boolean,
    default: false,
  },
  isButtonDisabled: {
    type: Boolean,
    default: false,
  },
  blockEditFirstReport: {
    type: Boolean,
    default: false
  }
});
const isSecondReport = ref(false);

const reportDataChildren = ref(
    {
      participants_number: '',
      employed_sso: '',
      employed_smo: '',
      employed_specialized_detachments: '',
      employed_spo: '',
      employed_sservo: '',
      employed_production_detachments: '',
      employed_sop: '',
      employed_ssho: '',
      employed_top: '',
      employed_so_poo: '',
      employed_so_oovo: '',
      employed_ro_rso: '',
      additional_statistics: []
    }
);
watchEffect(() => {
  if (route.fullPath === '/reporting-ro/report-regional-two') {
    isSecondReport.value = true;
  }
  reportDataChildren.value = {...props.reportData};
})

const sentReport = () => {
  emit('sentReport', reportDataChildren.value)
};

const focusOut = async () => {
  if (isSecondReport.value) {
    const {data} = await editReport(reportDataChildren.value);
    emit('sentReport', data);
  }
};

const addAdditionalStatistics = () => {
  reportDataChildren.value.additional_statistics.push({
    name: '',
    value: ''
  })
};
const deleteAdditionalStatistics = async (index) => {
  reportDataChildren.value.additional_statistics.splice(index, 1)

  if (isSecondReport.value) {
    const {data} = await editReport(reportDataChildren.value);
    emit('sentReport', data);
  }
}
</script>
<style lang="scss" scoped>
.valid-red {
  color: #db0000;
}

.form {
  &-container {
    display: flex;
    margin-bottom: 8px;

    @media (max-width: 1200px) {
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      display: initial;
    }
  }

  &-col {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    justify-content: space-between;

    @media (max-width: 643px) {
      justify-content: center;
    }
  }

  &-input {
    max-width: 340px;
    height: 40px;
  }
}

.form__field-group {
  display: flex;
  flex-direction: column;
  border: none;
  background-color: #F3F4F5;
  border-radius: 10px;

  @media (max-width: 643px) {
    align-items: center;
  }
}

.form__field-group .form__field-group.Report-Regional-Form__style {
  padding: 0;
}

.form__field-group p {
  color: #6D6D6D;
}

.report_title-h3 {
  font-family: Akrobat;
  font-size: 18px;
  font-weight: 600;
  line-height: 21.6px;
  text-align: left;
  padding-bottom: 32px;
}

.form__add-link-button {
  //width: 141px;
  margin: 8px 0;
  border: none;
  background-color: transparent;
  color: #1F7CC0;
  padding: 0;
  text-align: left;
}
</style>