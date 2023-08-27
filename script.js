"use strict";

// My original hard-coded version
// const courseLoad = function (js, htcs, aws, lin) {
//   let jH = js * 0.7;
//   let htH = htcs * 0.37;
//   let awH = aws * 0.14;
//   let linH = lin * 0.12;
//   let totalHours = jH + htH + awH + linH;
//   console.log(
//     `${js}% of the 70-hour JavaScript course has been completed, which is roughly ${jH} hours. ${
//       70 - jH
//     } hours remain for this course.`
//   );
//   console.log(
//     `${htcs}% of the 37-hour HTML/CSS course has been completed, which is roughly ${htH} hours. ${
//       37 - htH
//     } hours remain for this course.`
//   );
//   console.log(
//     `${aws}% of the 14-hour AWS course has been completed, which is roughly ${awH} hours. ${
//       14 - awH
//     } hours remain for this course.`
//   );
//   console.log(
//     `${lin}% of the 12-hour Linux course has been completed, which is roughly ${linH} hours. ${
//       12 - linH
//     } hours remain for this course.`
//   );
//   console.log(
//     `${totalHours} hours out of 133 in total have been completed, and ${
//       133 - totalHours
//     } remain. ${(totalHours / 133) * 100}% of the course has been completed. `
//   );
// };
// courseLoad(50, 60, 95, 35);

// Chat GPT-4's improved version:
// const courseLoad = function (c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11) {
//   const courses = {
//     JavaScript: { totalHours: 62, progress: c1 },
//     'HTML/CSS': { totalHours: 37, progress: c2 },
//     AWS: { totalHours: 14, progress: c3 },
//     Linux: { totalHours: 12, progress: c4 },
//     Aplus: { totalHours: 45, progress: c5 },
//     AWS_D: { totalHours: 32, progress: c6 },
//     SQL: { totalHours: 22, progress: c7 },
//     Kubs: { totalHours: 28, progress: c8 },
//     TS: { totalHours: 15, progress: c9 },
//     Node: { totalHours: 35, progress: c10 },
//     Svelte: { totalHours: 32, progress: c11 },
//   };

//   let totalHours = 0;
//   let totalCourseHours = 0;

//   for (let course in courses) {
//     let courseHours =
//       Math.round(
//         (courses[course].progress / 100) * courses[course].totalHours * 100
//       ) / 100;
//     totalHours += courseHours;
//     totalCourseHours += courses[course].totalHours;
//     console.log(
//       `${courses[course].progress}% of the ${
//         courses[course].totalHours
//       }-hour ${course} course has been completed, which is roughly ${courseHours} hours. ${
//         Math.round((courses[course].totalHours - courseHours) * 100) / 100
//       } hours remain for this course.`
//     );
//   }

//   let completedPercentage =
//     Math.round((totalHours / totalCourseHours) * 100 * 100) / 100;
//   let remainingPercentage = Math.round((100 - completedPercentage) * 100) / 100;

//   console.log(
//     `${totalHours} hours out of ${totalCourseHours} in total have been completed, and ${
//       Math.round((totalCourseHours - totalHours) * 100) / 100
//     } remain. ${completedPercentage}% of the course has been completed. ${remainingPercentage}% of the course remains to be completed.`
//   );
// };
const courseUL = document.querySelector(".course");
const result = document.querySelector(".result");
const addNew = document.querySelector(".add-new");
const modal = document.querySelector(".modal");
const editModal = document.querySelector(".modal-edit");
const closeBtn = document.querySelector(".close");
const closeBtnE = document.querySelector(".closeE");
const addCourseBtn = document.getElementById("addCourseBtn");
const editCourseBtn = document.getElementById("editCourseBtn");
const toggleBtn = document.getElementById("toggle-completed");
const sortBtn = document.querySelector(".sort-icon");
const ascendIcon = document.getElementById("ascend-icon");
const descendIcon = document.getElementById("descend-icon");
const sortCriteria = document.getElementById("sortCriteria");
const colorScheme = document.getElementById("colorScheme");
let showCompletedCourses = true;
let ascending = false;
let currentColorScheme = "";
let minusColor = getComputedStyle(document.body).getPropertyValue(
  "--minus-color"
);
function toggleSortIcon() {
  if (ascending) {
    ascendIcon.style.display = "none";
    descendIcon.style.display = "inline";
  } else {
    ascendIcon.style.display = "inline";
    descendIcon.style.display = "none";
  }
}
sortBtn.addEventListener("click", () => {
  ascending = !ascending;
  sortCourses(allCourses);
  toggleSortIcon();
});

