<template>
  <div>
    <video ref="videoPlayer" class="video-js vjs-default-skin vjs-16-9" data-setup='{ "playbackRates": [0.5, 1, 1.5, 2] }'></video>
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
    options: function(newVal){
      var newsrc = newVal.sources[0].src;
      console.log(newsrc)
      this.player.src({type: 'video/mp4', src: newsrc});
      this.player.load()
    }
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