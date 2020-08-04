using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace phase_2_back_end.Database
{
    public class Picture
    {
        [Required]
        [Key]
        public int PictureID { get; set; }

        [Required]
        public ICollection<Row> Rows { get; set; }
    }
}