sortCriteria.addEventListener("change", () => {
  ascending = false;
  sortCourses(allCourses, sortCriteria.value);
  toggleSortIcon();
});
toggleBtn.addEventListener("click", () => {
  showCompletedCourses = !showCompletedCourses;
  toggleBtn.className = showCompletedCourses
    ? "fas fa-toggle-on"
    : "fas fa-toggle-off";
  const displayCourses = showCompletedCourses
    ? allCourses
    : allCourses.filter((course) => course.progress < 100);
  courseLoad(displayCourses, allCourses);
});
colorScheme.addEventListener("change", () => {
  if (currentColorScheme) {
    document.body.classList.remove(currentColorScheme);
  }
  currentColorScheme = colorScheme.value;
  document.body.classList.add(`${currentColorScheme}`);
});

addNew.addEventListener("click", () => {
  modal.style.display = "block";
});
closeBtn.onclick = () => {
  modal.style.display = "none";
};
closeBtnE.onclick = () => {
  editModal.style.display = "none";
};
window.onclick = (event) => {
  if (event.target === modal || event.target === editModal) {
    modal.style.display = "none";
    editModal.style.display = "none";
  }
};
function sortCourses(displayCourses) {
  const selectedCriteria = sortCriteria.value;
  displayCourses.sort((a, b) => {
    let compareA, compareB;

    if (selectedCriteria === "progress") {
      compareA = a.progress;
      compareB = b.progress;
    } else {
      // Sort by hours remaining
      compareA = a.totalHours - (a.progress * a.totalHours) / 100;
      compareB = b.totalHours - (b.progress * b.totalHours) / 100;
    }

    return ascending ? compareB - compareA : compareA - compareB;
  });

  const coursesToDisplay = showCompletedCourses
    ? displayCourses
    : displayCourses.filter((course) => course.progress < 100);

  courseLoad(coursesToDisplay, displayCourses);
}
function updateCourse(displayCourses, allCourses, index) {
  const courseNameC = document.getElementById("courseNameE");
  const totalHoursC = document.getElementById("totalHoursE");
  const percentCompC = document.getElementById("percentComp");
  const updatedCourseName = courseNameC.value;
  const updatedTotalHours = Number(totalHoursC.value);
  const updatedProgress = Number(percentCompC.value);

  // Check for correct percent value
  if (updatedProgress < 0 || updatedProgress > 100) {
    alert("Must enter a percentage from 0-100.");
    percentCompC.value = updatedProgress; // Keep the incorrect value in the input field
  } else {
    displayCourses[index].name = updatedCourseName;
    displayCourses[index].totalHours = updatedTotalHours;
    displayCourses[index].progress = updatedProgress;

    if (!showCompletedCourses && updatedProgress === 100) {
      displayCourses = displayCourses.filter((course) => course.progress < 100);
    }
    courseLoad(displayCourses, allCourses);
    editModal.style.display = "none"; // Close the edit modal only when values are correct
    // completed();
  }
}
function editCourse(displayCourses, allCourses, index) {
  editModal.style.display = "block";
  const courseNameC = document.getElementById("courseNameE");
  const totalHoursC = document.getElementById("totalHoursE");
  const percentCompC = document.getElementById("percentComp");
  courseNameC.value = displayCourses[index].name;
  totalHoursC.value = displayCourses[index].totalHours;
  percentCompC.value = displayCourses[index].progress;

  // Update the onclick event with the correct index
  editCourseBtn.onclick = () => updateCourse(displayCourses, allCourses, index);
}
addCourseBtn.addEventListener("click", () => {
  const courseName = document.getElementById("courseName").value;
  const totalHours = Number(document.getElementById("totalHours").value);
  const newCourse = new Course(courseName, totalHours);
  allCourses.push(newCourse);
  courseLoad(allCourses, allCourses); // update the course list
  modal.style.display = "none"; // close the modal
});
class Course {
  constructor(name, totalHours, progress = 0) {
    this.name = name;
    this.totalHours = totalHours;
    this.progress = progress;
  }

