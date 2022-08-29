<template>
<div>
  <div id="upload_area">
    <p>Upload a Video:</p>
    <input type="file" @change="previewVideo" accept="video/*" >
    <button class="btn btn-success" @click="onUpload">Upload</button>
  </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UploadVideo',
  data(){
	return{
      video: null,
      vidname: null
	}
  },
  methods:{
    previewVideo(event) {
      this.video = event.target.files[0];
    },
    onUpload(){
      var formData = new FormData();
      formData.append("file", this.video);
      axios.post('https://video-time-series-labeler.herokuapp.com/upload_file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
      }).then(response => {
          this.vidname = response.data.data.filename
          this.frames = response.data.data.frames
          this.$emit('update', [this.vidname, this.frames])
        })
        .catch(e => {
          console.log(e, "error");
        })
    },
  }
}
</script>
<style scoped="">
img.preview {
    width: 200px;
}

#upload_area{
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0px 20px;
}

p{
  margin: 0 5px 0 0;
}

input{
  padding: 3px;
  background-color: #CBC3E3;
  border: 2px solid #CBC3E3;
  border-radius: 5px;
  margin: 0 5px 0;
  font-size: 25px;
}

input[type=text]{
  width: 50vw;
  max-width: 550px;
  padding: 7px;
}

input[type=file]::file-selector-button {
  border: 2px solid #6c5ce7;
  border-radius: 5px;
  background-color: #6c5ce7;
  color: white;
}

input[type=file]::file-selector-button:hover {
  background-color: #6a5acd;
  border: 2px solid #6a5acd;
}

button{
  border-radius: 5px;
  margin: 0 0 0 5px;
}

</style>