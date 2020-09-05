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
