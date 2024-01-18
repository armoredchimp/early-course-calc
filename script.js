('use strict');
import {
  getColor,
  bigColor,
  invertedBigColor,
  percentColor,
  invertedPercentColor,
} from './colors.js';

const courseUL = document.querySelector('.course');
const result = document.querySelector('.result');
const addNew = document.querySelector('.add-new');
const modal = document.querySelector('.modal');
const editModal = document.querySelector('.modal-edit');
const loginModal = document.querySelector('.modal-login');
const closeBtn = document.querySelector('.close');
const closeBtnE = document.querySelector('.closeE');
const closeBtnL = document.querySelector('.closeL');
const addCourseBtn = document.getElementById('addCourseBtn');
const editCourseBtn = document.getElementById('editCourseBtn');
const toggleBtn = document.getElementById('toggle-completed');
const loginBtn = document.querySelector('.login');
const sortBtn = document.querySelector('.sort-icon');
const ultraCont = document.querySelector('.ultra-cont');
const messageCont = document.querySelector('.message-cont');
const ascendIcon = document.getElementById('ascend-icon');
const descendIcon = document.getElementById('descend-icon');
const sortCriteria = document.getElementById('sortCriteria');
const colorScheme = document.getElementById('colorScheme');
const addLink = document.querySelector('.addLink');
const sampleLink = document.querySelector('.sampleLink');

loginBtn.addEventListener('click', () => {
  displayLogin();
});
function displayLogin() {
  loginModal.style.display = 'block';
}

let showCompletedCourses = true;
let ascending = false;
let currentColorScheme = '';
let minusColor = getComputedStyle(document.body).getPropertyValue(
  '--minus-color'
);
let allCourses = [];
let blankCourses = [];

//
// main course functionality
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

//
// Sorting and Toggling (Top left section of UI)
sortCriteria.addEventListener('change', () => {
  ascending = false;
  sortCourses(allCourses, sortCriteria.value);
  toggleSortIcon();
});

function toggleSortIcon() {
  if (ascending) {
    ascendIcon.style.display = 'none';
    descendIcon.style.display = 'inline';
  } else {
    ascendIcon.style.display = 'inline';
    descendIcon.style.display = 'none';
  }
}
sortBtn.addEventListener('click', () => {
  ascending = !ascending;
  sortCourses(allCourses);
  toggleSortIcon();
});

sortCriteria.addEventListener('change', () => {
  ascending = false;
  sortCourses(allCourses, sortCriteria.value);
  toggleSortIcon();
});

