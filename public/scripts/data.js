async function loadData() {
  const res = await fetch("/data", {
    method: "POST",
    body: "{}",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  const formatter = new JSONFormatter(data.data);
  document.querySelector(".content-wrapper1").appendChild(formatter.render());

  let finalData = [];
  let members = await fetch("/json/members.json");
  members = await members.json();
  let reporting = await fetch("/json/reporting.json");
  reporting = await reporting.json();
  let tempData = {};

  members.forEach((e) => {
    tempData = e;
    reporting.forEach((f) => {
      if (e["Name"] == f["Employee"]) {
        console.log(e["Name"]);
      }
    });
  });
}
loadData();
