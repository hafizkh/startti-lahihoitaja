(function () {
  "use strict";

  function normalize(str) {
    return (str || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[.,;:!?"'()]/g, "")
      .replace(/\s+/g, " ");
  }

  function answerMatches(userValue, item) {
    var correct = item.getAttribute("data-correct") || "";
    var altRaw = item.getAttribute("data-alt") || "";
    var accepted = [correct].concat(altRaw ? altRaw.split("|") : []).map(normalize);
    return accepted.indexOf(normalize(userValue)) !== -1;
  }

  function markItem(item, isCorrect, isAnswered) {
    item.classList.remove("correct", "incorrect", "unanswered");
    if (!isAnswered) {
      item.classList.add("unanswered");
    } else if (isCorrect) {
      item.classList.add("correct");
    } else {
      item.classList.add("incorrect");
    }
  }

  function showCorrectNote(item, correctText) {
    var note = item.querySelector(".correct-answer-note");
    if (!note) {
      note = document.createElement("div");
      note.className = "correct-answer-note";
      item.appendChild(note);
    }
    note.textContent = "Oikea vastaus: " + correctText;
  }

  function clearCorrectNote(item) {
    var note = item.querySelector(".correct-answer-note");
    if (note) note.remove();
  }

  function checkTF(item) {
    var selected = item.querySelector(".tf-btn.selected");
    var answered = !!selected;
    var isCorrect = answered && answerMatches(selected.getAttribute("data-value"), item);
    markItem(item, isCorrect, answered);
    item.querySelectorAll(".tf-btn").forEach(function (btn) {
      btn.classList.remove("correct-btn", "incorrect-btn");
    });
    var correctValue = (item.getAttribute("data-correct") || "").trim();
    if (answered) {
      if (isCorrect) {
        selected.classList.add("correct-btn");
      } else {
        selected.classList.add("incorrect-btn");
        var correctBtn = item.querySelector('.tf-btn[data-value="' + correctValue + '"]');
        if (correctBtn) correctBtn.classList.add("correct-btn");
      }
    }
    return { answered: answered, correct: isCorrect };
  }

  function checkFill(item) {
    var input = item.querySelector(".blank-input");
    var value = input ? input.value : "";
    var answered = normalize(value).length > 0;
    var isCorrect = answered && answerMatches(value, item);
    markItem(item, isCorrect, answered);
    if (answered && !isCorrect) {
      showCorrectNote(item, item.getAttribute("data-correct"));
    } else {
      clearCorrectNote(item);
    }
    return { answered: answered, correct: isCorrect };
  }

  function checkMCQ(item) {
    var checked = item.querySelector('input[type="radio"]:checked');
    var answered = !!checked;
    var isCorrect = answered && answerMatches(checked.value, item);
    markItem(item, isCorrect, answered);
    item.querySelectorAll(".mcq-opt").forEach(function (opt) {
      opt.classList.remove("correct-opt", "incorrect-opt");
    });
    var correctValue = (item.getAttribute("data-correct") || "").trim();
    item.querySelectorAll('input[type="radio"]').forEach(function (radio) {
      var opt = radio.closest(".mcq-opt");
      if (!opt) return;
      if (normalize(radio.value) === normalize(correctValue)) {
        opt.classList.add("correct-opt");
      } else if (radio.checked) {
        opt.classList.add("incorrect-opt");
      }
    });
    return { answered: answered, correct: isCorrect };
  }

  function checkItem(item) {
    var type = item.getAttribute("data-type");
    if (type === "tf") return checkTF(item);
    if (type === "fill") return checkFill(item);
    if (type === "mcq") return checkMCQ(item);
    return null;
  }

  function checkSection(section) {
    var items = section.querySelectorAll(".exam-item[data-type]");
    var correctCount = 0;
    var answeredCount = 0;
    items.forEach(function (item) {
      var result = checkItem(item);
      if (result) {
        if (result.answered) answeredCount++;
        if (result.correct) correctCount++;
      }
    });
    var resultEl = section.querySelector(".section-result");
    if (resultEl) {
      var missing = items.length - answeredCount;
      resultEl.textContent =
        "Oikein " + correctCount + " / " + items.length +
        (missing > 0 ? " (vastaamatta: " + missing + ")" : "");
    }
    return { correct: correctCount, total: items.length };
  }

  function resetSection(section) {
    section.querySelectorAll(".exam-item[data-type]").forEach(function (item) {
      item.classList.remove("correct", "incorrect", "unanswered");
      item.querySelectorAll(".tf-btn").forEach(function (btn) {
        btn.classList.remove("selected", "correct-btn", "incorrect-btn");
      });
      var input = item.querySelector(".blank-input");
      if (input) input.value = "";
      item.querySelectorAll('input[type="radio"]').forEach(function (radio) {
        radio.checked = false;
      });
      item.querySelectorAll(".mcq-opt").forEach(function (opt) {
        opt.classList.remove("correct-opt", "incorrect-opt");
      });
      clearCorrectNote(item);
    });
    var resultEl = section.querySelector(".section-result");
    if (resultEl) resultEl.textContent = "";
  }

  function checkAll() {
    var sections = document.querySelectorAll(".exam-section");
    var totalCorrect = 0;
    var totalCount = 0;
    sections.forEach(function (section) {
      var res = checkSection(section);
      totalCorrect += res.correct;
      totalCount += res.total;
    });
    var grandResult = document.querySelector(".grand-result");
    if (grandResult) {
      var pct = totalCount ? Math.round((totalCorrect / totalCount) * 100) : 0;
      grandResult.textContent =
        "Tulos yhteensä: " + totalCorrect + " / " + totalCount + " oikein (" + pct + " %)";
    }
  }

  function resetAll() {
    document.querySelectorAll(".exam-section").forEach(resetSection);
    var grandResult = document.querySelector(".grand-result");
    if (grandResult) grandResult.textContent = "";
  }

  document.addEventListener("click", function (e) {
    var tfBtn = e.target.closest(".tf-btn");
    if (tfBtn) {
      var item = tfBtn.closest(".exam-item");
      item.querySelectorAll(".tf-btn").forEach(function (btn) {
        btn.classList.remove("selected", "correct-btn", "incorrect-btn");
      });
      tfBtn.classList.add("selected");
      item.classList.remove("correct", "incorrect", "unanswered");
      clearCorrectNote(item);
      return;
    }

    var checkBtn = e.target.closest(".check-btn");
    if (checkBtn) {
      var section = checkBtn.closest(".exam-section");
      if (section) checkSection(section);
      return;
    }

    var resetBtn = e.target.closest(".reset-btn");
    if (resetBtn) {
      var section2 = resetBtn.closest(".exam-section");
      if (section2) resetSection(section2);
      return;
    }

    if (e.target.closest(".check-all-btn")) {
      checkAll();
      return;
    }

    if (e.target.closest(".reset-all-btn")) {
      resetAll();
      return;
    }
  });
})();
