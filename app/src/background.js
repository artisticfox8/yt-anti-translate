var mutationIdx = 0;
const MUTATION_UPDATE_STEP = 2;
const FIRST_CHILD_DESC_ID = "ytantitranslate_desc_div";
const cache = new Map();
var registeredMutationObserver = false;
//True if the user requested to see the original translated titles sent by YouTube (turned the extension off)
var showOriginalTitlesRan = false;
//if the title and translated title are the same, this will be set to false, and the original title will be shown
let fakeTitleNeedsShowing = false;
const selector = "h1.ytd-watch-metadata > yt-formatted-string";
  
function translateArray(otherVideos) {
    showOriginalTitlesRan = true;
    console.log("[YoutubeAntiTranslate] translateArray ran");
    for (let i = 0; i < otherVideos.length; i++) {
        let video = otherVideos[i];
        console.log(video);

        let videoThumbnail = video.querySelector("a#thumbnail");

        let videoId = videoThumbnail.href;
        let href = video.querySelector("a");

        let originalTitle = video.querySelector("#video-title").title;
        console.log(originalTitle);
        //this line overwrites the title, but when the user toggles the state, enables the addon again, untranslateOtherVideos just skips the videos
        video.querySelector("#video-title").innerText = originalTitle;
        video.untranslatedByExtension = false;
    }
}

