// @ts-check
/* globals txt_que, txt_vars */
/* exported onYouTubePlayerAPIReady */

const buttons = /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.btn'));
const white = /** @type {HTMLElement} */ (document.querySelector('.white'));
// const none = [>* @type {HTMLElement} <] (document.querySelector('.none'));
const question = /** @type {HTMLElement} */ (document.querySelector('.que'));
// const comm = [>* @type {HTMLElement} <] (document.querySelector('.comm'));
const start = /** @type {HTMLElement} */ (document.querySelector('.start'));
const end = /** @type {HTMLElement} */ (document.querySelector('.end'));
// const retry = [>* @type {HTMLElement} <] (document.querySelector('.retry'));
// const retryBtn = [>* @type {HTMLElement} <] (document.querySelector('.retry-button'));
const Answer = /** @type {HTMLElement} */ (document.querySelector('.answer'));
const videoNode = /** @type {HTMLVideoElement} */ (document.querySelector('video.video'));
const videoSource = document.createElement('source');

const answ = [null, null, null, null];

/** Use youtobe videos (ytVideos) or local (localVideos) */
const useLocalVideo = true;

// let started = 0;
// let changed = 0;
// let states = [];

let timeout;

let blocked = false;

/** Youtube video ids */
const ytVideos = [
  // Youtube videos...
  'H6XtZe9NQqk',
  'gTkIXlr-h5U',
  'j0RV0Cc1DbU',
  '8xdLlRIi7Fw',
  'cXcxugVV5d8',
];

/** Local video files */
const localVideos = [
  // Local videos,,,
  'videos/1.mp4',
  'videos/2.mp4',
  'videos/3.mp4',
  'videos/4.mp4',
  'videos/5.mp4',
];

// const questions = [];
// const comms = ['', '', ''];
// const answers = [];

let level = 0;

/** @type {HTMLElement} */
let target = null;

/** Could be used to check answers (see checkAnswer)
 * @type {number | undefined}
 */
let counter = undefined; // eslint-disable-line no-unused-vars

/** @type {InstanceType<typeof window.YT.Player>} */
let player;

function changeTexts() {
  const text = txt_que[level];
  const vars = txt_vars[level];
  if (!text || !vars) {
    // The last level?
    console.warn('Invalid level index (is it the last one?)', {
      level,
    });
    return;
  }
  console.log('[changeTexts]', {
    level,
    text,
    vars,
  });
  question.innerText = text;
  buttons.forEach((item, i) => {
    item.classList.toggle('selected', false);
    item.innerText = vars[i];
  });
}

function pauseVideo() {
  console.log('[pauseVideo]');
  if (useLocalVideo) {
    videoNode.pause();
  } else {
    player.pauseVideo();
  }
}

function playVideo() {
  console.log('[playVideo]');
  if (useLocalVideo) {
    videoNode.play();
  } else {
    player.playVideo();
  }
}

function replayVideo() {
  console.log('[replayVideo]');
  if (useLocalVideo) {
    videoNode.pause();
    videoNode.currentTime = 0;
    videoNode.play();
  } else {
    player.playVideo();
    player.seekTo(0, true);
    player.playVideo();
  }
}

function initPlayer() {
  console.log('[initPlayer]');
  changeVideo();
  pauseVideo();
  changeTexts();
  document.addEventListener('transitionstart', (ev) => {
    const { target, propertyName } = ev;
    if (propertyName == 'opacity') {
      if ((target == white && level != 2) || target == Answer) {
        console.log('[initPlayer:transitionstart] opacity', {
          target,
          propertyName,
        });
        playVideo();
      }
    }
  });
  document.addEventListener('transitionend', (ev) => {
    const { propertyName } = ev;
    const target = /** @type {HTMLElement} */ (ev.target);
    if (propertyName == 'opacity') {
      console.log('[initPlayer:transitionend]', {
        target,
        propertyName,
      });
      hide(target);
      target.classList.remove('no-op');
      changeTexts();
      target.classList.remove('selected');
      // comm.classList.add('no-op');
      // if (target == white) {
      //   // changeQuestion();
      //   // changeAnswers();
      //   // changeComm();
      // }
    }
  });
}

function playerLoad() {
  console.log('[playerLoad]');
  // debugger;
  initPlayer();
}

function findCounter() {
  counter = undefined;
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i] == target) {
      counter = i;
    }
  }
}

let answer = null;

function checkAnswer() {
  answer = null;
  // if (answ[level - 1] == counter + 1) {
  //     answer = true;
  // } else {
  //     answer = false;
  // }
  answer = true;
}

document.addEventListener('click', main);

