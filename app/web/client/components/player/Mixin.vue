
<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    poster: {
      type: String
    },
    autoplay: {
      type: Boolean
    },
    loop: {
      type: Boolean
    },
    muted: {
      type: Boolean
    }
  },
  data () {
    return {
      playing: false
    }
  },
  methods: {
    handleMediaPlaying() {
      this.playing = true
      this.$emit('playing')
    },
    handleMediaPause() {
      this.playing = false
      this.$emit('pause')
    },
    play() {
      this.$refs.player.play()
    },
    pause() {
      this.$refs.player.pause()
    },
    changePlaybackRate(rate) {
      this.$refs.player.playbackRate = rate
    }
  }
}
</script>
