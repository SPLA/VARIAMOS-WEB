<template>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {{ $t("domain_implementation") }}
    </a>
    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
      <a class="dropdown-item">{{ $t("domain_implementation_set_params") }}</a>
      <a class="dropdown-item">{{ $t("domain_implementation_execute") }}</a>
      <a class="dropdown-item">{{ $t("domain_implementation_verify") }}</a>
      <a class="dropdown-item">{{ $t("domain_implementation_customize") }}</a>
    </div>

  </li>
</template>

<script>
export default {
  name: 'DomainImplementation'
}
</script>


<style scoped>
</style>
