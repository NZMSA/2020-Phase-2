using StudentSIMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentSIMS
{
    public interface ICountryIdentifierRepository
    {
        IEnumerable<CountryIdentifiers> GetAllCountries();
        CountryIdentifiers GetCountryByID(int countryId);
        void InsertCountry(CountryIdentifiers country);
        void DeleteCountry(int countryId);
        void UpdateCountry(CountryIdentifiers country);
        public void Save();
        string GetCountryExtension(string countryCode);
        Student GetStudentById(int id);
    }
}
