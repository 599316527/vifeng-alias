<template>
<div class="create">
  <h2 class="page-title lowdash">人工录入新剧集</h2>

  <form ref="form" @submit="handleFormSubmit">
    <dl class="episode">
      <div class="item">
        <dt>节目名</dt>
        <dd>
          <select class="control" v-model="programId" required>
            <option v-for="(item, index) in programs" :value="item.programId">{{ item.name }}</option>
          </select>
        </dd>
      </div>

      <div class="item">
        <dt>播放日期</dt>
        <dd>
          <input type="number" class="control" v-model="programNo" placeholder="20170101" required="">
          <span class="tip">年月日 (2017年01月01日 -&gt; 20170101)</span>
        </dd>
      </div>
      <div class="item">
        <dt>剧集标题</dt>
        <dd>
          <input type="text" class="control" v-model="title" placeholder="李玫瑾分析丰县爆炸案 呼吁社会关注心理问题" required>
        </dd>
      </div>
      <div class="item">
        <dt>剧集作者</dt>
        <dd>
          <input type="text" class="control" v-model="author" placeholder="凤凰网" required>
        </dd>
      </div>
      <div class="item">
        <dt>剧集描述</dt>
        <dd>
          <textarea class="control" v-model="desc"></textarea>
          <span class="tip">可选，不填则留空</span>
        </dd>
      </div>
      <div class="item">
        <dt>剧集时长</dt>
        <dd>
          <input type="number" class="control" v-model="duration" placeholder="1520" required>
          <span class="tip">单位：秒  (1250秒 -> 20:50)</span>
        </dd>
      </div>
      <div class="item">
        <dt>剧集封面</dt>
        <dd>
          <input type="url" class="control" v-model="album" placeholder="https://" required>
          <span class="tip">图片 (.jpg)</span>
        </dd>
      </div>

      <div class="item">
        <dt>视频文件地址</dt>
        <dd>
          <input type="url" class="control" v-model="videoUrl" placeholder="https://">
          <span class="tip">视频 (.mp4)</span>
        </dd>
      </div>
      <div class="item">
      <dt>视频文件大小</dt>
        <dd>
          <input type="number" class="control" v-model="videoFileSize" placeholder="117760">
          <span class="tip">单位：KB  117760 -> 115MB</span>
        </dd>
      </div>

      <div class="item">
        <dt>音频文件地址</dt>
        <dd>
          <input type="url" class="control" v-model="audioUrl" placeholder="https://" required>
          <span class="tip">音频 (.mp3)</span>
        </dd>
      </div>
      <div class="item">
        <dt>音频文件大小</dt>
        <dd>
          <input type="number" class="control" v-model="audioFileSize" placeholder="117760" required>
          <span class="tip">单位：KB  (117760 -> 115MB)</span>
        </dd>
      </div>

      <div class="item">
        <dt>准入密码</dt>
        <dd>
          <input type="password" class="control" v-model="password" required>
        </dd>
      </div>

      <div class="item recaptcha" ref="recaptcha"></div>

      <div class="item button">
        <button :disabled="isSubmitting" type="submit">{{ isSubmitting ? '提交中...' : '提交' }}</button>
      </div>

      <div class="item message">{{ message }}</div>
    </dl>
  </form>
</div>
</template>

<script>
import axios from 'axios'
import {getApiUrl, apiResponseAdapter} from '~plugins/helper'

const formFields = [
  'programId', 'title', 'desc', 'author', 'album', 'duration', 'programNo',
  'videoUrl', 'videoFileSize', 'audioUrl', 'audioFileSize', 'password'
]

