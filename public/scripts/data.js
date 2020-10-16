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

  // add eScore

  // for (i = 0; i < 1779; i++) {
  //   let res1 = await fetch("/setEScore", {
  //     method: "POST",
  //     body: JSON.stringify({ task: data.data[i] }),
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   let data1 = await res1.json();
  //   console.log(data1.msg, i);
  // }

  // data.data.forEach(async (el, index) => {
  //   let res1 = await fetch("/setEScore", {
  //     method: "POST",
  //     body: JSON.stringify({ task: el }),
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   let data1 = await res1.json();
  //   console.log(data1.msg, index);
  // });

  // data.data.forEach(async (el, index) => {
  //   if (el.eScore == null) {
  //     console.log(el.email);
  //     console.count();
  //   }
  // });
}
loadData();

// generate data for csv

async function generateCsv(startDate, endDate) {
  let res1 = await fetch("/getCsvData", {
    method: "POST",
    body: JSON.stringify({ startDate, endDate }),
    headers: { "Content-Type": "application/json" },
  });
  let data1 = await res1.json();
  console.log(data1);
  JSONToCSVConvertor(data1.mainData, "", true);
}

let DataFromPreviousDay = 30;
let d = new Date();

let startDate = setTimeToZero(
  new Date(d.setDate(d.getDate() - DataFromPreviousDay))
);

let endDate = setTimeToZero(new Date());

generateCsv(startDate, endDate);

function setTimeToZero(date) {
  // let s = "00.01 AM",
  //   parts = s.match(/(\d+)\.(\d+) (\w+)/),
  //   hours = /am/i.test(parts[3])
  //     ? parseInt(parts[1], 10)
  //     : parseInt(parts[1], 10) + 12,
  //   minutes = parseInt(parts[2], 10);
  // date.setHours(hours);
  // date.setMinutes(minutes);
  return date;
}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
  //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
  var arrData = typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;
  var CSV = "";
  //This condition will generate the Label/Header
  if (ShowLabel) {
    var row = "";

    //This loop will extract the label from 1st index of on array
    for (var index in arrData[0]) {
      //Now convert each value to string and comma-seprated
      row += index + ",";
    }
    row = row.slice(0, -1);
    //append Label row with line break
    CSV += row + "\r\n";
  }

  //1st loop is to extract each row
  for (var i = 0; i < arrData.length; i++) {
    var row = "";
    //2nd loop will extract each column and convert it in string comma-seprated
    for (var index in arrData[i]) {
      row += '"' + arrData[i][index] + '",';
    }
    row.slice(0, row.length - 1);
    //add a line break after each row
    CSV += row + "\r\n";
  }

  if (CSV == "") {
    alert("Invalid data");
    return;
  }

  //this trick will generate a temp "a" tag
  var link = document.createElement("a");
  link.id = "lnkDwnldLnk";

  //this part will append the anchor tag and remove it after automatic click
  document.body.appendChild(link);

  var csv = CSV;
  blob = new Blob([csv], { type: "text/csv" });
  var csvUrl = window.webkitURL.createObjectURL(blob);
  var filename = "UserExport.csv";
  $("#lnkDwnldLnk").attr({
    download: filename,
    href: csvUrl,
  });

  $("#lnkDwnldLnk")[0].click();
  document.body.removeChild(link);
}
