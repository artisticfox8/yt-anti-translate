# YouTube Anti Translate
Source code of [YouTube Anti Translate](https://addons.mozilla.org/en-US/firefox/addon/youtube-anti-translate/?utm_source=github) for Firefox. Forked from https://github.com/zpix1/yt-anti-translate

This fork for Firefox includes a number of Firefox specific fixes, for that YouTube sends a different website HTML to Firefox and Chrome. Also the original idea of injecting the script to run in the page javascript namespace didn't work in Firefox reliably. That is why version 1.5 uses a different mechanism to get to the ytInitialPlayerResponse javascript object on YT. 
Original text:

I was annoyed by YouTube changing video titles to poorly user-translated versions, so I made this chrome extension to retrive original titles and change them back.

It is much easier to use than it's analogs (as [YoutubeAutotranslateCanceler](https://github.com/pcouy/YoutubeAutotranslateCanceler), because it does not require any YouTube API keys or addition userscript extensions).

## How to use
Just install it from firefox extensions store (https://addons.mozilla.org/en-US/firefox/addon/youtube-anti-translate/?utm_source=github).
