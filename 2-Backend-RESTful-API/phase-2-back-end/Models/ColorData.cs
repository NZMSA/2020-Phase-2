using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace phase_2_back_end.Models
{
    public class ColorData
    {
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int ColorDataID { get; set; }

        [Required]
        public int RowIndex { get; set; }
        [Required]
        public int ColumnIndex { get; set; }
        [Required]
        public string Hex { get; set; }

        // 1 canvas has many ColorData-s
        [Required]
        public int CanvasID { get; set; }
    }
}
