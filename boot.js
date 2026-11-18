$(document).ready(function () {
  // Helper: Recalculate total enrolled units
  function updateTotalUnits() {
    let totalUnits = 0;
    $("#subjectsTableBody tr:visible .subject-units").each(function () {
      totalUnits += parseInt($(this).text(), 10) || 0;
    });
    $("#totalUnitsBadge").text(totalUnits + " Units");
  }

  // 1. Live Subject Search Filter (jQuery)
  $("#subjectSearchInput").on("keyup", function () {
    const query = $(this).val().toLowerCase().trim();
    let visibleCount = 0;

    $("#subjectsTableBody tr").each(function () {
      const rowText = $(this).text().toLowerCase();
      const isMatch = rowText.indexOf(query) > -1;
      $(this).toggle(isMatch);
      if (isMatch) visibleCount++;
    });

    $("#visibleSubjectCount").text(visibleCount);
  });

  // 2. Announcement Category Filter (jQuery)
  $(".filter-btn").on("click", function () {
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");

    const selectedCategory = $(this).data("filter");

    $(".announcement-item").each(function () {
      if (selectedCategory === "all" || $(this).data("category") === selectedCategory) {
        $(this).fadeIn(150);
      } else {
        $(this).hide();
      }
    });
  });

  // 3. Accessible Bootstrap Form Validation & Dynamic Portal Update
  $("#portalRegistrationForm").on("submit", function (event) {
    event.preventDefault();
    const form = this;

    if (!form.checkValidity()) {
      event.stopPropagation();
      $(form).addClass("was-validated");
      return;
    }

    // Gather validated values
    const fullName = $("#regFullName").val().trim();
    const studentId = $("#regStudentId").val().trim();
    const email = $("#regEmail").val().trim();
    const yearSection = $("#regYearSection").val();
    const electiveVal = $("#regElective").val();

    // Update Profile Card & Banner
    const initials = fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");

    $("#profileInitials").text(initials || "ST");
    $("#bannerStudentName").text(fullName);
    $("#profileName").text(fullName);
    $("#profileStudentId").text(studentId);
    $("#profileEmail").text(email);
    $("#profileYearSection").text(yearSection);

    let feedbackMessage = "Profile details updated successfully!";

    // Append Elective Subject if selected and not already enrolled
    if (electiveVal) {
      const [code, title, schedule, units] = electiveVal.split("|");
      const alreadyExists = $("#subjectsTableBody td:first-child")
        .toArray()
        .some((td) => $(td).text().trim() === code);

      if (!alreadyExists) {
        const newRow = `
          <tr class="table-primary">
            <td class="fw-semibold text-primary">${code}</td>
            <td>${title}</td>
            <td class="d-none d-md-table-cell small text-muted">${schedule}</td>
            <td class="text-center subject-units">${units}</td>
            <td class="text-end"><span class="badge bg-success">Enrolled</span></td>
          </tr>
        `;
        $("#subjectsTableBody").append(newRow);
        $("#visibleSubjectCount").text($("#subjectsTableBody tr:visible").length);
        updateTotalUnits();
        feedbackMessage = `Profile updated and <strong>${code} (${title})</strong> has been added to your subjects.`;
      } else {
        feedbackMessage = `Profile updated. Note: <strong>${code}</strong> is already in your enrolled subjects.`;
      }
    }

    // Display accessible live alert
    $("#formAlert")
      .removeClass("d-none")
      .html(`<i class="bi bi-check-circle-fill me-2"></i>${feedbackMessage}`);

    $(form).removeClass("was-validated");
    $("#regElective").val("");
    $("#regConfirmCheck").prop("checked", false);
  });

  // Reset validation state on form reset
  $("#resetFormBtn").on("click", function () {
    $("#portalRegistrationForm").removeClass("was-validated");
    $("#formAlert").addClass("d-none");
  });

  // Auto-collapse mobile navbar after clicking a link
  $(".navbar-nav .nav-link").on("click", function () {
    const navbarCollapse = $("#portalNavbar");
    if (navbarCollapse.hasClass("show")) {
      bootstrap.Collapse.getInstance(navbarCollapse[0]).hide();
    }
  });
});