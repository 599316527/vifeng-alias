<template>
<div class="program">
  <h2 class="program-name lowdash">{{ info.name }}</h2>

  <div class="intro">
    <div class="head-pic">
      <div class="pic" :style="{'background-image': `url(${info.headPic})`}"></div>
    </div>
    <div class="desc">{{ info.desc }}</div>
  </div>

  <div class="episodes" :class="{'is-searching': isSearching || keyword}">
    <h3 class="lowdash">剧集列表</h3>
    <div class="search">
      <input type="text" v-model="keyword"
        @keyup.enter="handleItemSearch"
        @focus="isSearching = true"
        @blur="isSearching = false" >
    </div>
    <ul v-if="items.length">
      <li class="episode" v-for="(item, index) in items" :key="item.itemId">
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
            <router-link v-for="(file, i) in item.videos" :class="file.useType" :to="{
              name: 'program-media-programId-mediaType-itemId',
              params: {
                programId: info.programId,
                mediaType: file.useType,
                itemId: item.itemId
              }
            }" :key="i">
                <span>{{ ({
                  'mp41M': '视频',
                  'mp3': '音频'
                }[file.useType]) }}</span>
                <small>{{ cItems[index].videos[i].filesize }}</small>
            </router-link>
          </div>
        </div>
      </li>
    </ul>
    <div class="empty-list-tip" v-else>没有找到 ☹️</div>
    <div class="page-nav">
      <router-link v-if="pageNo > 1" :to="{
        name: 'program-programId',
        params: {
          programId: info.programId
        },
        query: {
          pageNo: pageNo - 1,
          keyword
        }
      }">上一页</router-link>
      <router-link :to="{
        name: 'program-programId',
        params: {
          programId: info.programId
        },
        query: {
          pageNo: pageNo + 1,
          keyword
        }
      }">下一页</router-link>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import {
  getApiUrl, apiResponseAdapter,
  formatDuration, formatFileSize, formatProgramNo
} from '~plugins/helper'

export default {
  name: 'Program',
  data() {
    return {
      isSearching: false
    }
  },
  asyncData (context) {
    let programId = context.params.programId
    let pageNo = context.query.pageNo || 1
    let keyword = context.query.keyword
    return Promise.all([
      axios.get(getApiUrl(`/api/program/${programId}/`, context)),
      axios.get(getApiUrl(`/api/program/items/${programId}/?pageNo=${pageNo}&pageSize=10${keyword ? ('&keyword=' + encodeURIComponent(keyword)) : ''}`, context))
    ]).then(function (results) {
      let [info, items] = results.map(function (result) {
        let data = apiResponseAdapter(result)
        if (data instanceof Error) {
          throw data
        }
        return data
      })
      return { info, items, pageNo, keyword }
    }).catch((err) => {
      context.error({
        statusCode: 404,
        message: err.message
      })
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
  },
  methods: {
    handleItemSearch() {
      if (!this.keyword) {
        return
      }
      this.$router.push({
        name: 'program-programId',
        params: {
          programId: this.info.programId
        },
        query: {
          keyword: this.keyword
        }
      })
    }
  }
}
</script>

<style>
.program {
  margin-top: 2em;
}

.program .program-name {
  font-size: 22px;
  margin: 0 0 .3em;
  text-align: center;
}

.program .intro {
  display: flex;
  align-items: center;
}
.program .intro .head-pic {
  width: 224px;
  flex: 0 0 224px;
}
.program .intro .head-pic .pic {
  width: 100%;
  padding-top: 56.25%;
  background-size: 100% auto;
  background-position: center;
}
.program .intro .desc {
  margin-left: 1.6em;
  font-size: 14px;
  color: #666;
  text-align: justify;
}
.program .episodes {
  margin-top: 2em;
  position: relative;
}
.program .episodes ul {
  padding: 0;
  list-style: none;
}
.program .episodes h3 {
  font-weight: normal;
  text-align: center;
  transition: transform 340ms;
}

.program .episodes .search {
  position: absolute;
  top: 0;
  right: 0;
  width: 24px;
  background: url(../../../assets/search-icon.png) no-repeat right center / auto 20px;
  opacity: .5;
  transition: width 340ms, opacity 340ms;
}
.program .episodes .search input {
  width: 100%;
  height: 28px;
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  box-sizing: border-box;
  padding: 0 5px;
  color: rgba(0,0,0,0);
}
.program .episodes.is-searching .search {
  width: calc(100% - 224px - 26px);
  opacity: 1;
  border-bottom: 1px solid #aaa;
}
.program .episodes.is-searching .search input {
  color: #333;
}
.program .episodes.is-searching h3 {
  transform: translateX(calc(-50% + 112px));
}

.program .episodes .page-nav {
  margin: 2em 0;
  text-align: center;
  display: flex;
  justify-content: space-between;
}
.program .episodes .page-nav a {
  text-decoration: none;
  color: #444;
  display: block;
  flex: 1 0 50%;
  line-height: 2.8em;
  background: #eee;
  margin: 0 1px;
}
.program .episodes .empty-list-tip {
  text-align: center;
  margin: 4em 0;
}

.program .episode {
  display: flex;
  margin: 2em 0;
  padding-bottom: 2em;
  border-bottom: 1px dotted #eee;
}
.program .episode .album {
  width: 224px;
  flex: 0 0 224px;
}
.program .episode .album .pic {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background: #eee center / cover;
}
.program .episode .album .duration {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0,0,0,.7);
  color: white;
  font-size: 14px;
  padding: 2px 4px;
}
.program .episode .desc {
  margin-left: 1.6em;
  text-align: justify;
}
.program .episode .program-no {
  display: inline-block;
  font-size: 12px;
  background: #ED802F;
  color: white;
  margin-right: 1em;
  padding: 2px 5px;
}
.program .episode .subtitle {
  font-size: 12px;
  margin: 8px 0;
  color: #666;
}
.program .episode .subtitle .dot {
  font-weight: bolder;
  margin: 0 3px;
}
.program .episode .subtitle .program-author {
  margin-left: 8px;
  color: #999;
  font-size: .8em;
}
.program .episode .subtitle .program-date {
  color: #999;
  font-size: .8em;
}
.program .episode .files {
  margin-top: 1em;
}
.program .episode .files a {
  color: #333;
  text-decoration: none;
  margin-right: 2em;
  user-select: none;
  border: 1px solid #666;
  padding: 2px 6px 2px 1.8em;
  background: no-repeat 6px center /auto 80%;
}
.program .episode .files a:last-child {
  margin-right: 0;
}
.program .episode .files .mp41M {
  padding-left: 2em;
  background-position: 8px center;
  background-image: url(../../../assets/tv.svg);
}
.program .episode .files .mp3 {
  background-image: url(../../../assets/airpods.svg);
}
.program .episode .files small {
  margin-left: 4px;
  font-size: 12px;
  color: #999;
}


@media (max-width: 560px) {
  .program .intro {
    display: block;
  }
  .program .intro .head-pic {
    width: 100%;
  }
  .program .intro .head-pic .pic {
    padding-top: 42.86%;
  }
  .program .intro .desc {
    margin-left: 0;
  }


  .program .episode {
    display: block;
    position: relative;
    padding-top: 30px;
  }
  .program .episode .album {
    margin-bottom: .5em;
    width: 100%;
  }
  .program .episode .title {
    text-align: center;
  }
  .program .episode .program-no {
    margin-right: 0;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
  }
  .program .episode .desc {
    margin-left: 0;
  }
  .program .episode .program-title {
    display: block;
    margin-top: 3px;
  }
  .program .episode .files {
    text-align: center;
  }
}
</style>
