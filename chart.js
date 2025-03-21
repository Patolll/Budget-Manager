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
function addDataToChart(chartId, category, value) {
  if (charts[chartId]) {
    const categoryIndex = charts[chartId].data.labels.indexOf(category);

    if (categoryIndex !== -1) {
      charts[chartId].data.datasets[0].data[categoryIndex] += value;
      charts[chartId].update();
    }
  }
}

document.getElementById("expenseForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const incomeAmount = Number(document.getElementById("expenseInput").value);
  const incomeCategory = document.getElementById("expenseSelect").value;
  if (incomeAmount > 0 && incomeCategory) {
    addDataToChart("expenseChart", incomeCategory, incomeAmount);
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
    addDataToChart("incomeChart", incomeCategory, incomeAmount);
  } else {
    console.error("Not valid data");
  }
  document.getElementById("incomeInput").value = "";
  document.getElementById("incomeSelect").value = "";
});
