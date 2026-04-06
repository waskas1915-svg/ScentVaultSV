export function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;
    if (container.children.length >= 3) {
      container.firstChild.remove();
    }

  container.appendChild(toast);

  const duration = type === "error" ? 3000 : 2000;
  setTimeout(() => {
      toast.classList.add("fade-out");

      setTimeout(() => {
          toast.remove();
      }, 300);
  }, duration);
}