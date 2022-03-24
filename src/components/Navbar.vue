<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand"
        ><img src="@/assets/logo.png" alt="" srcset="" width="150"
      /></router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 justify-content-end w-100">
          <li class="nav-item">
            <router-link
              to="/"
              class="nav-link active"
              aria-current="page"
              >Home</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              to="/"
              class="nav-link active"
              aria-current="page"
              >Login</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
</script>

<style>
</style>