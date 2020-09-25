var formData = {
  email: user,
  requestType: "",
  tasks: [],
  comment: "",
  time: "",
  paused: false,
};

var setTimeoutVar;
let stopReload = true;
var timerRunning = true;

async function fetchData() {
  let data = await fetch("/json/data.json");
  let jsonData = await data.json();
  return jsonData;
}

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
            <label for="input${index + "" + index}">${
          val["Counting Methodology"] ? val["Counting Methodology"] + " :" : ""
        }</label>
            <input type="number" name="input${index + "" + index}" id="input${
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
      setTimeout(function () {
        var checkedLength = $(".task-options .task-option.checked").length;

        if (
          checkedLength != 0 &&
          formData.tasks.length == checkedLength &&
          $("#comment").val() != ""
        ) {
          $(".submit-task, .stop-timer")
            .removeClass("disabled")
            .removeAttr("disabled");
        } else {
          $(".submit-task, .stop-timer")
            .addClass("disabled")
            .attr("disabled", "disabled");
        }
      }, 300);
    });

    $("#comment").on("input", function () {
      formData.comment = $(this).val().trim();
      //console.log(formData);
      setTimeout(function () {
        var checkedLength = $(".task-options .task-option.checked").length;

        if (
          checkedLength != 0 &&
          formData.tasks.length == checkedLength &&
          $("#comment").val() != ""
        ) {
          $(".submit-task, .stop-timer")
            .removeClass("disabled")
            .removeAttr("disabled");
        } else {
          $(".submit-task, .stop-timer")
            .addClass("disabled")
            .attr("disabled", "disabled");
        }
      }, 300);
    });
    $(".submit-task").click(function (e) {
      e.preventDefault();
      $(this).hide();
      $(".timer-wrapper").css("display", "flex");
      startTimer();
    });
    $(".stop-timer").click(async function (e) {
      stopReload = false;
      timerRunning = false;
      $(".cd-popup").addClass("is-visible");
      $(".stop-timer").addClass("disabled").attr("disabled", "disabled");
      e.preventDefault();
    });

    $(".alert-yes").click(async function () {
      formData.time = timeDiff;
      $(".cd-buttons").addClass("submitting");
      $(".cd-buttons li:first-child a").text("Submitting task...");
      try {
        const res = await fetch("/addTask", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        //console.log(data);
        if (data.errors) {
          alert("Error while saving data.");
          $(".cd-popup").removeClass("is-visible");
          stopReload = true;
          timerRunning = true;
          $(".stop-timer").removeClass("disabled").removeAttr("disabled");
        }
        if (data.task) {
          //$(".cd-popup").removeClass("is-visible");
          $(".cd-buttons").addClass("submitted");
          $(".cd-buttons li:first-child a").text("Task Submitted.");
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        }
      } catch (err) {
        console.log(err);
      }
    });

    $(".alert-no, .cd-popup-close").click(function () {
      $(".cd-popup").removeClass("is-visible");
      stopReload = true;
      timerRunning = true;
      $(".stop-timer").removeClass("disabled").removeAttr("disabled");
    });
  });

  $("select").selectpicker();
});

function startTimer() {
  $(".pause").show();
  window.onbeforeunload = function (e) {
    if (stopReload) {
      return "Your data won't be saved.";
    }
  };
  var startTime = 0; //Get the starting time (right now) in seconds
  localStorage.setItem("startTime", startTime); // Store it if I want to restart the timer on the next page

  function startTimeCounter() {
    if (timerRunning) {
      startTime = startTime + 1000; // get the time now
      timeDiff = startTime / 1000; // timeDiff in seconds between now and start
      var h = Math.floor(timeDiff / 60 / 60); // get hours value (quotient of timeDiff)
      var m = Math.floor((timeDiff / 60) % 60); // get minutes value (quotient of timeDiff)
      var s = Math.floor(timeDiff % 60); // get seconds value (remainder of timeDiff)
      h = checkTime(h); // add a leading zero if it's single digit
      m = checkTime(m); // add a leading zero if it's single digit
      s = checkTime(s); // add a leading zero if it's single digit
      $(".timer-wrapper .timer span").text(h + ":" + m + ":" + s); // update the element where the timer will appear
    }
    if (!setTimeoutVar) {
      setTimeoutVar = setInterval(startTimeCounter, 1000); // set a timeout to update the timer
    }
  }

  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    } // add zero in front of numbers < 10
    return i;
  }
  startTimeCounter();
}

$(".pause").click(function () {
  formData.paused = true;
  $(this).hide();
  $(".play").show();
  timerRunning = false;
});

$(".play").click(function () {
  $(this).hide();
  $(".pause").show();
  timerRunning = true;
});
