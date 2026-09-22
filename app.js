const TYPE_NAMES = {
  Normal: "Normal", Fire: "Feu", Water: "Eau", Electric: "Électrik",
  Grass: "Plante", Ice: "Glace", Fighting: "Combat", Poison: "Poison",
  Ground: "Sol", Flying: "Vol", Psychic: "Psy", Bug: "Insecte",
  Rock: "Roche", Ghost: "Spectre", Dragon: "Dragon", Dark: "Ténèbres",
  Steel: "Acier", Fairy: "Fée"
};

const OLDER_TYPES = ["Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel"];
const NEWER_TYPES = [...OLDER_TYPES, "Fairy"];
const ANSWERS = ["Normal", "Super Effective", "Not very effective", "Immune"];
const ANSWER_LABELS = { Normal: "Normal", "Super Effective": "Très efficace", "Not very effective": "Peu efficace", Immune: "Sans effet" };

const setupPanel = document.querySelector("#setup-panel");
const quizPanel = document.querySelector("#quiz-panel");
const resultPanel = document.querySelector("#result-panel");
const countInput = document.querySelector("#question-count");
const answerButtons = [...document.querySelectorAll(".answer-button")];
const generationCards = [...document.querySelectorAll(".generation-card")];

let chart;
let pairs = [];
let questionIndex = 0;
let score = 0;

function buildChart(includeFairy) {
  const types = includeFairy ? NEWER_TYPES : OLDER_TYPES;
  const nextChart = Object.fromEntries(types.map((attack) => [attack, Object.fromEntries(types.map((defender) => [defender, 1]))]));

  function setEffectiveness(attack, defenders, multiplier) {
    defenders.forEach((defender) => {
      if (nextChart[defender]) nextChart[attack][defender] = multiplier;
    });
  }

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
    setEffectiveness("Fairy", ["Fighting", "Dragon", "Dark"], 2); setEffectiveness("Fairy", ["Fire", "Poison", "Steel"], 0.5);
    nextChart.Ghost.Steel = 1; nextChart.Dark.Steel = 1;
  } else {
    nextChart.Ghost.Steel = 0.5; nextChart.Dark.Steel = 0.5;
  }
  return nextChart;
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function typeBadge(element, type) {
  element.textContent = TYPE_NAMES[type];
  element.dataset.type = type;
}

function updateGenerationSelection() {
  generationCards.forEach((card) => card.classList.toggle("selected", card.querySelector("input").checked));
}

function startQuiz() {
  const count = Math.min(50, Math.max(1, Number.parseInt(countInput.value, 10) || 10));
  countInput.value = count;
  const includeFairy = document.querySelector("input[name='generation']:checked").value === "new";
  chart = buildChart(includeFairy);
  pairs = shuffle(Object.keys(chart).flatMap((attack) => Object.keys(chart).map((defender) => [attack, defender]))).slice(0, count);
  questionIndex = 0;
  score = 0;
  setupPanel.classList.add("hidden");
  resultPanel.classList.add("hidden");
  quizPanel.classList.remove("hidden");
  showQuestion();
}

function showQuestion() {
  const [attack, defender] = pairs[questionIndex];
  document.querySelector("#question-counter").textContent = `Question ${String(questionIndex + 1).padStart(2, "0")} / ${pairs.length}`;
  document.querySelector("#progress-label").textContent = `${Math.round((questionIndex / pairs.length) * 100)} % complete`;
  document.querySelector("#progress-bar").style.width = `${(questionIndex / pairs.length) * 100}%`;
  typeBadge(document.querySelector("#attack-type"), attack);
  typeBadge(document.querySelector("#defender-type"), defender);
  document.querySelector("#feedback").textContent = "";
  document.querySelector("#feedback").className = "feedback";
  answerButtons.forEach((button) => { button.disabled = false; button.className = "answer-button"; });
}

function answerQuestion(button) {
  const [attack, defender] = pairs[questionIndex];
  const correctAnswer = chart[attack][defender] === 0 ? "Immune" : chart[attack][defender] === 0.5 ? "Not very effective" : chart[attack][defender] === 2 ? "Super Effective" : "Normal";
  const isCorrect = button.dataset.answer === correctAnswer;
  if (isCorrect) score += 1;
  button.classList.add(isCorrect ? "correct" : "wrong");
  if (!isCorrect) answerButtons.find((answerButton) => answerButton.dataset.answer === correctAnswer).classList.add("correct");
  answerButtons.forEach((answerButton) => { answerButton.disabled = true; });
  const feedback = document.querySelector("#feedback");
  feedback.className = `feedback ${isCorrect ? "correct" : "wrong"}`;
  feedback.textContent = isCorrect ? "Correct. Bonne lecture du tableau." : `La bonne réponse : ${ANSWER_LABELS[correctAnswer]}.`;
  window.setTimeout(() => {
    questionIndex += 1;
    if (questionIndex < pairs.length) showQuestion(); else showResult();
  }, 750);
}

function showResult() {
  quizPanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");
  document.querySelector("#final-score").textContent = score;
  document.querySelector("#final-total").textContent = `/ ${pairs.length}`;
  document.querySelector("#result-message").textContent = score === pairs.length ? "Tableau parfaitement maîtrisé." : "Chaque question est une occasion de mieux lire le tableau.";
  resultPanel.scrollIntoView({ behavior: "smooth", block: "center" });
}

generationCards.forEach((card) => card.addEventListener("click", updateGenerationSelection));
document.querySelector("#start-button").addEventListener("click", startQuiz);
document.querySelector("#restart-button").addEventListener("click", () => { resultPanel.classList.add("hidden"); setupPanel.classList.remove("hidden"); setupPanel.scrollIntoView({ behavior: "smooth", block: "center" }); });
answerButtons.forEach((button) => button.addEventListener("click", () => answerQuestion(button)));