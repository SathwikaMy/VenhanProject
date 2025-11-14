using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VenhanProject.Model;

namespace VenhanProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BorrowersController : ControllerBase
    {
        private readonly LibraryContext _db;
        public BorrowersController(LibraryContext db) => _db = db;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _db.Borrowers.ToListAsync());


        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var borrower = await _db.Borrowers.FindAsync(id);
            if (borrower == null) return NotFound();
            return Ok(borrower);
        }


        [HttpPost]
        public async Task<IActionResult> Create(Borrower borrower)
        {
            _db.Borrowers.Add(borrower);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = borrower.Id }, borrower);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Borrower updated)
        {
            var b = await _db.Borrowers.FindAsync(id);
            if (b == null) return NotFound();
            b.Name = updated.Name;
            b.Contact = updated.Contact;
            b.MembershipId = updated.MembershipId;
            await _db.SaveChangesAsync();
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var b = await _db.Borrowers.FindAsync(id);
            if (b == null) return NotFound();
            _db.Borrowers.Remove(b);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
