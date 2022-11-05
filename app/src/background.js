var mutationIdx = 0;
const MUTATION_UPDATE_STEP = 2;
const FIRST_CHILD_DESC_ID = 'ytantitranslate_desc_div';
const cache = new Map();
var registeredMutationObserver = false;
var showOriginalTitlesRan = false;
  
function translateArray(otherVideos){
    showOriginalTitlesRan = true;
    console.log("translateArray ran");
    for (let i = 0; i < otherVideos.length; i++) {
        let video = otherVideos[i];
        console.log(video);

        let videoThumbnail = video.querySelector('a#thumbnail');

        let videoId = videoThumbnail.href;
        let href = video.querySelector('a');

        let originalTitle = video.querySelector("#video-title").title;
        console.log(originalTitle);
        //this line overwrites the title, but when the user toggles the state, enables the addon again, untranslateOtherVideos just skips the videos
        video.querySelector('#video-title').innerText = originalTitle;
        //SO
        //video.querySelector('#video-title').style.background = "red";
        video.untranslatedByExtension = false;
    }
}

browser.runtime.onMessage.addListener(message => {
    console.log(message);
    console.log(typeof(message));
    console.error("s", String(message)); //just to make it easy to see in devtools
    if(message == "Enable"){
       showOriginalTitlesRan = false;
       document.getElementById('yt-anti-translate-fake-node').style.display = "";
       const translatedTitleElement = document.querySelector("h1 > yt-formatted-string");
       translatedTitleElement.style.display = 'none';
       if(!registeredMutationObserver){
            run();
       }else{
            untranslateCurrentVideo();
            untranslateOtherVideos();
       }
    }else if(message == "Disable"){

        //show the original heading
        let translatedTitleElement = document.querySelector("h1 > yt-formatted-string");
        translatedTitleElement.style.cssText = "visibility:visible;display:inline"; //block
        translatedTitleElement.style.visibility = 'visible';
        translatedTitleElement.style.display = 'inline';
        //set the tab title
        document.title = translatedTitleElement.innerText;

        //hide the translated title
        document.getElementById('yt-anti-translate-fake-node').style.display = "none"; 
        
        translateArray(document.querySelectorAll('ytd-video-renderer'));
        translateArray(document.querySelectorAll('ytd-rich-item-renderer'));
        translateArray(document.querySelectorAll('ytd-compact-video-renderer'));
        translateArray(document.querySelectorAll('ytd-grid-video-renderer'));
        translateArray(document.querySelectorAll('ytd-playlist-video-renderer'));

        //experimental
        translateArray(document.querySelectorAll('ytd-playlist-panel-video-renderer'));
    }
});


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
    if (cache.has(url)) {
        callback(cache.get(url));
        return;
    }
    var request = makeHttpObject();
    request.open("GET", url, true);
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
            cache.set(url, request);
            callback(request);
        }
    };
}

function trimYoutube(title) {
    return title.replace(/ - YouTube$/, '');
}

function setTitleNode(text, afterNode) {
    if (document.getElementById('yt-anti-translate-fake-node')) {
        const node = document.getElementById('yt-anti-translate-fake-node');
        node.textContent = text;
        return;
    }

    const node = document.createElement('span');
    node.className = 'style-scope ytd-video-primary-info-renderer';
    node.id = 'yt-anti-translate-fake-node';
    node.textContent = text;
    afterNode.after(node);
}

