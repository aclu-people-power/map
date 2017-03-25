<template>
  <div class="app-header">
    <img class="logo" src="~images/logo.png" />
    <h2 class="cta">Find events near you</h2>
    <div class="toolbar">
      <div>
        <input type="text" placeholder="Search by zip code" />
        <button type="button" class="btn -primary">
          <i class="icon-search"></i>
        </button>
      </div>
      <div>
        <button type="button" class="btn">Filter events</button>
        <button type="button" class="btn">List view</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app-header',
}
</script>

<style lang="scss">
@import '~styles/variables.scss';
.btn {
  background: #537882;
}

.btn:hover {
  cursor: pointer;
}

.btn.-primary {
  background: #EF4134;
}

.header {
  padding: 1em;
  text-align: center;
  background: $off-white;
}

.logo {
  max-width: 300px;
}

.cta {
  color: $blue;
  font-size: 2rem;
}
</style>
