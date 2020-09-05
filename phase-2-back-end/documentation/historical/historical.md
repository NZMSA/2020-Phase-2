# Historical Data Documentation
In the folder Models, create a table to store historical data, named HistoricalData.cs
HistoricalData.cs
```cs
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace phase_2_back_end.Models
{
	public class HistoricalData
	{
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int Id { get; set; }

        // Name of table that is changed
		    public string TableName { get; set; }
        // Time when SaveChangesAsync() is called in UpdateCell()
        public DateTime DateTime { get; set; }
        // Id of the item changed
        public string KeyValues { get; set; }
        // Old value of the item changed
        public string OldValues { get; set; }
        // New value of the item changed
        public string NewValues { get; set; }
    }
}
```


In the ApplicationDatabase.cs, add this table getter and setter:
```cs
public DbSet<HistoricalData> HistoricalData { get; set; }
```

And in the OnModelCreating(), we set the HistoricalData table to generate a new unique ID whenever we add a new item.
```cs
protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<HistoricalData>()
                .Property(p => p.Id)
                .ValueGeneratedOnAdd();
        }
```

Then use migration to update database with the following commands in Package Manager Console:
```
Add-Migration add_HistoricalData_table
Update-Database
```

CanvasController.cs


ApplicationDatabase.cs
ColorDatasController.cs
