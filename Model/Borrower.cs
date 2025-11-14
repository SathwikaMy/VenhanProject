using System.ComponentModel.DataAnnotations;

namespace VenhanProject.Model
{
    public class Borrower
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = null!;

        public string? Contact { get; set; }

        [Required]
        public string MembershipId { get; set; } = null!; 
    }
}
