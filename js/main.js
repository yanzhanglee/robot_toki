//Variables
let pupil_x = 235;
let pupil_y = 162;
let pupil_size = 50;
let mouth_type = 2;  //1 for open&smile, 2 for shut, 3 for sad
let blink_time = 2000;

let language = '';
let headText = document.getElementById("heading-text");
let pText = document.getElementById("paragraph-text");

let userId = 0;
let currentUser = 0;
let trans_result;
let spoken = false;

let words_repo = [["sound","annoyed","weekend","hate","love","random","crazy","funny","hope","dream","lazy"],["argument","film","weekend","hate","love","random","crazy","funny","hope","dream","lazy"],["sound","annoyed","weekend","hate","love","random","crazy","funny","hope","dream","lazy"]];
let trans_repo_chinese = [["声音","烦人的","周末","讨厌","爱","随机","疯狂的","有趣的","希望","梦","懒惰的"],["参数","电影","周末","讨厌","爱","随机","疯狂的","有趣的","希望","梦","懒惰的"],["声音","烦人的","周末","讨厌","爱","随机","疯狂的","有趣的","希望","梦","懒惰的"]];
let trans_repo_pt = [["Voz","Irritante","Fim-de-semana","Nojento","Amor","Aleatório","Maníaco","Divertido","Esperança","Sonho","Preguiçoso"],["Parâmetro","Filme","Fim-de-semana","Nojento","Amor","Aleatório","Maníaco","Divertido","Esperança","Sonho","Preguiçoso"],["Voz","Irritante","Fim-de-semana","Nojento","Amor","Aleatório","Maníaco","Divertido","Esperança","Sonho","Preguiçoso"]];
let trans_repo_french = [["du son","agacé","fin de semaine","haine","amour","Aléatoire","fou","drôle","espérer","rêver","paresseux"],["Les paramètres","agacé","fin de semaine","haine","amour","Aléatoire","fou","drôle","espérer","rêver","paresseux"],["du son","agacé","fin de semaine","haine","amour","Aléatoire","fou","drôle","espérer","rêver","paresseux"]];
let round = 0;
let scores = 0;

let results;

//CLass
function User(){
  this.initialUser = function (name){
    this.id = userId;
    this.name = name;
    userId += 1;
  }
  this.getId = function (){
    return this.id;
  }
  this.lang = 'en-US';
  this.progressOnVac = 0;
  this.progressOnSpoken = 0;
  this.getName = function (){
    return this.name;
  };
  this.setName = function (name){
    this.name = name;
  };
  this.setLang = function (lang){
    this.lang = lang;
  }
  this.getLang = function (){
    return this.lang;
  }
  this.setProgressOnVac = function (pr){
    this.progressOnVac = pr;
  }
  this.setProgressOnSpoken = function (pr){
    this.progressOnSpoken = pr;
  }
  this.getProgressOnVac = function (){
    return this.progressOnVac;
  }
  this.getProgressOnSpoken = function (){
    return this.progressOnSpoken;
  }

}

//Statements
drawToki();

window.onload=function (){
  console.log("Loaded");
  loadFaceapi();
}

//Data function
function saveName(){
  initialVideo();
  pupilTurn(25);
  const textInput = document.getElementById("textInput");
  const text = textInput.value;

  window.user1 = new User();
  user1.initialUser(text);

  let welcome = "Welcome "+ text +". Let's learn a second language together!";
  headText.innerText = "Welcome, "+text;
  pText.innerText = "Let's learn a second language together!"
  speak(welcome,'en-US');
  hideInput();
}

function firstSetLang(language){
  pupilTurn(30);
  user1.setLang(language);
  console.log(user1.getLang());
  if (language==='zh-cn'){
    let welcome = "中文是一门很有挑战的语言，祝你学习愉快！"
    headText.innerText = welcome;
    pText.innerText = "Chinese is a challenging language, hope you enjoy it!"
    speak(welcome,'zh-cn');
  }
  if (language==='pt-pt'){
    let welcome = "O português é UMA língua Muito elegante, desejo-lhe um estudo feliz!"
    headText.innerText = welcome;
    pText.innerText = "Portuguese is a romantic language, hope you enjoy it!"
    speak(welcome,'pt-pt');
  }
  document.getElementById("lang-select").setAttribute("style","display:none;");
  document.getElementById("start-to-learn").setAttribute("style","display:inline-block");
}