function untranslateCurrentVideo() {
    const translatedTitleElement = document.querySelector("h1 > yt-formatted-string");

    // title link approach
    // if (document.querySelector(".ytp-title-link")) {
    //     realTitle = document.querySelector(".ytp-title-link").innerText;
    // } else
    // document title approach
    // title approach (does not work anymore)
    // if (document.title) {
    //     realTitle = trimYoutube(document.title);
    //     // remove notification counter
    //     realTitle = realTitle.replace(/^\(\d+\)/, '');
    // } else 
    // if (document.querySelector('meta[name="title"]')) {
    //     realTitle = document.querySelector('meta[name="title"]').content;
    // }


    //the first time it took about 1415ms (then 0-1ms (repeated calls because of MutationObserver))
    console.time("fetching"); 
    get('https://www.youtube.com/oembed?url=' + document.location.href, function (response) {
        console.timeEnd("fetching");
        //response looks like this BTW
        /*
       "title":"I found AMAZING loot from FISHING in Minecraft! - Part 23",
        "author_name":"PewDiePie",
        "author_url":"https://www.youtube.com/user/PewDiePie",
        "type":"video",
        "height":113,
        "width":200,
        "version":"1.0",
        "provider_name":"YouTube",
        "provider_url":"https://www.youtube.com/",
        "thumbnail_height":360,
        "thumbnail_width":480,
        "thumbnail_url":"https://i.ytimg.com/vi/qpLFWwo7tL0/hqdefault.jpg",
        "html":"\u003ciframe width=\u0022200\u0022 height=\u0022113\u0022 src=\u0022https://www.youtube.com/embed/qpLFWwo7tL0?feature=oembed\u0022 frameborder=\u00220\u0022 allow=\u0022accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\u0022 allowfullscreen title=\u0022I found AMAZING loot from FISHING in Minecraft! - Part 23\u0022\u003e\u003c/iframe\u003e"
        */
        //The first title paramater is used
        //the last html paramater can be used to construct an actual HTML video thumbnail.
        //the other info is just info to make a static preview, no video data is sent until you inject iframe encoded int the html parameter 
       
        if (response.status !== 200) {
            return;
        }
        
        const realTitle = JSON.parse(response.responseText).title;

        if (!realTitle || !translatedTitleElement) {
            // Do nothing if video is not loaded yet
            return;
        }
    
        document.title = document.title.replace(translatedTitleElement.textContent, realTitle);

        if (realTitle === translatedTitleElement.textContent) {
            // Do not revert already original videos
            return;
        }

        //authors comment: untranslate video by creating its copy

        //my comment: basically we're hiding the original title
        //and calling setTitleNode to create a fake title with the style of the original title string (using the same class name in css)
        
        //and the id of yt-anti-translate-fake-node to find it later
        //(YouTube does not do full reloads, so just replacing the textContent of that fake title string with new titles (I think) )
        if(!window.showOriginalTitlesRan){

            translatedTitleElement.style.display = 'none';
            console.log(`[YoutubeAntiTranslate] translated title to "${realTitle}"`);
            setTitleNode(realTitle, translatedTitleElement);

        }
        // translatedTitleElement.textContent = realTitle;
        // translatedTitleElement.removeAttribute('is-empty');
        // translatedTitleElement.untranslatedByExtension = true;
    });

    // disabled bugged description untranslation
    // const translatedDescriptions = [document.querySelector("#description .ytd-video-secondary-info-renderer"), document.getElementById('description-inline-expander')];

    // let realDescription = null;

    // // For description, try ytInitialPlayerResponse object Youtube creates whenever you open video page, if it is for this video
    // if (!window.ytInitialPlayerResponse) {
    //     return;
    // }

    // if (window.ytInitialPlayerResponse.videoDetails && window.ytInitialPlayerResponse.videoDetails.title === realTitle) {
    //     realDescription = window.ytInitialPlayerResponse.videoDetails.shortDescription;
    // } else {
    //     for (const translatedDescription of translatedDescriptions) {
    //         if (translatedDescription.firstChild.id === FIRST_CHILD_DESC_ID) {
    //             translatedDescription.removeChild(translatedDescription.firstChild);
    //         }
    //     }
    // }

    // console.log(realDescription, translatedDescriptions);

    // if (realDescription) {
    //     // for (const translatedDescription of translatedDescriptions) {
    //     //     const div = document.createElement('div');
    //     //     div.innerHTML = makeLinksClickable(realDescription) + "\n\n<b>TRANSLATED (added by <a class='yt-simple-endpoint style-scope yt-formatted-string' href='https://chrome.google.com/webstore/detail/youtube-anti-translate/ndpmhjnlfkgfalaieeneneenijondgag?hl=ru'>Youtube Anti Translate</a>):</b>\n";
    //     //     div.id = FIRST_CHILD_DESC_ID;
    //     //     translatedDescription.insertBefore(div, translatedDescription.firstChild);
    //     // }
    // }
}

