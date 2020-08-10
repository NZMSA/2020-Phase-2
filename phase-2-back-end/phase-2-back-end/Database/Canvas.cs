using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace phase_2_back_end.Database
{
    public class Canvas
    {
        [Required]
        [Key]
        public int PictureID { get; set; }

        [Required]
        public ICollection<Matrix> Rows { get; set; }
    }
}
