const QUESTIONS = [
  "Do you often forget recent conversations, events, or appointments?",
  "Do you struggle to complete familiar daily activities (like cooking, paying bills, or using appliances)?",
  "Do you get confused about the date, time, or place?",
  "Do you have trouble finding the right words in a conversation?",
  "Do you frequently misplace items and can’t retrace steps?",
  "Do you feel difficulty making decisions or solving simple problems?",
  "Have you experienced sudden mood swings, anxiety, or irritability?",
  "Have you reduced participation in hobbies, work, or social activities?",
  "Do you find it hard to stay focused on a task, TV program, or conversation?",
  "Do you repeat questions or stories without realizing you’ve already said them?",
  "Do you have difficulty recalling names of familiar people?",
  "Do you find it hard to follow conversations or movies?",
  "Do you experience difficulty balancing your checkbook or managing finances?",
  "Do you have trouble completing multi-step tasks such as cooking a meal?",
  "Do you have frequent mood or behavior changes?",
  "Do your family or friends notice changes in your cognitive abilities?",
  "Do you struggle to understand visual images and spatial relationships?",
  "Do you have difficulty planning or organizing activities?",
  "Have you become less engaged in social activities or work?",
  "Do you get lost in familiar places?"
];

let pickedQuestions = [];
let currentIndex = 0;
let answers = [];

// pick 10 random questions
function pickRandomQuestions() {
  const shuffled = QUESTIONS.sort(() => 0.5 - Math.random());
  pickedQuestions = shuffled.slice(0, 10);
  answers = Array(10).fill(null);
}

// render current question
function renderQuestion() {
  const qList = document.getElementById("qList");
  qList.innerHTML = "";

  if (currentIndex < pickedQuestions.length) {
    const q = pickedQuestions[currentIndex];
    const div = document.createElement("div");
    div.className = "tile";
    div.innerHTML = `
      <div style="font-weight:600; margin-bottom:10px">Q${currentIndex+1}. ${q}</div>
      <div class="segmented vertical" role="radiogroup">
        ${[0,1,2,3].map(v => `
          <input type="radio" id="q${currentIndex}-${v}" name="q${currentIndex}" value="${v}">
          <label for="q${currentIndex}-${v}">${["Never","Rarely","Sometimes","Often"][v]}</label>
        `).join("")}
      </div>
    `;
    qList.appendChild(div);

    div.querySelectorAll(`input[name="q${currentIndex}"]`).forEach(inp => {
      inp.addEventListener("change", e => {
        answers[currentIndex] = Number(e.target.value);
        currentIndex++;
        renderQuestion();
      });
    });
  } else {
    qList.innerHTML = "<p>All questions completed. Click Submit to see your results.</p>";
    document.querySelector("button[type='submit']").style.display = "inline-block";
  }
}

// handle Submit
function submitAssessment(e) {
  e.preventDefault();

  if (answers.some(a => a === null)) {
    document.getElementById("scoreMsg").textContent = "Please answer all questions.";
    return false;
  }

  const total = answers.reduce((s,a)=>s+a,0);
  const risk = total <= 6 ? "Low" : total <= 16 ? "Moderate" : "Elevated";

  document.getElementById("scoreMsg").innerHTML =
    `Score: <strong>${total}/30</strong> • Risk: <strong>${risk}</strong>`;

  // show circle
  document.getElementById("scoreCircleWrapper").style.display = "block";
  const circle = document.querySelector(".progress-ring__circle");
  const scoreValue = document.getElementById("scoreValue");
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  circle.style.strokeDasharray = circumference;

  let progress = 0;
  const targetPercent = total / 30;  // max score = 30
  const targetOffset = circumference - targetPercent * circumference;

  // Animate circle + score number
  let displayedScore = 0;
  function animate() {
    progress += 0.02; // speed
    if (progress > 1) progress = 1;

    // Circle fill
    const currentOffset = circumference - (targetPercent * circumference * progress);
    circle.style.strokeDashoffset = currentOffset;

    // Number counting
    displayedScore = Math.floor(total * progress);
    scoreValue.textContent = displayedScore;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      scoreValue.textContent = total; // final score
    }
  }
  requestAnimationFrame(animate);

  // change color based on risk
  if (risk === "Low") circle.style.stroke = "green";
  else if (risk === "Moderate") circle.style.stroke = "orange";
  else circle.style.stroke = "red";

  // show Retake button
  const retakeBtn = document.getElementById("retakeBtn");
  retakeBtn.style.display = "inline-block";

  return false;
}

// restart assessment
function retakeAssessment() {
  currentIndex = 0;
  pickRandomQuestions();
  renderQuestion();
  document.querySelector("button[type='submit']").style.display = "none";
  document.getElementById("scoreCircleWrapper").style.display = "none";
  document.getElementById("scoreMsg").textContent = "";
  document.getElementById("retakeBtn").style.display = "none";
}

// init
window.addEventListener("load", () => {
  pickRandomQuestions();
  renderQuestion();
  document.querySelector("button[type='submit']").style.display = "none";
});