  completedHours() {
    return Math.round((this.progress / 100) * this.totalHours * 100) / 100;
  }

  remainingHours() {
    return Math.round((this.totalHours - this.completedHours()) * 100) / 100;
  }
}
function getColor(hours) {
  hours = Math.round(hours);
  return hours === 0
    ? "var(--text-color)"
    : hours <= 5
    ? "var(--primary-color)"
    : hours <= 15
    ? "var(--yellow-color)"
    : hours <= 25
    ? "var(--secondary-color)"
    : hours <= 35
    ? "var(--maroon-color)"
    : "var(--red-color)";
}

function bigColor(hours) {
  hours = Math.round(hours);
  return hours === 0
    ? "var(--text-color)"
    : hours <= 25
    ? "var(--primary-color)"
    : hours <= 55
    ? "var(--teal-color)"
    : hours <= 95
    ? "var(--secondary-color)"
    : hours <= 125
    ? "var(--yellow-color)"
    : hours <= 175
    ? "var(--maroon-color)"
    : "var(--red-color)";
}

function invertedBigColor(hours) {
  hours = Math.round(hours);
  return hours >= 176
    ? "var(--teal-color)"
    : hours >= 126
    ? "var(--secondary-color)"
    : hours >= 56
    ? "var(--yellow-color)"
    : hours >= 26
    ? "var(--maroon-color)"
    : hours > 0
    ? "var(--red-color)"
    : "var(--primary-color)";
}

function percentColor(percent) {
  percent = Math.round(percent);
  return percent === 100
    ? "var(--text-color)"
    : percent >= 80
    ? "var(--primary-color)"
    : percent >= 60
    ? "var(--teal-color)"
    : percent >= 40
    ? "var(--yellow-color)"
    : percent >= 21
    ? "var(--secondary-color)"
    : percent >= 1
    ? "var(--maroon-color)"
    : "var(--red-color)";
}

function invertedPercentColor(percent) {
  percent = Math.round(percent);
  return percent < 1
    ? "var(--text-color)"
    : percent <= 20
    ? "var(--primary-color)"
    : percent <= 39
    ? "var(--teal-color)"
    : percent <= 59
    ? "var(--yellow-color)"
    : percent <= 79
    ? "var(--secondary-color)"
    : percent <= 90
    ? "var(--maroon-color)"
    : "var(--red-color)";
}

function removeCourse(displayCourses, allCourses, index) {
  if (!showCompletedCourses) {
    displayCourses.splice(index, 1);
    allCourses.splice(index, 1);
  } else {
    displayCourses.splice(index, 1);
  }
  courseLoad(displayCourses, allCourses);
}
function resetProgress(displayCourses, allCourses, index) {
  displayCourses[index].progress = 0;
  courseLoad(displayCourses, allCourses);
}

