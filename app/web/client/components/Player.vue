<template>
<div class="player" :class="{ playing }">
  <audio-player ref="aplayer" v-if="mediaType === 'mp3'" :src="src" :poster="poster" />
  <video-player ref="vplayer" v-else :src="src" :poster="poster" />
  <div class="color-layer"></div>
  <div class="ctrl-layer" @click="handleCtrlLayerClick">
    <div v-if="!playing" class="play"></div>
    <div v-else="playing" class="pause"></div>
  </div>
</div>
</template>

<script>
import VideoPlayer from './player/Video'
import AudioPlayer from './player/Audio'

export default {
  name: 'Player',
  components: {
    'video-player': VideoPlayer,
    'audio-player': AudioPlayer
  },
  props: {
    src: {
      type: String,
      required: true
    },
    mediaType: {
      type: String,
      required: true
    },
    poster: {
      type: String
    }
  },
  data () {
    return {

    }
  },
  computed: {

  },
  methods: {
    handleMediaPlaying() {
      this.playing = true
    },
    handleMediaPause() {
      this.playing = false
    },
    play() {
      this.$refs.aplayer && this.$refs.aplayer.play()
      this.$refs.vplayer && this.$refs.vplayer.play()
    },
    pause() {
      this.$refs.aplayer && this.$refs.aplayer.pause()
      this.$refs.vplayer && this.$refs.vplayer.pause()
    },
    handleCtrlLayerClick() {
      if (this.playing) {
        this.pause()
      }
      else {
        this.play()
      }
    }
  }
}
</script>

<style scoped>
.player {
  position: relative;
}
.player .color-layer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #ED802F;
  opacity: .8;
  mix-blend-mode: color;
  transition: opacity 1s;
  pointer-events: none;
}
.player .ctrl-layer div {
  width: 20%;
  padding-top: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: no-repeat center / 80% auto;
  opacity: .8;
}
.player .ctrl-layer .play {
  background-image: url(../assets/play-icon.svg);
}
.player .ctrl-layer .pause {
  background-image: url(../assets/pause-icon.svg);
}
.player.playing .color-layer {
  opacity: 0;
}
</style>
