document.getElementById("getmp3").style.display = "none";
document.getElementById("upload_info").style.display = "none";
document.getElementById("spinner_load").style.display = "none";
document.getElementById("upload_success_icon").style.display = "none";
document.getElementById("audio_info").style.display = "none";
document.getElementById("spinner_load_audio").style.display = "none";
document.getElementById("fetch_success_icon").style.display = "none";
const fileHolder = document.getElementById('gallery-photo-add');
fileHolder.addEventListener('change', function(event) {
    console.log(event.target.files.length);
    var reader = new FileReader()
    for(let i=0; i<event.target.files.length; i++){
        var node = document.createElement('li');
        node.id = "image_"+i.toString();
        document.getElementById("appendImages").appendChild(node);
    }
    for(let i=0; i<event.target.files.length; i++){
        var img = new Image();
        img.src = URL.createObjectURL(event.target.files[i]);
        img.width = "500";
        img.height = "300";
        document.getElementById("image_"+i).appendChild(img);
    }
    if (event.target.files.length > 0) {
        document.getElementById("getmp3").style.display = "block";
    }

    let check = false;
    document.getElementById("getmp3").addEventListener('click', function(){
        bucket_name = document.getElementById('directory_list').value;
        counter=0;
        let fileNameList = [];
        for(let i=0; i<event.target.files.length; i++){
            let imageFiles = event.target.files[i];
            fileNameList.push(imageFiles.name);
            let storageRef = firebase.storage().ref(bucket_name + "/" + imageFiles.name);
            let task = storageRef.put(imageFiles);
            task.on('state_changed', function progress(snapshot){
                let perc = snapshot.bytesTransferred/snapshot.totalBytes * 100;
                if(perc == 100.0){
                    counter = counter+1;
                }
                if(counter == event.target.files.length){
                    document.getElementById('spinner_load').style.display = 'none';
                    document.getElementById('upload_info').innerHTML = 'Upload Successful';
                    document.getElementById("upload_success_icon").style.display = "block";
                    check=true;
                    verifyAudioStart(check, fileNameList, bucket_name);
                }else{
                    document.getElementById('upload_info').style.display = 'block';
                    document.getElementById('spinner_load').style.display = 'block';
                    document.getElementById("upload_success_icon").style.display = "none";
                }
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED:
                        console.log('UPLOAD PAUSED.');
                        break;
                    
                    case firebase.storage.TaskState.RUNNING:
                        console.log('UPLOAD RUNNING.');
                        break;

                    case firebase.storage.TaskState.RUNNING:
                        console.log('UPLOAD RUNNING.');
                        break;

                    default:
                        break;
                }
            });

        }

        // 
        
        
    });
});

function verifyAudioStart(check, arr, uploadBucket){
    if(check){
        document.getElementById('audio_info').style.display = 'block';
        document.getElementById('spinner_load_audio').style.display = 'block';
        document.getElementById("fetch_success_icon").style.display = "none";
        for (let index = 0; index < arr.length; index++) {
            arr[index] = arr[index].split('.').slice(0, -1).join('.');
        }
        let promiseList = [];
        for (let index = 0; index < arr.length; index++) {
            audio = document.createElement('audio');
            audio.class = "audioDesign";
            audio.id = "audio_"+index;
            audio.controls = "controls";
            document.getElementById('linkLabel').appendChild(audio);
            promise = fetch('http://127.0.0.1:5000/convert/'+ uploadBucket.substr(7) +'/'+arr[index]);
            promiseList.push(promise);
        }

        Promise.all(promiseList).then(files => {
            let i=0;
            files.forEach(file => {
              appendURL(file.json(), i, arr.length);
              i = i+1;
            });
        });
        
        
        let appendURL = (prom, ind, totAudio) => {
        prom.then(data => {
            srcElem = document.createElement('source');
            srcElem.src = data['Link'];
            srcElem.type = "audio/mpeg";
            document.getElementById('audio_'+ind).appendChild(srcElem);
            
            sliderElem = document.createElement('li');
            playButton = document.createElement('button');
            playButton.style.width = '300px';
            playButton.style.height = '300px';
            playButton.style.borderRadius = '50%';
            playButton.style.backgroundColor = 'black';
            spanElem = document.createElement('span');
            spanElem.class = "uk-margin-small-right";
            spanElem.style.color = "#0883ff";
            spanElem.setAttribute('uk-icon',"icon:play-circle; ratio:3");
            audioref = document.getElementById("audio_"+ind);
            seekb = document.createElement('input');
            seekb.type = "range";
            seekb.id =  "dur_"+ind;
            seekb.step = "0.25";
            seekb.style.width = "100%";
            seekb.style.height = "4px";
            seekb.setAttribute('onchange', 'mSet("dur_'+ind+'", "audio_'+ind+'")');
            playButton.appendChild(spanElem);
            sliderElem.appendChild(playButton);
            sliderElem.appendChild(seekb);
            document.getElementById('appendAudio').appendChild(sliderElem);
    
            playButton.setAttribute('onclick', "audioPlayOrPause('audio_"+ ind +"', "+totAudio+")");
            audioref.setAttribute("onloadedmetadata","mDur('dur_"+ind+"', 'audio__"+ind+"')");
            audioref.setAttribute("ontimeupdate","mPlay('dur_"+ind+"', 'audio__"+ind+"')");

            document.getElementById('audio_info').innerHTML = 'Fetch Successful!';
            document.getElementById('spinner_load_audio').style.display = 'none';
            document.getElementById("fetch_success_icon").style.display = "block";

            });
        }
    }
}

function audioPlayOrPause(audioID, totElem){
    audioElem = document.getElementById(audioID);
    for (let index = 0; index < totElem; index++) {
        if(audioID == 'audio_'+index){
            if(audioElem.paused){
                audioElem.play();
            }else{
                audioElem.pause();
            }
        }else{
            document.getElementById('audio_'+index).pause();
        }
    }  
}

function mDur(dur, aud){
    seekb = document.getElementById(dur);
    audio = document.getElementById(aud);
    seekb.max= audio.duration;
  }
  
  function mPlay(dur, aud){
    seekb = document.getElementById(dur);
    audio = document.getElementById(aud);
    seekb.value=audio.currentTime;
  }
  
  function mSet(dur, aud){
    seekb = document.getElementById(dur);
    audio = document.getElementById(aud);
    audio.currentTime=seekb.value;
  }