using System.ComponentModel.DataAnnotations;

namespace AyuPos.Standalone.Ui.Common.Entities;

public abstract class BaseEntity
{
    protected BaseEntity()
    {
        Id = Guid.NewGuid().ToString("N");
    }

    [Key] [StringLength(450)] public string Id { get; set; }
    
    public override bool Equals(object? obj)
    {
        var other = obj as BaseEntity;
        if (ReferenceEquals(other, null))
            return false;
        if (ReferenceEquals(this, other))
            return true;
        if (GetType() != other.GetType())
            return false;
        if (Id == "" || other.Id == "")
            return false;

        return Id == other.Id;
    }

    public override int GetHashCode()
    {
        return (GetType() + Id).GetHashCode();
    }
}