<template>
<div class="audio-player">
  <div class="poster" :style="{
    'background-image': `url(${poster})`
  }"></div>
  <audio :src="src" :autoplay="autoplay" :loop="loop" :muted="muted"
    playsinline controls ref="player"
    @playing="handleMediaPlaying" @pause="handleMediaPause"></audio>
</div>
</template>

<script>
import Mixin from './Mixin'

export default {
  name: 'AudioPlayer',
  mixins: [Mixin]
}
</script>

<style>
.audio-player {
  position: relative;
}
.audio-player .poster {
  padding-top: 56.25%;
  background-size: cover;
  background-position: center;
}

.audio-player audio {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}

</style>
