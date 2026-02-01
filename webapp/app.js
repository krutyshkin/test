const form = document.querySelector("#hello-form");
const result = document.querySelector("#result");

const updateResult = (payload) => {
  result.textContent = JSON.stringify(payload, null, 2);
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get("name");
  const url = new URL("/api/hello", window.location.origin);

  if (name) {
    url.searchParams.set("name", name);
  }

  result.textContent = "Загрузка...";

  try {
    const response = await fetch(url);
    const payload = await response.json();
    updateResult(payload);
  } catch (error) {
    updateResult({
      error: "Не удалось связаться с API.",
      details: error?.message,
    });
  }
});
