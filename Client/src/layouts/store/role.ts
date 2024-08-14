import { ref } from 'vue';
import { defineStore } from 'pinia';
import { HTTP } from '@app/http';

const isAuth = ref(!!localStorage.getItem('jwt_token'));

export const useRoleStore = defineStore('role', {
    state: () => ({
        roles: {},
        userRoles: {},
        myPositions: {},
        positions: {},
        isLoadingRoles: false,
        status: {},
    }),
    actions: {
        async getRoles() {
            // if (Object.keys(this.roles).length || this.isLoadingRoles) return;
            this.isLoadingRoles = true;
            const data = await HTTP.get('/rsousers/me_commander/', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'JWT ' + localStorage.getItem('jwt_token'),
                },
            });
            this.roles = data.data;
            console.log(data.data);
            this.isLoadingRoles = false;
        },

        async getUserRoles(id: string) {
            const dataUserRoles = await HTTP.get(`/rsousers/${id}/commander/`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'JWT ' + localStorage.getItem('jwt_token'),
                },
            });
            this.userRoles = dataUserRoles.data;
        },

        async getUserParticipantsStatus(competition_pk: string) {
            const dataUserStatus = await HTTP.get(
                `/competitions/${competition_pk}/participants/status/`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization:
                            'JWT ' + localStorage.getItem('jwt_token'),
                    },
                },
            );
            this.status = dataUserStatus.data;
            console.log(dataUserStatus.data);
        },

        async getMyPositions() {
            if (isAuth.value) {
                const dataMyPositions = await HTTP.get('/rsousers/me_positions/', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'JWT ' + localStorage.getItem('jwt_token'),
                    },
                });
                this.myPositions = dataMyPositions.data;
            }
        },

        async getPositions(id: string) {
            const dataPositions = await HTTP.get(`/rsousers/${id}/positions/`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'JWT ' + localStorage.getItem('jwt_token'),
                },
            });
            this.positions = dataPositions.data;
        },
    },
});