//DOM function
function goToChooseSection(){
  document.getElementById("start-to-learn").setAttribute("style","display:none;");
  document.getElementById("choose-section").setAttribute("style","display:inline-block");
}

function hideInput(){
  const initial = document.getElementById("toki-initial");
  initial.setAttribute("style","display:none;");
  const langSelect = document.getElementById("lang-select");
  langSelect.setAttribute("style","display:inline-block;")
}

function startVocabulary(level){
  //Data
  document.getElementById("choose-section").setAttribute("style","display:none;");
  let box = document.getElementById("learning-box");
  box.innerHTML = '';
  box.setAttribute("style","display:inline-block");
  //DOM
  round++;
  let words;
  let trans;
  let trans_repo;

  if(user1.lang === 'fr-fr')
    trans_repo = trans_repo_french;
  else if(user1.lang === 'zh-cn')
    trans_repo = trans_repo_chinese;
  else if(user1.lang === 'pt-pt')
    trans_repo = trans_repo_pt;

  if(level===1){
    words = words_repo[0];
    trans = trans_repo[0];
  }
  else if(level===2){
    words = words_repo[1];
    trans = trans_repo[1];
  }
  else{
    words = words_repo[2];
    trans = trans_repo[2];
  }

  let ansBtn0 = document.createElement('button');
  ansBtn0.setAttribute("class","primary-btn");
  let ansBtn1 = document.createElement('button');
  ansBtn1.setAttribute("class","primary-btn");
  let ansBtn2 = document.createElement('button');
  ansBtn2.setAttribute("class","primary-btn");
  //Task
  if(round<=5){
    if(round!==1){
      box.innerHTML = '';
    }
    let correctAns = Math.floor(Math.random() * 3); //Random from 0 - 2
    let word = words[Math.floor(Math.random()*words.length)];
    let correctTrans = trans[words.indexOf(word)];
    console.log("Correct Answer:" +correctAns);
    console.log("Correct Translation:" +correctTrans);
    console.log("Word: "+word);
    headText.innerText = "What is this word in English?"
    pText.innerText = word;
    speak(word,'en-US');
    speak(correctTrans,user1.lang);
    if(correctAns===0){
      ansBtn0.innerHTML = correctTrans;
      ansBtn0.addEventListener("click",function (){rightAnswer();startVocabulary(level);})
      ansBtn1.innerHTML = trans[Math.floor(Math.random()*words.length)];
      while(ansBtn1.innerHTML === correctTrans)
        ansBtn1.innerHTML = trans[Math.floor(Math.random()*words.length)];
      ansBtn2.innerHTML = trans[Math.floor(Math.random()*words.length)];
      while(ansBtn2.innerHTML === correctTrans)
        ansBtn2.innerHTML = trans[Math.floor(Math.random()*words.length)];
      ansBtn1.addEventListener("click",function (){wrongAnswer();startVocabulary(level);});
      ansBtn2.addEventListener("click",function (){wrongAnswer();startVocabulary(level);});
      box.appendChild(ansBtn0);
      box.appendChild(ansBtn1);
      box.appendChild(ansBtn2);
    }
    if(correctAns===1){
      ansBtn1.innerHTML = correctTrans;
      ansBtn1.addEventListener("click",function (){rightAnswer();startVocabulary(level);})
      ansBtn0.innerHTML = trans[Math.floor(Math.random()*words.length)];
      while(ansBtn0.innerHTML === correctTrans)
        ansBtn0.innerHTML = trans[Math.floor(Math.random()*words.length)];
      ansBtn2.innerHTML = trans[Math.floor(Math.random()*words.length)];
      while(ansBtn2.innerHTML === correctTrans)
        ansBtn2.innerHTML = trans[Math.floor(Math.random()*words.length)];
      ansBtn0.addEventListener("click",function (){wrongAnswer();startVocabulary(level);});
      ansBtn2.addEventListener("click",function (){wrongAnswer();startVocabulary(level);});
      box.appendChild(ansBtn0);
      box.appendChild(ansBtn1);
      box.appendChild(ansBtn2);
    }
    if(correctAns===2){
      ansBtn2.innerHTML = correctTrans;
      ansBtn2.addEventListener("click",function (){rightAnswer();startVocabulary(level);})
      ansBtn1.innerHTML = trans[Math.floor(Math.random()*words.length)];
      while(ansBtn1.innerHTML === correctTrans)
        ansBtn1.innerHTML = trans[Math.floor(Math.random()*words.length)];
      ansBtn0.innerHTML = trans[Math.floor(Math.random()*words.length)];
      while(ansBtn0.innerHTML === correctTrans)
        ansBtn0.innerHTML = trans[Math.floor(Math.random()*words.length)];
      ansBtn1.addEventListener("click",function (){wrongAnswer();startVocabulary(level);});
      ansBtn0.addEventListener("click",function (){wrongAnswer();startVocabulary(level);});
      box.appendChild(ansBtn0);
      box.appendChild(ansBtn1);
      box.appendChild(ansBtn2);
    }


  }else{
    box.innerHTML = '';
    round = 0;
    endSection(scores);
    scores = 0;
    backToChooseSection();
  }
}

