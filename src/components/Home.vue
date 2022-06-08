<template>
  <div id="app">
    <h1> Video Labeling for Time Series Models</h1>
    <div >
      <UploadVideo @update="getVideo"/>
    </div>
    <div v-if="videoOptions.sources[0].src != 'none'">
    <video-player :options="videoOptions" :sliderValue="slider2Vid" :key="vpkey" ref="player"/>
    <div id="controls">
    <button class="btn btn-success" @click="addState()">Click to Add State</button>
    <div id="trimmer">
      <div class="veeno_slider">
        <veeno
        v-model="sliderValue"
        v-bind:handles="statepts"
        connect
        :tooltips="tooltips"
        :range = "{ 
          'min': 0, 
          'max': 50 
        }"
        :step = 0.01
        :key="componentKey"
        @change="updateRanges"
        @slide="updateValue"
      /></div>
    </div>
    <div id="content">
      <div class="table-responsive">
        <!-- <EditableTable v-model="states" :fields="fields"/> -->
        <b-table class="b-table table-dark table-striped table-bordered" :items="states" :fields="fields" fixed>
            <template v-for="(field, index) in fields" #[`cell(${field.key})`]="data">
                <b-form-input v-if="field.type && states[data.index].isEdit" :key="index" :type="field.type" :value="states[data.index][field.key]" @blur="(e) => inputHandler(e.target.value, data.index, field.key)"></b-form-input>
                <div :key="index" v-if="field.type === 'edit'">
                    <b-button class="delete-button" variant="danger" @click="deleteState(data.index)">Remove</b-button>
                </div>
                <span :key="index" v-else>{{data.value}}</span>
            </template>
        </b-table>
      </div>
    </div>
    <button class="btn btn-success" @click="download()">Click to Download</button>
  </div>
  </div>
  </div>
</template>

<script>
import VideoPlayer from '@/components/VideoPlayer.vue';
import veeno from 'veeno';
import UploadVideo from '@/components/UploadVideo.vue'
import 'nouislider/distribute/nouislider.min.css';

export default {
  name: 'VideoExample',
  components: {
    VideoPlayer,
    veeno,
    UploadVideo
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
        states.push({'id': i, 'name': this.statenames[i], 'start': this.timeFormat(this.statepts[i]), 'end': this.timeFormat(this.statepts[i+1])})
      }
      return states
    }
  },
  mounted(){
    this.slider2Vid = '0';
  },
  updated(){
    var bars = document.getElementsByClassName('noUi-connect');
    for (var i = 0; i < bars.length; i++){
      bars[i].style.background = this.colors[i]
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
          ],
          techOrder: ["youtube"]
      },
      slider2Vid: null,
      sliderValue: null,
      statepts: [0, 50],
      statenames: ['State 0'],
      componentKey: 0,
      vpkey: 0,
      colors: ['#FFB7B2', '#E2F0CB', '#B5EAD7','#B5DAE7', '#C7CEEA'],
      fields: [
        {
          key: "start",
          label: "Start Time",
          type: "text",
          editable: false,
          placeholder: "Enter lower bound...",
          class: "lb-col",
        },
        {
          key: "end",
          label: "End Time",
          type: "text",
          editable: false,
          placeholder: "Enter upper bound...",
          class: "ub-col",
        },
        {
          key: "name",
          label: "Label",
          type: "text",
          editable: true,
          placeholder: "Enter state name...",
          class: "name-col",
        },
        { 
          key: "edit", 
          label: "",
          type: "edit", 
          class: "del-col",}
      ]
    };
  },
  methods: {
    timeFormat(n){
      return Math.floor(n/60)+':'+Math.floor(n%60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})+':'+Math.floor((n - Math.floor(n))*60).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})
    },
    addState(){
      this.slider2Vid = (this.$refs.player.$data.player.currentTime()).toString()
      this.statepts.push(this.slider2Vid);
      this.statepts.sort((a,b)=>a-b);
      this.statenames.push('State '+(this.componentKey+1).toString());
      this.componentKey += 1;
    },
    deleteState(index) {
      this.statepts = this.statepts.filter((item, i) => i !== index);
      this.statenames = this.statenames.filter((item, i) => i !== index);
      console.log(this.statepts)
      console.log(this.states)
      this.$emit('input', this.statepts);
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
    getVideo(vidURL){
      this.videoOptions.sources[0].src = vidURL
      this.vpkey += 1
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
    width: 200px !important;
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
    /* background: radial-gradient(#333, hsl(200,30%,6%) ); */
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
  
  /* Show the controls (hidden at the start by default) */
  .video-js .vjs-control-bar { 
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }

  .vjs-big-play-button{
    display: none !important;
  }

  .vjs-control-bar {
    font-size: 175%
  }

  .video-js .vjs-time-control {
    display: block;
  }
  .video-js .vjs-remaining-time {
    display: none;
  }
  body{
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    background-color: black !important;
  }
  /* Make the demo a little prettier */
  #app {
    text-align: center; 
    margin: 50px auto;
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
  width: 250px;
}

.lb-col, .ub-col {
  width: 150px;
}
</style>
