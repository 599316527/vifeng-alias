<template>
<div class="programs">
  <h2 class="lowdash">节目列表</h2>
  <ul>
    <li v-for="(item, index) in programs">
      <router-link :to="{
        name: 'program-programId',
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
import axios from 'axios'
import {getApiUrl} from '~plugins/helper'

export default {
  name: 'Programs',
  asyncData (context) {
    return axios.get(getApiUrl('/api/programs/', context))
      .then((res) => {
        return { programs: res.data.data }
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
