// using Mediator;
// using Microsoft.EntityFrameworkCore;
// using AyuPos.Web.Application.Interfaces;
// using AyuPos.Web.Domain.Entities;
//
// namespace AyuPos.Web.Application.Features.Inventory.Queries;
//
// public sealed record GetAllInventoriesQuery : IQuery<List<Domain.Entities.Inventory>>;
//
// public sealed class GetAllInventoriesQueryHandler : IQueryHandler<GetAllInventoriesQuery, List<Domain.Entities.Inventory>>
// {
//     private readonly IAppDbContext _context;
//
//     public GetAllInventoriesQueryHandler(IAppDbContext context)
//     {
//         _context = context;
//     }
//
//     public async ValueTask<List<Domain.Entities.Inventory>> Handle(GetAllInventoriesQuery query, CancellationToken cancellationToken)
//     {
//         return await _context.Inventories.ToListAsync(cancellationToken);
//     }
// }