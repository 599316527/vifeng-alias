
<template>
<div class="media">
  <h2 class="program-name lowdash">{{ program.name }}</h2>

  <div class="title">
    <div class="program-no">{{ programNo }}</div>
    <div class="program-title">{{ title }}</div>
  </div>
  <div class="player">
    <player v-if="video" :src="video.mediaUrl" :poster="album" :media-type="mediaType" />
    <div class="empty" v-else>no video</div>
  </div>
  <div class="desc">
    <span class="program-desc">{{ desc }}</span>
    <span class="program-author">{{ author }}</span>
    <span class="dot">·</span>
    <span class="program-date">{{ createDate }}</span>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import { getApiUrl, apiResponseAdapter, formatProgramNo } from '~plugins/helper'
import Player from '../../../../../components/Player'

export default {
  name: 'Media',
  components: {
    player: Player
  },
  validate ({ params }) {
    return /^\d+$/.test(params.itemId)
  },
  asyncData (context) {
    let {programId, mediaType, itemId} = context.params
    return axios.get(getApiUrl(`/api/program/item/${programId}/${itemId}/`, context))
      .then(function (result) {
        let data = apiResponseAdapter(result)
        if (data instanceof Error) {
          throw data
        }
        return Object.assign(asyncDataAdapater(data), {mediaType})
      }).catch((err) => {
        context.error({
          statusCode: 404,
          message: err.message
        })
      })
  },
  computed: {
    video() {
      return this.videos.filter((video) => {
        return video.useType === this.mediaType
      })[0]
    }
  },
  methods: {

  }
}

function asyncDataAdapater(data) {
  data.programNo = formatProgramNo(data.programNo)
  return data
}
</script>

<style>
.media {
  margin: 1em 0 2em;
}

.media .title {
  margin-top: 1.9em;
  color: #333;
  text-align: center;
}
.media .title .program-no {
  margin: 1.2em;
  display: inline-block;
  font-size: 13px;
  background: #ED802F;
  color: white;
  padding: 2px 5px;
}

.media .player {
  margin-top: 1em;
}
.media .player .empty {
  text-align: center;
  font-size: 1.2em;
  padding: 10% 0;
  border: 1px solid #333;
}

.media .desc {
  margin-top: 2em;
  text-align: justify;
  font-size: 14px;
}
.media .desc .dot {
  font-weight: bolder;
  margin: 0 3px;
}
.media .desc .program-author {
  margin-left: 8px;
  color: #999;
  font-size: .8em;
}
.media .desc .program-date {
  color: #999;
  font-size: .8em;
}
</style>
