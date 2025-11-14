using System.ComponentModel.DataAnnotations;

namespace VenhanProject.Model
{
    public class Book
    {
        [Key]
        public int Id { get; set; }


        [Required]
        public string Title { get; set; } = null!;


        [Required]
        public string Author { get; set; } = null!;


        [Required]
        public string ISBN { get; set; } = null!;


        public string? Genre { get; set; }


        public int Quantity { get; set; }
    }
}
