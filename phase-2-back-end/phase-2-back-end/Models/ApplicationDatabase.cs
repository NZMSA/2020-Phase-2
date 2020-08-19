using Microsoft.EntityFrameworkCore;
using System;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace phase_2_back_end.Models
{
    public class ApplicationDatabase : DbContext
    {
        public ApplicationDatabase(DbContextOptions<ApplicationDatabase> options) : base(options)
        {
        }

        public DbSet<Canvas> Canvas { get; set; }
        public DbSet<ColorData> ColorData { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
           .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
           .AddJsonFile("appsettings.json")
           .Build();
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Canvas>()
                .Property(p => p.CanvasID)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<ColorData>()
                .Property(p => p.ColorDataID)
                .ValueGeneratedOnAdd();
        }
    }
}