function rightAnswer(){
  mouth_type = 1;
  drawToki();
  speak("Answer correct!",'en-US');
  scores++;
}
function wrongAnswer(){
  mouth_type = 3;
  drawToki();
  speak("Wrong Answer!",'en-US');
}
function endSection(score){
  mouth_type = 2;
  drawToki();
  let msg = "You correctly answered " +score+" out of 5 questions!";
  alert(msg);
}
function backToChooseSection(){
  if(user1.lang === 'zh-cn'){
    headText.innerText = "中文是一门很有挑战的语言，继续学习吧！"
    pText.innerText = "Chinese is a challenging language, keep on it!"
  }else if(user1.lang === 'pt-pt'){
    headText.innerText = "O português é UMA língua Muito elegante, desejo-lhe um estudo feliz!"
    pText.innerText = "Portuguese is a romantic language, keep on it!"
  }
  document.getElementById("learning-box").setAttribute("style","display:none;");
  document.getElementById("start-to-learn").setAttribute("style","display:inline-block;");
}

let sentences = ["I love weekend!","I hate assignment.","I love programming.","Programming in Javascript and Python is fun.","This robot is cute.","I love drinking Latte.","The answer to the universe is 48."]

function goToSpeaking(){
  spoken=false;
  mouth_type = 2;
  drawToki();
  document.getElementById("start-to-learn").setAttribute("style","display:none;");
  let box = document.getElementById("learning-box");
  box.innerHTML = '';
  box.setAttribute("style","display:inline-block");

  headText.innerText = 'Follow what I said after I said "Your turn!"';

  let stopBtn = document.createElement("button");
  stopBtn.setAttribute("class","primary-btn");
  stopBtn.innerText = 'Back';
  stopBtn.addEventListener("click", backToChooseSection);
  box.appendChild(stopBtn);

  let pracBtn = document.createElement("button");
  pracBtn.setAttribute("class","primary-btn");
  pracBtn.setAttribute("id","media-btn");
  pracBtn.innerText = 'Practice Aloud';
  pracBtn.addEventListener("click", listen);
  box.appendChild(pracBtn);

  let nextBtn = document.createElement("button");
  nextBtn.setAttribute("class","primary-btn");
  nextBtn.innerText = 'Next Sentence';
  nextBtn.addEventListener("click", goToSpeaking);
  box.appendChild(nextBtn);

  translate(sentences[Math.floor(Math.random()*sentences.length)]);
}

let clicked = false;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
let context;
function listen(){
  if (!clicked) {
    clicked = !clicked;
    document.getElementById("media-btn").innerText = "Stop Recording";
    context = new AudioContext();
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio:true })
        .then(handleUserMediaSuccess)
        .catch(handleUserMediaError);
    }
  } else {
    clicked = !clicked;
    console.log("Click");
    document.getElementById("media-btn").innerText = "Practice";
    mediaStreamSource.disconnect(scriptProcessor);
    scriptProcessor.disconnect(context.destination);
  }
}

function handleUserMediaError(error) {
  console.log(error);
}

