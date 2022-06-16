<template>
  <div class="container pb-5">
    <div class="row">
      <h1 class="pt-5">{{ title }}</h1>
      <h2 class="">{{ auth.projectId }}</h2>
      <div class="col-12 pb-5">
        <h5 class="badge bg-success mx-3">{{ department }}</h5>
        <h5 class="badge bg-success mx-3">{{ division }}</h5>
      </div>
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
          class="btn btn-primary my-5"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Add Response Tasks
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
                <!-- Start image-->
                <div class="mb-3">
                  <label for="formFile" class="form-label">Task Attach</label>
                  <div class="flex">
                    <h6 class="mb-3 text-white">
                      upload states :
                      <span v-if="imgUpload == 100">100%</span>
                    </h6>
                  </div>
                  <input
                    class="form-control"
                    type="file"
                    id="formFile"
                    @change="DetectFiles($event.target.files)"
                  />
                </div>
                <!-- End image-->
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
                  Add Response Tasks
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div>
          <img
            class="bd-placeholder-img rounded-circle"
            width="140"
            height="140"
            role="img"
            :src="doctorPhoto"
          />
          <h2>{{ doctorName }}</h2>
          <h6>{{ doctorEmail }}</h6>
          <h6>{{ doctorDepartement }}</h6>
        </div>
        <p class="text-box text-start p-5 my-5 w-100">{{ des }}</p>
      </div>
      <div class="col-12 col-lg-3">
        <h3>Requested Tasks</h3>
        <ul>
          <li
            v-for="data in taskData"
            :key="data.index"
            class="py-2 my-2 bg-secondary text-white"
          >
            <h6>{{ data.task }}</h6>
            <h6 class="d-inline mx-3">
              {{ data.createdAt.toDate().toDateString() }}
            </h6>
          </li>
        </ul>
      </div>
      <div class="col-12 col-lg-9">
        <h3>Response Tasks</h3>
        <ul>
          <li
            v-for="data in rTaskData"
            :key="data.index"
            class="py-2 my-3 bg-secondary text-white"
          >
            <h6 class="d-inline mx-3">{{ data.task }}</h6>
            <h6 class="d-inline mx-3">
              {{ data.createdAt.toDate().toDateString() }}
            </h6>
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
import {
  getStorage,
  ref as refire,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const db = getFirestore();
const storage = getStorage();
const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const imgURL = ref<string>("");
const imgData = reactive([]);
const imgUpload = ref(0);
const studentData = reactive([]);
const taskData = reactive([]);

const title = ref("");
const des = ref("");
const image = ref("");
const department = ref();
const division = ref();

const task = ref();
const rTaskData = reactive([]);

const projectDoctor = ref();
const doctorName = ref();
const doctorEmail = ref();
const doctorPhoto = ref();
const doctorDepartement = ref();

getProjectsData();
getStudentsData();

async function getProjectsData() {
  const q = query(
    collection(db, "projects"),
    where("id", "==", auth.projectId)
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    title.value = doc.data()["title"];
    des.value = doc.data()["des"];
    image.value = doc.data()["image"];
    department.value = doc.data()["department"];
    division.value = doc.data()["division"];
    projectDoctor.value = doc.data()["doctor"];
  });
  getDoctorData();
}

async function getDoctorData() {
  const q = query(
    collection(db, "doctors"),
    where("email", "==", projectDoctor.value)
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    doctorName.value = doc.data()["name"];
    doctorEmail.value = doc.data()["email"];
    doctorPhoto.value = doc.data()["photo"];
    doctorDepartement.value = doc.data()["departement"];
  });
}

async function getStudentsData() {
  studentData.length = 0;

  const q = query(
    collection(db, "students"),
    where("projectId", "==", auth.projectId)
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    studentData.push(doc.data());
  });
}

function addTask() {
  const storageRef = refire(storage, `${imgData.value.name}`);
  const uploadTask = uploadBytesResumable(storageRef, imgData.value);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      imgUpload.value = Math.floor(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
    },
    (error) => {
      alert(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((URL) => {
        addDoc(collection(db, "responseTasks"), {
          task: task.value,
          attach: URL,
          projectId: auth.projectId,
          student: auth.email,
          createdAt: serverTimestamp(),
        }).then(() => {
          createToast("Save Task success", {
            type: "success",
          });
          task.value = "";
          getRTaskData();
        });
      });
    }
  );
}

getTaskData();

async function getTaskData() {
  taskData.length = 0;
  const q = query(
    collection(db, "requestedTasks"),
    orderBy("createdAt"),
    where("projectId", "==", auth.projectId)
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    taskData.push(doc.data());
  });
}

getRTaskData();

async function getRTaskData() {
  rTaskData.length = 0;
  const q = query(
    collection(db, "responseTasks"),
    orderBy("createdAt"),
    where("projectId", "==", auth.projectId)
  );

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async (doc) => {
    rTaskData.push({
      studentName: await getStudentName(doc.data().student),
      studentPhoto: await getStudentPhoto(doc.data().student),
      id: doc.id,
      ...doc.data(),
    });
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

function DetectFiles(input) {
  imgData.value = input[0];
  if (input) {
    var reader = new FileReader();
    reader.onload = (e) => {};
    reader.readAsDataURL(input[0]);
  }
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
