using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Mediator;

namespace AyuPos.Web.Domain.Entities;

public abstract class BaseEntity
{
    private readonly List<BaseEvent> _domainEvents = new();
    [NotMapped] public IReadOnlyCollection<BaseEvent> DomainEvents => _domainEvents.AsReadOnly();

    public void AddDomainEvent(BaseEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }
    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }
    
    
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

public abstract class BaseEvent : INotification
{
}