// composables/useCountries.js
import { ref } from 'vue';
import axios from 'axios';

const loading = ref(true);
const countries = ref([]);

const fetchCountries = async () => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    countries.value = response.data;
    loading.value = false;
  } catch (error) {
    console.error('Error fetching countries:', error);
    loading.value = false;
  }
};

export default function useCountries() {
  return {
    countries,
    fetchCountries,
  };
}
