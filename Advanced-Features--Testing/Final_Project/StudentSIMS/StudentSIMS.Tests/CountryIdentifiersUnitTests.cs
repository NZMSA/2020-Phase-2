using Microsoft.EntityFrameworkCore;
using Moq;
using NUnit.Framework;
using StudentSIMS.Data;
using StudentSIMS.Models;
using StudentSIMS.Repository;
using System.Collections.Generic;
using System.Linq;

namespace StudentSIMS.Tests
{
    public class Tests
    {
        [Test]
        public void GetAllCountries_ReturnsAllRecords()
        {
            //This test is the basic layout if you want to simulate database queries using linq.
            //Arrange
            var countries = new List<CountryIdentifiers>
            {
                new CountryIdentifiers()
                {
                    CountryId = 1,
                    CountryCode = "NZ",
                    PhoneExtension = "64"
                },
                new CountryIdentifiers()
                {
                    CountryId = 2,
                    CountryCode = "AU",
                    PhoneExtension = "61"
                }
            }.AsQueryable();

            var mockSet = new Mock<DbSet<CountryIdentifiers>>();
            mockSet.As<IQueryable<CountryIdentifiers>>().Setup(m => m.Provider).Returns(countries.Provider);
            mockSet.As<IQueryable<CountryIdentifiers>>().Setup(m => m.Expression).Returns(countries.Expression);
            mockSet.As<IQueryable<CountryIdentifiers>>().Setup(m => m.ElementType).Returns(countries.ElementType);
            mockSet.As<IQueryable<CountryIdentifiers>>().Setup(m => m.GetEnumerator()).Returns(countries.GetEnumerator());

            var mockContext = new Mock<StudentContext>();
            mockContext.Setup(c => c.CountryIdentifiers).Returns(mockSet.Object);
            //Act
            var service = new CountryIdentifiersRepository(mockContext.Object);
            var results = service.GetAllCountries().ToList();

            //Assert
            Assert.AreEqual(2, results.Count());
            Assert.AreEqual("NZ", results[0].CountryCode);
            Assert.AreEqual("AU", results[1].CountryCode);

        }

        [Test]
        public void GetCountryExtension_ReturnsPhoneNumberExtension()
        {
            //Arrange
            var countries = new List<CountryIdentifiers>
            {
                new CountryIdentifiers()
                {
                    CountryId = 1,
                    CountryCode = "NZ",
                    PhoneExtension = "64"
                },
                new CountryIdentifiers()
                {
                    CountryId = 2,
                    CountryCode = "AU",
                    PhoneExtension = "61"
                }
            }.AsQueryable();

            string countryCode = "NZ";
            string phoneExtension = "64";
            var mockSet = new Mock<DbSet<CountryIdentifiers>>();
            mockSet.As<IQueryable<CountryIdentifiers>>().Setup(m => m.Provider).Returns(countries.Provider);
            mockSet.As<IQueryable<CountryIdentifiers>>().Setup(m => m.Expression).Returns(countries.Expression);
            mockSet.As<IQueryable<CountryIdentifiers>>().Setup(m => m.ElementType).Returns(countries.ElementType);
            mockSet.As<IQueryable<CountryIdentifiers>>().Setup(m => m.GetEnumerator()).Returns(countries.GetEnumerator());

            var mockContext = new Mock<StudentContext>();
            mockContext.Setup(c => c.CountryIdentifiers).Returns(mockSet.Object);

            //Act
            var repo = new CountryIdentifiersRepository(mockContext.Object);
            var results = repo.GetCountryExtension(countryCode);

            //Assert
            Assert.AreEqual("64", results);
        }
        [Test]
        public void GetStudentById_ReturnsCorrectStudent()
        {
            //Arrange
            var students = new List<Student>
            {
                new Student()
                {
                    studentId = 1,
                    firstName = "firstName 1",
                    lastName = "lastName 1"
                },
                new Student()
                {
                    studentId = 2,
                    firstName = "firstName 2",
                    lastName = "lastName 2"
                }
            }.AsQueryable();

            int studentId = 1;
            var mockSet = new Mock<DbSet<Student>>();
            mockSet.As<IQueryable<Student>>().Setup(m => m.Provider).Returns(students.Provider);
            mockSet.As<IQueryable<Student>>().Setup(m => m.Expression).Returns(students.Expression);
            mockSet.As<IQueryable<Student>>().Setup(m => m.ElementType).Returns(students.ElementType);
            mockSet.As<IQueryable<Student>>().Setup(m => m.GetEnumerator()).Returns(students.GetEnumerator());

            var mockContext = new Mock<StudentContext>();
            mockContext.Setup(c => c.Student).Returns(mockSet.Object);

            //Act
            var repo = new CountryIdentifiersRepository(mockContext.Object);
            var results = repo.GetStudentById(studentId);

            //Assert
            Assert.AreEqual("firstName 1", results.firstName);
        }


    }
}