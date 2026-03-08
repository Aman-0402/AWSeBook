/* ============================================================
   TEMPLATE.JS  —  AWS Academy Data Engineering
   Handles: top button, section reveal animation, quiz logic
   Supports: single-answer buttons AND multi-select checkboxes
   ============================================================ */

/* ── TOP BUTTON ── */
const topBtn = document.getElementById("topBtn");

if (topBtn) {
  window.addEventListener("scroll", function () {
    const scrolled =
      document.body.scrollTop > 300 ||
      document.documentElement.scrollTop > 300;
    topBtn.style.display = scrolled ? "flex" : "none";
  });

  topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ── SECTION REVEAL ANIMATION ── */
const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  },
  { threshold: 0.12 }
);

sections.forEach((section) => observer.observe(section));

/* ============================================================
   QUIZ ENGINE
   - Counts both .quiz-question (single-answer) blocks
     and .quiz-multi (multi-select checkbox) blocks
   - Tracks answered / correct across both types
   - Shows score bar once every question is answered
   ============================================================ */

let _answered = 0;
let _correct  = 0;
let _total    = 0;

document.addEventListener("DOMContentLoaded", () => {
  _total =
    document.querySelectorAll(".quiz-question").length +
    document.querySelectorAll(".quiz-multi").length;
});

/* ── Helper: attempt to show the score bar ── */
function _tryShowScore() {
  if (_answered < _total) return;

  const bar     = document.getElementById("scoreBar");
  const countEl = document.getElementById("scoreCount");
  const msgEl   = document.getElementById("scoreMsg");
  if (!bar) return;

  bar.style.display  = "block";
  countEl.textContent = `${_correct} / ${_total}`;

  const pct = _correct / _total;
  if (pct === 1) {
    msgEl.textContent = "🏆 Perfect score! You are ready for the next module.";
  } else if (pct >= 0.7) {
    msgEl.textContent =
      "✅ Good work! Review any missed questions before moving on.";
  } else {
    msgEl.textContent = "📖 Review the sections above, then try again.";
  }

  bar.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ── SINGLE-ANSWER QUIZ ──────────────────────────────────────
   answer(btn, chosen, correctAns)
     btn        – clicked <button> element
     chosen     – letter the user clicked, e.g. "B"
     correctAns – letter of the right answer,  e.g. "C"
   ──────────────────────────────────────────────────────────── */
function answer(btn, chosen, correctAns) {
  const question = btn.closest(".quiz-question");
  if (!question || question.dataset.done) return;
  question.dataset.done = "1";
  _answered++;

  /* Lock all option buttons */
  const allBtns = question.querySelectorAll(".option-btn");
  allBtns.forEach((b) => (b.disabled = true));

  /* Always highlight the correct button green */
  allBtns.forEach((b) => {
    if (b.querySelector(".opt-label").textContent.trim() === correctAns) {
      b.classList.add("correct");
    }
  });

  const expEl = question.querySelector(".explanation");

  if (chosen === correctAns) {
    btn.classList.add("correct");
    if (expEl) {
      expEl.classList.add("show", "correct-exp");
    }
    _correct++;
  } else {
    btn.classList.add("wrong");
    if (expEl) {
      expEl.classList.add("show", "wrong-exp");
      expEl.innerHTML =
        "❌ Not quite. " + expEl.innerHTML.replace(/^[✅❌]\s*/, "");
    }
  }

  _tryShowScore();
}

/* ── MULTI-SELECT CHECKBOX QUIZ ──────────────────────────────
   checkMulti(qId, correctVals)
     qId         – id attribute of the .quiz-multi div
     correctVals – array of correct option values, e.g. ["A","C","E"]
   ──────────────────────────────────────────────────────────── */
function checkMulti(qId, correctVals) {
  const block = document.getElementById(qId);
  if (!block || block.dataset.done) return;
  block.dataset.done = "1";
  _answered++;

  /* Disable the Check button */
  const submitBtn = block.querySelector(".check-btn");
  if (submitBtn) submitBtn.disabled = true;

  /* Gather selected values */
  const options    = block.querySelectorAll(".checkbox-option");
  const correctSet = new Set(correctVals);
  const selected   = new Set();

  options.forEach((opt) => {
    const cb = opt.querySelector("input[type='checkbox']");
    if (cb && cb.checked) selected.add(cb.value);
  });

  /* Lock all checkboxes */
  options.forEach((opt) => {
    const cb = opt.querySelector("input[type='checkbox']");
    if (cb) cb.disabled = true;
    opt.classList.add("locked");
  });

  /* Colour-code each option */
  let allCorrect = true;

  options.forEach((opt) => {
    const cb         = opt.querySelector("input[type='checkbox']");
    const val        = cb ? cb.value : "";
    const isCorrect  = correctSet.has(val);
    const isSelected = selected.has(val);

    if (isSelected && isCorrect)  opt.classList.add("correct-pick");   // ✅ ticked right
    if (isSelected && !isCorrect) {
      opt.classList.add("wrong-pick");    // ❌ ticked wrong
      allCorrect = false;
    }
    if (!isSelected && isCorrect) {
      opt.classList.add("missed-pick");   // ⚠️ missed correct option
      allCorrect = false;
    }
  });

  if (allCorrect) _correct++;

  /* Show explanation */
  const expEl = block.querySelector(".multi-explanation");
  if (expEl) {
    expEl.classList.add("show");
    if (allCorrect) {
      expEl.classList.add("correct-exp");
    } else {
      expEl.classList.add("wrong-exp");
      expEl.textContent =
        "❌ " + expEl.textContent.replace(/^[✅❌]\s*/, "");
    }
  }

  _tryShowScore();
}

/* ── LEGACY HELPER (simple true/false buttons) ── */
function checkAnswer(button, isCorrect) {
  const question = button.closest(".quiz-question");
  if (!question || question.dataset.done) return;
  question.dataset.done = "1";

  const siblings = question.querySelectorAll("button");
  siblings.forEach((b) => (b.disabled = true));

  button.style.background = isCorrect ? "#16a34a" : "#dc2626";
  const explanation = question.querySelector(".explanation");
  if (explanation) explanation.style.display = "block";
}

/* ── Expose a no-op showScore so older pages don't error ── */
function showScore() {}