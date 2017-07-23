<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  font-size: 1.5em;
}
.container {
    padding: 32px;
    .table {
        th {
            text-align: center!important;
        }
    }
}
.tool-bar {
  padding-bottom: 16px;

}
.tool-bar ul li {
  float: left;
}
.clearFix {
    clear: both;
}
</style>
