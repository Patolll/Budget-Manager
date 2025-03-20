document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("myChart").getContext("2d");

  const myChart = new Chart(ctx, {
    type: "bar", // Typ wykresu (np. 'bar', 'line', 'pie')
    data: {
      labels: ["Jedzenie", "Transport", "Rozrywka"], // Etykiety dla wykresu
      datasets: [
        {
          label: "Wydatki",
          data: [300, 150, 200], // Dane, które chcesz przedstawić na wykresie
          backgroundColor: ["red", "blue", "green"], // Kolory dla każdego słupka
        },
      ],
    },
  });
});
