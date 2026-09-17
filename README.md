# YouTube Anti Translate
Source code of [YouTube Anti Translate](https://addons.mozilla.org/en-US/firefox/addon/youtube-anti-translate/?utm_source=github) for Firefox. Forked from https://github.com/zpix1/yt-anti-translate

## Release Notes:

### Version 1.20.5

- sync with Chrome version, all changes between 1.19.12 and 1.20.5

### Version 1.19.12

#### Fixed
- [#122](https://github.com/zpix1/yt-anti-translate/issues/122) YouTube classes change

##### From 1.19.11
- [#117](https://github.com/zpix1/yt-anti-translate/issues/117) Untranslate channel branding unicode issue

### Version 1.19.10

#### New Feature

- [#105](https://github.com/zpix1/yt-anti-translate/issues/105) Untranslate channel names on Collaborators pop-up

#### Fixed

- Fix [#106](https://github.com/zpix1/yt-anti-translate/issues/106) document title doesn't get untranslated when tab is backgrounded
- Fix [#109](https://github.com/zpix1/yt-anti-translate/issues/109) issues with videos which are part of playlists, in video suggestions next to the video 
- Fix [#108](https://github.com/zpix1/yt-anti-translate/issues/108) issues with title untranslating without player available

### Version 1.19.9.1

#### New Features:

- Mobile audio untranslation

#### Fixes:

- Fix [#101](https://github.com/zpix1/yt-anti-translate/issues/101) Video titles untranslation is slow and sequential

#### And all fixes from 1.19.5, 1.19.6, 1.19.7, 1.19.8:

- Fix [#84](https://github.com/zpix1/yt-anti-translate/issues/84) Channel titles in search are not always correctly untranslated
- Fix [#85](https://github.com/zpix1/yt-anti-translate/issues/85) Video Titles inside of a Playlist are not untranslated on mobile
- Fix [#86](https://github.com/zpix1/yt-anti-translate/issues/86) Channel Featured video title not untranslated on Mobile
- Fix [#88](https://github.com/zpix1/yt-anti-translate/issues/88) Channel name above description not untranslated on Mobile
- Fix issue where mobile description could be "untranslated" as the currently playing advert

- Fix [#91](https://github.com/zpix1/yt-anti-translate/issues/91) Chapter untranslation not always working

- Fix [#97](https://github.com/zpix1/yt-anti-translate/issues/97) video titles are not translated when oembed replies 401 on restricted video


### Version 1.19.4

#### New features:

- Chapters untranslation
- Option to only untranslate AI-dubbed audio
- Initial m.youtube.com support
- Notification untranslation

#### Fixes:

- Fix [#78](https://github.com/zpix1/yt-anti-translate/issues/78) Handles with dots or unicode are incorrectly untranslated
- Fix [#80](https://github.com/zpix1/yt-anti-translate/issues/80) Chapter descriptions are gone when you mouse over the search bar

#### And all fixes from Chrome releases 1.19.2 and 1.19.3 earlier this week

- Fix notification untranslation not working due to a typo, and add handle for ':'
- Fix [#73](https://github.com/zpix1/yt-anti-translate/issues/73) Video Chapters repeating
- Fix [#68](https://github.com/zpix1/yt-anti-translate/issues/68) Anti-translation does not work on embedded URLs
- Fix [#67](https://github.com/zpix1/yt-anti-translate/issues/67) Titles in playlists are not untranslated
- Fix [#40](https://github.com/zpix1/yt-anti-translate/issues/40) Performance issues
- Fix [#63](https://github.com/zpix1/yt-anti-translate/issues/63) Album names wrongly replaced in the Releases section of music channels

### Version 1.18.4

- Fix [#60](https://github.com/zpix1/yt-anti-translate/issues/60) Titles of playlists changed to the title of the first video on them

Also brought some fixes from Chrome 1.18.3 version:

- Fix compatibility with "Clickbait Remover for YouTube" for their "How to format titles" feature ([#41](https://github.com/zpix1/yt-anti-translate/issues/41))

- Fix 404 on advertisement videos ([#48](https://github.com/zpix1/yt-anti-translate/issues/48))

- Fix some issues in viewport/intersect logic

- Fix channel branding header description not untranslating when window was smaller than 528px width

- Fix videos in watch suggestions not untranslated by adding a new selector "yt-lockup-view-model" and way to handle it

- Fix bug #49 - reload current page only if is youtube.com


### Version 1.18.3

- I Fixed main video title not being translated when navigating to YouTube from Google search results ([#45](https://github.com/zpix1/yt-anti-translate/issues/45))

### Version 1.18.2
#### This long awaited update enables YouTube's translations to be removed from:
- automatically dubbed audio tracks of videos 
- video descriptions

Also support on a channel's page was improved, now the channel name there is not translated (= YouTube Channel Branding Header and About untranslation).

Switches to Manifest V3. 

The instant on/off toggle without full page reload was removed for now, but may get added again, if there is interest.

Incorporates fixes from namakeingo and his MV3 version. Thanks!

### Version 1.5.14

1. Updates to CSS selectors to work with YouTube
2. Improves support for turning extension on and off without reloading the page (removes bugs)

This release incorporates fixes from NetStranger. Thanks!

### Version 1.5.7

Mostly follows the upstream version, for example removes the description untranslation, because it was buggy.
It also adds support for turning the addon on and off without reloading.

This fork for Firefox used to include a number of Firefox specific fixes in version 1.5.2, because that YouTube sent a different website HTML to Firefox and Chrome. Also the original idea of injecting the script to run in the page javascript namespace didn't work in Firefox reliably. That is why version 1.5.2 used a different mechanism to get to the ytInitialPlayerResponse javascript object on YT. 

## Original text:

All the people involved were annoyed by YouTube changing video titles to poorly user-translated versions. While it might be useful if you do not know the language, it quickly becomes annoying once you do.
As there is no option provided by YouTube to disable it, we made this extension to retrieve original titles and change them back.
As YouTube later got even more annoying with translated descriptions, audio (dubbing) and channel branding, the extension was expanded to untranslate that too.

It is much easier to use than its analogues (such as [YoutubeAutotranslateCanceler](https://github.com/pcouy/YoutubeAutotranslateCanceler)), because it does not require any YouTube API keys (for core features) or additional userscript extensions.

## Features

- Restores original video titles on YouTube (can be toggled in settings "Untranslate titles")
- Restores original video descriptions on YouTube (can be toggled in settings "Untranslate description")
- Restores original video chapters (can be toggled in settings "Untranslate video chapters")
- Disables automatic audio (dubbing) translation (can be toggled in settings "Untranslate audio track")
- Restores original video thumbnails on YouTube (can be toggled in settings "Untranslate video thumbnails")
- Restores original channel branding header and about on YouTube (can be toggled in settings "Untranslate channel branding")
- Restores original channels' names everywhere else
- Untranslates YouTube Shorts audio and titles
- Works on m.youtube.com too (some mobile features are still unsupported and/or experimental)
- Works on youtube-nocookie.com
- Works on embeded YouTube videos
- Works automatically without any configuration
- "Advanced Settings" to allow translations for specified channels (using the @ handle of any channel)

> [!WARNING]
> For compatibility with [DeArrow](https://github.com/ajayyy/DeArrow) it is recommended do disable "Untranslate titles" and "Untranslate video thumbnails".
> You can then use [DeArrow](https://github.com/ajayyy/DeArrow)'s options page, under "Behavior" menu section, and enable "Default to Original Video Information" to still have translated titles and thumbnail from [DeArrow](https://github.com/ajayyy/DeArrow).

### Enhanced Features Reliability Option

In the extension settings, you can optionally provide a YouTube Data API Key. Although this is optional, it is reccomended.

When that is populated, some features work more reliably.
[Read more on how to obtain](https://github.com/zpix1/yt-anti-translate/blob/main/YOUTUBE_DATA_API_KEY.md)

## How to use
Just install it from Firefox extensions store (https://addons.mozilla.org/en-US/firefox/addon/youtube-anti-translate/?utm_source=github).

## How to test

1. Clone this repository
2. Navigate to the cloned folder and run the following command in a terminal window
   `npm ci`
3. Open with the IDE editor of choice
4. You can verify functionality by running Playwright Test (make sure you install Playwright extensions for your IDE if needed)
   - Before running the tests, you will need to install playwright browsers and dependencies
     `npx playwright install --with-deps`
   - Please create or update tests if adding new capabilities
   - For running tests on your machine you need a `.env` file with values for `GOOGLE_USER`, `GOOGLE_PWD` and `GOOGLE_OTP_SECRET`.
     > [!NOTE]
     > These `.env` values should be valid credentials to a Google (YouTube) Account with 2FA OTP enabled and OTP as the highest level of security on the account (aka no "Google prompt" or "Passkeys and security keys" configured).
     > `GOOGLE_OTP_SECRET` is the "secret" query parameter of the QR Code that is provided when configuring the 2FA OTP Authenticathor. You can use a QR Code reader to read the text value.
     > It is recommended that you create a test account for this purpose.

## DeArrow support

**TLDR:** Added the same way as in the Chrome version, but I still think it needs to be handled better by original Chrome version authors, due to the reasons highlighted below (**may be outdated**):

**Longer explanation:**

There were some complaints that the extension doesn't work with the DeArrow extension which also replaces video titles. 

The Chrome version "fixed" it by using `:not(.cbCustomTitle)` in their CSS selectors for video titles. Presumably to filter videos which are handled by DeArrow, and only untranslate videos where DeArrow didn't do anything. However, this approach doesn't really work.

As for any videos served with a translated title (here Russian), which is then formatted by DeArrow, there may exist an untranslated title (English). And the Chrome YT Anti Translate extension sees that there is cbCustomTitle class element, which renders the visible title, and doesn't touch it.  
![image](https://github.com/user-attachments/assets/f3281853-2b8f-4949-ac32-9318e6f1238b)
Below, hidden, there is the element YT Anti Translate edits, and fetches the original English title into. 

### The fundamental question here is, *what title should take precedence (and be shown)?* 
1. The untranslated title from the original author (fetched by YT Anti Translate)?
2. The nicely formatted version (by DeArrow) of the translated version (by YouTube) of the title?

### As to bugs seen in the screenshot, more detail:

We can also see there is a timing (?) bug between two extensions, as when I load the page, with YT Anti translate on and DeArrow fully on, there remains the translated in Russian title. Alternatively (would need investigation) it could be that DeArrow looks in the `title` attribute of the `<span id="video-title">` element, which is the Russian title (intentionally) and not its `innerText`, which is the English title. 

Furthermore, if the YT Anti Translate is off and DeArrow is on when page is loaded, the DeArrow's "Show original details" button which appears on hover, switches between formatted and unformatted versions of the Russian title. If then YT Anti Translate is reenabled (and English title fetched), the Russian title is hidden and the English title viewed only after the DeArrow's "Show original details" button is clicked. Further clicks alternate between unformatted and formatted versions of the English titles. That means that turning YT Anti Translate after DeArrow ran its scripts does not change the *visible* title of the video. 

Third case (to have it complete here), if YT Anti Translate is on and DeArrow off when page is loaded, the relevant markup looks like this:
(Off/on from their popups (not from about:addons), that's why DeArrow still injected a hidden element.)
![image](https://github.com/user-attachments/assets/4f1a224d-dc51-483d-a76b-d2682dac4f97)

If then DeArrow is turned on, and its "Show original details" button pressed, it toggles formatted/unformatted English titles normally (not reverting to the Russian title).
So, this may be a timing bug. If DeArrow runs after YT Anti Translate has run, all this appears correctly.
![image](https://github.com/user-attachments/assets/3b360d44-f8c6-4160-b6a1-4c534b5b71d2)
![image](https://github.com/user-attachments/assets/501a5ff6-5dc1-4c29-8bab-41f6bf0cff2a)



The page in question: https://www.youtube.com/watch?v=w26hmoyLbJ0 (old Pewdiepie video, which the https://www.youtube.com/watch?v=EC7gdOUvsAc video in screenshot appears as a recommendation to) and YT language changed to Russian (same config as original author of the Chrome extension). Good combination for testing, as his videos from 2018-19 mostly all have a translated title.
You can also show your support by:

- Starring this repository on GitHub
- Submitting a positive review for the extension on the [Chrome Web Store](https://chrome.google.com/webstore/detail/yt-anti-translate/ndpmhjnlfkgfalaieeneneenijondgag)
- Submitting a positive review for the extension on the [Firefox Extension Store](https://addons.mozilla.org/firefox/addon/youtube-anti-translate-mv3/)

### Contributors

- [namakeingo](https://github.com/namakeingo) - Collaborator and Main Maintainer - Firefox MV3 Developer
  - [Donate to namakeingo](https://github.com/sponsors/namakeingo)
  - Star the fork [namakeingo/yt-anti-translate-firefox](https://github.com/namakeingo/yt-anti-translate-firefox)
- [artisticfox8](https://github.com/artisticfox8/yt-anti-translate) - Firefox MV3 Developer
  - Star the fork [artisticfox8/yt-anti-translate](https://github.com/artisticfox8/yt-anti-translate)
- [ajayyy](https://github.com/ayayyy) - DeArrow compatibility [#18](https://github.com/zpix1/yt-anti-translate/pull/18) & [#20](https://github.com/zpix1/yt-anti-translate/pull/20)
- [YuriiMaiboroda](https://github.com/YuriiMaiboroda) - Fix translating for playlist panel [#14](https://github.com/zpix1/yt-anti-translate/pull/14)
- [BlackLanzer](https://github.com/BlackLanzer) - Translate title attribute [#24](https://github.com/zpix1/yt-anti-translate/pull/24)
- [NRngnl](https://github.com/NRngnl) - Replace 'chrome.extension.getURL' with 'chrome.runtime.getURL' [#12](https://github.com/zpix1/yt-anti-translate/pull/12)
