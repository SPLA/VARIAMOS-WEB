<template>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {{ $t("verification") }}
    </a>
    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
      <a class="dropdown-item">{{ $t("verification_root") }}</a>
      <a class="dropdown-item">{{ $t("verification_dead") }}</a>
      <a class="dropdown-item">{{ $t("verification_false") }}</a>
    </div>
  </li>
</template>

<script>
export default {
  name: 'Verification'
}
</script>


<style scoped>
</style>