const courseLoad = function (displayCourses, allCourses) {
  let totalHours = 0;
  let totalCourseHours = 0;

  allCourses.forEach((course) => {
    totalHours += course.completedHours();
    totalCourseHours += course.totalHours;
  });

  courseUL.innerHTML = "";

  displayCourses.forEach((course, index) => {
    let courseHours = course.completedHours();
    // totalHours += courseHours;
    // totalCourseHours += course.totalHours;
    let remainingHours = course.remainingHours();
    let colorR = getColor(remainingHours);
    let colorP = percentColor(course.progress);
    let backgroundColor =
      course.progress === 100 ? "var(--highlight-color);" : "";
    let courseR = `<div class="course-line" style="display: flex; justify-content: space-between; background-color: ${backgroundColor}; border-radius: 15px; padding: 0.5rem; padding-left: 1rem; width: 100%;">
    <div style="display: flex; align-items: center; gap: 0.3rem; font-size: 1rem;"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="minus-icon">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg><span style="color: ${colorP};">${course.progress}%</span> of the ${
      course.totalHours
    }-hour ${
      course.name
    } course has been completed, which is roughly ${courseHours} hours. <span style="color: ${colorR};">${remainingHours.toFixed(
      2
    )}</span> hours remain for this course.</div>
    <div style="display:flex; ">
    <button class="reset-button" style="align-self: center; margin-right: 2rem; margin-bottom: 0.5rem; cursor: pointer;">Reset</button>
    <button class="edit-button" style="align-self: center; margin-right: 15rem; margin-bottom: 0.5rem; cursor: pointer;">Edit</button>
    </div>
  </div>`;

    let listItem = document.createElement("li");
    listItem.innerHTML = courseR;
    let svgMI = listItem.querySelector(".minus-icon");
    svgMI.style.width = "1.4rem";
    svgMI.style.marginRight = "2rem";
    courseUL.appendChild(listItem);
    svgMI.addEventListener("click", () => {
      removeCourse(displayCourses, allCourses, index);
    });
    let resetBtn = listItem.querySelector(".reset-button");
    resetBtn.addEventListener("click", () => {
      resetProgress(displayCourses, allCourses, index);
    });
    let editBtn = listItem.querySelector(".edit-button");
    editBtn.addEventListener("click", () => {
      editCourse(displayCourses, allCourses, index);
    });
  });
  function completed() {
    let completedPercentage, remainingPercentage, remainingHours;
    if (totalCourseHours === 0) {
      completedPercentage = 0;
      remainingPercentage = 0;
      remainingHours = 0;
    } else {
      completedPercentage =
        Math.round((totalHours / totalCourseHours) * 100 * 100) / 100;
      remainingPercentage = Math.round((100 - completedPercentage) * 100) / 100;
      remainingHours = Math.round((totalCourseHours - totalHours) * 100) / 100;
    }
    let colorT = invertedBigColor(totalHours.toFixed(2));
    let colorGT = invertedBigColor(totalCourseHours);
    let colorC = percentColor(completedPercentage);
    let colorRtotal = bigColor(remainingHours);
    let colorInvPercent = invertedPercentColor(remainingPercentage);
    let list = document.createElement("ul");
    list.innerHTML = `
      <li class="completed-list" style="margin-top: 4rem;"><span style="color:${colorT};">${totalHours.toFixed(
      2
    )}</span> hours out of <span style="color:${colorGT};">${totalCourseHours}</span> in total have been completed</li>
      <li class="completed-list"><span style="color:${colorRtotal};">${remainingHours}</span> hours remain</li>
      <li class="completed-list"><span style="color: ${colorC};">${completedPercentage}%</span> of the course has been completed</li>
      <li class="completed-list"><span style="color:${colorInvPercent};">${remainingPercentage}%</span> of the course remains to be completed</li>
    `;

    result.innerHTML = ""; // Clear previous content
    result.appendChild(list);
  }
  completed();
};

// Sample course load:
let allCourses = [
  new Course("JavaScript", 61, 98),
  new Course("HTML/CSS", 37, 100),
  new Course("AWS", 14, 100),
  new Course("Linux", 12, 100),
  new Course("Aplus", 45, 100),
  new Course("AWS DVA", 32, 90),
  new Course("SQL", 22, 65),
  new Course("Kubernetes", 28, 10),
  new Course("TypeScript", 15, 1),
  new Course("Node", 35, 15),
  new Course("Svelte", 32, 0),
];

courseLoad(allCourses, allCourses);
