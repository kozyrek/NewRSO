<template>
    <div class="container">
        <div class="contributor">
            <h2 class="contributor-title">Реестр участников</h2>
            <div class="contributor-search">
                <input type="text" id="search" class="contributor-search__input mb-10" @keyup="searchItems"
                    v-model="name" placeholder="Начинайте ввод?" />
                <SvgIcon icon-name="search" />
            </div>
            <div class="contributor-container">
                <div class="filters">
                    <filters @update-district="updateDistrict" @update-reg="updateReg" @update-local="updateLocal"
                        @update-educ="updateEduc" @update-detachment="updateDetachment" :district="district"
                        :districts="districts" :reg="reg" :regionals="regionals" :local="local" :locals="locals"
                        :educ="educ" :educ-head="educHead" :detachment="detachment" :detachments="detachments"
                        :roles="roles.roles.value" :sorted-participants="sortedHeadquarters" />
                </div>
                <div class="contributor-items">
                    <div class="contributor-sort">
                        <div class="sort-layout">
                            <button class="showInfoBtn mr-4" v-if="!showInfo" @click="showInfo = !showInfo">
                                Показать статистику
                            </button>

                            <button class="showInfoBtn mr-4" v-else-if="showInfo" @click="showInfo = !showInfo">
                                Скрыть статистику
                            </button>
                        </div>

                        <div class="sort-filters">
                            <!-- <div class="sort-select">
                                <sortByEducation
                                    variant="outlined"
                                    clearable
                                    v-model="sortBy"
                                    :options="sortOptionss"
                                    :sorts-boolean="false"
                                ></sortByEducation>
                            </div>

                            <Button
                                type="button"
                                class="ascend mb-2"
                                icon="switch"
                                @click="ascending = !ascending"
                                color="white"
                            ></Button> -->
                        </div>
                    </div>
                    <registryList v-if="!isLoading" :items="sortedHeadquarters" :show-info="showInfo"></registryList>
                    <v-progress-circular class="circleLoader" v-else indeterminate color="blue"></v-progress-circular>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.contributor {
    padding: 0px 0px 60px 0px;

    &-title {
        font-size: 52px;
    }

    &-sort {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        margin-bottom: 32px;

        @media (max-width: 1024px) {
            flex-direction: column;
            align-items: flex-start;
            margin-top: 60px;
        }
    }

    &-container {
        display: grid;
        grid-template-columns: 0.5fr 1.5fr;
        align-items: baseline;
        grid-column-gap: 36px;
    }

    &-search {
        position: relative;
        box-sizing: border-box;
        margin: 60px 0px 0px 0px;

        img {
            position: absolute;
            top: 15px;
            left: 16px;
        }

        &__input {
            width: 100%;
            padding: 13px 0px 10px 60px;
            border-radius: 10px;
            border: 1px solid black;
        }
    }

    &-info {
        font-size: 18px;
        font-weight: 400;
        margin-top: 60px;
    }

    &-wrapper {
        padding-top: 40px;
    }
}

.showInfoBtn {
    padding: 6px 16px;
    border: 1px solid #35383f;
    border-radius: 10px;
    margin-bottom: 8px;
    height: 40px;
}

</style>

<script setup>
import { ref, computed, watch, inject, onMounted, onActivated } from 'vue';
import { sortByEducation } from '@shared/components/selects';
import { filters } from '@features/Contributor/components';
import { Button } from '@shared/components/buttons';
import { useUserStore } from '@features/store/index';
import { useRoleStore } from '@layouts/store/role';
import { useRegionalsStore } from '@features/store/regionals';
import { useDistrictsStore } from '@features/store/districts';
import { useLocalsStore } from '@features/store/local';
import { useEducationalsStore } from '@features/store/educationals';
import { useSquadsStore } from '@features/store/squads';
import { storeToRefs } from 'pinia';
import { HTTP } from '@app/http';
import { registryList } from '@features/registry/components';
import { SvgIcon } from '@shared/index';

const roleStore = useRoleStore();
const roles = storeToRefs(roleStore);
const regionalsStore = useRegionalsStore();

const userStore = useUserStore();
const districtsStore = useDistrictsStore();
const localsStore = useLocalsStore();
const educationalsStore = useEducationalsStore();
const squadsStore = useSquadsStore();
const regionals = ref([]);
const districts = ref([]);
const locals = ref([]);
const educHead = ref([]);
const detachments = ref([]);
const reg = ref(null);
const detachment = ref(null);
const timerSearch = ref(null);
const district = ref(null);
const local = ref(null);
const isLoading = ref(false);
const showInfo = ref(false);
const educ = ref(null);
const sortedVal = ref([]);

//Сортировк
const ascending = ref(true);
const levelAccess = ref(7);
const name = ref('');

const sortBy = ref('alphabetically');

const sortOptionss = ref([
    {
        value: 'alphabetically',
        name: 'Алфавиту от А - Я',
    },
    // { value: 'founding_date', name: 'Дате создания штаба' },
    // { value: 'members_count', name: 'Количеству участников' },
]);