function sortCourses(displayCourses) {
  const selectedCriteria = sortCriteria.value;
  displayCourses.sort((a, b) => {
    let compareA, compareB;

    if (selectedCriteria === 'progress') {
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

  courseLoadFn(coursesToDisplay, displayCourses);
}

toggleBtn.addEventListener('click', () => {
  showCompletedCourses = !showCompletedCourses;
  toggleBtn.className = showCompletedCourses
    ? 'fas fa-toggle-on'
    : 'fas fa-toggle-off';
  const displayCourses = showCompletedCourses
    ? allCourses
    : allCourses.filter((course) => course.progress < 100);
  courseLoadFn(displayCourses, allCourses);
});
colorScheme.addEventListener('change', () => {
  if (currentColorScheme) {
    document.body.classList.remove(currentColorScheme);
  }
  currentColorScheme = colorScheme.value;
  document.body.classList.add(`${currentColorScheme}`);
});

// My personal course load, grabbed from a DynamoDB table, passed through API-Gateway on AWS
function samplePrompt() {
  ultraCont.classList.add('sampler');
  messageCont.style.display = 'flex';
}
function sampleClose() {
  ultraCont.classList.remove('sampler');
  messageCont.style.display = 'none';
}

sampleLink.addEventListener('click', () => {
  const apiUrl = config.API_URL;

  axios
    .get(apiUrl)
    .then((response) => {
      // Remove the extra quotes and parse the string as JavaScript objects
      const courseString = response.data.slice(1, -2);
      const courseObjects = eval(courseString);
      console.log('Parsed courses:', courseObjects);

      // Create Course instances from each object in the array
      const sampleCourses = courseObjects.map(
        (obj) => new Course(obj.name, obj.totalHours, obj.progress)
      );

      courseLoadFn(sampleCourses, sampleCourses);
      allCourses.splice(0, allCourses.length, ...sampleCourses);
    })
    .catch((error) => {
      console.error('Error fetching courses:', error);
    });

  sampleClose();
});

// add a new course is available from a button as well as from a text link in the start screen
addLink.addEventListener('click', () => {
  modal.style.display = 'block';
});
addNew.addEventListener('click', () => {
  modal.style.display = 'block';
});
// X buttons in each modal window
closeBtn.onclick = () => {
  modal.style.display = 'none';
};
closeBtnE.onclick = () => {
  editModal.style.display = 'none';
};
closeBtnL.onclick = () => {
  loginModal.style.display = 'none';
};
//Close any open modal window
window.onclick = (event) => {
  if (
    event.target === modal ||
    event.target === editModal ||
    event.target === loginModal
  ) {
    modal.style.display = 'none';
    editModal.style.display = 'none';
    loginModal.style.display = 'none';
  }
};

// Function for editing an open Edit course modal
function updateCourse(displayCourses, allCourses, index) {
  const courseNameC = document.getElementById('courseNameE');
  const totalHoursC = document.getElementById('totalHoursE');
  const percentCompC = document.getElementById('percentComp');
  const updatedCourseName = courseNameC.value;
  const updatedTotalHours = Number(totalHoursC.value);
  const updatedProgress = Number(percentCompC.value);

  // Check for correct percent value
  if (updatedProgress < 0 || updatedProgress > 100) {
    alert('Must enter a percentage from 0-100.');
    percentCompC.value = updatedProgress; // Keep the incorrect value in the input field
  } else {
    displayCourses[index].name = updatedCourseName;
    displayCourses[index].totalHours = updatedTotalHours;
    displayCourses[index].progress = updatedProgress;

    if (!showCompletedCourses && updatedProgress === 100) {
      displayCourses = displayCourses.filter((course) => course.progress < 100);
    }
    courseLoadFn(displayCourses, allCourses);
    editModal.style.display = 'none'; // Close the edit modal only when values are correct
    // completed();
  }
}

// Edit a currently implemented course
function editCourse(displayCourses, allCourses, index) {
  editModal.style.display = 'block';
  const courseNameC = document.getElementById('courseNameE');
  const totalHoursC = document.getElementById('totalHoursE');
  const percentCompC = document.getElementById('percentComp');
  const hoursC = document.getElementById('totalHoursC');
  // Initialize the modal with current values for selected course
  courseNameC.value = displayCourses[index].name;
  totalHoursC.value = displayCourses[index].totalHours;
  percentCompC.value = displayCourses[index].progress;
  hoursC.value = displayCourses[index].completedHours();

  // Changes the % completed and total hours at the same time, with each new change
  percentCompC.addEventListener('input', function () {
    // Calculate new completedHours based on new percentComp
    const newCompletedHours =
      Math.round((this.value / 100) * totalHoursC.value * 100) / 100;
    hoursC.value = newCompletedHours;
  });

  hoursC.addEventListener('input', function () {
    // Calculate new percent completed based on new completedHours
    const newPercentComp =
      Math.round((this.value / totalHoursC.value) * 100 * 100) / 100;
    percentCompC.value = newPercentComp;
  });
  // Update the onclick event with the correct index
  editCourseBtn.onclick = () => updateCourse(displayCourses, allCourses, index);
}

//
// Function to add a new course
addCourseBtn.addEventListener('click', () => {
  const courseName = document.getElementById('courseName').value;
  const totalHours = Number(document.getElementById('totalHours').value);
  const newCourse = new Course(courseName, totalHours);
  allCourses.push(newCourse);
  courseLoadFn(allCourses, allCourses); // update the course list
  modal.style.display = 'none'; // close the modal
  sampleClose();
});

//
// Function to remove a course after clicking the minus sign next to every course
function removeCourse(displayCourses, allCourses, index) {
  if (!showCompletedCourses) {
    displayCourses.splice(index, 1);
    allCourses.splice(index, 1);
  } else {
    displayCourses.splice(index, 1);
  }
  courseLoadFn(displayCourses, allCourses);
  if (displayCourses.length === 0) {
    samplePrompt();
  }
}

// Reset course
function resetProgress(displayCourses, allCourses, index) {
  displayCourses[index].progress = 0;
  courseLoadFn(displayCourses, allCourses);
}

//
// The main function that updates the state. It re-creates the course list in html every time
const courseLoadFn = function (displayCourses, allCourses) {
  let totalHours = 0;
  let totalCourseHours = 0;

  // The total values of all courses, including the ones hidden by the toggle
  allCourses.forEach((course) => {
    totalHours += course.completedHours();
    totalCourseHours += course.totalHours;
  });

  courseUL.innerHTML = '';
  
  // Display courses are only the courses shown on the screen
  displayCourses.forEach((course, index) => {
    let courseHours = course.completedHours();
    // totalHours += courseHours;
    // totalCourseHours += course.totalHours;
    let remainingHours = course.remainingHours();
    let colorR = getColor(remainingHours);
    let colorP = percentColor(course.progress);
    let backgroundColor =
      course.progress === 100 ? 'var(--highlight-color);' : '';
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

    // Each course gets it's own edit and reset buttons
    let listItem = document.createElement('li');
    listItem.innerHTML = courseR;
    let svgMI = listItem.querySelector('.minus-icon');
    svgMI.style.width = '1.4rem';
    svgMI.style.marginRight = '2rem';
    courseUL.appendChild(listItem);
    svgMI.addEventListener('click', () => {
      removeCourse(displayCourses, allCourses, index);
    });
    let resetBtn = listItem.querySelector('.reset-button');
    resetBtn.addEventListener('click', () => {
      resetProgress(displayCourses, allCourses, index);
    });
    let editBtn = listItem.querySelector('.edit-button');
    editBtn.addEventListener('click', () => {
      editCourse(displayCourses, allCourses, index);
    });
  });

  //
  // Function to determine total values and final calulations of courseload
  function completed() {
    let completedPercentage = 0,
      remainingPercentage = 0,
      remainingHours = 0;

    if (totalCourseHours !== 0) {
      completedPercentage =
        Math.round((totalHours / totalCourseHours) * 10000) / 100;
      remainingPercentage = Math.round((100 - completedPercentage) * 100) / 100;
      remainingHours = Math.round((totalCourseHours - totalHours) * 100) / 100;
    }

    const list = document.createElement('ul');
    list.innerHTML = `
      <li class="completed-list" style="margin-top: 4rem;">
        <span style="color:${invertedBigColor(
          totalHours.toFixed(2)
        )};">${totalHours.toFixed(2)}</span> 
        hours out of <span style="color:${invertedBigColor(
          totalCourseHours
        )};">${totalCourseHours}</span> 
        in total have been completed
      </li>
      <li class="completed-list">
        <span style="color:${bigColor(
          remainingHours
        )};">${remainingHours}</span> hours remain
      </li>
      <li class="completed-list">
        <span style="color:${percentColor(
          completedPercentage
        )};">${completedPercentage}%</span> 
        of the course has been completed
      </li>
      <li class="completed-list">
        <span style="color:${invertedPercentColor(
          remainingPercentage
        )};">${remainingPercentage}%</span> 
        of the course remains to be completed
      </li>
    `;

    result.innerHTML = ''; // Clear previous content
    result.appendChild(list);
  }

  completed();
};

samplePrompt();
courseLoadFn(blankCourses, blankCourses);
