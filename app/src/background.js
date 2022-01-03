var mutationIdx = 0;
const MUTATION_UPDATE_STEP = 3;
const FIRST_CHILD_DESC_ID = 'ytantitranslate_desc_div';

function makeHttpObject() {
    try {return new XMLHttpRequest();}
    catch (error) {}
    try {return new ActiveXObject("Msxml2.XMLHTTP");}
    catch (error) {}
    try {return new ActiveXObject("Microsoft.XMLHTTP");}
    catch (error) {}
  
    throw new Error("Could not create HTTP request object.");
}

function makeLinksClickable(html) {
    return html.replace(/(https?:\/\/[^\s]+)/g, "<a rel='nofollow' target='_blank' dir='auto' class='yt-simple-endpoint style-scope yt-formatted-string' href='$1'>$1</a>");
}

function get(url, callback) {
    var request = makeHttpObject();
    request.open("GET", url, true);
    request.send(null);
    request.onreadystatechange = function() {
    if (request.readyState == 4)
        callback(request);
    };
}

function trimYoutube(title) {
    return title.replace(/ - YouTube$/, '');
}
function untranslateVideoDescription(ytInitialPlayerResponse){ //code moved from untranslateCurrentVideo
//Attempt to fix the description is not translated to the original language bug (the video title is translated)
 //in Chrome, window.ytInitialPlayerResponse is defined when the untranslateCurrentVideo runs,
 // in Firefox, not when it runs, leeading to console.log("ytInitialPlayerResponse is undefined")
 // when I paste window.ytInitialPlayerResponse in the Firefox Developer Console, the object is defined and prints out some properties and text
 // thus the consclusion is that for the description to be translated, this function needs to be called later, after the window.ytInitialPlayerResponse object is defined by YouTube
 let translatedDescription = document.querySelector("#description > yt-formatted-string");
    let realDescription = null;
    let realTitle = document.querySelector("#container > h1 > yt-formatted-string").textContent; //from untranslateCurrentVideo, right before this function untranslateVideoDescription is called

    // For description, try ytInitialPlayerResponse object Youtube creates whenever you open video page, if it is for this video
    if (ytInitialPlayerResponse){
        ytInitialPlayerResponse
        if (ytInitialPlayerResponse.videoDetails && ytInitialPlayerResponse.videoDetails.title === realTitle) {
        realDescription = ytInitialPlayerResponse.videoDetails.shortDescription;
        } else {
            if (translatedDescription.firstChild.id === FIRST_CHILD_DESC_ID) {
                translatedDescription.removeChild(translatedDescription.firstChild);
            }
        }

        if (realDescription) {
            var div = document.createElement('div');
            div.innerHTML = makeLinksClickable(realDescription) + "\n\n<b>TRANSLATED (added by <a class='yt-simple-endpoint style-scope yt-formatted-string' href='https://chrome.google.com/webstore/detail/youtube-anti-translate/ndpmhjnlfkgfalaieeneneenijondgag?hl=ru'>Youtube Anti Translate</a>):</b>\n";
            div.id = FIRST_CHILD_DESC_ID;
            translatedDescription.insertBefore(div, translatedDescription.firstChild);
        }
            //if window.ytInitialPlayerResponse is defined
        //clearInterval(Yt_InitialPlayer_Response_Loaded);
           
    }else{
        console.log("ytInitialPlayerResponse is undefined"); //easy debugging and unnoticeable for users
    } 


    
 // 

}
var Yt_InitialPlayer_Response_Loaded;
function untranslateCurrentVideo() {
    let translatedTitleElement = document.querySelector("#container > h1 > yt-formatted-string");
    let realTitle = null;

    // title link approach
    // if (document.querySelector(".ytp-title-link")) {
    //     realTitle = document.querySelector(".ytp-title-link").innerText;
    // } else
    // document title approach
    if (document.title) {
        realTitle = trimYoutube(document.title);
    } else if (document.querySelector('meta[name="title"]')) {
        realTitle = document.querySelector('meta[name="title"]').content;
    }

    if (!realTitle || !translatedTitleElement) {
        // Do nothing if video is not loaded yet
        return;
    }

    if (realTitle === translatedTitleElement.innerText) {
        // Do not revert already original videos
        return;
    }

    translatedTitleElement.textContent = realTitle;

    //Yt_InitialPlayer_Response_Loaded = setInterval(untranslateVideoDescription, 1000); for some reason this does not work
    //aha, I know, CONTENT SCRIPTS DONT HAVE ACCESS TO PAGE VARIABLES! 
    //https://stackoverflow.com/questions/3955803/chrome-extension-get-page-variables-in-content-script

    if(document.location.pathname != "/" && !document.location.pathname.startsWith("/channel")){

        Yt_InitialPlayer_Response_Loaded = setInterval(function(){
        let windowData  = new ExtractPageVariable('ytInitialPlayerResponse').data;
        windowData.then(pageVar => {
            console.log("pageVar.ytInitialPlayerResponse", pageVar.ytInitialPlayerResponse);
            console.log("pageVar", pageVar);
            if(pageVar.ytInitialPlayerResponse){ //window.ytInitialPlayerResponse is defined
                console.log("pageVar", pageVar.ytInitialPlayerResponse);
                untranslateVideoDescription(pageVar.ytInitialPlayerResponse);
                clearInterval(Yt_InitialPlayer_Response_Loaded); //untranslateVideoDescription is synchronous
            }
        }, 1000);
        });
    }
   
}

