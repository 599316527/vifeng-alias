<template>
<div class="player" :class="{
  playing,
  'is-audio': mediaType === 'mp3',
  'is-video': mediaType !== 'mp3'
}">
  <audio-player ref="aplayer" v-if="mediaType === 'mp3'" :src="src" :poster="poster"
    @playing="handleMediaPlaying" @pause="handleMediaPause" />
  <video-player ref="vplayer" v-else :src="src" :poster="poster"
    @playing="handleMediaPlaying" @pause="handleMediaPause" />
  <div class="color-layer"></div>
  <div class="type-identifier" ref="typeIdentifier"></div>
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
      playing: false
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
  },
  mounted() {
    replaceIdentifier(this.$refs.typeIdentifier)
  }
}

function replaceIdentifier(node) {
  let {width, height, backgroundImage} = window.getComputedStyle(node)
  width = parseFloat(width, 10) * 2
  height = parseFloat(height, 10) * 2
  let img = document.createElement('img')
  img.src = backgroundImage.substring(backgroundImage.indexOf('"') + 1, backgroundImage.lastIndexOf('"'))
  let canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  let context = canvas.getContext('2d')
  context.drawImage(img, 0, 0, width, height)
  let sourceImageData = context.getImageData(0, 0, width, height)
  let sourceImagePixels = sourceImageData.data
  for (let i = 0; i < sourceImagePixels.length; i++) {
      if ((i + 1) % 4) {
        // reverse
        sourceImagePixels[i] = 0xFF - sourceImagePixels[i]
      }
  }
  context.putImageData(sourceImageData, 0, 0)
  node.style.background = 'none'
  // for scoped style
  Object.keys(node.dataset).forEach(function (key) {
    canvas.dataset[key] = ''
  })
  node.appendChild(canvas)
}
</script>

<style scoped>
.player {
  position: relative;
  overflow: hidden;
}

.player .color-layer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(237, 128, 47, .7);
  mix-blend-mode: overlay;
  transition: background-color 1s;
  pointer-events: none;
}

.player .ctrl-layer div {
  width: 24%;
  padding-top: 24%;
  position: absolute;
  top: 45%;
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
  background-color: rgba(237, 128, 47, 0);
}

.player.is-video .pause {
  display: none;
}

.player .type-identifier {
  position: absolute;
  top: 1em;
  right: 1em;
  width: 2.4em;
  height: 2.4em;
  background: no-repeat center / 100% auto;
}
.player .type-identifier canvas {
  width: 100%;
}
.player.playing .type-identifier {
  display: none;
}
.player.is-video .type-identifier {
  background-image: url(../assets/tv.svg);
}
.player.is-audio .type-identifier {
  background-image: url(../assets/airpods.svg);
}

@keyframes wave {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(18);
  }
}
.player.is-audio.playing .color-layer::before,
.player.is-audio.playing .color-layer::after {
  content: "";
  position: absolute;
  top: 45%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin-left: -10px;
  margin-top: -10px;
  border: 1px solid #fff;
  border-radius: 100%;
  animation: wave 3s infinite ease-in;
}
.player.is-audio.playing .color-layer::after {
  animation-delay: 600ms;
}
.player audio {
    z-index: 9;
}
</style>
