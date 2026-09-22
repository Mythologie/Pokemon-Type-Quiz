// This file contains the rules and behavior of the quiz.
// JavaScript can read the HTML, change what is displayed, and react to clicks.

// The game uses English names internally because they are short and consistent.
// TYPE_NAMES translates those internal names into the French names shown to the player.
const TYPE_NAMES = {
  Normal: "Normal", Fire: "Feu", Water: "Eau", Electric: "Électrik",
  Grass: "Plante", Ice: "Glace", Fighting: "Combat", Poison: "Poison",
  Ground: "Sol", Flying: "Vol", Psychic: "Psy", Bug: "Insecte",
  Rock: "Roche", Ghost: "Spectre", Dragon: "Dragon", Dark: "Ténèbres",
  Steel: "Acier", Fairy: "Fée"
};

// Types available in generations 2 to 5.
const OLDER_TYPES = ["Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel"];
// The newer table contains all older types plus Fairy.
const NEWER_TYPES = [...OLDER_TYPES, "Fairy"];

// These are the four possible internal answers.
const ANSWERS = ["Normal", "Super Effective", "Not very effective", "Immune"];
// This object translates an internal answer into the text shown to the player.
const ANSWER_LABELS = { Normal: "Normal", "Super Effective": "Très efficace", "Not very effective": "Peu efficace", Immune: "Sans effet" };

// querySelector finds an HTML element using its CSS selector.
// Keeping references here means the game can update these elements later.
const setupPanel = document.querySelector("#setup-panel");
const quizPanel = document.querySelector("#quiz-panel");
const resultPanel = document.querySelector("#result-panel");
const countInput = document.querySelector("#question-count");
// querySelectorAll returns a collection. The spread operator (...) changes it into a normal array.
const answerButtons = [...document.querySelectorAll(".answer-button")];
const generationCards = [...document.querySelectorAll(".generation-card")];

// These variables represent the changing state of the current game.
let chart; // The table of effectiveness values.
let pairs = []; // The randomly selected attack/defender questions.
let questionIndex = 0; // The position of the current question in pairs.
let score = 0; // The number of correct answers.