function untranslateOtherVideos() {
    function untranslateArray(otherVideos) {
        for (let i = 0; i < otherVideos.length; i++) {
            let video = otherVideos[i];

            // video was deleted
            if (!video) {
                return;
            }

            let videoThumbnail = video.querySelector('a#thumbnail');

            // false positive result detected
            if (!videoThumbnail) {
                continue;
            }

            let videoId = videoThumbnail.href;

            if ((!video.untranslatedByExtension) || (video.untranslatedKey !== videoId)) { // do not request same video multiply times
                let href = video.querySelector('a');
                //relevant part the markup of in that video element looks like this

                /*
                <a class="yt-simple-endpoint style-scope ytd-compact-video-renderer" rel="nofollow" href="/watch?v=3Ag0BzLkaD4">
                <h3 class="style-scope ytd-compact-video-renderer">
                  <ytd-badge-supported-renderer class="top-badge style-scope ytd-compact-video-renderer" collection-truncate="" disable-upgrade="" hidden="">
                  </ytd-badge-supported-renderer>

                  <span id="video-title" class="style-scope ytd-compact-video-renderer" aria-label="Я нашел КРАЙ Майнкрафта! Автор: PewDiePie 3 года назад 27 минут 22&nbsp;185&nbsp;726 просмотров" title="Я нашел КРАЙ Майнкрафта!">I found the END of Minecraft! - Part 18</span>
                
                </h3>
                */

                //we get the video URL for the get('https://www.youtube.com/oembed?url=') function to  find the video's right title =  from the <a> element, from its href attribute
                //to show that to the user, we then modify the <span id="video-title"> element's innerText

                //The title attribute of <span id="video-title"> stays unchanged, we can use that for enabling / disabling the addon 

                video.untranslatedByExtension = true;
                video.untranslatedKey = videoId;
                
                //same method to get video title as in untranslateCurrentVideo
                //average time for get('https://www.youtube.com/oembed?url=' + href.href) is around 54ms in 23runs
                console.time("time fetch in otherVideos")
                get('https://www.youtube.com/oembed?url=' + href.href, function (response) {
                    if (response.status !== 200) {
                        return;
                    }
                    console.timeEnd("time fetch in otherVideos")
                    const title = JSON.parse(response.responseText).title;
                    const titleElement = video.querySelector('#video-title');
                    if (title !== titleElement.innerText) {
                        console.log(`[YoutubeAntiTranslate] translated from "${titleElement.innerText}" to "${title}"`);
                        if (titleElement) {
                            video.querySelector('#video-title').innerText = title;
                        }
                    }
                });
            }
        }
    }

    untranslateArray(document.querySelectorAll('ytd-video-renderer'));
    untranslateArray(document.querySelectorAll('ytd-rich-item-renderer'));
    untranslateArray(document.querySelectorAll('ytd-compact-video-renderer'));
    untranslateArray(document.querySelectorAll('ytd-grid-video-renderer'));
    untranslateArray(document.querySelectorAll('ytd-playlist-video-renderer'));

    //experimental
    untranslateArray(document.querySelectorAll('ytd-playlist-panel-video-renderer'));


    // let compactVideos = document.getElementsByTagName('ytd-compact-video-renderer');    // related videos
    // let normalVideos = document.getElementsByTagName('ytd-video-renderer');             // channel page videos
    // let gridVideos = document.getElementsByTagName('ytd-grid-video-renderer');          // grid page videos
    
    // untranslateArray(compactVideos);
    // untranslateArray(normalVideos);
    // untranslateArray(gridVideos);
}

function untranslate() {
    if(!showOriginalTitlesRan){
        if (mutationIdx % MUTATION_UPDATE_STEP == 0) {
            untranslateCurrentVideo();
            untranslateOtherVideos();
        }
        mutationIdx++;
    }
}

function run() {
    registeredMutationObserver = true
    // Change current video title and description
    // Using MutationObserver as we can't exactly know the moment when YT js will load video title
    let target = document.body;
    let config = { childList: true, subtree: true };
    let observer = new MutationObserver(untranslate);
    observer.observe(target, config);
    // setInterval(untranslate, 100);
}
browser.storage.sync.get().then(data =>{
    console.log(data.disabled)
    if(data.disabled == undefined || data.disabled == false){ //data.disabled !== undefined && data.disabled == false
      run();
    }
});
