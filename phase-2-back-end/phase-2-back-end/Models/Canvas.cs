using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace phase_2_back_end.Models
{
    public class Canvas
    {
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int CanvasID { get; set; }
        public string Name { get; set; }
        public int Score { get; set; }

        // foreign key to Color Data
        public ICollection<ColorData> ColorData { get; set; }
    }
}
