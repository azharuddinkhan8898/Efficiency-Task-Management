async function loadData() {
  const data = await fetch("/view-tasks", {
    method: "POST",
    body: JSON.stringify({ email: user }),
    headers: { "Content-Type": "application/json" },
  });
  const taskData = await data.json();
  const { emails, tasks } = taskData.data;
  let data1 = {};
  let tempObj = {},
    tempArr = [];
  emails.forEach((email) => {
    data1[email] = {};
    tasks.forEach((task) => {
      if (
        email.toLowerCase() === task.email.toLowerCase() &&
        task.createdAt &&
        task.time
      ) {
        let date = task.createdAt.split("T")[0];
        // if (!tempObj[date]) {
        //   tempObj[date] = true;
        //   tempArr.push(date);
        // }
        data1[email][date] =
          data1[email][date] !== 0 && data1[email][date] != undefined
            ? data1[email][date] + parseInt(task.time)
            : 0 + parseInt(task.time);
        //data1[email][date].push(task);
        //data1[email].push(task);
      }
    });
  });
  //   console.log(data1);
  tempArr = LastDays(14);
  tempArr.sort();
  // if (tempArr.length > 7) {
  //   tempArr = tempArr.slice(Math.max(tempArr.length - 7, 0));
  // }
  let keys = Object.keys(data1);
  let html = `
    <table class="data-table" id="myTable">
    <thead>
    <tr>
        <th>Name</th>
        ${tempArr
          .map((el) => {
            return `<th>${formatDate(el)}</th>`;
          })
          .join("")}
    </tr>
    </thead>
    ${keys
      .map((el) => {
        return `<tr>
        <td><strong style="text-transform:capitalize">${el
          .split("@")[0]
          .split(".")
          .join(" ")}</strong></td>
        ${tempArr
          .map((ell) => {
            return `<td>${
              data1[el][ell]
                ? `<strong>${timeConvert(data1[el][ell])}</strong>`
                : "NA"
            }</td>`;
          })
          .join("")}
      </tr>`;
      })
      .join("")}
    
    </table>
  `;
  $(".loading").hide();
  $(".content-wrapper").append(html);
  $("#myTable").DataTable({ paging: false });
}
loadData();

function formatDateNew(date) {
  var dd = date.getDate();
  var mm = date.getMonth() + 1;
  var yyyy = date.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  //date = mm + "/" + dd + "/" + yyyy;
  date = `${yyyy}-${mm}-${dd}`;
  return date;
}

function LastDays(days) {
  var result = [];
  for (var i = 0; i < days; i++) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    //console.log(getDay(d));
    if (getDay(d) !== "Sat" && getDay(d) !== "Sun") {
      result.push(formatDateNew(d));
    }
  }

  return result;
}

function timeConvert(time) {
  var hours = Math.floor(time / 3600);
  time -= hours * 3600;

  var minutes = Math.floor(time / 60);
  time -= minutes * 60;

  var seconds = parseInt(time % 60, 10);

  return hours + "h:" + (minutes < 10 ? "0" + minutes : minutes) + "m";
}

function formatDate(date) {
  let month = getMonth(date);
  let day = getDay(date);
  let year = date.split("-")[0].slice(-2);
  let dateNumber = date.split("-")[2];
  return `${dateNumber} ${month}, ${year} (${day})`;
}

function getDay(date) {
  var d = new Date(date);
  return d.toString().split(" ")[0];
}

function getMonth(date) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const d = new Date(date);
  return monthNames[d.getMonth()];
}
