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
            "green",
            "red",
            "blue",
            "orange",
            "purple",
            "yellow",
          ],
          barPercentage: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      layout: {
        padding: {
          top: 10,
          left: 10,
          right: 10,
          bottom: 10,
        },
      },
      plugins: {
        datalabels: {
          anchor: "end",
          align: "top",
          color: "black",
          font: {
            weight: "bold",
            size: 14,
          },
          formatter: (value) => value.toFixed(2) + "$",
        },
      },
    },
    plugins: [ChartDataLabels],
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
createChart("outputChart", "bar", ["Income", "Expenses"], [0, 0, 0], "Total");
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
      updateSummaryChart();
      balanceResult();
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
        updateSummaryChart();
        balanceResult();
      } else {
        console.warn(`Value for ${category} would go below 0.`);
      }
    }
  }
}

document.getElementById("expenseForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const incomeAmount = parseFloat(
    document.getElementById("expenseInput").value
  );

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
function updateSummaryChart() {
  const incomeData =
    JSON.parse(localStorage.getItem("incomeChart"))?.data || [];
  const expenseData =
    JSON.parse(localStorage.getItem("expenseChart"))?.data || [];

  const totalIncome = incomeData.reduce((acc, val) => acc + val, 0); // Suma dochodów
  const totalExpense = expenseData.reduce((acc, val) => acc + val, 0); // Suma wydatków

  if (charts["outputChart"]) {
    charts["outputChart"].data.datasets[0].data = [totalIncome, totalExpense];
    charts["outputChart"].update();
  }
}

function addDataToSummaryChart() {
  const expenseData =
    JSON.parse(localStorage.getItem("expenseChart"))?.data || [];
  const incomeData =
    JSON.parse(localStorage.getItem("incomeChart"))?.data || [];

  // Sumowanie danych
  const totalData = expenseData.map(
    (expense, index) => expense + (incomeData[index] || 0)
  );

  // Zaktualizowanie wykresu podsumowującego
  if (charts["outputChart"]) {
    charts["outputChart"].data.datasets[0].data = totalData;
    charts["outputChart"].update();
  }
}

window.onload = function () {
  loadChartDataFromLocalStorage("expenseChart");
  loadChartDataFromLocalStorage("incomeChart");
  updateSummaryChart();
  balanceResult();
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
        plugins: {
          datalabels: {
            anchor: "end",
            align: "top",
            color: "black",
            font: {
              weight: "bold",
              size: 14,
            },
            formatter: (value) => value.toFixed(2),
          },
        },
      },
      plugins: [ChartDataLabels], // Ładowanie pluginu znowu
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
function balanceResult() {
  const expenseData =
    JSON.parse(localStorage.getItem("expenseChart"))?.data || [];
  const incomeData =
    JSON.parse(localStorage.getItem("incomeChart"))?.data || [];

  const totalIncome = incomeData.reduce((acc, val) => acc + val, 0);
  const totalExpense = expenseData.reduce((acc, val) => acc + val, 0);
  const totalResult = totalIncome - totalExpense;

  const result = document.getElementById("balanceResult");
  const income = document.getElementById("incomeResult");
  const expense = document.getElementById("expenseResult");

  result.textContent = totalResult.toFixed(2);
  income.textContent = totalIncome.toFixed(2);
  expense.textContent = totalExpense.toFixed(2);
  let color = document.querySelector(".balanceBoxColor");
  if (totalIncome > totalExpense) {
    color.style.backgroundColor = "rgb(7, 182, 7)";
  } else if (totalIncome < totalExpense) {
    color.style.backgroundColor = " rgb(180, 37, 15)";
  } else {
    color.style.backgroundColor = "grey";
  }
}