function handleUserMediaSuccess(stream) {
  console.log("Audio success");
  mediaStreamSource = context.createMediaStreamSource(stream);
  scriptProcessor = context.createScriptProcessor(4096,1,1);
  mediaStreamSource.connect(scriptProcessor);
  scriptProcessor.connect(context.destination);
  scriptProcessor.onaudioprocess = function(e) {
    let buffer = e.inputBuffer.getChannelData(0);
    let max = Math.max.apply(Math, buffer);
    console.log("Max Volume "+max);
    if(max >= 0.6 && spoken===false){
      spoken = true;
      speakingJudge();
    }
  };
  mediaStreamSource.onend = function (){
   mediaStreamSource.disconnect(scriptProcessor);
   scriptProcessor.disconnect(context.destination);
  }

}

async function speakingJudge(){
    headText.innerText = "You did great! " + user1.name + " Let's continue!";
    await sleep(2200);
    speak(headText.innerText,'en');
    mouth_type = 1;
    drawToki();
}

function translate(sen){
  const baseUrl = "https://translation.googleapis.com/language/translate/v2"
  const mayasAPIKey = "AIzaSyBXLEjsx7WG-RR7iB2D_GeZKcur1HPkSE0";
  let url = baseUrl + "?key="+mayasAPIKey;
  pText.innerText = sen;
  // Translate
  let targetLang;
  if(user1.lang === 'pt-pt')
    targetLang = 'pt';
  else if(user1.lang === 'zh-cn')
    targetLang = 'zh';
  else if(user1.lang === 'fr-fr')
    targetLang = 'fr';
  let params = {
    "q": sen,
    "source":"en",
    "target": targetLang,
    "format":"text"
  };
  ajaxRequest("POST", url, handleTranslate, JSON.stringify(params));
}

function handleTranslate(){
  if (successfulRequest(this)) {
    let data = JSON.parse(this.responseText);
    trans_result = data.data.translations[0].translatedText;
    pText.innerText = pText.innerText + '\n' + trans_result;
    speak(trans_result+" Your turn.", user1.lang);
  }
  else {
    console.log("Ready state: " + this.readyState);
    console.log("Status: " + this.status);
    console.log("Status text: " + this.statusText);
  }
}

function ajaxRequest(method, url, handlerFunction, content) {
  const xhttp = new XMLHttpRequest();
  xhttp.open(method, url);
  xhttp.onreadystatechange = handlerFunction;
  if (method === "POST") {
    xhttp.setRequestHeader("Content-Type","application/json");
    xhttp.send(content);
  }
  else {
    xhttp.send();
  }
}
function successfulRequest(request) {
  return request.readyState === 4 && request.status === 200;
}

//DRAW
function drawToki() {
  let canvas = document.getElementById("face_canvas").getContext("2d");
  //draw eyes
  canvas.beginPath();
  canvas.arc(235,162,112, 0,(360 * Math.PI) / 180);
  canvas.arc(565,162,112, 0,(360 * Math.PI) / 180);
  canvas.fillStyle = "#ffffff";
  canvas.fill();
  //draw pupils
  canvas.beginPath();
  canvas.arc(pupil_x, pupil_y, pupil_size, 0,(360 * Math.PI) / 180);
  canvas.arc(pupil_x+330, pupil_y, pupil_size, 0,(360 * Math.PI) / 180);
  canvas.fillStyle = "#000000";
  canvas.fill();
  //draw pupil highlight
  canvas.beginPath();
  canvas.arc(pupil_x-25, pupil_y-25, 15, 0,(360 * Math.PI) / 180);
  canvas.arc(pupil_x+305, pupil_y-25, 15, 0,(360 * Math.PI) / 180);
  canvas.fillStyle = "#ffffff";
  canvas.fill();
  //draw mouths
  drawmouth(mouth_type);
  function drawmouth(type){ //1 for open&smile, 2 for shut, 3 for sad
    canvas.beginPath();
    canvas.rect(300,260,200,100);
    canvas.fillStyle = "#A0D1A5";
    canvas.fill();
    canvas.beginPath();
    if(type===1){
      canvas.moveTo(308,313);
      canvas.bezierCurveTo(308,363,493,363,493,313);
      canvas.closePath()
      canvas.fillStyle="#ffffff";
      canvas.fill();
    }
    if(type===2){
      canvas.moveTo(308,313);
      canvas.bezierCurveTo(308,333,493,333,493,313);
      canvas.lineWidth = 8;
      canvas.strokeStyle = '#ffffff';
      canvas.stroke();
    }
    if (type===3){
      canvas.moveTo(308,313);
      canvas.bezierCurveTo(308,293,493,293,493,313);
      canvas.lineWidth = 8;
      canvas.strokeStyle = '#ffffff';
      canvas.stroke();
    }
  }
}

