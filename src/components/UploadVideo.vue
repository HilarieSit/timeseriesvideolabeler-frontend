<template>
<div>
  <div id="upload_area">
    <p>Upload a Video:</p>
    <input type="file" @change="previewImage" accept="video/*" >
    <button class="btn btn-success" @click="onUpload">Upload</button>
  </div>
  <div id="upload_area">
    <p>or Enter Video URL:</p>
    <input id="url" type="text">
    <button class="btn btn-success" @click="onSubmit">Submit</button>
  </div>
</div>
</template>

<script>
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage'

export default {
  name: 'UploadVideo',
  data(){
	return{
      vidData: null,
      video: null,
      uploadValue: 0
	}
  },
  methods:{
    previewImage(event) {
      this.uploadValue=0;
      this.video=null;
      this.vidData = event.target.files[0];
    },
    onUpload(){
      this.video=null;
      const storageRef=firebase.storage().ref(`${this.vidData.name}`).put(this.vidData);
      storageRef.on(`state_changed`,snapshot=>{
        this.uploadValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
      }, error=>{console.log(error.message)},
      ()=>{this.uploadValue=100;
        storageRef.snapshot.ref.getDownloadURL().then((url)=>{
          this.video=url;
          this.$emit('update', this.video)
        });
      }
      );
    },
    onSubmit(){
      this.video=document.getElementById('url').value;
      this.$emit('update', this.video)
    }

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