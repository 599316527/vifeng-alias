<template>
<div class="program">
  <div class="intro">
    <div class="head-pic"><img :src="info.headPic"></div>
    <div class="desc">
      <h2>{{ info.name }}</h2>
      <div>{{ info.desc }}</div>
    </div>
  </div>

  <div class="episodes">
    <h3 class="lowdash">剧集列表</h3>
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
            <span class="program-desc">{{ item.desc }}</span>
            <span class="program-author">{{ item.author }}</span>
            <span class="dot">·</span>
            <span class="program-date">{{ item.createDate }}</span>
          </div>
          <div class="files">
            <a v-for="(file, i) in item.videos" :class="file.useType" :href="file.mediaUrl" target="blank">
                <span>{{ ({
                  'mp41M': '视频',
                  'mp3': '音频'
                }[file.useType]) }}</span>
                <small>{{ cItems[index].videos[i].filesize }}</small>
            </a>
          </div>
        </div>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import {getApiUrl} from '~plugins/helper'

export default {
  name: 'Program',
  asyncData (context) {
    let programId = context.params.programId
    return Promise.all([
      axios.get(getApiUrl(`/api/program/${programId}/`, context)),
      axios.get(getApiUrl(`/api/program/items/${programId}/1/`, context))
    ]).then(function ([info, items]) {
      return {
        info: info.data.data,
        items: items.data.data
      }
    })
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
  validate ({ params }) {
    return !!params.programId
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
  width: 96px;
}
.program .intro .desc {
  margin-left: 1.6em;
}
.program .intro .desc h2 {
  font-size: 20px;
  margin: 0 0 .3em;
}
.program .intro .desc div {
  font-size: 14px;
  color: #666;
}
.episodes {
  margin-top: 2em;
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
  padding-bottom: 2em;
  border-bottom: 1px dotted #eee;
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
  margin-left: 1.6em;
  text-align: justify;
}
.episode .program-no {
  display: inline-block;
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
  font-weight: bolder;
  margin: 0 3px;
}
.episode .subtitle .program-author {
  margin-left: 8px;
  color: #999;
  font-size: .8em;
}
.episode .subtitle .program-date {
  color: #999;
  font-size: .8em;
}
.episode .files {
  margin-top: 1em;
}
.episode .files a {
  color: #333;
  text-decoration: none;
  margin-right: 2em;

  border: 1px solid #666;
  padding: 2px 6px 2px 1.8em;
  background: no-repeat 6px center /auto 80%;
}
.episode .files .mp41M {
  padding-left: 2em;
  background-position: 8px center;
  background-image: url(../../assets/tv.png);
}
.episode .files .mp3 {
  background-image: url(../../assets/airpods.png);
}
.episode .files small {
  font-size: 12px;
  color: #999;
}


@media (max-width: 560px) {
  .episode {
    display: block;
  }
  .episode .album {
    margin-bottom: .5em;
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
