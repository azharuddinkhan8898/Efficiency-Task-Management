async function loadData() {
  const res = await fetch("/data", {
    method: "POST",
    body: "{}",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  const formatter = new JSONFormatter(data.data);
  document.querySelector(".content-wrapper1").appendChild(formatter.render());
}
loadData();
