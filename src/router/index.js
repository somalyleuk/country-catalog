import { createRouter, createWebHistory } from 'vue-router';
import CountriesList from '../View/CountriesList.vue';


const routes = [
    {
      path: '/',
      name: 'Countries',
      component: CountriesList,
    },
    // Add your other routes here
  ];
  
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
  export default router;
  