let myInterval = window.setInterval(function (){blink();},blink_time)
function blink(){
  blink_time = Math.floor((Math.random()*2000)+2000);
  pupil_size = 0;
  drawToki();
  pupil_size = 50;
  let myFunc = setTimeout(drawToki,200);
}

async function pupilTurn(t){
  for(let times = 0;times<60;times++){
    await sleep(t);
    let hudu = (2 * Math.PI / 360) * 6 * times;
    pupil_x = 235 + Math.sin(hudu) * 24;
    pupil_y = 162 - Math.cos(hudu) * 24;
    drawToki();//  注意此处是“-”号，因为我们要得到的Y是相对于（0,0）而言的。
  }
  pupil_x = 235;
  pupil_y = 162;
  drawToki();
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

//SPEAK
function speak(text, lang) {
  /*Check that your browser supports text to speech*/
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance();
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // console.log("Your browser supports " + voices.length + " voices");
      // console.log(voices);
      msg.voice = voices.filter(function(voice) { return voice.lang === lang; })[1];
    }
    msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.rate = 1.0; // 0.1 to 10
    msg.pitch = 2; //0 to 2
    msg.text = text;
    msg.lang = lang;
    msg.onend = function(e) {
      console.log('Speaking finished in ' + e.elapsedTime + ' milliseconds.');
    };
    speechSynthesis.speak(msg);
  }
}

function speakConversationBox(){
  const textBox = document.getElementById("conversation-box");
  const text = textBox.innerText;
  speak(text,'en-US');
}

//Face Recognitio
const minConfidence = 0.8;
let video = document.getElementById("myVideo");

function initialVideo(){
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(handleUserVideoSuccess)
      .catch(handleUserVideoError);
  }
  document.getElementById("video-container").setAttribute("style","display:none;")
}
let faceMatcher;
async function loadFaceapi(){
  console.log("Loading faceapi")
  await faceapi.nets.tinyFaceDetector.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
  await faceapi.nets.faceRecognitionNet.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
  await faceapi.nets.faceLandmark68Net.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
  await faceapi.nets.faceLandmark68TinyNet.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
  await faceapi.nets.ssdMobilenetv1.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
  await faceapi.nets.tinyFaceDetector.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
  await faceapi.nets.mtcnn.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
  console.log("Faceapi Loaded");

  const img = new Image();
  img.setAttribute("crossOrigin", "anonymous");
  img.src = 'https://img.oh-eureka.com/pics/2020-12-16-test.jpg';
  results = await faceapi
    .detectAllFaces(img)
    .withFaceLandmarks()
    .withFaceDescriptors();
  if (!results.length) {
    console.log("face not in");
    return;
  }
  faceMatcher = new faceapi.FaceMatcher(results);
  console.log("face in");
}

function handleUserVideoSuccess(stream){
  video.srcObject = stream;
  window.setInterval(captureImageFromVideo, 50);
  window.setInterval(detect,2000);
}
function handleUserVideoError(e){
  console.log(e);
}
function captureImageFromVideo(){
  let canvas = document.getElementById("videoCanvas");
  let context = canvas.getContext('2d');
  canvas.setAttribute("width", video.width);
  canvas.setAttribute("height", video.height);
  context.drawImage(video, 0, 0, video.width, video.height);
}

async function detect(){
  const detections = await faceapi.detectAllFaces(video);
  console.log(detections);

  if(detections.length === 0){
    document.getElementById("pop-text").innerText = 'The user is not here..\n Come back to me!';
    document.getElementById("popUp").setAttribute("style","display:flex;");
  }
  if(detections.length){
    const singleResult = await faceapi
      .detectSingleFace(video)
      .withFaceLandmarks()
      .withFaceDescriptor();
    if (singleResult) {
      const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor);
      console.log(bestMatch);
      if(bestMatch.label==='person 1'){
        document.getElementById("popUp").setAttribute("style","display:none;");
      }
      else {
        document.getElementById("pop-text").innerText = 'You are not ' + user1.name +'!';
        document.getElementById("popUp").setAttribute("style","display:flex;");
      }
    }
  }
}

