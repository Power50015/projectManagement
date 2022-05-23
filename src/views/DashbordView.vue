<template>
  <AdminDashbord v-if="auth.type == 'admins'"/>
  <DoctorDashbord v-if="auth.type == 'doctors'"/>
  <StudentDashbord v-if="auth.type == 'students'"/>
</template>

<script lang="ts" setup>
import AdminDashbord from "@/components/AdminDashbord.vue";
import DoctorDashbord from "@/components/DoctorDashbord.vue";
import StudentDashbord from "@/components/StudentDashbord.vue";

import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

</script>

<style>

</style>