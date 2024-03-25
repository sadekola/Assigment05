const fs = require("fs");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/courses.json', 'utf8', (err, courseData) => {
            if (err) {
                reject("Unable to load courses");
                return;
            }

            fs.readFile('./data/students.json', 'utf8', (err, studentData) => {
                if (err) {
                    reject("Unable to load students");
                    return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
}

module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        if (!dataCollection || !dataCollection.students || dataCollection.students.length === 0) {
            reject("Query returned 0 results");
            return;
        }

        resolve(dataCollection.students);
    });
}

module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        if (!dataCollection || !dataCollection.courses || dataCollection.courses.length === 0) {
            reject("Query returned 0 results");
            return;
        }

        resolve(dataCollection.courses);
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        if (!dataCollection || !dataCollection.students || dataCollection.students.length === 0) {
            reject("Query returned 0 results");
            return;
        }

        const foundStudent = dataCollection.students.find(student => student.studentNum == num);
        if (!foundStudent) {
            reject("Student not found");
            return;
        }

        resolve(foundStudent);
    });
};

module.exports.getCourseById = function (id) {
    return new Promise((resolve, reject) => {
        if (!dataCollection || !dataCollection.courses || dataCollection.courses.length === 0) {
            reject("Query returned 0 results");
            return;
        }

        const foundCourse = dataCollection.courses.find(course => course.courseId == id);
        if (!foundCourse) {
            reject("Course not found");
            return;
        }

        resolve(foundCourse);
    });
};

// Add student to the data collection
module.exports.addStudent = function (student) {
    return new Promise((resolve, reject) => {
        if (!dataCollection || !dataCollection.students) {
            reject("Data collection not initialized or missing students data");
            return;
        }

        // Generate a unique student number (assuming unique identifier)
        const studentNum = Math.floor(Math.random() * 1000000) + 1;
        student.studentNum = studentNum;

        // Add the new student to the collection
        dataCollection.students.push(student);
        resolve(student);
    });
};

// Add student update method to the data collection
// module.exports.updateStudent = function (updatedStudent) {
//     return new Promise((resolve, reject) => {
//         if (!dataCollection || !dataCollection.students) {
//             reject("Data collection not initialized or missing students data");
//             return;
//         }

//         // Find the index of the student in the collection
//         const index = dataCollection.students.findIndex(student => student.studentNum === updatedStudent.studentNum);

//         if (index === -1) {
//             reject("Student not found");
//             return;
//         }

//         // Update the student information
//         dataCollection.students[index] = updatedStudent;
//         resolve();
//     });
// };


// Add method to get TAs
module.exports.getTAs = function () {
    return new Promise(function (resolve, reject) {
        const filteredStudents = dataCollection.students.filter(student => student.TA);
        if (filteredStudents.length === 0) {
            reject("No TAs found");
            return;
        }
        resolve(filteredStudents);
    });
};

// Add method to get students by course
module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        const filteredStudents = dataCollection.students.filter(student => student.course === course);
        if (filteredStudents.length === 0) {
            reject("No students found for the course");
            return;
        }
        resolve(filteredStudents);
    });
};


module.exports.updateStudent = function(studentData) {
    return new Promise((resolve, reject) => {
        // Find the student with the matching studentNum
        let student = dataCollection.students.find(s => s.studentNum == studentData.studentNum);
        if (student) {
            // Update the student's properties
            student.firstName = studentData.firstName || student.firstName;
            student.lastName = studentData.lastName || student.lastName;
            student.email = studentData.email || student.email;
            student.addressStreet = studentData.addressStreet || student.addressStreet;
            student.addressCity = studentData.addressCity || student.addressCity;
            student.addressProvince = studentData.addressProvince || student.addressProvince;
            student.TA = studentData.TA === "on"; // Check if the checkbox was checked
            student.course = studentData.course || student.course;
            student.status = studentData.status || student.status;
            
            // Write the updated students array to the students.json file
            fs.writeFile('./data/students.json', JSON.stringify(dataCollection.students), err => {
                if (err) {
                    reject('Unable to save student update.');
                } else {
                    resolve();
                }
            });
        } else {
            reject('Student not found');
        }
    });
};