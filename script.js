const ques = document.querySelector(".ques");
const optionBox = document.querySelector(".options");
const quizContainer = document.querySelector(".quiz-container");
const restartBtn = document.querySelector(".restartBtn");
const exitBtn = document.querySelector(".exitBtn");

let questions = [];
let current = 0;
let score = 0;

const fileUrl = 'https://raw.githubusercontent.com/parth1512kshatriya/csvFile/refs/heads/main/file.csv';

fetch(fileUrl)
  .then(response => response.text())
  .then(data => {
    const questionsData = data.split('}');
    const uniqueQuestions = [];

    questionsData.forEach(q => {
      q = q.replace('{', '').trim();
      if (q === '') {
        return;
      }

      const parts = q.split(',');
      if (parts.length < 6) {
        return;
      }

      const cleanPart = (part) => part.replace(/"/g, '').trim();
      const questionText = cleanPart(parts[0]);

      let isDuplicate = false;
      for (let i = 0; i < uniqueQuestions.length; i++) {
        if (uniqueQuestions[i].question === questionText) {
          isDuplicate = true;
          break;
        }
      }

      if (!isDuplicate) {
        const questionObj = {
          question: questionText,
          option: [
            cleanPart(parts[1]),
            cleanPart(parts[2]),
            cleanPart(parts[3]),
            cleanPart(parts[4])
          ],
          answer: cleanPart(parts[5])
        };
        uniqueQuestions.push(questionObj);
      }
    });

    questions = uniqueQuestions.slice(0, 10);
  })
  .catch(error => {
    console.error('Error fetching the CSV file:', error);
  });


function showQuestion(index) {
  const q = questions[index];
  ques.innerHTML = q.question;
  optionBox.innerHTML = "";

  q.option.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;

    btn.onclick = () => {
      const allButtons = optionBox.querySelectorAll("button");
      allButtons.forEach(b => b.disabled = true);

      if (opt == q.answer) {
        btn.style.backgroundColor = "green";
        btn.style.color = "white";
        score++;
      } else {
        btn.style.backgroundColor = "red";
        btn.style.color = "white";
        allButtons.forEach(b => {
          if (b.textContent == q.answer) {
            b.style.backgroundColor = "green";
            b.style.color = "white";
          }
        });
      }

      setTimeout(() => {
        current++;
        if (current < questions.length) {
          showQuestion(current);
        } else {
          showResult();
        }
      }, 350);
    };

    optionBox.appendChild(btn);
  });
}

function onStart() {

  const shuffledQuestions = [...questions];
  const newQuestions = [];

  while (shuffledQuestions.length > 0) {
    const randomIndex = Math.floor(Math.random() * shuffledQuestions.length);
    const randomQuestion = shuffledQuestions.splice(randomIndex, 1)[0];
    newQuestions.push(randomQuestion);
  }

  questions = newQuestions;
  quizContainer.style.display = "none";
  ques.style.display = "block";
  exitBtn.style.display = "block";
  showQuestion(current);
}

function showResult() {
  ques.innerHTML = `Quiz finished! Your score is: ${score} / ${questions.length}`;
  optionBox.innerHTML = "";
  restartBtn.style.display = "block";
  exitBtn.style.display = "none";
}

function restartGame() {
  current = 0;
  score = 0;
  restartBtn.style.display = "none";
  exitBtn.style.display = "block";
  showQuestion(current);
}

function onExitBtn() {
  const confirmExit = confirm("Are you sure you want to go back?");
  if (confirmExit) {
    window.location.href = "index.html";
  } else {
    // Do nothing
  }
}