/** @param {MouseEvent} e */
function main(e) {
  console.log('[main]', {
    blocked,
  });
  if (blocked) {
    return false;
  }
  const target = /** @type {HTMLElement} */ (e.target);
  if (/* started == 1 && */ target.classList.contains('start-button')) {
    console.log('[main] start-button');
    playVideo();
    noOp(start);
    blocked = true;
    // return false;
  } else if (target.classList.contains('end-button')) {
    console.log('[main] end-button');
    location.reload();
    blocked = true;
  } else if (target.classList.contains('answer-btn')) {
    console.log('[main] answer-button');
    // setTimeout(() => {
    changeVideo();
    replayVideo();
    noOp(Answer);
    blocked = true;
    // changed = 1;
    // Answer.classList.add('hide');
    // }, 1500);
  } else if (findTarget(e)) {
    console.log('[main] other');
    blocked = true;
    // if (changed == 0) {
    clearTimeout(timeout);
    // changed = 1;
    changeLevel('+');
    if (level == 2) {
      Answer.classList.remove('hide');
      noOp(white);
      blocked = false;
      // changed = 0;
    } else {
      Answer.classList.add('hide');
    }
    findCounter();
    checkAnswer();
    target.classList.add('selected');
    // if (answer == true) {
    // comm.innerText = 'Вы ответили правильно!';
    // comm.classList.add('true');
    // } else {
    // comm.classList.remove('true');
    // comm.innerText = 'Вы ответили неправильно!';
    // }
    // comm.classList.remove('no-op');

    // setTimeout(() => {
    // pauseVideo();
    // }, 100);
    // }
    if (level != 2) {
      setTimeout(() => {
        changeVideo();
        replayVideo();
        noOp(white);
      }, 1500);
    }
    // playVideo();
  } else {
    return false;
  }
}

/** @param {HTMLElement} tar */
function hide(tar) {
  tar.classList.add('hide');
}

/** @param {HTMLElement} tar */
function noOp(tar) {
  tar.classList.add('no-op');
}

/** @param {HTMLElement} tar */
function show(tar) {
  tar.classList.remove('hide');
}

function playerChange() {
  const state = player.getPlayerState();
  console.log('[playerChange]', {
    state,
  });
  // debugger;
  // states.push(state);
  // if (states[states.length - 1] == -1) {
  //   // started = 1;
  // }
  if (player.getPlayerState() == 0) {
    handleVideoEnd();
    // blocked = false;
    // // changed = 0;
    // // checkComm();
    // checkFinish();
    // show(white);
    // // timeout = setTimeout(() => {
    // // changed = 1;
    // // changeLevel();
    // // changeVideo();
    // // playVideo();
    // // setTimeout(() => {
    // // pauseVideo();
    // // }, 100);
    // // }, 400);
  } else if (player.getPlayerState() == 1) {
    // show(none);
    // playVideo();
  }
}

/** @param {MouseEvent} e */
function findTarget(e) {
  target = null;
  const eventTarget = /** @type {HTMLElement} */ (e.target);
  if (eventTarget.classList.contains('btn')) {
    target = eventTarget;
    return true;
  } else {
    return false;
  }
}

function changeVideo() {
  console.log('[changeVideo]', {
    useLocalVideo,
    level,
  });
  if (useLocalVideo) {
    const videoUrl = localVideos[level];
    console.log('[changeVideo] local', {
      videoUrl,
    });
    videoSource.setAttribute('src', videoUrl);
    videoNode.load();
  } else {
    const videoId = ytVideos[level];
    console.log('[changeVideo] youtube', {
      videoId,
    });
    player.loadVideoById(videoId);
  }
  return true;
  /* // OLD CODE: ???
   * if (level != 0) {
   *     player.loadVideoById(ytVideos[level]);
   *     return true;
   * } else {
   *     player.loadVideoById(ytVideos[level]);
   *     return true;
   * }
   */
}

/** @param {'+'|'-'} type */
function changeLevel(type) {
  switch (type) {
    case '+':
      level++;
      break;
    case '-':
      level--;
      break;
  }
}

/* // UNUSED
 * function changeAnswers() {
 *   if (answers[level]) {
 *     for (let i = 0; i < buttons.length; i++) {
 *       buttons[i].innerHTML = answers[level][i];
 *     }
 *   }
 * }
 * function changeComm() {
 *   comm.innerText = comms[level];
 * }
 * function checkComm() {
 *   if (level < comms.length) {
 *     // if (comms[level].length == 0) {
 *     // hide(comm);
 *     // } else {
 *     // show(comm);
 *     // }
 *   }
 * }
 */

function checkFinish() {
  if (level == answ.length) {
    show(end);
  }
}

function handleVideoEnd() {
  console.log('[handleVideoEnd]');
  blocked = false;
  // changed = 0;
  // checkComm();
  checkFinish();
  show(white);
}

function handleVideoError(ev) {
  console.log('[handleVideoError]', {
    ev,
  });
  debugger;
}

function handleVideoPlay(ev) {
  console.log('[handleVideoPlay]', {
    ev,
  });
  debugger;
}

// eslint-disable-next-line no-unused-vars
function onYouTubePlayerAPIReady() {
  // @see https://developers.google.com/youtube/iframe_api_reference
  player = new window.YT.Player('ytplayer', {
    // videoId: 'pQc5jTB1V2I',
    playerVars: { showinfo: 0 },
    events: {
      onStateChange: playerChange,
      onReady: playerLoad,
    },
  });
  player.getIframe().classList.add('player');
  document.getElementById('ytplayer').classList.remove('hide');
  // hide(player.getIframe());
}

// function initVideoSource() {}

function onLocalPlayerReady() {
  videoSource.setAttribute('type', 'video/mp4');
  videoNode.appendChild(videoSource);
  videoNode.addEventListener('ended', handleVideoEnd);
  videoNode.classList.remove('hide');
  initPlayer();
}

function onYoutubePlayerReady() {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/player_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

if (useLocalVideo) {
  window.addEventListener('load', onLocalPlayerReady);
} else {
  window.addEventListener('load', onYoutubePlayerReady);
}
