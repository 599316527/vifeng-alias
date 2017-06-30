<template>
<div class="video-player">
  <video :src="src" :poster="poster" :autoplay="autoplay" :loop="loop" :muted="muted"
    playsinline controls ref="player"
    @playing="handleMediaPlaying" @pause="handleMediaPause"></video>
</div>
</template>

<script>
import Mixin from './Mixin'

export default {
  name: 'VideoPlayer',
  mixins: [Mixin]
}
</script>

<style>
.video-player {
  position: relative;
  padding-top: 56.25%;
}
.video-player video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
