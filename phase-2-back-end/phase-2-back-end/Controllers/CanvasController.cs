using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using phase_2_back_end.Models;

namespace phase_2_back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CanvasController : ControllerBase
    {
        private ApplicationDatabase _context;
        private IConfiguration _config;
        private int SIZE = 32;

        public CanvasController(ApplicationDatabase context, IConfiguration config)
        {
            _context = context;
            _config = config;
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

        // To save a new canvas
        //[HttpPost]
        //public async Task<ActionResult<Canvas>> PostCanvas(Canvas canvas)
        //{
        //    _context.Canvas.Add(canvas);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetStudent", new { id = canvas.CanvasID }, canvas);
        //}

        [HttpPut]
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


        [HttpPut]
        [Route("ClearCanvas")]
        public String ClearCanvas([FromQuery] string psd)
        {
            var password = ComputeSha256Hah(psd, _config["SHA256:Salt"]);
            if(password == _config["SHA256:Password"])
            {
                var canvas = _context.Canvas
                .Include(c => c.ColorData)
                .OrderByDescending(c => c.CanvasID)
                .FirstOrDefault();
                foreach (var tableRow in canvas.ColorData)
                {
                    tableRow.Hex = "#FFFFFF";
                }
                _context.SaveChanges();
                return "All done";
            }
            else
            {
                return "Nice try but you are unauthorized";
            }
            
        }

		// to populate a mock Canvas
		[HttpPost]
		[Route("PopulateDb_dont_run_this_unnecessarily")]
		public void PopulateDb()
		{
			var matrix = new ColorData[SIZE * SIZE];
			for (int i = 0; i < SIZE; i++)
			{
				for (int j = 0; j < SIZE; j++)
				{
					matrix[SIZE * i + j] = new ColorData
					{
						RowIndex = i,
						ColumnIndex = j,
						Hex = "#FFFFFF"
					};
				}
			}
			_context.Canvas.Add(new Models.Canvas { ColorData = matrix });
			_context.SaveChanges();
		}
		public static string ComputeSha256Hah(string psd, string Salt)
        {
            using (SHA256 Hash = SHA256.Create())
            {
                string RawData = string.Format("{1}{0}{1}", psd, Salt);
                byte[] bytes = Hash.ComputeHash(Encoding.UTF8.GetBytes(RawData));

                //Converts the bytes array into a string
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }

    public class UpdateCellModel
    {
        public int Row { get; set; }
        public int Column { get; set; }
        [Required]
        public String Hex { get; set; }
    }
}
