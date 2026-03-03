<script>
const botName = "zukezargispgt";

// Load learned data from browser storage
let memory = JSON.parse(localStorage.getItem("zukezargispgt_memory")) || {};

// Basic bad word filter
const badWords = ["badword1", "badword2", "stupid", "idiot"];

// Simple spell correction dictionary
const corrections = {
    "helo": "hello",
    "hw": "how",
    "whta": "what",
    "pii": "pi",
    "mth": "math"
};

// Save memory
function saveMemory() {
    localStorage.setItem("zukezargispgt_memory", JSON.stringify(memory));
}

// Spell correction
function correctSpelling(input) {
    let words = input.split(" ");
    return words.map(word => corrections[word] || word).join(" ");
}

// Detect math
function tryMath(input) {
    if (/^[0-9+\-*/(). ]+$/.test(input)) {
        try {
            return eval(input);
        } catch {
            return "Math error.";
        }
    }
    return null;
}

// Detect bad words
function containsBadWord(input) {
    return badWords.some(word => input.includes(word));
}

// Main response function
function respond(input) {
    input = input.toLowerCase().trim();
    input = correctSpelling(input);

    // Bad word detection
    if (containsBadWord(input)) {
        return "Please keep it respectful.";
    }

    // Learning format: learn: question=answer
    if (input.startsWith("learn:")) {
        let content = input.replace("learn:", "").trim();
        let parts = content.split("=");
        if (parts.length === 2) {
            let question = parts[0].trim();
            let answer = parts[1].trim();
            memory[question] = answer;
            saveMemory();
            return "Learned successfully!";
        }
        return "Use format: learn: question=answer";
    }

    // If learned before
    if (memory[input]) {
        return memory[input];
    }

    // Math
    let mathResult = tryMath(input);
    if (mathResult !== null) {
        return mathResult;
    }

    // Built-in responses
    if (input.includes("hello")) return "Hello!";
    if (input.includes("how are you")) return "I'm functioning perfectly.";
    if (input.includes("pi")) return Math.PI.toString();
    if (input.includes("name")) return "My name is " + botName;

    return "I don't understand yet. You can teach me using: learn: question=answer";
}

// Connect to HTML
function sendMessage() {
    const inputField = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");
    let userText = inputField.value;

    if (!userText) return;

    let botReply = respond(userText);

    chatBox.innerHTML += "<p><strong>You:</strong> " + userText + "</p>";
    chatBox.innerHTML += "<p><strong>" + botName + ":</strong> " + botReply + "</p>";

    inputField.value = "";
}
</script>