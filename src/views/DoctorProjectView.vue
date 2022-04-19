<template>
  <div class="container">
    <div class="row">
      <h1 class="pt-5">{{ title }}</h1>
      <h2 class="pb-5">{{ route.params.id }}</h2>
      <div class="col-12 col-lg-9">
        <img :src="image" :alt="title" class="w-100" />
      </div>
      <div class="col-12 col-lg-3">
        <ul>
          <li
            v-for="data in studentData"
            :key="data.index"
            class="row student-box py-2"
          >
            <div class="col-12 col-lg-5">
              <img
                :src="data.photo"
                alt=""
                class="bd-placeholder-img rounded-circle"
                width="80"
                height="80"
              />
            </div>
            <div class="col-12 col-lg-7">
              <h5>{{ data.name }}</h5>
            </div>
          </li>
        </ul>
      </div>

      <div class="col-12 text-center">
        <!-- Button trigger modal -->
        <button
          type="button"
          class="btn btn-primary mt-5"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Add Task
        </button>

        <!-- Modal -->
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <form class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Add Task</h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                  <textarea name="" id="" cols="30" rows="10">

                  </textarea>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" class="btn btn-primary">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-12">
        <p class="text-box text-start p-5 m-5">{{ des }}</p>
      </div>
      <div class="col-12 col-lg-6">
          <h3>Requested Tasks</h3>
      </div>
      <div class="col-12 col-lg-6">
          <h3>Response Tasks</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import app from "@/firebase";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useAuthStore } from "@/stores/auth";
import { ref, reactive } from "@vue/reactivity";
import { useRoute, useRouter } from "vue-router";
import { computed } from "@vue/runtime-core";

const db = getFirestore();
const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const studentData = reactive([]);

const title = ref("");
const des = ref("");
const image = ref("");

getProjectsData();
getStudentsData();

async function getProjectsData() {
  const q = query(
    collection(db, "projects"),
    where("id", "==", route.params.id)
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    title.value = doc.data()["title"];
    des.value = doc.data()["des"];
    image.value = doc.data()["image"];
  });
}

async function getStudentsData() {
  studentData.length = 0;

  const q = query(
    collection(db, "students"),
    where("projectId", "==", route.params.id)
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    studentData.push(doc.data());
  });
}
</script>

<style scoped>
.row {
  text-align: center;
}
.student-box {
  display: flex;
  align-items: center;
}
.text-box {
  background: rgba(238, 238, 238, 0.651);
}
</style>
