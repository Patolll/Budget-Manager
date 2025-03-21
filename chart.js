let charts = {};
function createChart(chartId, chartType, labels, data, chartLabel) {
  const ctx = document.getElementById(chartId).getContext("2d");
  charts[chartId] = new Chart(ctx, {
    type: chartType,
    data: {
      labels: labels,
      datasets: [
        {
          label: chartLabel,
          data: data,
          backgroundColor: [
            "red",
            "blue",
            "green",
            "orange",
            "purple",
            "yellow",
          ],
          barPercentage: 0.5,
        },
      ],
    },
    options: {
      responsive: true, // Umożliwia elastyczne dostosowanie rozmiaru
      maintainAspectRatio: false, // Jeśli chcesz, by wykres nie zachowywał proporcji
      aspectRatio: 1, // Współczynnik proporcji (szerokość:wysokość)
      layout: {
        padding: {
          top: 10,
          left: 10,
          right: 10,
          bottom: 10,
        },
      },
    },
  });
}
createChart(
  "expenseChart",
  "bar",
  ["Rent", "Taxes", "Transport", "Entertainment", "Food", "Other"],
  [0, 0, 0, 0, 0, 0],
  "Expenses"
);
createChart(
  "incomeChart",
  "bar",
  ["Salary", "Side-job", "Other"],
  [0, 0, 0],
  "Income"
);
function saveChartDataToLocalStorage(chartId) {
  if (charts[chartId]) {
    const chartData = charts[chartId].data.datasets[0].data;
    localStorage.setItem(chartId, JSON.stringify({ data: chartData }));
  }
}
function addDataToChart(chartId, category, value) {
  if (charts[chartId]) {
    const categoryIndex = charts[chartId].data.labels.indexOf(category);

    if (categoryIndex !== -1) {
      charts[chartId].data.datasets[0].data[categoryIndex] += value;
      charts[chartId].update();
      saveChartDataToLocalStorage(chartId);
    }
  }
}
function deleteDataFromChart(chartId, category, value) {
  if (charts[chartId]) {
    const categoryIndex = charts[chartId].data.labels.indexOf(category);

    if (categoryIndex !== -1) {
      const newValue =
        charts[chartId].data.datasets[0].data[categoryIndex] - value;
      if (newValue >= 0) {
        charts[chartId].data.datasets[0].data[categoryIndex] = newValue;
        charts[chartId].update();
        saveChartDataToLocalStorage(chartId);
      } else {
        console.warn(`Value for ${category} would go below 0.`);
      }
    }
  }
}

document.getElementById("expenseForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const incomeAmount = Number(document.getElementById("expenseInput").value);
  const incomeCategory = document.getElementById("expenseSelect").value;
  if (incomeAmount > 0 && incomeCategory) {
    const buttonClicked = event.submitter;
    if (buttonClicked.classList.contains("addBtn")) {
      addDataToChart("expenseChart", incomeCategory, incomeAmount);
    } else if (buttonClicked.classList.contains("deleteBtn")) {
      deleteDataFromChart("expenseChart", incomeCategory, incomeAmount);
    }
  } else {
    console.error("Not valid data");
  }
  document.getElementById("expenseInput").value = "";
  document.getElementById("expenseSelect").value = "";
});

document.getElementById("incomeForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const incomeAmount = Number(document.getElementById("incomeInput").value);
  const incomeCategory = document.getElementById("incomeSelect").value;

  if (incomeAmount > 0 && incomeCategory) {
    const buttonClicked = event.submitter;
    if (buttonClicked.classList.contains("addBtn")) {
      addDataToChart("incomeChart", incomeCategory, incomeAmount);
    } else if (buttonClicked.classList.contains("deleteBtn")) {
      deleteDataFromChart("incomeChart", incomeCategory, incomeAmount);
    }
  } else {
    console.error("Not valid data");
  }

  document.getElementById("incomeInput").value = "";
  document.getElementById("incomeSelect").value = "";
});

function loadChartDataFromLocalStorage(chartId) {
  const savedData = localStorage.getItem(chartId);
  if (savedData) {
    const { data } = JSON.parse(localStorage.getItem(chartId));
    charts[chartId].data.datasets[0].data = data;

    charts[chartId].update();
  }
}

window.onload = function () {
  loadChartDataFromLocalStorage("expenseChart");
  loadChartDataFromLocalStorage("incomeChart");
};
function clearChart(chartId) {
  if (charts[chartId]) {
    charts[chartId].data.datasets[0].data = [];
    charts[chartId].update();
  }
  localStorage.removeItem(chartId);
  setTimeout(() => {
    window.location.reload(); // Teraz przeładowanie strony
  }, 100);
}
function changeChartType(chartId, newType) {
  if (newType === "") {
    console.warn("Please choose a valid chart style.");
    return;
  }

  if (charts[chartId]) {
    const chartData = JSON.parse(JSON.stringify(charts[chartId].data));
    charts[chartId].destroy();

    const ctx = document.getElementById(chartId).getContext("2d");
    charts[chartId] = new Chart(ctx, {
      type: newType,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}
document
  .getElementById("expenseChartSelect")
  .addEventListener("change", function () {
    const newType = this.value;
    if (newType !== "") {
      changeChartType("expenseChart", newType);
    } else {
      console.warn("Please select a valid chart style.");
    }
  });
document
  .getElementById("incomeChartSelect")
  .addEventListener("change", function () {
    const newType = this.value;
    if (newType !== "") {
      changeChartType("incomeChart", newType);
    } else {
      console.warn("Please select a valid chart style.");
    }
  });
document.getElementById("clearExpense").addEventListener("click", () => {
  clearChart("expenseChart");
});
document.getElementById("clearIncome").addEventListener("click", () => {
  clearChart("incomeChart");
});
