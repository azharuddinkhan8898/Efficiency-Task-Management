//const e = require("express");

async function loadData() {
  const res = await fetch("/data", {
    method: "POST",
    body: "{}",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  const formatter = new JSONFormatter(data.data);
  document.querySelector(".content-wrapper1").appendChild(formatter.render());

  //add user connections

  // let finalData = [];
  // let joiningDetails = await fetch("/json/joiningDetails.json");
  // joiningDetails = await joiningDetails.json();
  // let reporting = await fetch("/json/reporting.json");
  // reporting = await reporting.json();

  // joiningDetails.forEach((e) => {
  //   let tempData = {};
  //   //tempData = e;
  //   //console.log(tempData);
  //   tempData.email = e["Email id"].toLowerCase();
  //   tempData.name = e["Name"];
  //   tempData.reportingName = e["Reporting Manager"];
  //   tempData.reportingEmail = "NA";
  //   joiningDetails.forEach((k) => {
  //     if (k["Name"].toLowerCase() === tempData.reportingName.toLowerCase()) {
  //       tempData.reportingEmail = k["Email id"].toLowerCase();
  //     }
  //   });
  //   tempData.authority = "user";
  //   tempData.shift = reporting[tempData.name]["Team"];
  //   tempData.doj = new Date(e["DOJ"]).getTime();
  //   //console.log(tempData.name, tempData.shift);
  //   finalData.push(tempData);
  // });

  // console.log(finalData, joiningDetails.length);

  // addUserConnection(finalData);

  // function addUserConnection(data) {
  //   data.forEach(async (el) => {
  //     const {
  //       email,
  //       name,
  //       reportingName,
  //       reportingEmail,
  //       shift,
  //       authority,
  //       doj,
  //     } = el;
  //     const taskRes = await fetch("/addUserConnection", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         email,
  //         name,
  //         reportingName,
  //         reportingEmail,
  //         shift,
  //         authority,
  //         doj,
  //       }),
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     const taskData = await taskRes.json();
  //     console.log(taskData);
  //   });
  // }

  async function fetchData() {
    let data = await fetch("/json/data.json");
    let jsonData = await data.json();
    return jsonData;
  }

  function convertTime(time) {
    if (time != "NA") {
      const timeSplit = time.split(":");
      const h = parseInt(timeSplit[0]) * 60 * 60;
      const m = parseInt(timeSplit[1]) * 60;
      const s = parseInt(timeSplit[2]);
      return h + m + s;
    } else {
      return 0;
    }
  }

  //add task data to mongo from data.json

  // fetchData().then((res) => {
  //   const keys = Object.keys(res);
  //   keys.forEach(async (k) => {
  //     res[k].forEach(async (e) => {
  //       console.log(`${k} --- ${e["Action Task"]}`);
  //       const taskRes = await fetch("/addTaskConnection", {
  //         method: "POST",
  //         body: JSON.stringify({
  //           taskType: k,
  //           task: e["Action Task"],
  //           methodology: e["Counting Methodology"]
  //             ? e["Counting Methodology"]
  //             : "",
  //           number: e["Number"] ? parseInt(e["Number"]) : 0,
  //           threeMonths: e["Members with 3 months of Experience"]
  //             ? convertTime(e["Members with 3 months of Experience"])
  //             : 0,
  //           sixMonths: e["Members with 6 months of Experience"]
  //             ? convertTime(e["Members with 6 months of Experience"])
  //             : 0,
  //           oneYear: e["Members with 1 year of  Experience"]
  //             ? convertTime(e["Members with 1 year of  Experience"])
  //             : 0,
  //           aboveOneYear: e["Members with 1yr and above Experience"]
  //             ? convertTime(e["Members with 1yr and above Experience"])
  //             : 0,
  //         }),
  //         headers: { "Content-Type": "application/json" },
  //       });
  //       const taskData = await taskRes.json();

  //       console.log("added task", taskData);
  //     });
  //   });
  // });
}
loadData();
