import { convertMarkdownToJson } from "./convertMarkdownToJson.js";

document.addEventListener("DOMContentLoaded", () => {
  const gameTextElement = document.getElementById("gameText");
  const choice1Button = document.getElementById("choice1");
  const choice2Button = document.getElementById("choice2");

  let currentScene = "start";
  let previousScene = null;
  let gameData = {};

  fetch("gameData.md")
    .then((response) => response.text())
    .then((markdown) => {
      gameData = convertMarkdownToJson(markdown);
      displayScene(currentScene);
    })
    .catch((error) => console.error("Error loading game data:", error));

  function displayScene(scene) {
    const sceneData = gameData[scene];
    if (!sceneData) {
      console.error("Scene data not found for scene:", scene);
      return;
    }

    gameTextElement.textContent = sceneData.text;

    if (sceneData.choices.length === 2) {
      if (Math.random() > 0.5) {
        [sceneData.choices[0], sceneData.choices[1]] = [
          sceneData.choices[1],
          sceneData.choices[0],
        ];
      }
    }

    choice1Button.textContent = sceneData.choices[0].text;
    choice1Button.onclick = () =>
      changeScene(sceneData.choices[0].next || sceneData.choices[0].end, scene);

    if (sceneData.choices.length > 1) {
      choice2Button.style.display = "block";
      choice2Button.textContent = sceneData.choices[1].text;
      choice2Button.onclick = () =>
        changeScene(
          sceneData.choices[1].next || sceneData.choices[1].end,
          scene
        );
    } else {
      choice2Button.style.display = "none";
    }
  }

  function changeScene(nextScene, current) {
    if (nextScene === "Start") {
      displayScene("start");
    } else {
      previousScene = current;
      currentScene = nextScene;
      displayScene(nextScene);
    }
  }
});
