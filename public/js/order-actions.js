document.addEventListener("DOMContentLoaded", () => {
  const cancellationForms =
    document.querySelectorAll(
      ".cancel-order-form"
    );

  cancellationForms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      const confirmed = window.confirm(
        "Are you sure you want to cancel this order?"
      );

      if (!confirmed) {
        event.preventDefault();
      }
    });
  });
});