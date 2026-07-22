document.addEventListener("DOMContentLoaded", () => {
  const alerts = document.querySelectorAll(".alert");

  alerts.forEach((alertElement) => {
    window.setTimeout(() => {
      const alert = bootstrap.Alert.getOrCreateInstance(alertElement);
      alert.close();
    }, 5000);
  });
});