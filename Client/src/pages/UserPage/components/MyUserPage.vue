<template>
    <div class="container">
        <div class="user-wrapper" v-if="!isLoading.isLoading.value">
            <h2 class="page-title">Моя страница</h2>
            <MyWall :user="currentUser.currentUser.value" :education="education" :user_region="region" :edited="true"
                class="mt-3" @upload-wall="uploadWall" @update-wall="updateWall" @delete-wall="deleteWall"
                @upload="uploadAva" @update="updateAva" @delete="deleteAva"></MyWall>
            <div class="user-verify" v-if="!currentUser.currentUser.value.is_verified">
                <p class="user-verify__title">Верификация данных</p>
                <div class="user-verify__desc">
                    Уважаемый пользователь, для того, чтобы использовать полный
                    функционал личного кабинета, пройдите, пожалуйста,
                    верификацию. Верификация — это документальное подтверждение
                    ваших личных данных. Она займет всего несколько минут.
                </div>
                <router-link to="/personal-data">
                    <Button class="user-verify__btn" name="verify-btn" label="Пройти верификацию"
                        color="primary"></Button></router-link>
            </div>

            <div class="mt-14" v-if="currentUser.currentUser.value.is_verified">
                {{ currentUser.currentUser.value.bio }}
            </div>
            <div class="mt-8 photoWrapper">
                <user-photo 
                    v-for="(photo, index) in media" 
                    :key="index"
                    class="photo-item" 
                    :photo="photo" 
                    :add="false" 
                    :number="index"
                />
                <!-- <userPhoto class="photo-item" :photo="currentUser.currentUser.value.media?.photo1" :add="false"
                    @uploadUserPic="uploadUserPic" @updateUserPic="updateUserPic"></userPhoto>
                <userPhoto2 class="photo-item" :photo="currentUser.currentUser.value.media?.photo2" :add="false">
                </userPhoto2>
                <userPhoto3 class="photo-item" :photo="currentUser.currentUser.value.media?.photo3" :add="false">
                </userPhoto3>
                <userPhoto4 class="photo-item photo-item-last" :photo="currentUser.currentUser.value.media?.photo4"
                    :add="false"></userPhoto4> -->
            </div>
        </div>

        <v-progress-circular class="circleLoader" v-else indeterminate color="blue"></v-progress-circular>
    </div>
</template>
<script setup>
import { Button } from '@shared/components/buttons';
import { MyWall } from '@features/baner/components';
import { TextArea } from '@shared/components/inputs';
import { userPhoto } from '@shared/components/imagescomp';

import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { HTTP } from '@app/http';
import { useUserStore } from '@features/store/index';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';


const router = useRouter();
const userStore = useUserStore();
const currentUser = storeToRefs(userStore);
const isLoading = storeToRefs(userStore);
const education = ref({});
const region = ref({});
const tokenUser = ref("");
const isAuth = ref(!!localStorage.getItem('jwt_token'));
const query = new URLSearchParams(window.location.search);
const payload = JSON.parse(query.get("payload"));

const media = ref({
    photo1: null,
    photo2: null,
    photo3: null,
    photo4: null,
})

const TokenData = ref({
    silent_token: payload?.token,
    uuid: payload?.uuid,
})

const getAccessToken = async () => {
    if (!TokenData.value.silent_token && !TokenData.value.uuid) {
        console.log('TokenData values are null, undefined, or empty');
        return;
    }
    try {
        const resp = await HTTP.post('/jwt/vk-login/', TokenData.value);
        localStorage.setItem('jwt_token', resp.data.access);
        router.replace({ query: null });
    } catch (e) {
        console.log('Error:', e);
    }
};
const uploadAva = (imageAva) => {

    currentUser.currentUser.value.media.photo = imageAva;
};

const updateAva = (imageAva) => {

    currentUser.currentUser.value.media.photo = imageAva;
};

const deleteAva = (imageAva) => {

    currentUser.currentUser.value.media.photo = imageAva;
};

const uploadWall = (imageWall) => {

    currentUser.currentUser.value.media.banner = imageWall;
};

const updateWall = (imageWall) => {

    currentUser.currentUser.value.media.banner = imageWall;
};

const deleteWall = (imageWall) => {

    currentUser.currentUser.value.media.banner = imageWall;
};

watch (() => currentUser.currentUser.value.media,(photos)=> {
    media.value = {
        photo1: photos?.photo1,
        photo2: photos?.photo2,
        photo3: photos?.photo3,
        photo4: photos?.photo4,
    }
}, {deep: true});

onMounted(() => {
    getAccessToken();
})
</script>
<style lang="scss" scoped>
.user-wrapper {
    padding: 0px 0px 80px 0px;
}

.photoWrapper {
    display: flex;

    @media screen and (max-width: 768px) {
        display: grid;
        grid-template-columns: 0.28fr 0.28fr;
        grid-column-gap: 20px;
        grid-row-gap: 20px;
        justify-content: center;
    }

    @media screen and (max-width: 575px) {
        grid-template-columns: 0.28fr;
    }
}

.user-verify {
    margin-top: 60px;
    margin-bottom: 40px;

    &__title {
        font-size: 32px;
        color: #35383f;
        font-weight: 600;

        @media screen and (max-width: 575px) {
            font-size: 28px;
        }
    }

    &__desc {
        font-size: 18px;
        color: #35383f;
        font-weight: 40;
        margin-top: 40px;
        max-width: 835px;
        margin-bottom: 40px;

        @media screen and (max-width: 768px) {
            max-width: 620px;
        }

        @media screen and (max-width: 575px) {
            width: 100%;
        }
    }
}

.circleLoader {
    width: 60px;
    height: 60px;
    display: block;
    margin: 30px auto;
}

.photo-item {
    width: 280px;
    margin-right: 20px;

    @media screen and (max-width: 575px) {
        height: 373px;
        width: 280px;
        margin-right: 0;
    }
}

.photo-item-last {
    margin-right: 0;
}

.btn {
    margin: 0px;
    padding: 12px 62px;
    height: 52px;

    @media screen and (max-width: 575px) {
        margin: 0px auto;
        width: 100%;
    }
}
</style>
