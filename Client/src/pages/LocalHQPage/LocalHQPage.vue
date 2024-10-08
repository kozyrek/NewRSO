<template>
    <div class="container">
        <Breadcrumbs :items="pages"></Breadcrumbs>
        <h1 class="title title--hq">Местный штаб</h1>
        <BannerHQ  :localHeadquarter="localHeadquarter" :member="member"
            :ending="ending" :endingMember="endingMember">
        </BannerHQ>
        <section class="about-hq" v-if="localHeadquarter.about && localHeadquarter.about != 'null'">
            <h3>Описание местного штаба</h3>
            <p>{{ localHeadquarter.about }}</p>
        </section>
        <ManagementHQ :commander="commander" :member="member" head="Руководство местного штаба" :position="position"
            :leadership="leaderships"></ManagementHQ>
        <section class="headquarters_squads">
            <h3>Штабы и отряды местного штаба</h3>
            <div class="headquarters_squads__container">
                <div class="card" :key="HQandSquad.link" v-for="(HQandSquad, index) in HQandSquads" :class="{
                    'align-left': index % 2 === 0,
                    'align-right': index % 2 !== 0,
                }">
                    <a v-bind:href="HQandSquad.link" @click="HQandSquad.click">
                        <p>{{ HQandSquad.name }}</p>
                    </a>
                </div>
            </div>
        </section>
    </div>
</template>
<script setup>
import { BannerHQ } from '@features/baner/components';
import ManagementHQ from '../HQPage/components/ManagementHQ.vue';
import { ref, onMounted, watch, computed } from 'vue';
import { HTTP } from '@app/http';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import { useCrosspageFilter } from '@shared';
import { usePage } from '@shared';
import { useUserStore } from '@features/store';
import mixins from '@/mixins/mixins';

const { methods } = mixins;
const { getEnding } = methods;
const { getEndingMembers } = methods;

const userStore = useUserStore();

const crosspageFilters = useCrosspageFilter();
const commander = ref({});
const position = ref({});
const leaderships = ref({});
const localHeadquarter = ref({});
const member = ref([]);
const route = useRoute();
let id = route.params.id;

const { replaceTargetObjects } = usePage();

const aboutlocalHQ = async () => {
    if (typeof id !== 'undefined') {
        try {
            const response = await HTTP.get(`/locals/${id}/`);

            localHeadquarter.value = response.data;
            replaceTargetObjects([localHeadquarter.value]);
        } catch (error) {
            console.log('an error occured ' + error);
        }
    }
};

const fetchCommander = async () => {
    try {
        let id = localHeadquarter.value.commander.id;

        const response = await HTTP.get(`/users/${id}/`);

        commander.value = response.data;
        // console.log(response);
    } catch (error) {
        console.log('An error occurred:', error);
    }
};

const getLeadership = async () => {
    if (typeof id !== 'undefined') {
        try {
            const response = await HTTP.get(`/locals/${id}/leadership/`);

            leaderships.value = response.data;
        } catch (error) {
            console.log('an error occured ' + error);
        }
    }
}

watch(
    () => route.params.id,

    async (newId) => {
        id = newId;
        await aboutlocalHQ();
        await fetchCommander();
        await getLeadership();
    },
    {
        immediate: true,
        deep: true,
    },
);


const HQandSquads = ref([
    {
        name: 'Штабы СО ОО',
        link: '/all-headquarters',
        click: () => {
            crosspageFilters.addFilter({
                pageName: 'AllHeadquarters',
                filters: {
                    localName: localHeadquarter.value.name,
                },
            });
        },
    },
    {
        name: 'ЛСО',
        link: '/all-squads',
        click: () => {
            crosspageFilters.addFilter({
                pageName: 'AllHeadquarters',
                filters: {
                    localName: localHeadquarter.value.name,
                },
            });
        },
    },
]);
const ending = computed(() =>
    getEnding(localHeadquarter.value.participants_count),
);
const endingMember = computed(() =>
    getEndingMembers(localHeadquarter.value.members_count),
);
</script>
<style scoped lang="scss">
.title {
    //-----------------------------------общий класс для всех заголовков h1
    // font-family: ;
    font-size: 52px;
    line-height: 62px;
    font-weight: 700;
    color: #35383f;

    &--hq {
        margin-bottom: 50px;
    }
}

