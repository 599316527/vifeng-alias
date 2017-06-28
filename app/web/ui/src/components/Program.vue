<template>
<div class="program">
  <div class="intro">
    <div class="head-pic"><img :src="info.headPic"></div>
    <div class="desc">
      <h2>{{ info.name }}</h2>
      <p>{{ info.desc }}</p>
    </div>
  </div>

  <div class="episodes">
    <h3>剧集列表</h3>
    <ul>
      <li class="episode" v-for="(item, index) in items">
        <div class="album">
          <div class="pic" :style="{'background-image': `url(${item.album})`}">
            <span class="duration">{{ cItems[index].duration }}</span>
          </div>
        </div>
        <div class="desc">
          <div class="title">
            <span class="program-no">{{ cItems[index].programNo }}</span>
            <span class="program-title">{{ item.title }}</span>
          </div>
          <div class="subtitle">
            <span class="program-author">{{ item.author }}</span>
            <span class="dot">·</span>
            <span class="program-date">{{ item.createDate }}</span>
            <span class="dot">·</span>
            <span class="program-desc">{{ item.desc }}</span>
          </div>
          <div class="files">
            <router-link v-for="(file, i) in item.videos" :class="file.useType"
              :to="file.mediaUrl">
                <span>{{ ({
                  'mp41M': '📽 视频',
                  'mp3': '📣 音频'
                }[file.useType]) }}</span>
                <small>{{ cItems[index].videos[i].filesize }}</small>
            </router-link>
          </div>
        </div>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import {getJson} from '../helper'

export default {
  name: 'Program',
  data () {
    return {
      info: {},
      items: []
    }
  },
  computed: {
    cItems() {
      return this.items.map(function (item) {
        return {
          duration: formatDuration(item.duration),
          programNo: formatProgramNo(item.programNo),
          videos: item.videos.map(function (file) {
            return {
              filesize: formatFileSize(file.filesize)
            }
          })
        }
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    let programId = to.params.programId
    Promise.all([
      getJson(`/api/program/${programId}/`),
      getJson(`/api/program/items/${programId}/1/`)
    ]).then(function ([info, items]) {
      next(vm => {
        vm.info = info
        vm.items = items
      })
    })
  }
}

function formatDuration(duration) {
  // TODO: support hours
  let m = ~~(duration / 60)
  let s = duration % 60
  return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
}

function formatFileSize(filesize) {
  // TODO: support more units
  return `${(filesize / 1024).toFixed(2)}M`
}

function formatProgramNo(source) {
  return `${source.substring(0, 4)}年${source.substring(4, 6)}月${source.substring(6, 8)}日`
}
</script>

<style>
.program {

}

.program .intro {
  display: flex;
  align-items: center;
}
.program .intro .head-pic img {
  display: block;
  width: 120px;
}
.program .intro .desc {
  margin-left: 2em;
}
.program .intro .desc h2 {
  font-size: 22px;
}
.episodes ul {
  padding: 0;
  list-style: none;
}
.episodes h3 {
  font-weight: normal;
  text-align: center;
}

.episode {
  display: flex;
  margin: 2em 0;
}
.episode .album {
  width: 224px;
  flex: 0 0 224px;
}
.episode .album .pic {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  /*background: url(../assets/image-placeholder.jpg);*/
  background-position: center;
  background-size: cover;
}
.episode .album .duration {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0,0,0,.7);
  color: white;
  font-size: 14px;
  padding: 2px 4px;
}
.episode .desc {
  margin-left: 2em;
  text-align: justify;
}
.episode .program-no {
  font-size: 12px;
  background: #ED802F;
  color: white;
  padding: 2px 5px;
}
.episode .subtitle {
  font-size: 12px;
  margin: 8px 0;
  color: #666;
}
.episode .subtitle .dot {
  color: #333;
  font-weight: bolder;
  margin: 0 3px;
}
.episode .files {
  margin-top: 1em;
}
.episode .files a {
  color: #333;
  text-decoration: none;
  margin-right: 2em;

  border: 1px solid #ccc;
  border-radius: 2px;
  padding: 1px 6px;
}
.episode .files small {
  font-size: 12px;
  color: #999;
}


@media (max-width: 600px) {
  .episode {
    display: block;
    margin-bottom: 3em;
  }
  .episode .album {
    margin: .5em auto;
    width: 100%;
  }
  .episode .title {
    text-align: center;
  }
  .episode .desc {
    margin-left: 0;
  }
  .episode .program-title {
    display: block;
    margin-top: 3px;
  }
  .episode .files {
    text-align: center;
  }
}
</style>
