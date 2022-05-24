<template>
  <div class="container">
    <div class="row bg-light mb-5 py-3">
      <div class="col-2">
        Year :
        <select v-model="yearData" @change="getProjectsData()">
          <option value="all" selected></option>
          <option v-for="year in years" :value="year">{{ year }}</option>
        </select>
      </div>
      <div class="col-6">
        Departement :
        <select v-model="depData" @change="getProjectsData()">
          <option value="all" selected></option>
          <option value="cs">Computer Science</option>
          <option value="mis">Management information system</option>
        </select>
      </div>
      <div class="col-4">
        Division :
        <select v-model="divisionData" @change="getProjectsData()">
          <option value="all" selected></option>
          <option value="Computer Engineering - Computer Network">
            Computer Engineering - Computer Network
          </option>
          <option value="Computer Engineering - Cybersecurity">
            Computer Engineering - Cybersecurity
          </option>
          <option value="AI - Pattern Recognition">
            AI - Pattern Recognition
          </option>
          <option value="AI - Robotics">AI - Robotics</option>
          <option value="Marketing - Digital Marketing">
            Marketing - Digital Marketing
          </option>
          <option value="Marketing - Conversational Marketing">
            Marketing - Conversational Marketing
          </option>
        </select>
      </div>
    </div>
    <div class="row">
      <div
        class="col-12 col-lg-3"
        v-for="project in projectsData"
        :key="project.index"
      >
        <div class="card" style="width: 18rem">
          <img :src="project.image" class="card-img-top" :alt="project.title" />
          <div class="card-body">
            <h5 class="card-title">{{ project.title }}</h5>
            <p class="card-text">
              {{ project.des }}
            </p>
            <a :href="project.link" class="btn btn-primary" target="_blank"
              >Link</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import app from "@/firebase";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useAuthStore } from "@/stores/auth";
import { reactive, ref } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import {
  getStorage,
  ref as refire,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const db = getFirestore();
const storage = getStorage();
const router = useRouter();
const auth = useAuthStore();

const years = computed(() => {
  const year = new Date().getFullYear() + 1;
  return Array.from({ length: year - 1990 }, (value, index) => 1990 + index);
});

const yearData = ref("all");
const divisionData = ref("all");
const depData = ref("all");
const projectsData = reactive([]);

getProjectsData();

async function getProjectsData() {
  projectsData.length = 0;

  //if(yearData.value != "all" && divisionData.value != "all")

  const q = query(collection(db, "projects"), orderBy("year", "desc"));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    if (
      yearData.value == "all" &&
      divisionData.value == "all" &&
      depData.value == "all"
    ) {
      projectsData.push(doc.data());
    }
    if (
      yearData.value != "all" &&
      divisionData.value == "all" &&
      depData.value == "all"
    ) {
      if (doc.data().year == yearData.value) {
        projectsData.push(doc.data());
      }
    }
    if (
      yearData.value != "all" &&
      divisionData.value != "all" &&
      depData.value == "all"
    ) {
      if (
        doc.data().year == yearData.value &&
        doc.data().division == divisionData.value
      ) {
        projectsData.push(doc.data());
      }
    }
    if (
      yearData.value != "all" &&
      divisionData.value == "all" &&
      depData.value != "all"
    ) {
      if (
        doc.data().year == yearData.value &&
        doc.data().department == depData.value
      ) {
        projectsData.push(doc.data());
      }
    }
    if (
      yearData.value != "all" &&
      divisionData.value != "all" &&
      depData.value != "all"
    ) {
      if (
        doc.data().year == yearData.value &&
        doc.data().division == divisionData.value &&
        doc.data().department == depData.value
      ) {
        projectsData.push(doc.data());
      }
    }

    if (
      yearData.value == "all" &&
      divisionData.value != "all" &&
      depData.value == "all"
    ) {
      if (
        doc.data().division == divisionData.value
      ) {
        projectsData.push(doc.data());
      }
    }
    if (
      yearData.value == "all" &&
      divisionData.value != "all" &&
      depData.value != "all"
    ) {
      if (
        doc.data().division == divisionData.value &&
        doc.data().department == depData.value
      ) {
        projectsData.push(doc.data());
      }
    }
if (
      yearData.value == "all" &&
      divisionData.value == "all" &&
      depData.value != "all"
    ) {
      if (
        doc.data().department == depData.value
      ) {
        projectsData.push(doc.data());
      }
    }
  });
}
</script>

<style></style>
