const fs = require('fs');
class Data {
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}

let dataCollection = null;
// Step 2
function readDataFromFile(path) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, 'utf8', function (err, dataFromSomeFile) {
      if (err) {
        reject(err);
        return;
      }
      let data = JSON.parse(dataFromSomeFile);
      resolve(data);
    });
  });
}
// Step 3
function initialize() {
  return new Promise(function (resolve, reject) {
    readDataFromFile('data/students.json')
      .then(function (studentDataFromFile) {
        readDataFromFile('data/courses.json')
          .then(function (courseDataFromFile) {
            dataCollection = new Data(studentDataFromFile, courseDataFromFile);
            resolve('Operation was a Success');
          })
          .catch(function () {
            reject('unable to read courses.json');
          });
      })
      .catch(function () {
        reject('unable to read students.json');
      });
  });
}

function getAllStudents() {
  return new Promise(function (resolve, reject) {
    const { students } = dataCollection;
    if (students && students.length) {
      resolve(students);
    } else {
      reject('No results returned');
    }
  });
}

function getCourses() {
  return new Promise(function (resolve, reject) {
    const { courses } = dataCollection;
    if (courses && courses.length) {
      resolve(courses);
    } else {
      reject('No results returned');
    }
  });
}

function getStudentsByCourse(course) {
  return new Promise(function (resolve, reject) {
    const { students } = dataCollection;
    const courseData = (students || []).filter(function (student) {
      return student.hasOwnProperty('course') && student.course == course;
    });

    if (courseData.length) {
      resolve(courseData);
    } else {
      reject('No results returned');
    }
  });
}
function getStudentByNum(num) {
  return new Promise(function (resolve, reject) {
    const { students } = dataCollection;
    const studentData = (students || []).find(function (student) {
      return student.hasOwnProperty('studentNum') && student.studentNum == num;
    });

    if (studentData) {
      resolve(studentData);
    } else {
      reject('No results returned');
    }
  });
}

function addStudent(student) {
  return new Promise(function (resolve, reject) {
    const { students } = dataCollection;
    try {
      const payload = {
        studentNum: students.length || 1,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        addressStreet: student.addressStreet,
        addressCity: student.addressCity,
        addressProvince: student.addressProvince,
        TA: student.TA ? true : false,
        status: student.status,
        course: Number(student.course),
      };
      students.push(payload);
      resolve('Successfully added');
    } catch {
      reject('Error while adding student');
    }
  });
}

function getCourseById(id) {
  return new Promise(function (resolve, reject) {
    const { courses } = dataCollection;
    const courseData = (courses || []).find(function (course) {
      return course.hasOwnProperty('courseId') && course.courseId == id;
    });

    if (courseData) {
      resolve(courseData);
    } else {
      reject('query returned 0 results');
    }
  });
}

function updateStudent(studentData) {
  return new Promise(function (resolve, reject) {
    const { students } = dataCollection;
    const index = (students || []).findIndex(function (student) {
      return (
        student.hasOwnProperty('studentNum') &&
        student.studentNum == studentData.studentNum
      );
    });
    if (index > 0) {
      studentData.TA = studentData.TA ? true : false;
      students[index] = studentData;
      resolve();
    } else {
      reject('query returned 0 results');
    }
  });
}

module.exports = {
  initialize,
  getAllStudents,
  getCourses,
  getStudentByNum,
  getStudentsByCourse,
  addStudent,
  getCourseById,
  updateStudent,
};
