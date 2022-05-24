<template>
  <div class="container">
    <div class="row pb-5">
      <div class="col-lg-6 col-md-8 login-box">
        <div class="col-lg-12 login-title">Add Project</div>

        <div class="col-lg-12 login-form">
          <div class="col-lg-12 login-form">
            <form @submit.prevent="saveProject">
              <div class="form-group">
                <label class="form-control-label">Project Title</label>
                <input type="text" class="form-control" v-model="title" />
              </div>
              <div class="form-group">
                <label class="form-control-label">Project Number</label>
                <input
                  type="number"
                  min="1"
                  class="form-control"
                  v-model="number"
                />
              </div>
              <div class="form-group">
                <label class="form-control-label">Project Year</label>
                <input
                  type="number"
                  min="1999"
                  class="form-control"
                  v-model="year"
                />
              </div>
              <div class="form-group">
                <label class="form-control-label">Department</label>
                <select class="form-control" v-model="department">
                  <option value="mis">MIS</option>
                  <option value="cs">CS</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-control-label">Division</label>
                <select class="form-control" v-model="division">
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
              <div class="form-group">
                <label class="form-control-label">Doctor</label>
                <select class="form-control" v-model="projectDoctor">
                  <option
                    v-for="doctor in doctorsData"
                    :key="doctor.index"
                    :value="doctor.email"
                  >
                    {{ doctor.name }} - {{ doctor.departement }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-control-label">Project Details</label>
                <textarea
                  type="number"
                  min="1999"
                  class="form-control"
                  v-model="des"
                ></textarea>
              </div>
              <div class="form-group">
                <label class="form-control-label">Project Link</label>
                <input type="text" class="form-control" v-model="link" />
              </div>
              <!-- Start image-->
              <div class="mb-3">
                <label for="formFile" class="form-label">Profile image</label>
                <template v-if="imgPreview">
                  <img
                    :src="imgPreview"
                    class="img-fluid"
                    height="300"
                    width="300"
                  />
                  <p class="mb-0">file name: {{ imgData.value.name }}</p>
                  <p class="mb-0">
                    size: {{ Math.round(imgData.value.size / 1024) }}KB
                  </p>
                </template>
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
                  accept="image/jpeg"
                  @change="DetectFiles($event.target.files)"
                />
              </div>
              <!-- End image-->

              <div class="col-lg-12 loginbttm">
                <div class="col-lg-6 login-btm login-text">
                  <!-- Error Message -->
                </div>
                <div class="col-lg-12 login-btm login-button">
                  <button
                    type="submit"
                    class="btn btn-outline-primary"
                    :disabled="!btn"
                  >
                    Save Project
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="row text-center">
      <div class="col col-lg-4" v-for="data in projectsData" :key="data.id">
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
      </div>
      <!-- /.col-lg-4 -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import app from "@/firebase";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
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

const title = ref<string>("");
const number = ref();
const year = ref();
const department = ref<string>("cs");
const division = ref<string>("Computer Engineering - Computer Network");
const des = ref("");
const link = ref("");
const imgURL = ref<string>("");
const imgData = reactive([]);
const imgPreview = ref<any>("");
const btn = ref(true);
const imgUpload = ref(0);
const projectDoctor = ref("");
const projectsData = reactive([]);
const doctorsData = reactive([]);

getProjectsData();
getDoctorsDatas();

function DetectFiles(input) {
  imgData.value = input[0];
  if (input) {
    var reader = new FileReader();
    reader.onload = (e) => {
      imgPreview.value = e.target.result;
    };
    reader.readAsDataURL(input[0]);
  }
}

async function getProjectsData() {
  projectsData.length = 0;
  const querySnapshot = await getDocs(collection(db, "projects"));
  querySnapshot.forEach((doc) => {
    projectsData.push(doc.data());
  });
}

async function getDoctorsDatas() {
  doctorsData.length = 0;
  const querySnapshot = await getDocs(collection(db, "doctors"));
  querySnapshot.forEach((doc) => {
    doctorsData.push(doc.data());
  });
}

function saveProject() {
  btn.value = false;
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
        btn.value = true;
        imgURL.value = URL;
        auth.addProject(
          title.value,
          number.value,
          year.value,
          department.value,
          des.value,
          link.value,
          imgURL.value,
          projectDoctor.value,
          division.value
        );
        createToast("Save Project success", {
          type: "success",
        });
        setTimeout(() => {
          title.value = "";
          number.value = "";
          imgURL.value = "";
          des.value = "";
          link.value = "";
          year.value = "";
          projectDoctor.value = "";
          department.value = "cs";
          division.value ="Computer Engineering - Computer Network";
          imgPreview.value = "";
          imgUpload.value = 0;
          imgData.length = 0;
          getProjectsData();
        }, 1500);

        // router.push("/dashbord");
      });
    }
  );
}
</script>

<style scoped>
.row {
  justify-content: center;
  align-content: center;
}
.login-box {
  margin-top: 75px;
  height: auto;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  padding: 50px 15px 5px 15px;
}

.login-title {
  margin-top: 15px;
  text-align: center;
  font-size: 30px;
  letter-spacing: 2px;
  margin-top: 15px;
  font-weight: bold;
}

.login-form {
  margin-top: 25px;
  text-align: left;
}

input {
  border: none;
  border-bottom: 2px solid #e34554;
  border-top: 0px;
  border-radius: 0px;
  font-weight: bold;
  outline: 0;
  margin-bottom: 20px;
  padding-left: 0px;
  /* color: #ecf0f5; */
}

.form-group {
  margin-bottom: 40px;
  outline: 0px;
}

.form-control:focus {
  border-color: inherit;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-bottom: 2px solid #e02c3e;
  outline: 0;
  /* color: #ecf0f5; */
}

input:focus {
  outline: none;
  box-shadow: 0 0 0;
}

label {
  margin-bottom: 0px;
}

.form-control-label {
  font-size: 10px;
  color: #6c6c6c;
  font-weight: bold;
  letter-spacing: 1px;
}

.btn-outline-primary {
  border-color: #e34554;
  color: #e34554;
  border-radius: 0px;
  font-weight: bold;
  letter-spacing: 1px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  width: 100%;
  border-radius: 3px;
}

.btn-outline-primary:hover {
  background-color: #e02c3e;
  color: #fff;
  right: 0px;
}

.login-btm {
  float: left;
}

.login-button {
  padding-right: 0px;
  text-align: right;
  margin-bottom: 25px;
}

.login-text {
  text-align: left;
  padding-left: 0px;
  color: #a2a4a4;
}

.loginbttm {
  padding: 0px;
}
.col div {
  background: rgba(238, 238, 238, 0.397);
  border-radius: 22px;
  margin-bottom: 15px;
}
.col div img {
  width: 100%;
}
</style>
