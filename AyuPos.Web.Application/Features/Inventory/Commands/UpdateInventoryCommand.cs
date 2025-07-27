// using Mediator;
// using Microsoft.EntityFrameworkCore;
// using AyuPos.Web.Application.Interfaces;
// using AyuPos.Web.Domain.Entities;
//
// namespace AyuPos.Web.Application.Features.Inventory.Commands;
//
// public sealed record UpdateInventoryCommand(string Id, string Name, string? Description, decimal Price, int Quantity) : ICommand<Domain.Entities.Inventory?>;
//
// public sealed class UpdateInventoryCommandHandler : ICommandHandler<UpdateInventoryCommand, Domain.Entities.Inventory?>
// {
//     private readonly IAppDbContext _context;
//
//     public UpdateInventoryCommandHandler(IAppDbContext context)
//     {
//         _context = context;
//     }
//
//     public async ValueTask<Domain.Entities.Inventory?> Handle(UpdateInventoryCommand command, CancellationToken cancellationToken)
//     {
//         var inventory = await _context.Inventories
//             .FirstOrDefaultAsync(i => i.Id == command.Id, cancellationToken);
//
//         if (inventory == null)
//             return null;
//
//         inventory.Name = command.Name;
//         inventory.Description = command.Description;
//         inventory.Price = command.Price;
//         inventory.Quantity = command.Quantity;
//
//         await _context.SaveChangesAsync(cancellationToken);
//
//         return inventory;
//     }
// }