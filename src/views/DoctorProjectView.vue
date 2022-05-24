<template>
  <div class="container pb-5">
    <div class="row">
      <h1 class="pt-5">{{ title }}</h1>
      <h2 class="pb-5">{{ route.params.id }}</h2>
      <div class="col-12 col-xl-9 mb-3">
        <img :src="image" :alt="title" class="w-100" />
      </div>
      <div class="col-12 col-xl-3">
        <ul class="students">
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
      <!-- Modal -->
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
                <textarea class="w-100" cols="30" rows="10" v-model="task">
                </textarea>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-primary w-100"
                  data-bs-dismiss="modal"
                  @click="addTask"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-12">
        <p class="text-box text-start p-5 m-5">{{ des }}</p>
      </div>
      <div class="col-12 col-lg-3">
        <h3>Requested Tasks</h3>
        <ul>
          <li v-for="data in taskData" :key="data.index" class="py-2">
            <h6>{{ data.task }}</h6>
          </li>
        </ul>
      </div>
      <div class="col-12 col-lg-9">
        <h3>Response Tasks</h3>
        <ul>
          <li v-for="data in rTaskData" :key="data.index" class="py-2">
            <h6 class="d-inline mx-3">{{ data.task }}</h6>
            <a :href="data.attach" class="btn btn-primary" download
              >Download Attach</a
            >
            <!-- Button trigger modal -->
            <button
              type="button"
              class="btn btn-primary mx-5"
              data-bs-toggle="modal"
              :data-bs-target="`#studentModal${data.id}`"
            >
              Student
            </button>
            <!-- Modal -->
            <div
              class="modal fade"
              :id="`studentModal${data.id}`"
              tabindex="-1"
              aria-labelledby="studentModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="studentModalLabel">
                      {{ data.studentName }}
                    </h5>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <img
                      class="bd-placeholder-img rounded-circle"
                      width="140"
                      height="140"
                      role="img"
                      :src="data.studentPhoto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import app from "@/firebase";
import { addDoc, getFirestore, serverTimestamp } from "firebase/firestore";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useAuthStore } from "@/stores/auth";
import { ref, reactive } from "@vue/reactivity";
import { useRoute, useRouter } from "vue-router";
import { computed } from "@vue/runtime-core";
import { createToast } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";

const db = getFirestore();
const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const studentData = reactive([]);
const taskData = reactive([]);

const title = ref("");
const des = ref("");
const image = ref("");

const task = ref();

const rTaskData = reactive([]);

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

function addTask() {
  addDoc(collection(db, "requestedTasks"), {
    task: task.value,
    projectId: route.params.id,
    createdAt: serverTimestamp(),
  }).then(() => {
    createToast("Save Task success", {
      type: "success",
    });
    task.value = "";
    getTaskData();
  });
}

getTaskData();

async function getTaskData() {
  taskData.length = 0;
  const q = query(collection(db, "requestedTasks"), orderBy("createdAt"));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    if (doc.data()["projectId"] == route.params.id) {
      taskData.push(doc.data());
    }
  });
}
getRTaskData();

async function getRTaskData() {
  rTaskData.length = 0;
  const q = query(collection(db, "responseTasks"), orderBy("createdAt"));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async (doc) => {
    if (doc.data()["projectId"] == route.params.id) {
      rTaskData.push({
        studentName: await getStudentName(doc.data().student),
        studentPhoto: await getStudentPhoto(doc.data().student),
        id: doc.id,
        ...doc.data(),
      });
    }
  });
}

async function getStudentName(studentEmail: any) {
  let student;
  const q = query(
    collection(db, "students"),
    where("email", "==", studentEmail)
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    student = doc.data().name;
  });

  return student;
}

async function getStudentPhoto(studentEmail: any) {
  let student;
  const q = query(
    collection(db, "students"),
    where("email", "==", studentEmail)
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    student = doc.data().photo;
  });

  return student;
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
.students {
  max-height: 542px;
  overflow-x: hidden;
  overflow-y: scroll;
}
li {
  list-style-type: none;
}
</style>
