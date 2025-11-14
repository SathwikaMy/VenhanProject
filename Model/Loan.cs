using System.ComponentModel.DataAnnotations;

namespace VenhanProject.Model
{
    public class Loan
    {
        [Key]
        public int Id { get; set; }


        [Required]
        public int BookId { get; set; }
        public Book? Book { get; set; }


        [Required]
        public int BorrowerId { get; set; }
        public Borrower? Borrower { get; set; }


        [Required]
        public DateTime BorrowedAt { get; set; }


        [Required]
        public DateTime DueDate { get; set; }


        public DateTime? ReturnedAt { get; set; }


        public bool IsOverdue => ReturnedAt == null && DateTime.UtcNow > DueDate;
    }
}
