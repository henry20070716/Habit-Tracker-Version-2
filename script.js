const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitList = document.getElementById("habitList");
const searchInput = document.getElementById("searchInput");

const totalHabits = document.getElementById("totalHabits");
const completedHabits = document.getElementById("completedHabits");
const pendingHabits = document.getElementById("pendingHabits");
const streakCount = document.getElementById("streakCount");

const progress = document.getElementById("progress");
const progressText = document.getElementById("progressText");

const badges = document.getElementById("badges");
const category = document.getElementById("category");

const themeToggle = document.getElementById("themeToggle");

let habits = JSON.parse(localStorage.getItem("habits")) || [];
let streak = Number(localStorage.getItem("streak")) || 0;

renderHabits();
updateDashboard();

addHabitBtn.addEventListener("click", () => {

    const text = habitInput.value.trim();

    if(text === ""){
        alert("Enter a habit!");
        return;
    }

    habits.push({
        id: Date.now(),
        text,
        category: category.value,
        completed: false
    });

    saveData();

    habitInput.value = "";
});

function renderHabits(){

    habitList.innerHTML = "";

    habits.forEach(habit => {

        const div = document.createElement("div");
        div.className = "habit";

        div.innerHTML = `
            <div class="habit-info">
                <span class="${habit.completed ? "completed" : ""}">
                    ${habit.text}
                </span>

                <span class="category">
                    ${habit.category}
                </span>
            </div>

            <div class="actions">

                <button
                class="done-btn"
                onclick="toggleHabit(${habit.id})">
                ${habit.completed ? "Undo" : "Done"}
                </button>

                <button
                class="delete-btn"
                onclick="deleteHabit(${habit.id})">
                Delete
                </button>

            </div>
        `;

        habitList.appendChild(div);

    });

    updateDashboard();
}

function toggleHabit(id){

    habits = habits.map(habit => {

        if(habit.id === id){

            if(!habit.completed){
                streak++;
                localStorage.setItem("streak", streak);
            }

            return {
                ...habit,
                completed: !habit.completed
            };
        }

        return habit;
    });

    saveData();
}

function deleteHabit(id){

    habits = habits.filter(habit => habit.id !== id);

    saveData();
}

function updateDashboard(){

    const total = habits.length;

    const completed =
    habits.filter(h => h.completed).length;

    const pending = total - completed;

    totalHabits.textContent = total;
    completedHabits.textContent = completed;
    pendingHabits.textContent = pending;
    streakCount.textContent = streak;

    let percent = total === 0
    ? 0
    : Math.round((completed / total) * 100);

    progress.style.width = percent + "%";
    progressText.textContent =
    percent + "% Completed";

    updateBadges(completed);
}

function updateBadges(completed){

    badges.innerHTML = "";

    if(completed >= 1){

        badges.innerHTML += `
        <span class="badge">
        🥉 Beginner
        </span>`;
    }

    if(completed >= 5){

        badges.innerHTML += `
        <span class="badge">
        🥈 Consistent
        </span>`;
    }

    if(completed >= 10){

        badges.innerHTML += `
        <span class="badge">
        🥇 Habit Master
        </span>`;
    }

    if(completed === 0){

        badges.innerHTML = `
        <span class="badge">
        Start Your Journey
        </span>`;
    }
}

function saveData(){

    localStorage.setItem(
        "habits",
        JSON.stringify(habits)
    );

    renderHabits();
}

searchInput.addEventListener("input", () => {

    const value =
    searchInput.value.toLowerCase();

    const habitCards =
    document.querySelectorAll(".habit");

    habitCards.forEach(card => {

        if(
            card.innerText
            .toLowerCase()
            .includes(value)
        ){
            card.style.display = "flex";
        }
        else{
            card.style.display = "none";
        }

    });

});

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle(
        "light-mode"
    );

    if(
        document.body.classList.contains(
            "light-mode"
        )
    ){

        localStorage.setItem(
            "theme",
            "light"
        );

        themeToggle.textContent = "☀️";
    }
    else{

        localStorage.setItem(
            "theme",
            "dark"
        );

        themeToggle.textContent = "🌙";
    }

});

if(
    localStorage.getItem("theme")
    === "light"
){

    document.body.classList.add(
        "light-mode"
    );

    themeToggle.textContent = "☀️";
}