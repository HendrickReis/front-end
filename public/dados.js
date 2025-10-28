document.addEventListener("DOMContentLoaded", async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  window.location.href = "http://localhost:8080/"
})
