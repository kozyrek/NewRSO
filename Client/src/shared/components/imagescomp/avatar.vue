<template>
    <div class="user-metric__avatar-wrapper">
        <div class="user-metric__avatar">
            <!-- Аватар пользователя  -->

            <img v-if="avatar" :src="avatar" alt="avatarka" />
            <img v-else id="profile-pic" src="@app/assets/user-avatar.png" alt="Аватарка(пусто)" />
        </div>

        <!-- Иконка добавления аватара -->
        <v-menu min-width="200px" rounded v-if="props.edited">
            <template v-slot:activator="{ props }">
                <v-btn class="user-metric__avatar-add" icon v-bind="props">
                    <v-avatar size="large">
                        <v-icon :icon="avatar ? 'mdi-pencil' : 'mdi-plus'"></v-icon>
                    </v-avatar>
                </v-btn>
            </template>
            <v-card>
                <v-card-text>
                    <div class="mx-auto text-center">
                        <v-dialog v-model="dialog" width="1024">
                            <template v-slot:activator="{ props }">
                                <v-btn rounded variant="text" v-bind="props">
                                    {{ avatar ? 'Редактировать' : 'Загрузить' }} аватар
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="text-h5">Загрузите ваше фото</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-file-input @change="selectFile" type="file" show-size
                                                prepend-icon="mdi-camera" counter />
                                        </v-row>
                                        <v-row class="align-center justify-end">
                                            <v-btn v-if="preview" class="button-wrapper mt-5" @click="cropImage()"
                                                prepend-icon="crop" variant="plain">Обрезать фото</v-btn>
                                        </v-row>
                                        <v-row v-if="preview">
                                            <Cropper ref="cropper" class="cropper mt-5 mx-auto" :src="preview"
                                                @change="onChangeCrop" :stencil-component="CircleStencil
                                                    " />
                                            <Preview :width="120" :height="120" :image="result.image" :coordinates="result.coordinates
                                                " class="mt-9" style="border-radius: 50%" />
                                        </v-row>
                                    </v-container>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
                                        Закрыть
                                    </v-btn>
                                    <v-btn :disabled="!media" color="blue-darken-1" variant="text" type="submit"
                                        @click="banner ? updatePhoto() : uploadPhoto()">
                                        Загрузить
                                    </v-btn>
                                </v-card-actions>
                                <p class="error" v-if="isError.detail">
                                    {{ isError.detail }}
                                </p>
                            </v-card>
                        </v-dialog>
                        <v-divider class="my-3" v-if="avatar"></v-divider>  
                        <v-btn v-if="avatar" rounded variant="text" @click="deletePhoto()">  
                            Удалить аватар 
                        </v-btn>  
                    </div>
                </v-card-text>
            </v-card>
        </v-menu>
    </div>
</template>
<script setup>
import { ref, inject } from 'vue';
import { HTTP } from '@app/http';
import { Cropper, Preview, CircleStencil } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const dialog = ref(false);
const preview = ref(null);
const isError = ref([]);
const swal = inject('$swal');

const emit = defineEmits(['upload', 'update', 'delete']);

const props = defineProps({
    avatar: String,
    edited: {
        type: Boolean,
        default: false,
    },
});


const media = ref(null);
const cropper = ref();

const showSuccessAlert = (message) => {
    swal.fire({
        position: 'top-center',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1500,
    });
};

const showErrorAlert = (error) => {
    isError.value = error;
    console.error('There was an error!', error);
    swal.fire({
        position: 'top-center',
        icon: 'error',
        title: 'ошибка',
        showConfirmButton: false,
        timer: 1500,
    });
};

let result = ref({
    coordinates: null,
    image: null,
});

const cropImage = () => {
    if (cropper.value) {
        const { canvas } = cropper.value.getResult();
        preview.value = canvas.toDataURL('image/jpeg');
        canvas.toBlob((blob) => {
            media.value = new File([blob], 'photo1.jpg', {
                type: 'image/jpeg',
            });
        }, 'image/jpeg');
    }
};

const onChangeCrop = ({ coordinates, image }) => {
    result.value.coordinates = coordinates;
    result.value.image = image;
};

const selectFile = (event) => {
    media.value = event.target.files[0];
    preview.value = URL.createObjectURL(media.value);
};


const handleAvatarRequest = async (method, url, action) => {
    dialog.value = true;
    const formData = new FormData();
    formData.append('photo', media.value);
    try {
        const response = await HTTP[method](url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        showSuccessAlert('успешно');
        dialog.value = false;
        emit(action, response.data.photo);
    } catch ({ response }) {
        showErrorAlert(response.data);
    }
};

const uploadPhoto = () => {
    handleAvatarRequest('patch', '/rsousers/me/media/', 'upload');
};

const updatePhoto = () => {
    handleAvatarRequest('put', '/rsousers/me/media/', 'update');
};

const deletePhoto = async () => {
    try {
        const response = await HTTP.put('/rsousers/me/media/', { photo: null });
        showSuccessAlert('успешно');
        emit('delete', response.data.photo);
    } catch ({ response }) {
        showErrorAlert(response.data);
    }
};  
</script>

<style lang="scss">
.user-metric__avatar {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 3;
    width: 80%;
    height: 100%;
    border-radius: 50%;

    @media screen and (min-width: 320px) and (max-width: 480px) {
        display: flex;
        grid-column-start: 1;
        grid-column-end: 3;
        grid-row-start: 1;
        grid-row-end: 3;
        width: 80%;
        height: 100%;
        justify-content: center;
        align-items: center;
        transform: translateX(center);
    }

    &-wrapper {
        display: grid;
        grid-template-columns: 160px 90px;
        grid-template-rows: 130px 80px;
        align-content: center;
        justify-content: center;
        grid-column-start: 2;
        grid-column-end: 4;
        grid-row-start: 2;
        grid-row-end: 4;
    }

    &-add {
        display: grid;
        grid-column-start: 2;
        grid-column-end: 3;
        grid-row-start: 2;
        grid-row-end: 3;
    }

}

.user-metric__avatar img {
    width: 90%;
    height: 90%;
    clip-path: circle(50%);
    object-fit: cover;
    border-radius: 50%;
    align-items: center;

    @media screen and (min-width: 320px) and (max-width: 480px) {
        transform: translateX(25px);
        margin-bottom: 200px;
    }
}


.parent {

    .v-btn--icon.v-btn--density-default {
        background: rgba(0, 0, 0, 0.4);
        margin-right: 25px;

        @media screen and (min-width: 320px) and (max-width: 480px) {
            &:nth-of-type(1) {
                margin-right: 15px;
                transform: translateY(120px) translateX(-20px);
            }
        }
    }
}

.v-btn--icon.v-btn--density-default {
    background: rgba(0, 0, 0, 0.4);
    margin-right: 25px;
    transform: translateY(0px) translateX(0px);


    @media screen and (min-width: 320px) and (max-width: 480px) {
        margin-right: 25px;
        transform: translateX(5px) translateY(-70px);

        &.banner {
            margin-right: 10px;
            position: relative;
            transform: translateY(-90px);
        }
    }
}

.v-btn--icon {
    border-radius: 50%;
    border: 2px solid white;
    color: white;



}

.v-avatar i {
    color: white;
}
</style>
