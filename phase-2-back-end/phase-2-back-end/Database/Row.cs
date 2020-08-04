using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace phase_2_back_end.Database
{
    public class Row
    {
        [Required]
        [Key]
        public int RowID { get; set; }

        [Required]
        public ICollection<Column> Columns { get; set; }
    }
}
