using Microsoft.EntityFrameworkCore;
using Moq;
using NUnit.Framework;
using StudentSIMS.Controllers;
using StudentSIMS.Data;
using StudentSIMS.Models;
using StudentSIMS.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StudentSIMS.Tests
{
    class StudentControllerUnitTests
    {
        [Test]
        public void GetStudentPhoneNumberWithExtension_ReturnsPhoneNumberWithCorrectExtension()
        {
            //Arrange
            Student student = new Student { studentId = 1, firstName = "firstname 1", lastName = "lastname 1", phoneNumber ="555555555" };
            //Here I'm creating a fake object of ICountryIdentifierRepository.
            //This is so I can fake the methods returns of GetStudentById() and GetCountryExtension()
            //We're doing this so that we can remove the dependencies from these functions
            //We don't really care what the output of the 2 functions are and we mainly concerned with API call
            //additionally we can assume that the GetStudentById() and GetCountryExtension() have already been tested.
            var mockRepo = new Mock<ICountryIdentifierRepository>();
            mockRepo.Setup(c => c.GetStudentById(It.IsAny<int>())).Returns(student);
            mockRepo.Setup(c => c.GetCountryExtension(It.IsAny<string>())).Returns("64");

            //Act
            var controller = new StudentsController(mockRepo.Object);
            var results = controller.GetStudentPhoneNumberWithExtension(student.studentId);

            //Assert
            Assert.IsNotNull(results);
            Assert.AreEqual("640555555555", results.Value.ToString());
        }

    }
}
