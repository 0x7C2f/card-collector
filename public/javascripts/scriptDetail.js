const auto_update_cont = document.getElementById('auto-update-form-container');
const auto_update_toggle = document.getElementById("auto-update-toggle");
const close_btn = document.getElementById("close-btn");
const msg_container = document.getElementById("msg");

auto_update_toggle.addEventListener("click", () => {
  auto_update_cont.classList.add("visible");
})

close_btn.addEventListener("click", () => {
  auto_update_cont.classList.remove("visible");
})

setTimeout(() => msg_container.classList.add("show"), 10);
setTimeout(() => msg_container.classList.remove("show"), 3000);