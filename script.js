const bgm = document.getElementById("bgm");
const background = document.getElementById("background");
const text = document.getElementById("text");
const nextBtn = document.getElementById("nextBtn");
const textbox = document.getElementById("textbox");
const dimOverlay = document.getElementById("dimOverlay");

let chosenWords = [];
let currentScene = 0;
let state = "text";
let typingTimeout = null;

let poemParts = [];
let poemIndex = 0;

nextBtn.style.display = "none";

const scenes = [
  {
    bg: "Assets/backgrounds/1.png",
    text: `Someone once gave me a flower.

It wasn’t dramatic.
It wasn’t loud.

But I hadn’t received one in a long time.`,
    choices: [
      { label: "It felt special.", word: "special" },
      { label: "It felt unexpected.", word: "unexpected" },
    ],
  },
  {
    bg: "Assets/backgrounds/2.png",
    text: `I kept thinking about it.

About how something small
can stay in your mind longer than you expect.`,
    choices: [
      { label: "Small things matter.", word: "small things" },
      { label: "Details matter.", word: "details" },
    ],
  },
  {
    bg: "Assets/backgrounds/3.png",
    text: `So I picked it up carefully.

Not because I was certain.
Not because I was ready.

Just because I wanted to try.`,
    choices: [
      { label: "Trying is brave.", word: "trying" },
      { label: "Trying is enough.", word: "enough" },
    ],
  },
  {
    bg: "Assets/backgrounds/4.png",
    text: `It didn’t bloom immediately.

There were days it looked unsure.
Like it was still deciding
whether it was safe.`,
    choices: [
      { label: "Growth takes time.", word: "time" },
      { label: "Growth needs patience.", word: "patience" },
    ],
  },
  {
    bg: "Assets/backgrounds/5.png",
    text: `You told me to take time.

And I think I understand.

Some things grow better
when they’re not rushed.`,
    choices: [
      { label: "Move slowly.", word: "slowly" },
      { label: "Let it breathe.", word: "breathe" },
    ],
  },
  {
    bg: "Assets/backgrounds/6.png",
    text: `I don’t want to be the reason you bloom.

You were always capable of that.

I just want to stand beside it —
steady.`,
    choices: [
      { label: "Rooted in belief.", word: "belief" },
      { label: "Rooted in faith.", word: "faith" },
    ],
  },
];

function typeWriter(content, callback) {
  clearTimeout(typingTimeout);
  text.innerHTML = "";
  let i = 0;

  function typing() {
    if (i < content.length) {
      text.innerHTML += content.charAt(i) === "\n" ? "<br>" : content.charAt(i);
      i++;
      typingTimeout = setTimeout(typing, 20);
    } else {
      callback();
    }
  }

  typing();
}

function showScene(index) {
  const scene = scenes[index];

  background.style.opacity = 0;

  setTimeout(() => {
    background.style.backgroundImage = `url(${scene.bg})`;
    background.style.opacity = 1;

    typeWriter(scene.text, () => {
      state = "readyForChoice";
      nextBtn.style.display = "block";
    });
  }, 400);
}

function showChoices() {
  state = "choice";
  nextBtn.style.display = "none";

  scenes[currentScene].choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.innerText = choice.label;
    btn.classList.add("choiceBtn");

    btn.onclick = () => {
      chosenWords.push(choice.word);
      removeChoiceButtons();
      currentScene++;
      state = "text";
      nextScene();
    };

    textbox.appendChild(btn);
  });
}

function removeChoiceButtons() {
  document.querySelectorAll(".choiceBtn").forEach((b) => b.remove());
}

function nextScene() {
  if (currentScene < scenes.length) {
    showScene(currentScene);
  } else {
    startPoemSequence();
  }
}

function startPoemSequence() {
  state = "poem";
  dimOverlay.style.background = "rgba(0,0,0,0.45)";
  poemIndex = 0;

  poemParts = [
    `It began ${chosenWords[0]},
in ${chosenWords[1]}.`,

    `We learned that growth takes ${chosenWords[2]},
that love moves ${chosenWords[3]}.`,

    `What is meant to last
must unfold ${chosenWords[4]}.`,

    `Rooted not in pressure —
but in ${chosenWords[5]}.`,

    `You were always capable.`,

    `I just want to stay by you.`,
  ];

  showNextPoemPart();
}

function showNextPoemPart() {
  if (poemIndex < poemParts.length) {
    typeWriter(poemParts[poemIndex], () => {
      nextBtn.style.display = "block";
    });
    poemIndex++;
  } else {
    showFinalLine();
  }
}

function showFinalLine() {
  fadeOutMusic();
  background.style.backgroundImage = `url("Assets/backgrounds/7.png")`;

  typeWriter(`I believe in you.`, () => {
    showEndOptions();
  });
}

function fadeOutMusic() {
  let fade = setInterval(() => {
    if (bgm.volume > 0.02) {
      bgm.volume -= 0.02;
    } else {
      bgm.pause();
      clearInterval(fade);
    }
  }, 200);
}

function showEndOptions() {
  const poemBtn = document.createElement("button");
  poemBtn.innerText = "Read the full poem";
  poemBtn.classList.add("choiceBtn");

  const restartBtn = document.createElement("button");
  restartBtn.innerText = "Start over";
  restartBtn.classList.add("choiceBtn");

  poemBtn.onclick = () => {
    removeChoiceButtons();
    typeWriter(poemParts.join("\n\n") + "\n\nI believe in you.", () => {});
  };

  restartBtn.onclick = resetGame;

  textbox.appendChild(poemBtn);
  textbox.appendChild(restartBtn);
}

function resetGame() {
  clearTimeout(typingTimeout);
  chosenWords = [];
  currentScene = 0;
  state = "text";
  poemIndex = 0;

  removeChoiceButtons();
  dimOverlay.style.background = "rgba(0,0,0,0)";
  text.innerHTML = "";

  bgm.pause();
  bgm.currentTime = 0;
  bgm.volume = 0.4;

  nextBtn.style.display = "none";
  showScene(currentScene);
}

nextBtn.addEventListener("click", () => {
  if (currentScene === 0 && state === "readyForChoice") {
    bgm.volume = 0.4;
    bgm.play();
  }

  if (state === "readyForChoice") {
    showChoices();
  } else if (state === "poem") {
    nextBtn.style.display = "none";
    showNextPoemPart();
  }
});

showScene(currentScene);
