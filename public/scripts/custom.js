var formData = {
  email: $("nav ul li:first-child").text().replace("Welcome, ", ""),
  requestType: "",
  tasks: [],
  comment: "",
  time: "",
};

async function fetchData() {
  let data = await fetch("/json/data.json");
  let jsonData = await data.json();
  return jsonData;
}
// window.onbeforeunload = function () {
//   return "Are you sure you want to leave?";
// };
fetchData().then((res) => {
  for (var k in res) {
    $("#Request").append(`<option value="${k}">${k}</option>`);
  }

  $("#Request").on("change", function () {
    if ($(this).val() != "0") {
      formData.requestType = $(this).val();
      formData.tasks = [];
      var data = res[$(this).val()];
      var html = "";
      data.forEach((val, index) => {
        html += `
        <div class="task-option disabled">
          <div class="left">
            <input type="checkbox" name="name${index}" id="name${index}" />
            <label for="name${index}">${val["Action Task"]}</label>
          </div>
          <div class="right">
            <label for="name${index + "" + index}">${
          val["Counting Methodology"]
        }:</label>
            <input type="number" name="name${index + "" + index}" id="name${
          index + "" + index
        }" />
          </div>
        </div>
        `;
      });
      $("#actionTask .task-options").empty().append(html);
      $("#actionTask").show();
    } else {
      formData.requestType = "";
      $("#actionTask").hide();
    }
    $(".task-options .task-option [type=checkbox]").on("change", function () {
      if ($(this).is(":checked")) {
        $(this).parent().parent().removeClass("disabled");
        $(this).parent().parent().addClass("checked");
      } else {
        $(this).parent().parent().addClass("disabled");
        $(this).parent().parent().removeClass("checked");
      }
    });
    $(".task-options .task-option input").on("input", function () {
      if ($(this).attr("type") == "checkbox") {
        var tempData = formData.tasks.filter((val) => {
          return val.taskName != $(this).parent().find("label").text();
        });
        if (
          $(this).is(":checked") &&
          $(this).parent().parent().find(".right input").val() != ""
        ) {
          tempData.push({
            taskName: $(this).parent().find("label").text(),
            number: $(this).parent().parent().find(".right input").val(),
            numberMethodology: $(this)
              .parent()
              .parent()
              .find(".right label")
              .text(),
          });
        }
        formData.tasks = tempData;
      } else {
        var tempData = formData.tasks.filter((val) => {
          return (
            val.taskName != $(this).parent().parent().find(".left label").text()
          );
        });
        if (
          $(this).val() != "" &&
          $(this).parent().parent().find(".left input").is(":checked")
        ) {
          tempData.push({
            taskName: $(this).parent().parent().find(".left label").text(),
            number: $(this).val(),
            numberMethodology: $(this).parent().find("label").text(),
          });
        } else {
        }
        formData.tasks = tempData;
      }
      if (formData.tasks.length > 0) {
        $(".submit-task").removeClass("disabled").removeAttr("disabled");
      } else {
        $(".submit-task").addClass("disabled").attr("disabled", "disabled");
      }
    });

    $("#comment").on("input", function () {
      formData.comment = $(this).val();
      console.log(formData);
    });
    $(".submit-task").click(function (e) {
      e.preventDefault();
      $(this).hide();
      $(".timer-wrapper").css("display", "flex");
      startTimer();
    });
    $(".stop-timer").click(function (e) {
      e.preventDefault();
      
      window.location.reload();
    });
  });

  $("select").selectpicker();
});

function startTimer() {
  var startTime = Math.floor(Date.now() / 1000); //Get the starting time (right now) in seconds
  localStorage.setItem("startTime", startTime); // Store it if I want to restart the timer on the next page

  function startTimeCounter() {
    var now = Math.floor(Date.now() / 1000); // get the time now
    timeDiff = now - startTime; // timeDiff in seconds between now and start
    var h = Math.floor(timeDiff / 60 / 60); // get hours value (quotient of timeDiff)
    var m = Math.floor(timeDiff / 60); // get minutes value (quotient of timeDiff)
    var s = Math.floor(timeDiff % 60); // get seconds value (remainder of timeDiff)
    h = checkTime(h); // add a leading zero if it's single digit
    m = checkTime(m); // add a leading zero if it's single digit
    s = checkTime(s); // add a leading zero if it's single digit
    $(".timer-wrapper .timer").text(h + ":" + m + ":" + s); // update the element where the timer will appear
    var t = setTimeout(startTimeCounter, 500); // set a timeout to update the timer
  }

  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    } // add zero in front of numbers < 10
    return i;
  }
  startTimeCounter();
}