const viewHeadquartersData = async (resp, search, join) => {
    try {
        isLoading.value = true;
        let routeName = 'DistrictHQ';
        if (resp.indexOf('districts') >= 0) {
            routeName = 'DistrictHQ';
        } else if (resp.indexOf('regionals') >= 0) {
            routeName = 'RegionalHQ';
        } else if (resp.indexOf('locals') >= 0) {
            routeName = 'LocalHQ';
        } else if (resp.indexOf('educationals') >= 0) {
            routeName = 'HQ';
        } else if (resp.indexOf('detachments') >= 0) {
            routeName = 'lso';
        } else if (resp.indexOf('rsousers') >= 0) {
            routeName = 'userpage';
        }
        const viewHeadquartersResponse = await HTTP.get(resp + search);

        let response = viewHeadquartersResponse.data.results;
        for (let i in response) {
            response[i]['route'] = routeName;
        }
        if (join) {
            const viewHeadquartersResponsetTwo = await HTTP.get(
                '/educationals/' + search,
            );
            educHead.value = viewHeadquartersResponsetTwo.data.results;
            let response2 = viewHeadquartersResponsetTwo.data.results;
            for (let i in response2) {
                response2[i]['route'] = 'HQ';
            }
            response = response.concat(response2);
        }
        sortedVal.value = response;
        isLoading.value = false;

        if (resp.indexOf('districts') >= 0) {
            districts.value = viewHeadquartersResponse.data.results;
        } else if (resp.indexOf('regionals') >= 0) {
            regionals.value = viewHeadquartersResponse.data.results;
        } else if (resp.indexOf('locals') >= 0) {
            locals.value = viewHeadquartersResponse.data.results;
        } else if (resp.indexOf('educationals') >= 0) {
            educHead.value = viewHeadquartersResponse.data.results;
        } else if (resp.indexOf('detachments') >= 0) {
            detachments.value = viewHeadquartersResponse.data.results;
        }
    } catch (error) {
        console.log('an error occured ' + error);
    }
};

const updateDistrict = (districtVal) => {
    let search = '';
    let resp = '/regionals/';

    if (districtVal) {
        search = '?district_headquarter__name=' + districtVal;
    } else {
        search = '';
        resp = '/districts/';
    }

    if (name.value) search += '&search=' + name.value;
    viewHeadquartersData(resp, search);

    district.value = districtVal;
};

const updateReg = (regVal) => {
    let search = '';
    let resp = '/locals/';
    if (regVal) {
        search = '?regional_headquarter__name=' + regVal;
    } else if (levelAccess.value < 2) {
        search = '?district_headquarter__name=' + district.value;
    }
    if (name.value) search += '&search=' + name.value;
    viewHeadquartersData(resp, search);

    reg.value = regVal;
};
const updateLocal = (localVal) => {
    let search = '';
    let resp = localVal ? '/educationals/' : '/locals/';

    if (localVal) {
        search = '?local_headquarter__name=' + localVal;
    } else if (levelAccess.value < 3) {
        search = '?regional_headquarter__name=' + reg.value;
    }
    if (name.value) search += '&search=' + name.value;

    viewHeadquartersData(resp, search, !localVal);

    local.value = localVal;
};

const updateEduc = (educVal) => {
    let search = '';
    let resp = educVal
        ? '/detachments/'
        : local.value
            ? '/educationals/'
            : '/locals/';
    if (educVal) {
        search = '?educational_headquarter__name=' + educVal;
    } else if (local.value) {
        search = '?local_headquarter__name=' + local.value;
    } else if (levelAccess.value < 3) {
        search = '?regional_headquarter__name=' + reg.value;
    } else if (levelAccess.value < 4) {
        search = '?local_headquarter__name=' + local.value;
    }
    if (name.value) search += '&search=' + name.value;

    viewHeadquartersData(resp, search);

    educ.value = educVal;
};

const updateDetachment = (detachmentVal) => {
    let search = '';
    let resp = detachmentVal ? '/rsousers' : educ.value ? '/detachments/' : '';
    if (detachmentVal) {
        search = '?detachment__name=' + detachmentVal;
    } else if (levelAccess.value < 5) {
        search = '?educational_headquarter__name=' + educ.value;
    }
    if (name.value) search += '&search=' + name.value;

    viewHeadquartersData(resp, search);
    detachment.value = detachmentVal;
};

const searchItems = (event) => {
    let search = '';
    let resp = '';
    if (!name.value && roles.roles.value.centralheadquarter_commander) {
        resp = '/districts/';
    } else if (name.value && roles.roles.value.centralheadquarter_commander) {
        resp = '/districts/';
        search = '?search' + name.value;
    }
    if (district.value) {
        resp = '/regionals/';
        // search = '?regional_headquarter__name=' + reg.value;
        search = '?district_headquarter__name=' + district.value;
    }
    if (reg.value) {
        resp = '/locals/';
        // search = '?local_headquarter__name=' + local.value;
        search = '?regional_headquarter__name=' + reg.value;
    }
    if (local.value) {
        resp = local.value ? '/educationals/' : '/locals/';

        // search = '?educational_headquarter_name=' + educ.value;
        search = '?local_headquarter__name=' + local.value;
    }
    if (educ.value) {
        resp = educ.value
            ? '/detachments/'
            : local.value
                ? '/educationals/'
                : '/locals/';
        search = '?detachment__name=' + detachment.value;

        search = '?educational_headquarter__name=' + educ.value;
    }
    if (detachment.value) {
        resp = '/rsousers';
        search = '?detachment__name=' + detachment.value;
    }
    if (search) {
        search += '&search=' + name.value;
    }

    clearTimeout(timerSearch.value);
    timerSearch.value = setTimeout(() => {
        viewHeadquartersData(resp, search);
    }, 400);
};

