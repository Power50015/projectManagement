<template>
  <div class="container mt-4">
    <div class="row text-center">
      <div class="col col-lg-3" v-for="data in projectsData" :key="data.id">
        <router-link :to="{ name: 'doctor-project', params: { id: data.id } }">
          <div>
            <img
              class="bd-placeholder-img"
              width="240"
              height="240"
              role="img"
              :src="data.image"
            />
            <h6>ID: {{ data.id }}</h6>
            <h2>{{ data.title }}</h2>
            <h6>Departement: {{ data.department }}</h6>
            <h6>year: {{ data.year }}</h6>
          </div>
        </router-link>
      </div>

      <!-- /.col-lg-4 -->
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
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";

const db = getFirestore();
const storage = getStorage();
const router = useRouter();
const auth = useAuthStore();

const projectsData = reactive([]);

const currentTime = new Date();
const year = currentTime.getFullYear();

getProjectsData();

async function getProjectsData() {
  projectsData.length = 0;

  const q = query(
    collection(db, "projects"),
    where("doctor", "==", auth.email),
    where("year", "==", year)
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    projectsData.push(doc.data());
  });
}
</script>
<style scoped>
a {
  text-decoration: none;
  color: #e34453;
}
a:hover {
  color: #c02b3a;
}
.row {
  justify-content: center;
  align-content: center;
}
.col div {
  background: rgba(238, 238, 238, 0.397);
  border-radius: 22px;
  padding-bottom: 3px;
  margin-bottom: 15px;
}
.col div img {
  width: 100%;
}
</style>
