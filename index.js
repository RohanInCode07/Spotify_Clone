console.log("Let write some javascript");
let currentSongs = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1])
    }
  }
  

// Show all the songs in the playlist 

let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
songUL.innerHTML = " "

for (const song of songs) {
  let songTemp = song.replaceAll("%20" , " ")
  songTemp = songTemp.replaceAll("%2C" , " ")
  songTemp = songTemp.replaceAll("%26" , " ")
  songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="svg/music.svg" alt="">
  <div class="info">
    <div>${songTemp}</div>
    <div>Artist</div>
  </div>
  <div class="playnow">
    <span>Play Now</span>
    <img class="invert"  src="svg/play.svg" alt="">
  </div> 
   </li> `;
  
  
}

// Attach an event listener to each songs
Array.from(document.querySelector(".songlist ").getElementsByTagName("li")).forEach(e=>{
e.addEventListener("click" , element=>{
  console.log(e.querySelector(".info").firstElementChild.innerHTML);
  playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())


})
})




}

const playMusic = (track , pause=false)=>{

  
  currentSongs.src = `/${currFolder}/` + track
if(!pause){
  currentSongs.play()
  play.src = "svg/pause.svg"
}

  
  
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


async function displayAlbums(){
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let cardContainer = document.querySelector(".cardContainer")
  Array.from(anchors).forEach(async  e=>{
if(e.href.includes("/songs")){

 let folder = e.href
 if (folder != "http://127.0.0.1:5500/songs"){
  let a = await fetch(`${folder}/info.json`)
  let response = await a.json(); 
  console.log(response); 
 }
}

  })
  
}


async function main() {


  // get the list of all the songs 

   await getSongs("songs/rohan-collection")
  playMusic(songs[0] , true)



  //Display all the albums on the pages
displayAlbums()



// Attach an event listener to shuffle , previous , play , next , loop 

play.addEventListener("click" , ()=>{
 if(currentSongs.paused){
  currentSongs.play()
  play.src = "svg/pause.svg"
 }
 else{
  currentSongs.pause()
  play.src = "svg/play.svg"
  
 }

})


//Listen for timeupdate event

currentSongs.addEventListener("timeupdate" , ()=>{
console.log(currentSongs.currentTime , currentSongs.duration);
document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSongs.currentTime)} : ${secondsToMinutesSeconds(currentSongs.duration)}`
document.querySelector(".circle").style.left  = (currentSongs.currentTime / currentSongs.duration) * 100 + "%";


})


//Add an event listener to seekbar 

document.querySelector(".seekbar").addEventListener("click" , e=>{
  let percent = (e.offsetX/e.target.getBoundingClientRect().width ) * 100 ;
  document.querySelector(".circle").style.left =  percent + "%"  ;
  currentSongs.currentTime =  ((currentSongs.duration) * percent) /100;
})



//Add an event listener for menu
document.querySelector(".menu").addEventListener("click" , ()=>{
  document.querySelector(".left-container").style.left ="0"
})


//Add a eventlistener for close button
document.querySelector(".close").addEventListener("click" , ()=>{
  document.querySelector(".left-container").style.left = "-120%"
})

//Add an event listener for previous

previous.addEventListener("click" , ()=>{
  currentSongs.pause()
  console.log("Previous clicked");
  console.log(currentSongs);
  let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
  if((index - 1) >= 0){
    playMusic(songs[index-1])
  }
})


//Add an event listener for next
next.addEventListener("click" , ()=>{
  currentSongs.pause()
  console.log("Next clicked");
  console.log(currentSongs);
  let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
  if((index + 1) <  songs.length){
    playMusic(songs[index+1])
  }
  })


  //Add an event listener for loop

loop.addEventListener("click" , ()=>{
  console.log("Loop clicked");
  console.log(currentSongs);
  let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
    playMusic(songs[index])
    songs[index].currentTime=0
    autoplay()
  })

// Add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change" , (e)=>{
console.log(e , e.target , e.target.value);
currentSongs.volume = parseInt(e.target.value)/100

})


//Load the playlist whenever anyone click that folder

Array.from(document.getElementsByClassName("card")).forEach(e=>{
e.addEventListener("click" , async item=>{
 
  songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)


})


})

   // Add event listener to mute the track
   document.querySelector(".volume>img").addEventListener("click", e=>{ 
    if(e.target.src.includes("svg/volume.svg")){
        e.target.src = e.target.src.replace("svg/volume.svg", "svg/mute.svg")
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src = e.target.src.replace("svg/mute.svg", "svg/volume.svg")
        currentSong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }

})



}

main()


