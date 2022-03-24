<template>
  <Navbar />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
</script>

<style>
@import "@/assets/base.css";
</style>
