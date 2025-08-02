# Multi-stage build for .NET API with React frontend

# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend

# Copy frontend package files
COPY AyuPos.Web.Frontend/package*.json ./
RUN npm ci

# Copy frontend source and build
COPY AyuPos.Web.Frontend/ ./
RUN npm run build

# Stage 2: Build .NET API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY AyuPos.sln ./
COPY AyuPos.Web.Api/AyuPos.Web.Api.csproj AyuPos.Web.Api/
COPY AyuPos.Web.Application/AyuPos.Web.Application.csproj AyuPos.Web.Application/
COPY AyuPos.Web.Domain/AyuPos.Web.Domain.csproj AyuPos.Web.Domain/
COPY AyuPos.Web.Infrastructure/AyuPos.Web.Infrastructure.csproj AyuPos.Web.Infrastructure/

# Restore dependencies
RUN dotnet restore "AyuPos.Web.Api/AyuPos.Web.Api.csproj"

# Copy source code
COPY AyuPos.Web.Api/ AyuPos.Web.Api/
COPY AyuPos.Web.Application/ AyuPos.Web.Application/
COPY AyuPos.Web.Domain/ AyuPos.Web.Domain/
COPY AyuPos.Web.Infrastructure/ AyuPos.Web.Infrastructure/

# Build and publish
WORKDIR /src/AyuPos.Web.Api
RUN dotnet publish -c Release -o /app/publish

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy published API
COPY --from=build /app/publish .

# Copy built React app to wwwroot
COPY --from=frontend-build /app/frontend/dist ./wwwroot

# Set environment variables
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/swagger/index.html || exit 1

# Run the application
ENTRYPOINT ["dotnet", "AyuPos.Web.Api.dll"]