.user-data__wrapper {
    margin: 20px 0 12px 298px;
}

.Squad-HQ__name {
    font-family: 'Akrobat';
    font-size: 32px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
}

.slogan {
    margin-top: 20px;
    margin-bottom: 9.5px;
}

.Squad-HQ__list {
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: 380px 300px;
}

.Squad-HQ__list li {
    border-right: none;
    height: 20px;
    margin: 0;
}

.Squad-HQ__university p {
    border-right: 1px solid #35383f;
    margin-right: 8px;
    padding-right: 8px;
}

.Squad-HQ__date {
    display: flex;
}

.Squad-HQ__date p {
    margin-right: 22px;
}

.user-data__link {
    border-radius: 10px;
    background: #39bfbf;
    align-self: end;
    text-align: center;
    font-family: 'BertSans';
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px;
    color: white;
    padding: 16px 32px;
}

.squad-data__contacts-wrapper {
    display: flex;
    justify-content: space-between;
}

.squad-data__contacts {
    display: grid;
}

.squad-data__contacts {
    display: flex;
    flex-direction: column;
}

.squad-data__social-network {
    display: flex;
    justify-content: space-between;
    margin: 16px 16px 0px 0px;
}

.about-hq {
    margin-bottom: 60px;
}

.about-hq h3 {
    font-size: 32px;
    font-family: 'Akrobat';
    margin-bottom: 40px;
    color: #35383f;
}

.about-hq p {
    font-size: 18px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 0em;
    text-align: left;
    color: #35383f;
}

@media (max-width: 1110px) {
    .Squad-HQ__list {
        grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    }

    .Squad-HQ__university p {
        border-right: 0;
        margin-right: 0;
        padding-right: 0;
    }

    .Squad-HQ__list li {
        margin-bottom: 8px;
    }
}

@media (max-width: 790px) {
    .squad-data__contacts-wrapper {
        flex-direction: column;
    }

    .user-data__link {
        align-self: start;
    }

    .squad-data__social-network {
        justify-content: start;
        margin: 16px 16px 20px 0px;
        gap: 12px;
    }
}

@media (max-width: 730px) {
    .user-data__wrapper {
        margin: 20px 0 12px 265px;
    }

    .user-metric {
        grid-template-columns: 15px 135px 135px 2fr 16px;
    }
}

@media (max-width: 690px) {
    .user-metric {
        grid-template-columns: 3fr 0fr 16fr 1fr;
    }

    .user-data__wrapper {
        margin: 105px 5px 20px 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .Squad-HQ__university p {
        text-align: center;
    }

    .Squad-HQ__list li {
        justify-content: center;
    }

    .squad-data__contacts {
        align-self: center;
    }
}

@media (max-width: 430px) {
    .user-metric {
        grid-template-columns: 6fr 0fr 16fr 1fr;
    }
}

@media (max-width: 415px) {
    .Squad-HQ__list {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        row-gap: 30px;
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
section.headquarters_squads {
    margin-bottom: 60px;
}

section.headquarters_squads h3 {
    color: #35383f;
    font-family: 'Akrobat';
    font-size: 32px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
}

.headquarters_squads__container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 40px;
}

.card {
    border-radius: 10px;
    background: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);
    /*  */
    padding: 80px 20px;
    width: 280px;
    height: 220px;
    display: grid;
    align-items: center;
}

.card p {
    color: #35383f;
    text-align: center;
    font-family: 'Akrobat';
    font-size: 32px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
}

// адаптив
@media (max-width: 965px) {
    .headquarters_squads__container {
        justify-items: center;
        column-gap: 40px;
    }

    .card.align-left {
        margin-left: auto;
    }

    .card.align-right {
        margin-right: auto;
    }
}

@media (max-width: 648px) {
    .card.align-left {
        margin-left: 0;
    }

    .card.align-right {
        margin-right: 0;
    }
}

@media (max-width: 450px) {
    .headquarters_squads__container {
        grid-template-columns: repeat(auto-fill, minmax(156px, 1fr));
        column-gap: 16px;
        row-gap: 16px;
    }

    .card {
        padding: 16px;
        width: 156px;
        height: 165px;
    }

    .card p {
        font-size: 18px;
    }
}
</style>
