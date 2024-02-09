<template>
  <div class="countries-catalog p-5">
    <!-- search -->

    <div class="relative w-full">
      <div
        class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
      >
        <svg
          class="w-6 h-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2"
            d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        type="text"
        v-model="searchTerm"
        @input="searchCountries"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        placeholder="Search by Country Name"
        required
      />
    </div>

    <div class="grid grid-cols-2 gap-1">
      <!-- Search by Country Name -->
      <div class="max-w-sm pt-5 pb-5">
        <label
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Select an option</label
        >
        <select
          v-model="sortOrder"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        >
          <option value="asc">Sort Ascending</option>
          <option value="desc">Sort Descending</option>
        </select>
      </div>
      <!-- Pagination (25 rows) -->
      <div class="flex flex-col items-end justify-center">
        <span class="text-sm text-gray-700 dark:text-gray-400">
          Showing
          <span>{{ currentPage }} of </span>
          <span class="font-semibold text-gray-900 dark:text-white">{{
            totalPages
          }}</span>
          Pages
        </span>
        <div class="inline-flex mt-2 xs:mt-0">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white rounded-s dark:border-gray-700 dark:text-gray-400 dark:hover:text-whitedark:hover:text-white focus:ring-blue-300 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Prev
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="flex items-center justify-center px-3 h-8 text-sm font-medium text-white border-0 border-s rounded-e hodark:border-gray-700 dark:text-gray-400 dark:hover:text-white focus:ring-blue-300 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else></div>

    <!-- country catalog -->
    <div class="pt-5 max-h-dvh overflow-y-auto">
      <div class="grid grid-cols-2 md:grid-cols-8 gap-6">
        <div
          v-for="country in paginatedCountries"
          :key="country.cca2"
          class="country-card"
        >
          <img
            class="max-h-36 max-w-full rounded-lg"
            :src="country.flags.png"
            alt="Flag"
          />
          <div class="p-5">
            <div @click="showCountryDetails(country)" class="country-name">
              <p class="text-xs">{{ country.name.official }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div v-if="selectedCountry" class="modal text-left">
    <div class="modal-content">
      <div class="flex justify-center items-center p-5">
        <img
          class="max-h-36 max-w-full rounded-lg"
          :src="selectedCountry.flags.png"
          alt="Flag"
        />
      </div>
      <div class="p-5">
        <h2>Country Name : {{ selectedCountry.name.official }}</h2>
        <p>2 character Country Code : {{ selectedCountry.cca2 }}</p>
        <p>3 character Country Code : {{ selectedCountry.cca3 }}</p>
        <p>
          Native Country Name :
          {{ selectedCountry.name.nativeName }}
        </p>
        <p>Alternative Country Name : {{ selectedCountry.altSpellings }}</p>
        <p>Country Calling Codes : {{ selectedCountry.idd }}</p>
      </div>
      <div
        class="flex justify-end items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"
      >
        <button
          type="button"
          @click="closeModal"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import useCountries from "@/store/Countries";
import { ref, computed, watchEffect } from "vue";

const { countries, fetchCountries } = useCountries();
const searchTerm = ref("");
const sortOrder = ref("asc");
const currentPage = ref(1);
const itemsPerPage = 25;
const selectedCountry = ref(null);

const showCountryDetails = (country) => {
  selectedCountry.value = country;
};
const closeModal = () => {
  selectedCountry.value = null;
};

//searching for countries based on the input
const filteredCountries = computed(() => {
  return countries.value.filter((country) =>
    country.name.official.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Sort the countries based on the selected sort order
const sortCountries = (countries) => {
  if (sortOrder.value === "asc") {
    countries.sort((a, b) => a.name.official.localeCompare(b.name.official));
  } else if (sortOrder.value === "desc") {
    countries.sort((a, b) => b.name.official.localeCompare(a.name.official));
  }
};
// Watch for changes in the sortOrder and re-sort the countries accordingly
watchEffect(() => {
  sortCountries(countries.value);
});

// To calculate the total number of pages
const totalPages = computed(() =>
  Math.ceil(filteredCountries.value.length / itemsPerPage)
);
// Function for the current page
const paginatedCountries = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  return filteredCountries.value.slice(startIndex, startIndex + itemsPerPage);
});
// Function to nav to the next page
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
// Function to nav to the previous page
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

fetchCountries();
</script>

<style>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.country-card {
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.country-name {
  font-weight: bold;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  border-radius: 10px;
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.loading {
  text-align: center;
}
</style>
