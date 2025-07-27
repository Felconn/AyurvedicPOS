// using Mediator;
// using Microsoft.EntityFrameworkCore;
// using AyuPos.Web.Application.Interfaces;
// using AyuPos.Web.Domain.Entities;
//
// namespace AyuPos.Web.Application.Features.Inventory.Queries;
//
// public sealed record GetInventoryByIdQuery(string Id) : IQuery<Domain.Entities.Inventory?>;
//
// public sealed class GetInventoryByIdQueryHandler : IQueryHandler<GetInventoryByIdQuery, Domain.Entities.Inventory?>
// {
//     private readonly IAppDbContext _context;
//
//     public GetInventoryByIdQueryHandler(IAppDbContext context)
//     {
//         _context = context;
//     }
//
//     public async ValueTask<Domain.Entities.Inventory?> Handle(GetInventoryByIdQuery query, CancellationToken cancellationToken)
//     {
//         return await _context.Inventories
//             .FirstOrDefaultAsync(i => i.Id == query.Id, cancellationToken);
//     }
// }