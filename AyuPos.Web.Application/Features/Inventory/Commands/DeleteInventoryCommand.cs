// using Mediator;
// using Microsoft.EntityFrameworkCore;
// using AyuPos.Web.Application.Interfaces;
//
// namespace AyuPos.Web.Application.Features.Inventory.Commands;
//
// public sealed record DeleteInventoryCommand(string Id) : ICommand<bool>;
//
// public sealed class DeleteInventoryCommandHandler : ICommandHandler<DeleteInventoryCommand, bool>
// {
//     private readonly IAppDbContext _context;
//
//     public DeleteInventoryCommandHandler(IAppDbContext context)
//     {
//         _context = context;
//     }
//
//     public async ValueTask<bool> Handle(DeleteInventoryCommand command, CancellationToken cancellationToken)
//     {
//         var inventory = await _context.Inventories
//             .FirstOrDefaultAsync(i => i.Id == command.Id, cancellationToken);
//
//         if (inventory == null)
//             return false;
//
//         _context.Inventories.Remove(inventory);
//         await _context.SaveChangesAsync(cancellationToken);
//
//         return true;
//     }
// }