// Build a complete table of attack types versus defending types.
function buildChart(includeFairy) {
  // Choose the list of types based on the generation selected by the player.
  const types = includeFairy ? NEWER_TYPES : OLDER_TYPES;
  // Start every possible matchup at 1, which means normal effectiveness.
  const nextChart = Object.fromEntries(types.map((attack) => [attack, Object.fromEntries(types.map((defender) => [defender, 1]))]));

  // Apply one multiplier to several defending types at once.
  // 2 means very effective, 0.5 means not very effective, and 0 means immune.
  function setEffectiveness(attack, defenders, multiplier) {
    defenders.forEach((defender) => {
      // Only write to a type that exists in the selected generation.
      if (nextChart[defender]) nextChart[attack][defender] = multiplier;
    });
  }

  // The following rules describe the Pokémon type chart.
  setEffectiveness("Normal", ["Rock", "Steel"], 0.5); setEffectiveness("Normal", ["Ghost"], 0);
  setEffectiveness("Fire", ["Grass", "Ice", "Bug", "Steel"], 2); setEffectiveness("Fire", ["Fire", "Water", "Rock", "Dragon"], 0.5);
  setEffectiveness("Water", ["Fire", "Ground", "Rock"], 2); setEffectiveness("Water", ["Water", "Grass", "Dragon"], 0.5);
  setEffectiveness("Electric", ["Water", "Flying"], 2); setEffectiveness("Electric", ["Electric", "Grass", "Dragon"], 0.5); setEffectiveness("Electric", ["Ground"], 0);
  setEffectiveness("Grass", ["Water", "Ground", "Rock"], 2); setEffectiveness("Grass", ["Fire", "Grass", "Poison", "Flying", "Bug", "Dragon", "Steel"], 0.5);
  setEffectiveness("Ice", ["Grass", "Ground", "Flying", "Dragon"], 2); setEffectiveness("Ice", ["Fire", "Water", "Ice", "Steel"], 0.5);
  setEffectiveness("Fighting", ["Normal", "Ice", "Rock", "Dark", "Steel"], 2); setEffectiveness("Fighting", ["Poison", "Flying", "Psychic", "Bug", "Fairy"], 0.5); setEffectiveness("Fighting", ["Ghost"], 0);
  setEffectiveness("Poison", ["Grass", "Fairy"], 2); setEffectiveness("Poison", ["Poison", "Ground", "Rock", "Ghost"], 0.5); setEffectiveness("Poison", ["Steel"], 0);
  setEffectiveness("Ground", ["Fire", "Electric", "Poison", "Rock", "Steel"], 2); setEffectiveness("Ground", ["Grass", "Bug"], 0.5); setEffectiveness("Ground", ["Flying"], 0);
  setEffectiveness("Flying", ["Grass", "Fighting", "Bug"], 2); setEffectiveness("Flying", ["Electric", "Rock", "Steel"], 0.5);
  setEffectiveness("Psychic", ["Fighting", "Poison"], 2); setEffectiveness("Psychic", ["Psychic", "Steel"], 0.5); setEffectiveness("Psychic", ["Dark"], 0);
  setEffectiveness("Bug", ["Grass", "Psychic", "Dark"], 2); setEffectiveness("Bug", ["Fire", "Fighting", "Poison", "Flying", "Ghost", "Steel", "Fairy"], 0.5);
  setEffectiveness("Rock", ["Fire", "Ice", "Flying", "Bug"], 2); setEffectiveness("Rock", ["Fighting", "Ground", "Steel"], 0.5);
  setEffectiveness("Ghost", ["Psychic", "Ghost"], 2); setEffectiveness("Ghost", ["Dark"], 0.5); setEffectiveness("Ghost", ["Normal"], 0);
  setEffectiveness("Dragon", ["Dragon"], 2); setEffectiveness("Dragon", ["Steel"], 0.5); setEffectiveness("Dragon", ["Fairy"], 0);
  setEffectiveness("Dark", ["Psychic", "Ghost"], 2); setEffectiveness("Dark", ["Fighting", "Dark", "Fairy"], 0.5);
  setEffectiveness("Steel", ["Ice", "Rock", "Fairy"], 2); setEffectiveness("Steel", ["Fire", "Water", "Electric", "Steel"], 0.5);

  if (includeFairy) {
    // Fairy rules only exist in the newer table.
    setEffectiveness("Fairy", ["Fighting", "Dragon", "Dark"], 2); setEffectiveness("Fairy", ["Fire", "Poison", "Steel"], 0.5);
    // Steel no longer resists Ghost and Dark after generation 5.
    nextChart.Ghost.Steel = 1; nextChart.Dark.Steel = 1;
  } else {
    // In the older table, Steel resists Ghost and Dark.
    nextChart.Ghost.Steel = 0.5; nextChart.Dark.Steel = 0.5;
  }
  // Return the finished table to the code that requested it.
  return nextChart;
}

// Return a new array with the items in a random order.
// The original array is left unchanged.
function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

// Put a translated type name into an HTML element and store its internal name
// in data-type so CSS can give each type its own color.
function typeBadge(element, type) {
  element.textContent = TYPE_NAMES[type];
  element.dataset.type = type;
}

// Keep the visual selected state synchronized with the checked radio button.
function updateGenerationSelection() {
  generationCards.forEach((card) => card.classList.toggle("selected", card.querySelector("input").checked));
}

