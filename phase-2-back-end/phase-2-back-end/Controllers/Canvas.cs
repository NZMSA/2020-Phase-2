using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using phase_2_back_end.Database;

namespace phase_2_back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Canvas : ControllerBase
    {
        private ApplicationDatabase _context;
        private int SIZE = 32;

        public Canvas(ApplicationDatabase context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetCanvas")]
        public String GetCanvas()
        {
            string[,] outputArray = new string[32,32];
            var canvas = _context.Canvas
                .Include(c => c.ColorData)
                .OrderByDescending(c => c.CanvasID)
                .FirstOrDefault();

            var colorData = canvas.ColorData
                .OrderBy(c => c.RowIndex)
                .ThenBy(c => c.ColumnIndex)
                .ToArray();

            for(int i=0; i<SIZE; i++)
            {
                for(int j=0; j<SIZE; j++)
                {
                    outputArray[i, j] = colorData[SIZE * i + j].Hex;
                }
            }


            return JsonConvert.SerializeObject(outputArray);
        }
        [HttpPost]
        [Route("UpdateCell")]
        public void UpdateCell([FromBody] UpdateCellModel data)
        {
            var tableRow = _context.Canvas
                .Include(c => c.ColorData)
                .OrderByDescending(c => c.CanvasID)
                .FirstOrDefault()
                .ColorData
                .First(row => row.RowIndex == data.Row && row.ColumnIndex == data.Column);
            tableRow.Hex = data.Hex;
            _context.SaveChanges();
        }

        [HttpPost]
        [Route("PopulateDb_dont_run_this_unnecessarily")]
        public void PopulateDb()
        {
            var matrix = new ColorData[SIZE * SIZE];
            for(int i=0; i<SIZE; i++)
            {
                for(int j=0; j<SIZE; j++)
                {
                    matrix[SIZE * i + j] = new ColorData
                    {
                        RowIndex = i,
                        ColumnIndex = j,
                        Hex = "#FFFFFF"
                    };
                }
            }
            _context.Canvas.Add(new Database.Canvas { ColorData = matrix});
            _context.SaveChanges();
        }
    }

    public class UpdateCellModel
    {
        public int Row { get; set; }
        public int Column { get; set; }
        public String Hex { get; set; }
    }
}
