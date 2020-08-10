using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace phase_2_back_end.Database
{
    public class Matrix
    {
        [Required]
        [Key]
        public int RowID { get; set; }

        [Required]
        public int Row { get; set; }
        [Required]
        public int Column { get; set; }
        [Required]
        public string Hex { get; set; }
    }
}
