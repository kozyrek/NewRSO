import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
  },
});



router.beforeEach((to, _from, next) => {
  if (
    to.name !== 'Login' &&
    to.name !== 'Register' &&
    to.name !== 'RecoveryPassword' &&
    to.name !== 'CreaturePassword' &&
    to.name !== 'Competition' &&
    to.name !== 'faq' &&
    to.name !== 'actionSquads' &&
    to.name !== 'allsquads' &&
    to.name !== 'AllHeadquarters' &&
    to.name !== 'LocalHeadquarters' &&
    to.name !== 'regionalHeadquarters' &&
    to.name !== 'districtHeadquarters' &&
    to.name !== 'CentralHQ' &&
    to.name !== 'privacy_policy' &&
    to.name !== 'terms_of_use' &&
    to.name !== 'mypage' &&
    localStorage.getItem('jwt_token') === null
  )
    next({ name: 'Login' });
  else if (to.name == 'Login' && localStorage.getItem('jwt_token') !== null)
    next({ name: 'mypage' });
  else next();
});

export default router;
