<template>
  <div>
    <video preload="none" ref="videoPlayer" class="video-js vjs-default-skin vjs-16-9"></video>
  </div>
</template>

<script>
import videojs from 'video.js';

export default {
  name: 'VideoPlayer',
  props: {
    options: {
      type: Object,
      default() {
        return {};
      }
    },
    sliderValue:  {
      type: String
    }
  },
  watch: { 
    sliderValue: function(newVal) {
      this.player.currentTime(newVal);
    },
  },
  data() {
    return {
      player: null
    }
  },
  mounted() {
    this.player = videojs(this.$refs.videoPlayer, this.options, () => {
      this.player.log('onPlayerReady', this);
    });
    this.player.on('loadedmetadata', () => { 
      var duration = this.player.duration();
      this.$emit('update', duration)
    })
  },
  beforeUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
</script>
<style scoped>
</style>