// Prepare and display a new game.
function startQuiz() {
  // Read the requested question count and keep it between 1 and 50.
  // If the input is empty or invalid, use 10 questions.
  const count = Math.min(50, Math.max(1, Number.parseInt(countInput.value, 10) || 10));
  countInput.value = count;

  // The checked radio button tells us which generation to use.
  const includeFairy = document.querySelector("input[name='generation']:checked").value === "new";
  chart = buildChart(includeFairy);

  // Create every possible attack/defender pair, shuffle them,
  // and keep only as many questions as the player requested.
  pairs = shuffle(Object.keys(chart).flatMap((attack) => Object.keys(chart).map((defender) => [attack, defender]))).slice(0, count);
  questionIndex = 0;
  score = 0;

  // Hide setup and result screens, then show the quiz screen.
  setupPanel.classList.add("hidden");
  resultPanel.classList.add("hidden");
  quizPanel.classList.remove("hidden");
  showQuestion();
}

// Fill the quiz screen with the current question.
function showQuestion() {
  const [attack, defender] = pairs[questionIndex];
  // Update the counter, percentage, and progress bar.
  document.querySelector("#question-counter").textContent = `Question ${String(questionIndex + 1).padStart(2, "0")} / ${pairs.length}`;
  document.querySelector("#progress-label").textContent = `${Math.round((questionIndex / pairs.length) * 100)} % complete`;
  document.querySelector("#progress-bar").style.width = `${(questionIndex / pairs.length) * 100}%`;
  // Show the translated attack and defender names.
  typeBadge(document.querySelector("#attack-type"), attack);
  typeBadge(document.querySelector("#defender-type"), defender);
  // Clear old feedback and re-enable every answer button for this question.
  document.querySelector("#feedback").textContent = "";
  document.querySelector("#feedback").className = "feedback";
  answerButtons.forEach((button) => { button.disabled = false; button.className = "answer-button"; });
}

// Check one answer after the player clicks a button.
function answerQuestion(button) {
  const [attack, defender] = pairs[questionIndex];
  // Convert the numerical multiplier in the chart into one of the four answers.
  const correctAnswer = chart[attack][defender] === 0 ? "Immune" : chart[attack][defender] === 0.5 ? "Not very effective" : chart[attack][defender] === 2 ? "Super Effective" : "Normal";
  const isCorrect = button.dataset.answer === correctAnswer;

  // Increase the score only when the selected answer is correct.
  if (isCorrect) score += 1;
  // Color the clicked button. If it was wrong, also show the correct button.
  button.classList.add(isCorrect ? "correct" : "wrong");
  if (!isCorrect) answerButtons.find((answerButton) => answerButton.dataset.answer === correctAnswer).classList.add("correct");
  // Disable all buttons so the same question cannot be answered twice.
  answerButtons.forEach((answerButton) => { answerButton.disabled = true; });
  const feedback = document.querySelector("#feedback");
  feedback.className = `feedback ${isCorrect ? "correct" : "wrong"}`;
  feedback.textContent = isCorrect ? "Correct. Bonne lecture du tableau." : `La bonne réponse : ${ANSWER_LABELS[correctAnswer]}.`;
  // Wait briefly so the player can read the feedback, then continue.
  window.setTimeout(() => {
    questionIndex += 1;
    if (questionIndex < pairs.length) showQuestion(); else showResult();
  }, 750);
}

// Replace the quiz screen with the final score screen.
function showResult() {
  quizPanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");
  document.querySelector("#final-score").textContent = score;
  document.querySelector("#final-total").textContent = `/ ${pairs.length}`;
  document.querySelector("#result-message").textContent = score === pairs.length ? "Tableau parfaitement maîtrisé." : "Chaque question est une occasion de mieux lire le tableau.";
  // Smoothly scroll to the result in case the page is long.
  resultPanel.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Register event listeners: these functions run after the player interacts with the page.
generationCards.forEach((card) => card.addEventListener("click", updateGenerationSelection));
document.querySelector("#start-button").addEventListener("click", startQuiz);
// Restart hides the result and shows the setup screen again.
document.querySelector("#restart-button").addEventListener("click", () => { resultPanel.classList.add("hidden"); setupPanel.classList.remove("hidden"); setupPanel.scrollIntoView({ behavior: "smooth", block: "center" }); });
// Each answer button sends itself to answerQuestion when clicked.
answerButtons.forEach((button) => button.addEventListener("click", () => answerQuestion(button)));