using System.ComponentModel.DataAnnotations;

namespace AyuPos.Web.Domain.Entities;

public class Inventory : BaseEntity
{
    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(500)]
    public string? Description { get; set; }
    
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }
    
    [Range(0, int.MaxValue)]
    public int Quantity { get; set; }
}