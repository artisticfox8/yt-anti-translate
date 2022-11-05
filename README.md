# YouTube Anti Translate
Source code of [YouTube Anti Translate](https://addons.mozilla.org/en-US/firefox/addon/youtube-anti-translate/?utm_source=github) for Firefox. Forked from https://github.com/zpix1/yt-anti-translate

**Release Notes:** Version 1.5.7 mostly follows the upstream version, for example removes the description untranslation, because it was buggy.
It also adds support for turning the addon on and off without reloading.

This fork for Firefox used to include a number of Firefox specific fixes in version 1.5.2, because that YouTube sent a different website HTML to Firefox and Chrome. Also the original idea of injecting the script to run in the page javascript namespace didn't work in Firefox reliably. That is why version 1.5.2 used a different mechanism to get to the ytInitialPlayerResponse javascript object on YT. 
Original text:

I was annoyed by YouTube changing video titles to poorly user-translated versions, so I made this chrome extension to retrive original titles and change them back.

It is much easier to use than it's analogs (as [YoutubeAutotranslateCanceler](https://github.com/pcouy/YoutubeAutotranslateCanceler), because it does not require any YouTube API keys or addition userscript extensions).

## How to use
Just install it from firefox extensions store (https://addons.mozilla.org/en-US/firefox/addon/youtube-anti-translate/?utm_source=github).