export default {
  name: 'Program',
  asyncData (context) {
    return Promise.all([
      axios.get(getApiUrl('/api/programs/', context)),
      axios.get(getApiUrl('/api/recaptcha/', context))
    ]).then(function (results) {
      let [programs, recaptcha] = results.map(function (result) {
        let data = apiResponseAdapter(result)
        if (data instanceof Error) {
          throw data
        }
        return data
      })
      return {
        context: {
          // 直接写 context 会导致 ssr 的时候报错 Converting circular structure to JSON
          isServer: context.isServer
        },
        programs,
        recaptcha
      }
    }).catch((err) => {
      context.error({
        statusCode: 404,
        message: err.message
      })
    })
  },
  data() {
    return Object.assign({
      isSubmitting: false,
      message: ''
    }, formFields.reduce(function (obj, key) {
      obj[key] = ''
      return obj
    }, {}))
  },
  computed: {

  },
  methods: {
    handleFormSubmit(evt) {
      evt.preventDefault()

      this.isSubmitting = true
      this.message = ''

      let data = formFields.reduce((obj, key) => {
        obj[key] = this[key]
        return obj
      }, {})

      data.recaptchaResponse = grecaptcha.getResponse(this.recaptchaWdigetId)

      axios.post(getApiUrl(`/api/program/item/${this.programId}/`, this.context), data)
        .then((response) => {
          let data = apiResponseAdapter(response)
          if (data instanceof Error) {
            throw data
          }
          this.isSubmitting = false
          this.message = '提交成功'
        })
        .catch((error) => {
          this.isSubmitting = false
          this.message = error.message
          grecaptcha.reset(this.recaptchaWdigetId)
        })
    }
  },
  mounted() {
    this.recaptchaWdigetId = grecaptcha.render(this.$refs.recaptcha, {
      'sitekey': this.recaptcha.siteKey
    });
  }
}
</script>

<style scoped>
.create {
  margin: 2em 0;
}
.create .page-title {
  font-size: 22px;
  text-align: center;
}
.create .episode .item {
  display: flex;
  margin: 1.2em 0;
}
.create .episode dt {
  color: #a04501;
  flex: 0 0 90px;
  text-align: right;
  position: relative;
  padding-right: 8px;
  font-size: 14px;
  padding-top: 6px;
}
.create .episode dt::after {
  content: ":";
  position: absolute;
  top: 6px;
  right: 0;
}
.create .episode dd {
  width: 100%;
  margin: 0 0 0 .6em;
}
.create .episode .tip {
  display: block;
  margin: 5px 0 0 6px;
  font-size: 12px;
  color: #666;
}
.create .episode .control {
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #999;
  border-radius: 0;
  background: transparent;
  font-size: 18px;
  color: #333;
  outline: none;
  transition: border-bottom-color 400ms, box-shadow 400ms;
}
.create .episode .control:focus {
  border-bottom-color: #e67514;
  box-shadow: 0 1px 2px #ccc;
}

.create .episode input {
  padding: 6px 6px 2px 6px;
}

.create .episode textarea.control {
  display: block;
  height: 87px;
  border: none;
  line-height: 1.6;
  background: repeating-linear-gradient(to bottom,
    rgba(0,0,0,0) 0px, rgba(0,0,0,0) 28px, rgba(0,0,0,1) 29px);
}
.create .episode textarea.control:focus {
  background: repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 27px, rgba(0,0,0,.4) 28px, rgba(0,0,0,0) 29px),
    repeating-linear-gradient(to bottom, rgba(230,117,20,0) 0px, rgba(230,117,20,0) 28px, rgba(230,117,20,1) 29px);
}

.create .episode select.control {
  padding: 6px 6px 2px 6px;
  -webkit-appearance: none;
  background: url(../../../assets/arrow-down.svg) no-repeat center right 6px / 1.2em auto;
}

.create .episode button {
  display: block;
  width: 200px;
  box-sizing: border-box;
  margin: 1em auto;
  padding: 6px 20px;
  border: 1px solid #333;
  border-radius: 0;
  background: transparent;
  font-size: 18px;
  color: #333;
  outline: none;
}
.create .episode button[disabled] {
  opacity: .7;
}
.create .episode .message {
  display: block;
  text-align: center;
  color: #f75520;
}
.create .episode .recaptcha {
  margin: 2em 0;
  justify-content: center;
}

@media (max-width: 650px) {
  .create .episode .item {
    display: block;
  }
  .create .episode dt {
    text-align: left;
  }
  .create .episode dt::after {
    display: none;
  }
  .create .episode dd {
    margin-left: 0;
  }
  .create .episode .tip {
    margin-left: 0;
  }
  .create .episode input {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
