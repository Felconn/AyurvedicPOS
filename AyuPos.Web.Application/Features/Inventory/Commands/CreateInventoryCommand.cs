// using Mediator;
// using AyuPos.Web.Application.Interfaces;
// using AyuPos.Web.Domain.Entities;
//
// namespace AyuPos.Web.Application.Features.Inventory.Commands;
//
// public sealed record CreateInventoryCommand(string Name, string? Description, decimal Price, int Quantity) : ICommand<Domain.Entities.Inventory>;
//
// public sealed class CreateInventoryCommandHandler : ICommandHandler<CreateInventoryCommand, Domain.Entities.Inventory>
// {
//     private readonly IAppDbContext _context;
//
//     public CreateInventoryCommandHandler(IAppDbContext context)
//     {
//         _context = context;
//     }
//
//     public async ValueTask<Domain.Entities.Inventory> Handle(CreateInventoryCommand command, CancellationToken cancellationToken)
//     {
//         // var inventory = new Domain.Entities.Inventory
//         // {
//         //     Name = command.Name,
//         //     Description = command.Description,
//         //     Price = command.Price,
//         //     Quantity = command.Quantity
//         // };
//         //
//         // _context.Inventories.Add(inventory);
//         // await _context.SaveChangesAsync(cancellationToken);
//         //
//         // return inventory;
//     }
// }