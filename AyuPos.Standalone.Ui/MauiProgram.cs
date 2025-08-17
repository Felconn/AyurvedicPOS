using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using AyuPos.Standalone.Ui.Common;

namespace AyuPos.Standalone.Ui;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts => { fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular"); });

        builder.Services.AddMauiBlazorWebView();

        ConfigureDatabase(builder.Services);

#if DEBUG
        builder.Services.AddBlazorWebViewDeveloperTools();
        builder.Logging.AddDebug();
#endif

        var app = builder.Build();
        
        InitializeDatabase(app.Services);
        
        return app;
    }

    private static void ConfigureDatabase(IServiceCollection services)
    {
        var dbPath = Path.Combine(FileSystem.AppDataDirectory, "ayupos.db");
        
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlite($"Data Source={dbPath}"));
    }

    private static void InitializeDatabase(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        
        context.Database.EnsureCreated();
    }
}