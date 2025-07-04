# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["WellOffice/WellOffice.csproj", "WellOffice/"]
RUN dotnet restore "WellOffice/WellOffice.csproj"

# Copy the rest of the code
COPY . .

# Build and publish
WORKDIR "/src/WellOffice"
RUN dotnet build "WellOffice.csproj" -c Release -o /app/build
RUN dotnet publish "WellOffice.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:7254
ENV ASPNETCORE_ENVIRONMENT=Development
ENV DOTNET_RUNNING_IN_CONTAINER=true
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

EXPOSE 7254

ENTRYPOINT ["dotnet", "WellOffice.dll"] 