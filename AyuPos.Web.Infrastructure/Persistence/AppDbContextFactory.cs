using System.Linq;
using Mediator;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using AyuPos.Web.Application.Interfaces;
using AyuPos.Web.Infrastructure.Interceptors;

namespace AyuPos.Web.Infrastructure.Persistence;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        // Build configuration to read from appsettings.json
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddJsonFile("appsettings.Secret.json", optional: true, reloadOnChange: true)
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        var connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? "Host=localhost;Port=5432;Username=ashzadmin;Password=ashzDBA01.;Database=pos_system;";
            
        ConfigureServices.ConfigureDbContextOptions(optionsBuilder, connectionString);

        var serviceProvider = new ServiceCollection()
            .AddLogging()
            .AddScoped<IMediator, NullMediator>()
            .AddScoped<ICurrentUserService, NullCurrentUserService>()
            .AddScoped<AuditableEntitySaveChangesInterceptor>()
            .BuildServiceProvider();

        var logger = serviceProvider.GetRequiredService<ILogger<AppDbContext>>();
        var mediator = serviceProvider.GetRequiredService<IMediator>();
        var interceptor = serviceProvider.GetRequiredService<AuditableEntitySaveChangesInterceptor>();

        return new AppDbContext(optionsBuilder.Options, mediator, interceptor, logger);
    }
    
    private class NullMediator : IMediator
    {
        public ValueTask<TResponse> Send<TResponse>(IRequest<TResponse> request, CancellationToken cancellationToken = default)
        {
            return default;
        }

        public ValueTask<object?> Send(object request, CancellationToken cancellationToken = default)
        {
            return default;
        }
        
        public ValueTask<TResponse> Send<TResponse>(ICommand<TResponse> command, CancellationToken cancellationToken = default)
        {
            return default;
        }
        
        public ValueTask<TResponse> Send<TResponse>(IQuery<TResponse> query, CancellationToken cancellationToken = default)
        {
            return default;
        }

        public async IAsyncEnumerable<TNotification> CreateStream<TNotification>(IStreamRequest<TNotification> request, CancellationToken cancellationToken = default)
        {
            yield break;
        }

        public async IAsyncEnumerable<object?> CreateStream(object request, CancellationToken cancellationToken = default)
        {
            yield break;
        }
        
        public async IAsyncEnumerable<TResponse> CreateStream<TResponse>(IStreamQuery<TResponse> query, CancellationToken cancellationToken = default)
        {
            yield break;
        }
        
        public async IAsyncEnumerable<TResponse> CreateStream<TResponse>(IStreamCommand<TResponse> command, CancellationToken cancellationToken = default)
        {
            yield break;
        }

        public ValueTask Publish<TNotification>(TNotification notification, CancellationToken cancellationToken = default) where TNotification : INotification
        {
            return default;
        }

        public ValueTask Publish(object notification, CancellationToken cancellationToken = default)
        {
            return default;
        }
    }
    
    private class NullCurrentUserService : ICurrentUserService
    {
        public string UserId => "design-time-user";
        
        public List<string> UserRoles()
        {
            return new List<string>();
        }
        
        public void SetUserId(string userId)
        {
            
        }
        
        public void SetUserRoles(List<string> roles)
        {
        }
    }
}