function untranslateOtherVideos() {
    if(document.location.pathname != "/"){ //the original code of untranslateOtherVideos works everywhere except the YouTube Homepage in Firefox
        function untranslateArray(otherVideos) {
       
            for (let i = 0; i < otherVideos.length; i++) {
                let video = otherVideos[i];
                let videoId = video.querySelector('#thumbnail').href;
                if ((!video.untranslatedByExtension) || (video.untranslatedKey !== videoId)) { // do not request same video multiply times
                    let href = video.querySelector('a');
                    video.untranslatedByExtension = true;
                    video.untranslatedKey = videoId;
                    get('https://www.youtube.com/oembed?url=' + href.href, function (response) {
                        const title = JSON.parse(response.responseText).title;
                        video.querySelector('#video-title').innerText = title;
                    });
                }
            }
        }
        let compactVideos = document.getElementsByTagName('ytd-compact-video-renderer');    // related videos
        let normalVideos = document.getElementsByTagName('ytd-video-renderer');             // channel page videos
        let gridVideos = document.getElementsByTagName('ytd-grid-video-renderer');          // grid page videos
        
        untranslateArray(compactVideos);
        untranslateArray(normalVideos);
        untranslateArray(gridVideos);
    }else{
        //the YouTUBE homepage code

        function untranslateArray2(otherVideos) {
            for (let i = 0; i < otherVideos.length; i++) {
                let video = otherVideos[i];
                let videoId = video.href; //video is an <a> element, href is the relative path for example "/watch?v=-cABBWfRqms" (like the location.href.pathname) //
                if ((!video.untranslatedByExtension) || (video.untranslatedKey !== videoId)) { // do not request same video multiply times
                    let href = video.querySelector('a');
                    video.untranslatedByExtension = true; //I feel like this should be saved somewhere
                    video.untranslatedKey = videoId;
                    get('https://www.youtube.com/oembed?url=' + videoId, function (response) { //href.href
                        const title = JSON.parse(response.responseText).title;
                        video.querySelector('#video-title').innerText = title; //interestlingly this part works, it got the original title of a Pewds video
                    });
                }
            }
        }

        let compactVideosList = document.getElementsByClassName("yt-simple-endpoint style-scope ytd-rich-grid-media");
        let compactVideos = [];
        for(var x = 0; x < compactVideosList.length; x++){
            if(x % 2 == 1){
                compactVideos.push(compactVideosList[x]); //the odd <a> elements in compactVideosList are for videos
            }
        }
        untranslateArray2(compactVideos);
    }
}

function untranslate() {
    if (mutationIdx % MUTATION_UPDATE_STEP == 0) {
        untranslateCurrentVideo();
        untranslateOtherVideos();
    }
    mutationIdx++;
}

function run() {
    // Change current video title and description
    // Using MutationObserver as we can't exactly know the moment when YT js will load video title
    let target = document.body;
    let config = { childList: true, subtree: true };
    let observer = new MutationObserver(untranslate);
    observer.observe(target, config);
    // setInterval(untranslate, 100);
}
chrome.storage.sync.get({
    disabled: false
}, function (items) {
    if (!items.disabled) {
        // I moved the code from start.js for the following reasons:

        // the start.js (1.4.8 addon release) file did not inject the background.js reliably (tested in Firefox Nightly 97) (I saw the start.js in debugger, but the background js file did not appear to be running (translating video titles) on Youtube, 
        //interestingly, when I pasted the version 1.4.8 background js code in the Firefox developer console, it worked)
        //this way (making backround.js a content script, not injecting it programatically) actually works, but https://stackoverflow.com/questions/3955803/chrome-extension-get-page-variables-in-content-script


        // here so the script is defined on all YT pages, where it can the run after the user clicks the button, without reloading the page
        //when this runs (this is the same code which was in start.js, but there the background.js script was injected in the page),
        //the code is ran the same way, as the run() statement was previously called right after the script was loaded (it was outside function defintions)
        //even though the run() function checks for the video title being loaded it doesn't check for the window.ytInitialPlayerResponse object to be defined,
        //thus causing the translated video descriptions with original video titles in Firefox
        run(); 
    }
});

browser.runtime.onMessage.addListener((message => {
    console.log(message);
    console.log(typeof(message));
    console.log("s", String(message));
    if(message == "Enable"){ //message.greeting
        
       untranslateCurrentVideo();
       untranslateOtherVideos();
    }
}));

class ExtractPageVariable { //https://stackoverflow.com/questions/3955803/chrome-extension-get-page-variables-in-content-script
  constructor(variableName) {
    this._variableName = variableName;
    this._handShake = this._generateHandshake();
    this._inject();
    this._data = this._listen();
  }

  get data() {
    return this._data;
  }

  // Private

  _generateHandshake() {
    const array = new Uint32Array(5);
    return window.crypto.getRandomValues(array).toString();
  }

  _inject() {
    function propagateVariable(handShake, variableName) {
      const message = { handShake };
      message[variableName] = window[variableName];
      window.postMessage(message, "*");
    }

    const script = `( ${propagateVariable.toString()} )('${this._handShake}', '${this._variableName}');`
    const scriptTag = document.createElement('script');
    const scriptBody = document.createTextNode(script);

    scriptTag.id = 'chromeExtensionDataPropagator';
    scriptTag.appendChild(scriptBody);
    document.body.append(scriptTag);
  }

  _listen() {
    return new Promise(resolve => {
      window.addEventListener("message", ({data}) => {
        // We only accept messages from ourselves
        if (data.handShake != this._handShake) return;
        resolve(data);
      }, false);
    })
  }
}

// const windowData = new ExtractPageVariable('somePageVariable').data;
// windowData.then(console.log);
// windowData.then(data => {
//    // Do work here
// });
