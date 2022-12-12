using BCPServer.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Host.ConfigureLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
});

builder.Logging.AddSimpleConsole(options =>
{
    options.IncludeScopes = true;
    options.SingleLine = true;
    options.TimestampFormat = "hh:mm:ss ";
});

builder.Services.Configure<BCPOptions>(builder.Configuration.GetSection(BCPOptions.Key));

builder.Services.AddCors();
builder.Services.AddControllers();
builder.Services.AddSwaggerGen();

builder.WebHost.UseKestrel((builderContext, kestrelOptions) =>
{
    kestrelOptions.Configure(builderContext.Configuration.GetSection("Kestrel"), reloadOnChange: true);
});

var app = builder.Build();
var url = builder.Configuration.GetSection("Kestrel").GetSection("Endpoints").GetSection("Http").GetSection("Url").Value;

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    //System.Diagnostics.Process.Start("cmd", $"/C start {url}");
}

app.UseDefaultFiles();

//app.UseHttpsRedirection();

app.UseCors(x => x
    .AllowAnyMethod()
    .AllowAnyHeader()
    .SetIsOriginAllowed(origin => true)
    .AllowCredentials());

app.UseStaticFiles();
app.UseAuthorization();

app.MapControllers();

Console.ForegroundColor = ConsoleColor.Cyan;
Console.WriteLine(@"

        ____  __________  _____                          
       / __ )/ ____/ __ \/ ___/___  ______   _____  _____
      / __  / /   / /_/ /\__ \/ _ \/ ___/ | / / _ \/ ___/
     / /_/ / /___/ ____/___/ /  __/ /   | |/ /  __/ /    
    /_____/\____/_/    /____/\___/_/    |___/\___/_/     
                                                    By Minsait     
   ");
Console.ForegroundColor = ConsoleColor.Red;
Console.WriteLine(":: AUTODOC URL -> " + url + "\n\n");

Console.ForegroundColor = ConsoleColor.White;

app.Run();
