const API_URL = 'https://api.jsonbin.io/v3/b/679e6276acd3cb34a8d6a001';
const API_KEY = '$2a$10$9s4iSBZroxXX2aWGmnYKxerH0JuGZkpQwXWBcggrbKkyGqx2tkqe6';

const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const scoreSummary = document.getElementById('score-summary');
const startButton = document.getElementById('start-btn');
const quizContainer = document.getElementById('quiz-container');

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// Start button click event
startButton.addEventListener('click', startQuiz);

// Fetch quiz questions from API
async function fetchQuestions() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        'X-Master-Key': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch questions: ${response.statusText}`);
    }

    const jsonResponse = await response.json();
    questions = jsonResponse.record;
  } catch (error) {
    console.error("Error fetching questions:", error);
    questionElement.innerText = "Error loading quiz. Please try again.";
  }
}

// Start the quiz
function startQuiz() {
  score = 0;
  currentQuestionIndex = 0;
  scoreSummary.innerText = '';
  startButton.style.display = 'none';
  quizContainer.style.display = 'block';
  nextButton.style.display = 'none';

  fetchQuestions().then(() => {
    showQuestion(questions[currentQuestionIndex]);
  });
}

// Show question and options
function showQuestion(question) {
  questionElement.innerText = question.question;
  answerButtonsElement.innerHTML = '';

  question.options.forEach(option => {
    const button = document.createElement('button');
    button.innerText = option;
    button.classList.add('btn');
    button.addEventListener('click', () => selectAnswer(button, option, question.answer));
    answerButtonsElement.appendChild(button);
  });
}

// Handle answer selection
function selectAnswer(button, selectedAnswer, correctAnswer) {
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => btn.disabled = true);

  if (selectedAnswer === correctAnswer) {
    button.classList.add('correct');
    score++;
    triggerConfettiRain(); // Show confetti rain for correct answers
  } else {
    button.classList.add('incorrect');
    shakeButton(button); // Shake animation for wrong answers
  }

  nextButton.style.display = 'block';
}

// Trigger confetti rain animation
function triggerConfettiRain() {
  for (let i = 0; i < 150; i++) {
    createConfettiPiece();
  }
}

function createConfettiPiece() {
  const confettiPiece = document.createElement('div');
  confettiPiece.classList.add('confetti-piece');
  
  // Random positioning and color
  confettiPiece.style.left = `${Math.random() * 100}vw`;
  confettiPiece.style.animationDelay = `${Math.random() * 3}s`;
  confettiPiece.style.backgroundColor = getRandomColor();

  document.body.appendChild(confettiPiece);

  setTimeout(() => confettiPiece.remove(), 4000);
}

// Get a random vibrant color for confetti pieces
function getRandomColor() {
  const colors = ['#FFCC00', '#FF4081', '#36CFC9', '#F85C50', '#28a745'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Shake animation for wrong answers
function shakeButton(button) {
  button.classList.add('shake');
  setTimeout(() => {
    button.classList.remove('shake');
  }, 1000); // Remove shake class after 1 second
}

// Move to the next question or show results
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion(questions[currentQuestionIndex]);
  } else {
    showResults();
  }
  nextButton.style.display = 'none';
}

// Display results
function showResults() {
  questionElement.innerText = `Quiz Completed! Your score is ${score} out of ${questions.length}.`;
  answerButtonsElement.innerHTML = '';
  nextButton.style.display = 'none';
  scoreSummary.innerText = `You scored ${score} out of ${questions.length}. Thank you for playing!`;

  if (score === questions.length) {
    scoreSummary.innerText = `Perfect score! 🎉 You got all answers correct!`;
  } else if (score > questions.length / 2) {
    scoreSummary.innerText = `Well done! You scored ${score}. Keep it up!`;
  } else {
    scoreSummary.innerText = `Better luck next time! You scored ${score}.`;
  }
}

nextButton.addEventListener('click', nextQuestion);

// Initial Setup - Hide quiz and show start button
quizContainer.style.display = 'none';
nextButton.style.display = 'none';