browser.runtime.onMessage.addListener(message => {
    console.log(message);
    console.error("Got a message", String(message), "registeredMutatinObserver", registeredMutationObserver); //just to make it easy to see in devtools
    
    if (message == "Enable") {
       console.error("[YoutubeAntiTranslate] Enabling");
       showOriginalTitlesRan = false;
       if (!registeredMutationObserver) {
            console.log(
                "[YoutubeAntiTranslate] Enabled, MutationObserver will be registered"
            );
            run(true);
       } else {
            console.log(
                "[YoutubeAntiTranslate] Enabled, MutationObserver already registered"
            );
            const statusObject = {};
            untranslateCurrentVideo(statusObject);
            untranslateOtherVideos();
            if (fakeTitleNeedsShowing) {
                makeFakeTitleNodeVisible();
            }
       }
       
    } else if (message == "Disable") {
        //show the original heading
        let translatedTitleElement = document.querySelector(selector);
        //TODO: why is cssText here?
        translatedTitleElement.style.cssText = "visibility:visible;display:inline";
        translatedTitleElement.style.visibility = "visible";
        translatedTitleElement.style.display = "inline";
        //set the tab title
        if (!["/watch", "/"].includes(document.location.pathname)) {
            let channelName = document.querySelector("yt-page-header-view-model").querySelector("h1").innerText;
            document.title = `${channelName} - YouTube`;
        } else {
            document.title = translatedTitleElement.innerText;
        }
        
        //hide the translated title
        hideFakeTitleNode();
        translateArray(document.querySelectorAll("ytd-video-renderer"));
        translateArray(document.querySelectorAll("ytd-rich-item-renderer"));
        translateArray(document.querySelectorAll("ytd-compact-video-renderer"));
        translateArray(document.querySelectorAll("ytd-grid-video-renderer"));
        translateArray(document.querySelectorAll("ytd-playlist-video-renderer"));
        translateChannelViewMainVideo();

        //experimental
        translateArray(document.querySelectorAll("ytd-playlist-panel-video-renderer"));
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
    return title.replace(/ - YouTube$/, "");
}

/*The purpose of this function over editing the video title directly is 
so the user can toggle the extension on and off without reloading the page
This element is shown, with our untranslated title.
When the user turns the extension off, this element is hidden, 
and the original title element is shown.  */
function setFakeTitleNode(text, afterNode) {
    const existingNode = document.getElementById("yt-anti-translate-fake-node");
    if (existingNode) {
        existingNode.textContent = text;
        return;
    }

    const node = document.createElement("span");
    node.className = "style-scope ytd-video-primary-info-renderer";
    node.id = "yt-anti-translate-fake-node";
    node.textContent = text;
    afterNode.after(node);
}

function makeFakeTitleNodeVisible() {
    //show our untranslated title
    console.log("[YoutubeAntiTranslate] making yt-anti-translate-fake-node visible")
    const fakeTitle = document.getElementById("yt-anti-translate-fake-node");
    if (fakeTitle) {
        fakeTitle.style.display = ""; //unsets display none
    }
    //and hide the original title
    const translatedTitleElement = document.querySelector(selector);
    translatedTitleElement.style.display = "none";
}

function hideFakeTitleNode() {
    //hide our untranslated title
    console.log("[YoutubeAntiTranslate] hide yt-anti-translate-fake-node")
    const fakeTitle = document.getElementById("yt-anti-translate-fake-node");
    //if we didn't check, there would be an error when accessing style
    if (fakeTitle) { 
        fakeTitle.style.display = "none"; //unsets display none
    }
}

function replaceAll(newTitle) {
    if (!newTitle) {
        // Do nothing if video is not loaded yet
        return;
    }

    const translatedTitleElement = document.querySelector(selector);

    document.title = document.title.replace(
        translatedTitleElement.textContent,
        newTitle
    );

    if (newTitle === translatedTitleElement.textContent) {
        // Do not revert already original videos
        fakeTitleNeedsShowing = false;
        return;
    }
    fakeTitleNeedsShowing = true;
    //WE WILL ONLY SET THE FAKE TITLE NODE (THE REAL TITLE WE'LL HIDE) => SO THE EXTENSION COULD SHOW THE OG TRANSLATED TITLE WHEN TURNED OFF
    //translatedTitleElement.textContent = newTitle;

    //if (translatedTitleElement.style.display === "none") {
    //    return;
    //}
  
    //basically we're hiding the original title
    //and calling setFakeTitleNode to create a fake title with the style of the original title string (using the same class name in css)
    //and the id of yt-anti-translate-fake-node to find it later
    //we only ever edit the fake title
    //(YouTube does not do full reloads, so just replacing the textContent of that fake title string with new titles (I think) )
    if (!showOriginalTitlesRan) {
        console.log("[YoutubeAntiTranslate] Setting main video title");
        translatedTitleElement.style.display = "none";
        console.log(
            `[YoutubeAntiTranslate] translated title from "${translatedTitleElement.textContent}" to "${newTitle}"`
        );
        setFakeTitleNode(newTitle, translatedTitleElement);
    }
}

function untranslateCurrentVideo(statusObject = null) {
    if (statusObject == null) {
        console.log("[YoutubeAntiTranslate] no context object");
        return;
    }

    if (statusObject["href"] != document.location.href) {
        console.log("[YoutubeAntiTranslate] url changed");
        statusObject["realTitle"] = null;
    }

    if (statusObject["realTitle"] == null) {
        if (statusObject["fetching"]) {
            console.log("[YoutubeAntiTranslate] fetch in progress");
            return;
        }
        statusObject["fetching"] = true;
        const docHref = document.location.href;
        statusObject["href"] = docHref;
        console.time("[YoutubeAntiTranslate] fetching");
        get(
            "https://www.youtube.com/oembed?url=" + docHref,
            function (response) {
                console.timeEnd("[YoutubeAntiTranslate] fetching");
                statusObject["fetching"] = false;
                console.log("[YoutubeAntiTranslate] fetch completed " + docHref);

                if (response.status !== 200) {
                    return;
                }
                if (document.location.href != docHref) {
                    console.log("[YoutubeAntiTranslate] fetched wrong url");
                    return;
                }

                const realTitle = JSON.parse(response.responseText).title;
                console.log(
                    `[YoutubeAntiTranslate] fetched real title: ${realTitle}`
                );
                statusObject["realTitle"] = realTitle;
                replaceAll(realTitle);
            }
        );
        return;
    }

    const realTitle = statusObject["realTitle"];
    replaceAll(realTitle);
}
//Example page https://www.youtube.com/@BeastReacts
function untranslateChannelViewMainVideo(){
    if (["/watch", "/"].includes(document.location.pathname)) {
        return;
    }
    let link = document.querySelector("ytd-channel-video-player-renderer").querySelector("yt-formatted-string#title>a"); //title next to video
    let videoPlayerTitle = document.querySelector("ytd-channel-video-player-renderer").querySelector(".ytp-title-link");
    get(
        "https://www.youtube.com/oembed?url=" + link.href,
        function (response) {
            if (response.status !== 200) {
                return;
            }
            const title = JSON.parse(response.responseText).title;
            const titleElement = link;
            if (title !== titleElement.innerText) {
                console.log(
                    `[YoutubeAntiTranslate] translated from "${titleElement.innerText}" to "${title}"`
                );
                if (titleElement) {
                    link.innerText = title;
                    videoPlayerTitle.innerText = title;
                }
            }
        }
    );    
}

function translateChannelViewMainVideo(){
    if (["/watch", "/"].includes(document.location.pathname)) {
        return;
    }
    let originalTitle =  document.querySelector("ytd-channel-video-player-renderer").querySelector("yt-formatted-string#title").title 
    let link = document.querySelector("ytd-channel-video-player-renderer").querySelector("yt-formatted-string#title>a"); //title next to video
    let videoPlayerTitle = document.querySelector("ytd-channel-video-player-renderer").querySelector(".ytp-title-link");
    link.innerText = originalTitle;
    videoPlayerTitle.innerText = originalTitle;
}

function untranslateOtherVideos() {
    console.log("[YoutubeAntiTranslate] entered untranslateOtherVideos");
    function untranslateArray(otherVideos) {
        console.log(`[YoutubeAntiTranslate] untranslateArray ${otherVideos.length} items`);
        for (let i = 0; i < otherVideos.length; i++) {
            let video = otherVideos[i];

            // video was deleted
            if (!video) {
                return;
            }

            let videoThumbnail = video.querySelector("a#thumbnail");

            // false positive result detected
            if (!videoThumbnail) {
                continue;
            }

            let videoId = videoThumbnail.href;

            if (
                !video.untranslatedByExtension ||
                video.untranslatedKey !== videoId
            ) {
                // do not request same video multiply times
                let href = video.querySelector("a");
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
                console.time("time fetch in otherVideos");
                get(
                    "https://www.youtube.com/oembed?url=" + href.href,
                    function (response) {
                        if (response.status !== 200) {
                            return;
                        }
                        console.timeEnd("time fetch in otherVideos");
                        const title = JSON.parse(response.responseText).title;
                        const titleElement = 
                            video.querySelector("#video-title");
                        if (title !== titleElement.innerText) {
                            console.log(
                                `[YoutubeAntiTranslate] translated from "${titleElement.innerText}" to "${title}"`
                            );
                            if (titleElement) {
                                video.querySelector("#video-title").innerText =
                                    title;
                            }
                        }
                    }
                );
            }
        }
    }

    untranslateArray(document.querySelectorAll("ytd-video-renderer"));
    untranslateArray(document.querySelectorAll("ytd-rich-item-renderer"));
    untranslateArray(document.querySelectorAll("ytd-compact-video-renderer"));
    untranslateArray(document.querySelectorAll("ytd-grid-video-renderer"));
    untranslateArray(document.querySelectorAll("ytd-playlist-video-renderer"));
    untranslateChannelViewMainVideo();
   
    //experimental
    untranslateArray(
        document.querySelectorAll("ytd-playlist-panel-video-renderer")
    );

    // let compactVideos = document.getElementsByTagName('ytd-compact-video-renderer');    // related videos
    // let normalVideos = document.getElementsByTagName('ytd-video-renderer');             // channel page videos
    // let gridVideos = document.getElementsByTagName('ytd-grid-video-renderer');          // grid page videos

    // untranslateArray(compactVideos);
    // untranslateArray(normalVideos);
    // untranslateArray(gridVideos);
}

function untranslate(statusObject) {
    if (!showOriginalTitlesRan) {
        if (mutationIdx % MUTATION_UPDATE_STEP == 0) {
            untranslateCurrentVideo(statusObject);
            untranslateOtherVideos();
        }
        mutationIdx++;
    }
}

function run(activatedFromPopup) {
    /*The user likely pressed the button when everything was loaded already 
    => the MutationObserver might not fire immediately */
    if (activatedFromPopup) {
        untranslate({});
        if (fakeTitleNeedsShowing) {
            makeFakeTitleNodeVisible();
        }
    }
    registeredMutationObserver = true;
    // Change current video title and description
    // Using MutationObserver as we can't exactly know the moment when YT js will load video title
    let target = document.body;
    let config = { childList: true, subtree: true };
    //currying function to pass a function with a parameter to MutationObserver 
    function makeFunc() {
        const statusObject = {};
        function baka() {
            untranslate(statusObject);
        }
        return baka;
    }
    let observer = new MutationObserver(makeFunc());
    observer.observe(target, config);
    
}
browser.storage.sync.get().then(data => {
    console.log(
        `[YoutubeAntiTranslate] Is extension disabled from browser storage: "${data.disabled}"`
    );
    if (data.disabled == undefined || data.disabled == false) {
      run(false);
    }
});
