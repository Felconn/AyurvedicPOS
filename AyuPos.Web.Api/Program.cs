using System.Text;
using AyuPos.Web.Api.Middlewares;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using AyuPos.Web.Application.Common.Models;
using AyuPos.Web.Infrastructure;
using AyuPos.Web.Application;
using AyuPos.Web.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure Swagger with JWT authentication
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "Ayu POS System API", 
        Version = "v1",
        Description = "A simple POS System API with JWT authentication",
        Contact = new OpenApiContact
        {
            Name = "Ayu POS System API",
            Email = "help@falconn.com"
        }
    });
    
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var allowedOrigins = builder.Configuration.GetSection("ApplicationConfig:AllowedHosts").Get<string[]>() ?? new string[1];

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        policy =>
        {
            policy.WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

// Configure ApplicationConfig
var applicationConfig = builder.Configuration.GetSection("ApplicationConfig").Get<ApplicationConfig>()!;
builder.Services.AddSingleton(applicationConfig);

// Configure JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = applicationConfig.Issuer,
        ValidAudience = applicationConfig.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(applicationConfig.Secret)),
        ClockSkew = TimeSpan.Zero
    };
    
    // Prevent redirect to login page for API calls and return Result type
    options.Events = new JwtBearerEvents
    {
        OnChallenge = context =>
        {
            // Skip the default logic.
            context.HandleResponse();
            
            context.Response.StatusCode = 401;
            context.Response.ContentType = "application/json";
            
            var result = Result.Failure("Unauthorized", "Invalid or missing authentication token");
            var jsonOptions = new System.Text.Json.JsonSerializerOptions
            {
                PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase
            };
            var jsonResult = System.Text.Json.JsonSerializer.Serialize(result, jsonOptions);
            
            return context.Response.WriteAsync(jsonResult);
        },
        OnAuthenticationFailed = context =>
        {
            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
            {
                context.Response.Headers.Add("Token-Expired", "true");
            }
            return Task.CompletedTask;
        },
        OnForbidden = context =>
        {
            context.Response.StatusCode = 403;
            context.Response.ContentType = "application/json";
            
            var result = Result.Failure("Forbidden", "You do not have permission to access this resource");
            var jsonOptions = new System.Text.Json.JsonSerializerOptions
            {
                PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase
            };
            var jsonResult = System.Text.Json.JsonSerializer.Serialize(result, jsonOptions);
            
            return context.Response.WriteAsync(jsonResult);
        }
    };
});

builder.Services.AddAuthorization();

// Add Application services (Mediator, CQRS)
builder.Services.AddApplication();

// Add Infrastructure services (Database, Repositories, etc.)
builder.Services.AddInfrastructure(builder.Configuration);

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        corsBuilder =>
        {
            corsBuilder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Initialize database and seed data
using (var scope = app.Services.CreateScope())
{
    var databaseInitializer = scope.ServiceProvider.GetRequiredService<IDatabaseInitializer>();
    await databaseInitializer.InitializeAsync();
}

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "POS System API v1");
});

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ErrorHandlerMiddleware>();

app.MapControllers();

app.Run();
