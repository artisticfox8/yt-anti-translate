async function hasPermanentHostPermission(origin) {
  return new Promise((resolve, reject) => {
    window.YoutubeAntiTranslate.getBrowserOrChrome().permissions.getAll(
      (allPermissions) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(allPermissions.origins?.includes(origin));
        }
      },
    );
  });
}

async function checkPermissions() {
  const permissionWarning = document.getElementById("permission-warning");

  if (!permissionWarning) {
    window.YoutubeAntiTranslate.logInfo("Permission elements not found in DOM");
    return;
  }

  const hasPermanent = await hasPermanentHostPermission("*://*.youtube.com/*");

  if (!hasPermanent) {
    permissionWarning.style.display = "block";
  }
}

function requestPermissions() {
  chrome.tabs.create({
    url: chrome.runtime.getURL("pages/permission.html"),
  });
  window.close();
}

function renderFooterLinks() {
  const footer = document.getElementById("footer-links");

  if (!footer) {
    return;
  }

  const commonLinks = `
    <a target="_blank" href="https://github.com/zpix1/yt-anti-translate">Report issues</a>
  `;

  if (window.YoutubeAntiTranslate.isFirefoxBasedBrowser()) {
    footer.innerHTML = `
      <a target="_blank" href="https://addons.mozilla.org/firefox/addon/youtube-anti-translate/">Rate extension</a> • 
      ${commonLinks}
    `;
  } else {
    footer.innerHTML = `
      <a target="_blank" href="https://chrome.google.com/webstore/detail/yt-anti-translate/ndpmhjnlfkgfalaieeneneenijondgag">Rate extension</a> • 
      ${commonLinks} • 
      <a target="_blank" href="https://zpix1.github.io/donate/">Support developer</a>
    `;
  }
}

function saveOptions() {
    

  if (document.getElementById("reload-checkbox").checked) {
    chrome.tabs.reload();
  }
  chrome.storage.sync.get(
    {
      disabled: false,
      autoreloadOption: true,
      untranslateAudio: true,
      untranslateDescription: true,
      untranslateChannelBranding: true,
      youtubeDataApiKey: null,
    },
    function (items) {
      const disabled = !items.disabled;
      chrome.storage.sync.set(
        {
          disabled: disabled,
        },
        function () {
          document.getElementById("disable-button").innerText = disabled
            ? "Enable"
            : "Disable";
          document.getElementById("status").innerText = disabled
            ? "Disabled"
            : "Enabled";
          document.getElementById("status").className =
            "status " + (disabled ? "disabled" : "enabled");
          document.getElementById("disable-button").className = disabled
            ? "disabled"
            : "enabled";
        },
      );
    },
  );
}

/*
Toggle the addon on/off without reloading the page.
The content scripts should be listening
  => if the addon is toggled off, translateArray ran in the content scripts
  => it relied on the fact that the `title` HTML attribute
    (which appears with the hover tooltip btw) was not changed by YT-Anti-Translate
    => Now, it is changed
  => So, to make it work again, set a custom data attribute to recover original (translated) titles
*/
function tellThePage(){
    let message;
    if(document.getElementById('status').innerText == "Enabled"){ //The value is set correctly
        message = "Enable";
    }else if(document.getElementById('status').innerText == "Disabled"){
        message = "Disable";
    }
    browser.tabs.query({url:"*://*.youtube.com/*"}, function(tabs){

        for (var x = 0; x < tabs.length; x++) {
            //sending a message to content script https://stackoverflow.com/questions/14245334/sendmessage-from-extension-background-or-popup-to-content-script-doesnt-work
            browser.tabs.sendMessage(tabs[x].id, message)
            .then(response => { 
              console.log("Message from the content script:",response);

            })
            .catch(e => {
                console.log(e);
            });
        }
        
    });
}
function loadOptions() {
  chrome.storage.sync.get(
    {
      disabled: false,
      autoreloadOption: true,
      untranslateAudio: true,
      untranslateDescription: true,
      untranslateChannelBranding: true,
      youtubeDataApiKey: null,
    },
    function (items) {
      document.getElementById("disable-button").innerText = items.disabled
        ? "Enable"
        : "Disable";
      document.getElementById("status").innerText = items.disabled
        ? "Disabled"
        : "Enabled";
      document.getElementById("status").className =
        "status " + (items.disabled ? "disabled" : "enabled");
      document.getElementById("disable-button").className = items.disabled
        ? "disabled"
        : "enabled";
      document.getElementById("reload-checkbox").checked =
        items.autoreloadOption;
      document.getElementById("audio-checkbox").checked =
        items.untranslateAudio;
      document.getElementById("description-checkbox").checked =
        items.untranslateDescription;
      document.getElementById("channel-branding-checkbox").checked =
        items.untranslateChannelBranding;
      document.getElementById("api-key-input").value = items.youtubeDataApiKey;
    },
  );
}

function checkboxUpdate() {
  chrome.storage.sync.set({
    autoreloadOption: document.getElementById("reload-checkbox").checked,
    untranslateAudio: document.getElementById("audio-checkbox").checked,
    untranslateDescription: document.getElementById("description-checkbox")
      .checked,
    untranslateChannelBranding: document.getElementById(
      "channel-branding-checkbox",
    ).checked,
  });
}

function apiKeyUpdate() {
  const newApiKey = document.getElementById("api-key-input").value.trim();
  const saveButton = document.getElementById("save-api-key-button");
  const saveButtonText = document.getElementById("save-api-key-text");

  chrome.storage.sync.get(
    {
      youtubeDataApiKey: null,
    },
    function (items) {
      if (items.youtubeDataApiKey === newApiKey) {
        return;
      }

      chrome.storage.sync.set(
        {
          youtubeDataApiKey: newApiKey,
        },
        () => {
          window.YoutubeAntiTranslate.logInfo("API key saved");
        },
      );
    },
  );

  const originalText = saveButtonText.textContent;
  saveButtonText.classList.add("saving");
  saveButtonText.textContent = "Saved!";
  saveButton.disabled = true;
  setTimeout(() => {
    saveButtonText.textContent = originalText;
    saveButton.disabled = false;
    saveButtonText.classList.remove("saving");
  }, 1500);
}

function addListeners() {
  document
    .getElementById("request-permission-button")
    .addEventListener("click", requestPermissions);
  document
    .getElementById("disable-button")
    .addEventListener("click", saveOptions);
  document
    .getElementById("reload-checkbox")
    .addEventListener("click", checkboxUpdate);
  document
    .getElementById("audio-checkbox")
    .addEventListener("click", checkboxUpdate);
  document
    .getElementById("description-checkbox")
    .addEventListener("click", checkboxUpdate);
  document
    .getElementById("channel-branding-checkbox")
    .addEventListener("click", checkboxUpdate);
  document
    .getElementById("save-api-key-button")
    .addEventListener("click", apiKeyUpdate);
}

document.addEventListener("DOMContentLoaded", renderFooterLinks);
document.addEventListener("DOMContentLoaded", checkPermissions);
document.addEventListener("DOMContentLoaded", loadOptions);
document.addEventListener("DOMContentLoaded", addListeners);
