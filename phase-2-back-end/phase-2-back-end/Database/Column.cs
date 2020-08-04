using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace phase_2_back_end.Database
{
    public class Column
    {
        [Required]
        [Key]
        public int ColumnID { get; set; }

        [Required]
        public float rgb { get; set; }
    }
}
