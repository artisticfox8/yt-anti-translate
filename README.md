# YouTube Anti Translate
Source code of [YouTube Anti Translate](https://addons.mozilla.org/en-US/firefox/addon/youtube-anti-translate/?utm_source=github) for Firefox. Forked from https://github.com/zpix1/yt-anti-translate

## Release Notes:
**Version 1.5.14**

1. Updates to CSS selectors to work with YouTube
2. Improves support for turning extension on and off without reloading the page (removes bugs)

This release incorporates fixes from NetStranger. Thanks!

**Version 1.5.7** mostly follows the upstream version, for example removes the description untranslation, because it was buggy.
It also adds support for turning the addon on and off without reloading.

This fork for Firefox used to include a number of Firefox specific fixes in version 1.5.2, because that YouTube sent a different website HTML to Firefox and Chrome. Also the original idea of injecting the script to run in the page javascript namespace didn't work in Firefox reliably. That is why version 1.5.2 used a different mechanism to get to the ytInitialPlayerResponse javascript object on YT. 

## Original text:

I was annoyed by YouTube changing video titles to poorly user-translated versions, so I made this chrome extension to retrive original titles and change them back.

It is much easier to use than it's analogs (as [YoutubeAutotranslateCanceler](https://github.com/pcouy/YoutubeAutotranslateCanceler), because it does not require any YouTube API keys or addition userscript extensions).

## How to use
Just install it from firefox extensions store (https://addons.mozilla.org/en-US/firefox/addon/youtube-anti-translate/?utm_source=github).

## DeArrow support
There were some complaints that the extension doesn't work with the DeArrow extension which also replaces video titles. 

The Chrome version "fixed" it by using `:not(.cbCustomTitle)` in their CSS selectors for video titles. Presumably to filter videos which are handled by DeArrow, and only untranslate videos where DeArrow didn't do anything. However, this approach doesn't really work.

As for any videos served with a title, which is then formatted by DeArrow, there may exist an untranslated title. And the Chrome YT Anti Translate extension sees that there is cbCustomTitle class element, which renders the visible title, and doesn't touch it.  

The fundamental question here is, *what title should take precedence?* 
1. The untranslated title from the original author (fetched by YT Anti Translate)?
2. The nicely formatted version (by DeArrow) of the translated (by YouTube) version of the original title?
