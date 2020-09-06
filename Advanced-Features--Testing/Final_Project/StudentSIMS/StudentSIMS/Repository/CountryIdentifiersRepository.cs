using Microsoft.EntityFrameworkCore;
using StudentSIMS.Data;
using StudentSIMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentSIMS.Repository
{
    public class CountryIdentifiersRepository : ICountryIdentifierRepository
    {
        private StudentContext _context;
        public CountryIdentifiersRepository(StudentContext context)
        {
            // We are passing the database instance into this class.
            _context = context;
        }

        public IEnumerable<CountryIdentifiers> GetAllCountries() 
        {
            return _context.CountryIdentifiers.ToList();
        }
        public CountryIdentifiers GetCountryByID(int countryId)
        {
            return _context.CountryIdentifiers.Find(countryId);
        }

        public void InsertCountry(CountryIdentifiers country)
        {
            _context.CountryIdentifiers.Add(country);
        }

        public void DeleteCountry(int countryId)
        {
            CountryIdentifiers country = _context.CountryIdentifiers.Find(countryId);
            _context.CountryIdentifiers.Remove(country);
        }

        public void UpdateCountry(CountryIdentifiers country)
        {
            _context.Entry(country).State = EntityState.Modified;
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        public string GetCountryExtension(string countryCode)
        {
            var result = _context.CountryIdentifiers.FirstOrDefault(c => c.CountryCode.Contains(countryCode));
            return result.PhoneExtension;
        }
        public Student GetStudentById(int id)
        {
            var student = _context.Student.FirstOrDefault(_ => _.studentId == id);
            return student;
        }
    }
}
