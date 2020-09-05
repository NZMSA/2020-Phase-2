using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using phase_2_back_end.Models;
using Microsoft.EntityFrameworkCore;

namespace phase_2_back_end.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class HistoricalDatasController : ControllerBase
	{
        private readonly ApplicationDatabase _context;

        public HistoricalDatasController(ApplicationDatabase context)
        {
            _context = context;
        }

        // GET: api/HistoricalData
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HistoricalData>>> GetHistoricalData()
        {
            return await _context.HistoricalData.ToListAsync();
        }
    }
}
