document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("expenseChart").getContext("2d");

  const myChart = new Chart(ctx, {
    type: "bar", // Typ wykresu (np. 'bar', 'line', 'pie')
    data: {
      labels: ["Food", "Transport", "Fun"], // Etykiety dla wykresu
      datasets: [
        {
          label: "Expenses",
          data: [300, 150, 200], // Dane, które chcesz przedstawić na wykresie
          backgroundColor: ["red", "blue", "green"], // Kolory dla każdego słupka
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
});

document.addEventListener("DOMContentLoaded", () => {
  const ctx2 = document.getElementById("incomeChart").getContext("2d");

  const myChart = new Chart(ctx2, {
    type: "bar", // Typ wykresu (np. 'bar', 'line', 'pie')
    data: {
      labels: ["Salary", "Transport", "Fun"], // Etykiety dla wykresu
      datasets: [
        {
          label: "Income",
          data: [300, 150, 200], // Dane, które chcesz przedstawić na wykresie
          backgroundColor: ["red", "blue", "green"],
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
});
