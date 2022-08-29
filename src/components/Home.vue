<template>
  <div id="app2">
    <h1> Video Labeling for Time Series Models</h1>
    <div >
      <UploadVideo @update="getVideo"/>
    </div>
    <div v-if="videoOptions.sources[0].src != 'none'">
    <video-player @update="getDuration" :options="videoOptions" :sliderValue="slider2Vid" :key="vpkey" ref="player"/>
    <div id="controls">
    <button class="btn btn-success" @click="addState()">Click to Add State</button>
    <div id="trimmer">
      <div class="veeno_slider">
        <veeno
          v-model="sliderValue"
          v-bind:handles="statepts"
          connect
          :tooltips="tooltips"
          v-bind:range = "{ 
            'min': 0, 
            'max': duration
          }"
          :step = 0.01
          :key="componentKey"
          @change="updateRanges"
          @slide="updateValue"
      /></div>
    </div>
    <div id="content">
      <EditableTable v-bind:states="states" @deleteState="deleteState" @editState="editState"/>
    </div>
  </div>
  </div>
  </div>
</template>

<script>
import VideoPlayer from '@/components/VideoPlayer.vue';
import veeno from 'veeno';
import UploadVideo from '@/components/UploadVideo.vue'
import EditableTable from '@/components/EditableTable.vue'
import axios from 'axios';
import 'nouislider/distribute/nouislider.min.css';

export default {
  name: 'VideoExample',
  components: {
    VideoPlayer,
    veeno,
    UploadVideo,
    EditableTable
  },
  computed:{
    tooltips(){
      var tooltips = [];
      const format = { to: (n) => this.timeFormat(n) }
      for (var i = 0; i < this.statepts.length; i++){
        tooltips.push(format)
      }
      return tooltips
    },
    states(){
      var states = [];
      for (var i = 0; i < this.statenames.length; i++){
        states.push({'id': i, 'name': this.statenames[i], 'start': this.timeFormat(this.statepts[i]), 'end': this.timeFormat(this.statepts[i+1]), 'frames': this.frameRange(this.statepts[i], this.statepts[i+1])})
      }
      return states
    }
  },
  mounted(){
    this.slider2Vid = '0';
  },
  updated(){
    var bars = document.getElementsByClassName('noUi-connect');
    var uniqueStates = [... new Set(this.statenames)]
    for (var i = 0; i < uniqueStates.length; i++){
      this.colordict[uniqueStates[i]] = this.colors[i]
    }
    for (var j = 0; j < bars.length; j++){
      var key = this.statenames[j]
      bars[j].style.background = this.colordict[key]
    }
  },
  data() {
    return {
      videoOptions: {
          autoplay: false,
          controls: true,
          sources: [
            {
              src:
                'none',
                type: 'video/mp4'
            }
          ]
      },
      frames: 0,
      duration: 1,
      slider2Vid: null,
      sliderValue: null,
      statepts: [0, 50],
      statenames: ['State 0'],
      componentKey: 0,
      vpkey: 0,
      colors: ['#FFB7B2', '#E2F0CB', '#B5EAD7','#B5DAE7', '#C7CEEA'],
      colordict: {},
      currentState: 0
    };
  },
  methods: {
    timeFormat(n){
      return Math.floor(n/60)+':'+Math.floor(n%60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})+':'+Math.floor((n - Math.floor(n))*1000).toLocaleString('en-US', {minimumIntegerDigits: 3, useGrouping: false})
    },
    frameRange(n1, n2){
      return (Math.round((n1/this.duration) * this.frames)).toString() + ' - ' +(Math.round((n2/this.duration) * this.frames)).toString()
    },
    addState(){
      this.slider2Vid = (this.$refs.player.$data.player.currentTime()).toString()
      this.statepts.push(this.slider2Vid);
      this.statepts.sort((a,b)=>a-b);
      this.statenames.push('State '+(this.currentState+1).toString());
      this.componentKey += 1;
      this.currentState += 1;
    },
    deleteState(index) {
      this.statepts = this.statepts.filter((item, i) => i !== index);
      this.statenames = this.statenames.filter((item, i) => i !== index);
      this.componentKey += 1;
    },
    editState(options) {
      this.statenames[options.id] = options.value;
      this.componentKey += 1;
    },
    updateRanges(event){
      this.statepts = event.values.map(function (x) { 
        return x; 
      });
      this.slider2Vid = this.sliderValue
    },
    updateValue(){
      this.slider2Vid = this.sliderValue
    },
    async getVideo(vidinfo){
      this.frames = vidinfo[1]
        await axios({
          url: 'https://video-time-series-labeler.herokuapp.com/download/'+vidinfo[0], 
          method: 'GET',
          responseType: 'blob',
        }).then((response) => {
          this.statepts = this.statepts.slice(0,2)
          this.statenames = this.statenames.slice(0,1)
          var FILE = window.URL.createObjectURL(new Blob([response.data]));
          this.videoOptions.sources[0].src = FILE
          this.vpkey += 1
        });
    },
    getDuration(duration){
      this.duration = duration;
      this.statepts = [0, duration]
      this.componentKey += 1;
    }
  }
};
</script>

<style>
  @import 'video.js/dist/video-js.css';

  .del-col{
    width: 100px !important;
  }
  .lb-col, .ub-col{
    width: 150px !important;
  }

  .noUi-horizontal .noUi-handle{
    width: 15px;
    margin-right: 13px;
  }

  .noUi-handle:before, .noUi-handle:after{
     display: none;
   }

  #settings, #controls{
    padding: 10px;
    margin-bottom: 20px;
    margin-top: 5px;
    border-radius: 20px;
  }

  .noUi-handle{
    border-radius: 30px;
  }

  .noUi-base, .noUi-target{
    background-color: #999;
    border-radius: 0px;
  }

  p{
    color: #fff;
    text-align: left;
  }

  .vjs-control-bar {
    font-size: 150%
  }

  .video-js .vjs-time-control {
    display: inline;
  }
  .video-js .vjs-remaining-time {
    display: none;
  }
  body{
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    background-color: black !important;
  }
  /* Make the demo a little prettier */
  #app2 {
    text-align: center; 
    margin: 30px auto 50px;
    max-width: 1000px;
    width: 100%;
  }
  h1{
    color: white;
    padding: 0 0 10px;
  }
  h2{
    color: white;
  }
  
  .btn {
    font-size: 25px !important;
  }

  a, a:hover, a:visited { color: #76DAFF; }

  #trimmer .veeno_slider{
    margin: 70px 30px 0;
  }

  .veeno_slider p{
    padding-bottom: 40px;
    text-align: center;
  }

  #trimmer{
    margin-bottom: 20px;
  }
  .noUi-target{
    border: none;
  }
  p, span{
    font-size: 25px;
    color: #fff;
  }
table {
  font-size: 25px;
}

table.editable-table {
  margin: auto;
}

td, tr {
  vertical-align: middle;
}

.editable-table .data-cell {
  padding: 8px;
  vertical-align: middle;
  justify-content: center;
}

.name-col{
  width: 200px;
}

.lb-col, .ub-col {
  width: 150px;
}
</style>
