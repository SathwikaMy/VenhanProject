using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VenhanProject.Model;

namespace VenhanProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoansController : ControllerBase
    {
        private readonly LibraryContext _db;
        public LoansController(LibraryContext db) => _db = db;


        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _db.Loans.Include(l => l.Book).Include(l => l.Borrower).ToListAsync());


        [HttpGet("overdue")]
        public async Task<IActionResult> GetOverdue() => Ok(await _db.Loans.Include(l => l.Book).Include(l => l.Borrower)
        .Where(l => l.ReturnedAt == null && l.DueDate < DateTime.UtcNow).ToListAsync());


        [HttpPost("borrow")]
        public async Task<IActionResult> Borrow([FromBody] BorrowRequest req)
        {
            var book = await _db.Books.FindAsync(req.BookId);
            if (book == null) return NotFound(new { message = "Book not found" });
            if (book.Quantity <= 0) return BadRequest(new { message = "No copies available" });


            var borrower = await _db.Borrowers.FindAsync(req.BorrowerId);
            if (borrower == null) return NotFound(new { message = "Borrower not found" });


            var loan = new Loan
            {
                BookId = book.Id,
                BorrowerId = borrower.Id,
                BorrowedAt = DateTime.UtcNow,
                DueDate = req.DueDate
            };


            book.Quantity -= 1;
            _db.Loans.Add(loan);
            await _db.SaveChangesAsync();
            return Ok(loan);
        }


        [HttpPost("return/{loanId}")]
        public async Task<IActionResult> Return(int loanId)
        {
            var loan = await _db.Loans.Include(l => l.Book).FirstOrDefaultAsync(l => l.Id == loanId);
            if (loan == null) return NotFound();
            if (loan.ReturnedAt != null) return BadRequest(new { message = "Already returned" });


            loan.ReturnedAt = DateTime.UtcNow;
            loan.Book!.Quantity += 1;
            await _db.SaveChangesAsync();
            return Ok(loan);
        }
    }


    public record BorrowRequest(int BookId, int BorrowerId, DateTime DueDate);
}
