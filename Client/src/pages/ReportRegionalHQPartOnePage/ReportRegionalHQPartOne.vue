<template>
  <div class="container">
    <h1 class="title title--mb">Отчет о деятельности регионального отделения РСО за 2024 год. Часть 1</h1>
    <h2 class="report_title-h2">Свод статистических данных по трудоустройству бойцов студенческих отрядов РО за 2024 год
      на 1 сентября 2024 года</h2>

      <p class="report_title-name">{{ route.query.headquartersName }}</p>

    <report-regional-form :reportData="reportData" @sentReport="sentReport" isNewReport
      :isButtonDisabled="isButtonDisabled" :key="route.path"/>
  </div>
  <ReportModalSuccess v-if="showModalSuccess" @closeModal="closeModalSuccess" />
  <ReportModalWarning v-if="showModalWarning" @reportConfirmation="reportConfirmation" />
</template>

<script setup>
import { inject, onActivated, ref, watch } from "vue";
import { useRoleStore } from "@layouts/store/role";
import ReportRegionalForm from "@pages/ReportRegionalHQPartOnePage/components/ReportRegionalForm.vue";
import { createReport, getCurrentReport, getReport } from "@services/ReportService.ts";
import ReportModalSuccess from "@pages/ReportRegionalHQPartOnePage/components/ReportModalSuccess.vue";
import ReportModalWarning from "@pages/ReportRegionalHQPartOnePage/components/ReportModalWarning.vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";

const swal = inject('$swal');
const route = useRoute();
const router = useRouter();

const roleStore = useRoleStore();

const defaultReportData = {
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
};

const reportData = ref(defaultReportData);
const showModalWarning = ref(false);
const showModalSuccess = ref(false);
const isButtonDisabled = ref(false);

onActivated(async () => {
  try {
    const res = route.query.id ? await getCurrentReport(String(route.query.id)) : await getReport();
    reportData.value = res.data;
    isButtonDisabled.value = true;
  } catch (e) {
    console.log(e)
  }
});

watch(() => roleStore.roles?.regionalheadquarter_commander, () => {
  if (roleStore.roles?.regionalheadquarter_commander === null) {
    router.push({ name: 'mypage' })
  }
})

onBeforeRouteLeave(() => {
  reportData.value = defaultReportData;
  isButtonDisabled.value = false;
});
const reportConfirmation = async (value) => {
  if (hasEmptyField(reportData.value)) {
    showModalWarning.value = false;
    swal.fire({
      position: 'center',
      icon: 'warning',
      title: `Все поля обязательны для заполнения`,
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }
  if (value) {
    isButtonDisabled.value = true;
    try {
      await createReport(reportData.value)
      showModalWarning.value = false;
      showModalSuccess.value = true;
    } catch (e) {
      swal.fire({
        position: 'center',
        icon: 'error',
        title: `Не удалось отправить отчет`,
        showConfirmButton: false,
        timer: 1500,
      });
      isButtonDisabled.value = false;
      showModalWarning.value = false;
    }
  } else {
    showModalWarning.value = false;
  }
};
const sentReport = (data) => {
  showModalWarning.value = true;
  reportData.value = data;
};
const closeModalSuccess = (value) => {
  showModalSuccess.value = value;
};

watch(() => roleStore.roles?.regionalheadquarter_commander, () => {
  if (roleStore.roles?.regionalheadquarter_commander === null) {
    router.push({ name: 'mypage' })
  }
})
const hasEmptyField = (obj) => {
  for (let item in obj) {
    if (!obj[item]) {
      return true;
    }
  }
  return false;
};
</script>
<style lang="scss" scoped>
.report_title-h2 {
  font-family: Bert Sans;
  font-size: 22px;
  font-weight: 400;
  line-height: 29.01px;
  text-align: left;
  margin-bottom: 40px;
}
.report_title-name {
  font-family: Bert Sans;
  font-size: 18px;
  font-weight: 500;
  line-height: 22.1px;
  text-align: left;
  margin-bottom: 20px;
}

.form {
  &-container {
    display: flex;
    margin-bottom: 8px;
    gap: 80px;

    @media (max-width: 768px) {
      display: initial;
    }
  }

  &-col {
    width: 50%;

    @media (max-width: 768px) {
      width: initial;
    }
  }

  &-input {
    width: 100%;
    height: 40px;
  }
}
</style>