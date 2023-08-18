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
let courseUL = document.querySelector(".course");
let result = document.querySelector(".result");
// courseLoad(98, 100, 100, 100, 100, 90, 50, 5, 0, 0, 0);
///// Updated version:
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

const courseLoad = function (courses) {
  let totalHours = 0;
  let totalCourseHours = 0;

  courses.forEach((course) => {
    let courseHours = course.completedHours();
    totalHours += courseHours;
    totalCourseHours += course.totalHours;
    let courseR = `${course.progress}% of the ${course.totalHours}-hour ${
      course.name
    } course has been completed, which is roughly ${courseHours} hours. ${course.remainingHours()} hours remain for this course.`;
    let listItem = document.createElement("li");
    listItem.textContent = courseR;
    courseUL.appendChild(listItem);
    console.log(courseR);
  });

  let completedPercentage =
    Math.round((totalHours / totalCourseHours) * 100 * 100) / 100;
  let remainingPercentage = Math.round((100 - completedPercentage) * 100) / 100;

  let text = `${totalHours} hours out of ${totalCourseHours} in total have been completed, and ${
    Math.round((totalCourseHours - totalHours) * 100) / 100
  } remain. ${completedPercentage}% of the course has been completed. ${remainingPercentage}% of the course remains to be completed.`;
  console.log(text);
  result.innerHTML = text;
};

// Sample course load:
let myCourses = [
  new Course("JavaScript", 61, 98),
  new Course("HTML/CSS", 37, 100),
  new Course("AWS", 14, 100),
  new Course("Linux", 12, 100),
  new Course("Aplus", 45, 100),
  new Course("AWS_D", 32, 90),
  new Course("SQL", 22, 60),
  new Course("Kubs", 28, 10),
  new Course("TS", 15, 1),
  new Course("Node", 35, 15),
  new Course("Svelte", 32, 0),
];

courseLoad(myCourses);
