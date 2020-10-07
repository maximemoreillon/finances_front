
<template>
  <div class="home">
    <h1>About</h1>
    <p>A finance management system</p>
    <p>Developed and maintained by Maxime MOREILLON</p>
    <p>Version {{version}}</p>


  </div>
</template>

<script>
// @ is an alias to /src
import pjson from '../../package.json'

export default {
  name: 'ViewTransaction',

  data(){
    return {
      version: pjson.version
    }
  },

}
</script>

<style scoped>



</style>
