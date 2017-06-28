<template>
<div class="programs">
  <h2>节目列表</h2>
  <ul>
    <li v-for="(item, index) in programs">
      <router-link :to="{
        name: 'program',
        params: {
          programId: item.programId
        }
      }">
        <img class="pic" :src="item.headPic">
        <div class="name">{{ item.name }}</div>
      </router-link>
    </li>
  </ul>
</div>
</template>

<script>
import {getJson} from '../helper'

export default {
  name: 'Programs',
  data () {
    return {
      programs: []
    }
  },
  beforeRouteEnter (to, from, next) {
    getJson('/api/programs/').then(function (data) {
      next(vm => {
        vm.programs = data
      })
    })
  }
}
</script>

<style>
.programs h2 {
  text-align: center;
}
.programs ul {
  padding: 0;
  display: flex;
  list-style: none;
  justify-content: space-around;
  flex-wrap: wrap;
}
.programs li {
  text-align: center;
  margin: 1em;
}
.programs a {
  text-decoration: none;
  color: #333;
}
.programs .pic {
  display: block;
}
.programs .name {
  margin-top: .5em;
}
</style>
