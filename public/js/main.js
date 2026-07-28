document.addEventListener("DOMContentLoaded", () => {
  if (document.body.classList.contains("ascii-home")) {
    window.setTimeout(() => {
      document.body.classList.add("entry-complete");
    }, 2250);
  }

  const alerts = document.querySelectorAll(".alert");

  alerts.forEach((alertElement) => {
    window.setTimeout(() => {
      const alert = bootstrap.Alert.getOrCreateInstance(alertElement);
      alert.close();
    }, 5000);
  });
});
