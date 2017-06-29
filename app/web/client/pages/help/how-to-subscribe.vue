
<template>
<div class="help">
  <h2 class="lowdash">如何订阅播客?</h2>

  <div class="alert alert-danger">
    由于<a href="http://www.jiemian.com/article/1417385.html">某些原因</a>，凤凰网/凤凰视频/凤凰FM上的锵锵三人行都没了，所以停更了。
  </div>

  <div class="copy-tip alert alert-info" v-if="!hideCopyTip">
    <button type="button" class="close" @click="hideCopyTip = true"><span>&times;</span></button>
    <small><strong>提示</strong>
      下面这段是从 IPN 播客网络哪儿抄来的。为什么不直接链接过去？1. 因为“如何...”这节的标题没有设置 Anchor，链接过去没法定位这一节； 2. 我也想修改下内容。</small>
  </div>

  <blockquote>
    <p>首先你需要一个泛用型（或称通用型）播客客户端软件。</p>
    <p>在 iOS 和 Android 上，我推荐
        <a target="_blank" href="https://itunes.apple.com/us/app/pocket-casts/id414834813">Pocket Casts</a> 。
    </p>
    <p>在 Mac 和 Windows 上用 iTunes 就好 <small>(文件 &gt; 订阅到播客)</small>。
        当然，您也可以随时在浏览器里访问 <router-link :to="{ name: 'index' }">节目的网站</router-link> 收听。
    </p>
  </blockquote>

  <h2 class="lowdash">锵锵三人行</h2>
  <div class="program">
    <div class="album">
      <img src="https://hk1229.cn/demo/phoenixtv/help/how-to-subscribe/57ee2ee9cea8e82ace69ee78f8d93eda.png" />
    </div>
    <ul class="urls">
      <li class="video"><span>视频版</span><samp>https://qcdn.adeline.cc/vifeng/podcast/video/qqsrx.xml</samp></li>
      <li class="audio"><span>音频版</span><samp>https://qcdn.adeline.cc/vifeng/podcast/video/qqsrx.xml</samp></li>
    </ul>
  </div>

  <h2 class="lowdash">常见问题</h2>
  <dl class="faq">
    <dt>如果使用 iOS 官方 Podcast 客户端订阅 URL？</dt>
    <dd>复制上面的 URL，把开头的 <code>https</code> 改成 <code>podcast</code>，粘贴到 Safari 打开。</dd>

    <dt>为什么更新不及时？</dt>
    <dd>数据定时从凤凰视频和凤凰FM抓取，数据源更新不及时是主要原因。其次，抓取频率和CDN缓存也可能引起更新延误。</dd>

    <dt>为什么在 iTunes 中搜不到？</dt>
    <dd>被 Apple 下架了。
      <a class="btn btn-link btn-sm" target="_blank" href="https://hk1229.cn/demo/phoenixtv/help/how-to-subscribe/4570ede8275af238cbfc8d22ac4a7b03.jpg">
      查看邮件截图</a></dd>
  </dl>
</div>
</template>

<script>
export default {
  name: 'HelpHowToSubscribe',
  data() {
    return {
      hideCopyTip: false
    }
  }
}
</script>

<style>
.help {
  font-size: 14px;
  margin: 0 4em;
}
.help a {
  color: #ED802F;
  text-decoration: none;
}
.help h2 {
  margin-top: 2.8em;
  font-size: 20px;
  text-align: center;
}
.help code {
  padding: 2px 4px;
  font-size: 90%;
  color: #c7254e;
  background-color: #f9f2f4;
  border-radius: 4px;
}
.help .copy-tip .close {
  float: right;
  background: no-repeat;
  border: none;
}
.help .alert {
  padding: 10px 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 4px;
}
.help .alert-danger {
  color: #a94442;
  background-color: #f2dede;
  border-color: #ebccd1;
}
.help .alert-info {
  color: #31708f;
  background-color: #d9edf7;
  border-color: #bce8f1;
}
.help .btn {
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  touch-action: manipulation;
  cursor: pointer;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 4px;
}
.help .btn-default {
  color: #333;
  background-color: #fff;
  border-color: #ccc;
}
.help .btn-link {
  font-weight: 400;
  color: #337ab7;
  border-radius: 0;
  background-color: transparent;
  box-shadow: none;
  border-color: transparent;
}
.help .btn-sm {
  padding: 5px 10px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 3px;
}
.help blockquote {
  padding: 0 20px;
  margin: 0 0 20px;
  font-size: 14px;
  border-left: 5px solid #eee;
  line-height: 2;
}
.help blockquote p {
  margin: 4px 0;
}
.help blockquote .btn {
  padding: 2px 6px !important;
}
.help .program {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}
.help .program .album {
  width: 320px
}
.help .program .album img {
  width: 100%;
}
.help .program .urls {
  margin: 0;
  padding: 0;
  list-style: none;
  line-height: 2.2;
}
.help .program .urls span {
  display: inline-block;
  margin-right: 1em;
  padding-right: .8em;
  padding-left: 2em;
  background-position: left center;
  background-size: auto 20px;
  background-repeat: no-repeat;
  position: relative;
}
.help .program .urls span::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(0, -50%);
  height: 9px;
  border-right: 1px dotted #999;
}
.help .program .urls .video span {
  background-image: url(../../assets/tv.png);
}
.help .program .urls .audio span {
  background-image: url(../../assets/airpods.png);
}
.help .program .urls samp {
  font-family: Menlo,Monaco,Consolas,"Courier New",monospace;
  font-size: 16px;
  word-break: break-all;
  color: #333;
}
.help .faq {

}
.help .faq dt {
  margin: 2.5em 0 0.6em;
  color: #a04501;
}
.help .faq dd {
  font-size: 16px;
  margin: 0;
  color: #333;
}

@media (max-width: 650px) {
  .help {
    margin: 0 1em;
  }
  .help .program .urls {
    text-align: center;
    line-height: 1.5;
  }
  .help .program .urls samp {
    display: block;
    font-size: 14px;
    margin: 0 1em;
  }
  .help .program .urls span {
    margin: 1.5em 0 .5em;
    padding-right: 0;
    background-position: left top;
  }
  .help .program .urls span::after {
    display: none;
  }
}
</style>
