using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using StudentSIMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentSIMS.Data
{
    public class StudentContext : DbContext
    {
        public StudentContext()
        {

        }
        public StudentContext(DbContextOptions<StudentContext> options)
        : base(options)
        {

        }
        public virtual DbSet<Student> Student { get; set; }
        public virtual DbSet<CountryIdentifiers> CountryIdentifiers { get; set; }

        public static System.Collections.Specialized.NameValueCollection AppSettings { get; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
           .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
           .AddJsonFile("appsettings.json")
           .Build();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("schoolSIMSConnection"));
        }
    
    
    }
}
