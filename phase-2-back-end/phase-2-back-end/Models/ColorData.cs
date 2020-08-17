using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace phase_2_back_end.Database
{
    public class ColorData
    {
        [Required]
        [Key]
        public int ColorDataID { get; set; }

        [Required]
        public int RowIndex { get; set; }
        [Required]
        public int ColumnIndex { get; set; }
        [Required]
        public string Hex { get; set; }
    }
}
