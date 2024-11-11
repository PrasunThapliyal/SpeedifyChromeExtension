console.log("Loaded ..");

document.getElementById("speedSlider").addEventListener("input", (event) => {
  const playbackRate = document.getElementById("playbackRate");
  if (playbackRate) {
    console.log(event.target.value);
    playbackRate.textContent = `${event.target.value}x`;
  }
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabs[0].id },
      function: getPlaybackRate,
    },
    (results) => {
      if (results && results[0]) {
        console.log(`Computing current playback rate ..`);
        const currentPlaybackRate = results[0].result;
        console.log(`Current Playback Rate: ${currentPlaybackRate}`);

        const speedSlider = document.getElementById("speedSlider");
        const playbackRate = document.getElementById("playbackRate");

        if (playbackRate) {
          playbackRate.textContent = `${currentPlaybackRate}x`;
        }
        if (speedSlider) {
          speedSlider.value = currentPlaybackRate;
        }
      }
    }
  );
});

function getPlaybackRate() {
  console.log(`Search document for videos ..`);
  const video = document.getElementsByTagName("video")[0];

  return video ? video.playbackRate : 1.0;
}

document.getElementById("speedSlider").addEventListener("change", () => {
  console.log("speedSlider.change event received ..");

  const playbackRate = document.getElementById("playbackRate");
  const speedSlider = document.getElementById("speedSlider");

  if (playbackRate) {
    playbackRate.textContent = `${speedSlider.value}x`;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: setSpeed,
        args: [document.getElementById("speedSlider").value],
      },
      (results) => {
        if (results && results[0]) {
          console.log(`Updating Extension UI playback rate ..`);
          const currentPlaybackRate = results[0].result;
          console.log(`Current Playback Rate: ${currentPlaybackRate}`);

          const playbackRate = document.getElementById("playbackRate");

          if (playbackRate) {
            playbackRate.textContent = `${currentPlaybackRate}x`;
          }
        }
      }
    );
  });
});

function setSpeed(speed) {
  const video = document.getElementsByTagName("video")[0];
  if (video) {
    video.playbackRate = speed;

    return speed;
  }
}
