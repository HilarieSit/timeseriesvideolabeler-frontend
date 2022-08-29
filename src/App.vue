<template>
 <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light"><b><span id="nav2Home"><a href="https://www.dreamworthie.com/">Dreamworthie</a></span><span id="navCurrent"> / Video Labeling </span></b></nav>
    <router-view />
 </div>
</template>

<script>
export default {
name: 'App',
}
</script>

<style>
#app{
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
}
nav{
    position: absolute;
    left: 0;
    top: 0;
}
#nav2Home{
  cursor: pointer;
  color: #2c3e50;
  font-size: 16px;
}
#navCurrent{
  color: #888;
  font-size: 16px;
}
nav{
  padding-left: 15px;
}

a:link {
    text-decoration: none;
    color: #2c3e50 !important;
}

a:visited {
    text-decoration: none;
    color: #2c3e50 !important;
}
</style>