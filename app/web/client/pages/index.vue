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
import {getApiUrl, apiResponseAdapter} from '~plugins/helper'

export default {
  name: 'Programs',
  asyncData (context) {
    return axios.get(getApiUrl('/api/programs/', context))
      .then((res) => {
        let data = apiResponseAdapter(res)
        if (data instanceof Error) {
          throw data
        }
        return { programs: data }
      })
      .catch((err) => {
        context.error({
          statusCode: 404,
          message: err.message
        })
      })
  }
}
</script>

<style>
.programs {
  margin-top: 2em;
}

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
  width: 200px;
  border: 1px solid #333;
}
.programs .name {
  margin-top: .5em;
}
</style>
