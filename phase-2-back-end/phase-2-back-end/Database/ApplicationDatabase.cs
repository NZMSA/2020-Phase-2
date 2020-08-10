using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace phase_2_back_end.Database
{
    public class ApplicationDatabase : DbContext
    {
        public ApplicationDatabase(DbContextOptions<ApplicationDatabase> options) : base(options)
        {

        }

        public DbSet<Canvas> Canvas { get; set; }
        public DbSet<Matrix> Matrices { get; set; }
    }
}