const getItemsByRoles = () => {
    if (!Object.keys(roleStore.roles).length) return false;
    if (!roles.roles.value.centralheadquarter_commander) {
        let search = '';
        let resp = '';
        let join = false;

        if (roles.roles.value.districtheadquarter_commander) {
            district.value =
                roles.roles.value.districtheadquarter_commander.name;
            search =
                '?district_headquarter__name=' +
                roles.roles.value.districtheadquarter_commander.name;
            resp = '/regionals/';
            levelAccess.value = 1;
        } else if (roles.roles.value.regionalheadquarter_commander) {
            reg.value = roles.roles.value.regionalheadquarter_commander.name;
            search =
                '?regional_headquarter__name=' +
                roles.roles.value.regionalheadquarter_commander.name;
            resp = '/locals/';
            join = true;
            locals.value = localsStore.locals.filter(
                (loc) => loc.regional_headquarter == reg.value,
            );
            levelAccess.value = 2;
        } else if (roles.roles.value.localheadquarter_commander) {
            local.value = roles.roles.value.localheadquarter_commander.name;
            search =
                '?local_headquarter__name=' +
                roles.roles.value.localheadquarter_commander.name;
            resp = '/educationals/';
            levelAccess.value = 3;
        } else if (roles.roles.value.educationalheadquarter_commander) {
            educ.value =
                roles.roles.value.educationalheadquarter_commander.name;
            search =
                '?educational_headquarter__name=' +
                roles.roles.value.educationalheadquarter_commander.name;
            resp = '/detachments/';
            levelAccess.value = 4;
        } else if (roles.roles.value.detachment_commander) {
            detachment.value = roles.roles.value.detachment_commander.name;
            search =
                '?detachment__name=' +
                roles.roles.value.detachment_commander.name;
            resp = '/rsousers';
            levelAccess.value = 5;
        }
        viewHeadquartersData(resp, search, join);
    } else {
        levelAccess.value = 0;
        let resp = '/districts/';
        viewHeadquartersData(resp, '');
    }
};

const sortedHeadquarters = computed(() => {
    let tempHeadquarters = sortedVal.value;

    // tempHeadquarters = tempHeadquarters.sort((a, b) => {
    //     if (sortBy.value == 'alphabetically') {
    //         let fa = a?.name.toLowerCase(),
    //             fb = b?.name.toLowerCase()

    //         if (fa < fb) {
    //             return -1;
    //         }
    //         if (fa > fb) {
    //             return 1;
    //         }
    //         return 0;
    //     }
    // });

    // if (!ascending.value) {
    //     tempHeadquarters.reverse();
    // }
    return tempHeadquarters;
});

watch(
    () => roles.roles.value,

    (newRole, oldRole) => {
        getItemsByRoles();
    },
);

watch(
    () => districtsStore.districts,
    () => {
        districts.value = districtsStore.districts;
    },
);

watch(
    () => regionalsStore.regionals,
    () => {
        let districtID = districtsStore.districts.length
            ? districtsStore.districts.find(
                (dis) => (dis.name = district.value),
            )?.id
            : roleStore.roles.districtheadquarter_commander?.id;
        regionals.value = regionalsStore.regionals.filter(
            (reg) => reg.district_headquarter == district.value,
        );
    },
);

watch(
    () => localsStore.locals,
    () => {
        let regID = regionalsStore.regionals.length
            ? regionalsStore.regionals.find((reg) => reg.name == reg.value)?.id
            : roleStore.roles.regionalheadquarter_commander?.id;
        locals.value = localsStore.locals.filter(
            (loc) => loc.regional_headquarter == regID,
        );
    },
);

watch(
    () => educationalsStore.educationals,
    () => {
        let regID = regionalsStore.regionals.length
            ? regionalsStore.regionals.find((reg) => reg.name == reg.value)?.id
            : roleStore.roles.regionalheadquarter_commander?.id;
        let locID = localsStore.locals.length
            ? localsStore.locals.find((loc) => loc.name == local.value)?.id
            : roleStore.roles.localheadquarter_commander?.id;
        educHead.value = educationalsStore.educationals.filter(
            (edh) => edh.regional_headquarter == regID,
        );
        if (local.value) {
            educHead.value = educationalsStore.educationals.filter(
                (edh) => edh.local_headquarter == locID,
            );
        }
    },
);

watch(
    () => squadsStore.squads,
    () => {
        detachments.value = squadsStore.squads;
    },
);

onMounted(() => {
    getItemsByRoles();
});
</script>
