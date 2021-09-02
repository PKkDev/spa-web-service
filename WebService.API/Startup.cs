using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using NLog.Extensions.Logging;
using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Threading.Tasks;
using WebService.API.Health;
using WebService.Domain.ServicesContract;
using WebService.Infrastructure.Context;
using WebService.Infrastructure.Services;
using WebService.Infrastructure.Token;

namespace WebService.API
{
    /// <summary>
    /// конвейер обработки запросов
    /// </summary>
    public class Startup
    {
        /// <summary>
        /// поставщик конфигурации
        /// </summary>
        private IConfiguration Configuration { get; set; }

        /// <summary>
        /// провайдер для логирования команд ef core серез nlog
        /// </summary>
        public static readonly ILoggerFactory EfNlogFactory = LoggerFactory.Create(builder =>
        {
            builder
              .AddNLog()
              .SetMinimumLevel(LogLevel.Trace);
        });

        /// <summary>
        /// инициализация
        /// </summary>
        /// <param name="configuration"></param>
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container
        /// </summary>
        /// <param name="services"></param>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            #region add helth check

            services.AddHealthChecks()
                .AddDbContextCheck<ApplicationContext>("DB check");

            #endregion

            #region add services

            services.AddScoped<IToDoService, ToDoService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IJwtTokenService, JwtTokenService>();
            services.AddScoped<IPostService, PostService>();
            services.AddScoped<IDepartmentService, DepartmentService>();

            services.AddHttpClient("smsAreaApi", s =>
            {
                s.BaseAddress = new Uri(Configuration["SmsAreaSettings:BaseUrl"]);
            })
                .ConfigurePrimaryHttpMessageHandler(() =>
                {
                    var user = Configuration["SmsAreaSettings:User"];
                    var pass = Configuration["SmsAreaSettings:Pass"];
                    return new HttpClientHandler()
                    {
                        UseDefaultCredentials = true,
                        Credentials = new NetworkCredential(user, pass)
                    };
                });

            #endregion

            #region добавление JWT аутентификации

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = AuthOptions.ISSUER,
                        ValidateAudience = true,
                        ValidAudience = AuthOptions.AUDIENCE,
                        ValidateLifetime = true,
                        IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
                        ValidateIssuerSigningKey = true,
                    };
                    options.Events = new JwtBearerEvents()
                    {
                        OnAuthenticationFailed = c => { return Task.CompletedTask; },
                        OnTokenValidated = c => { return Task.CompletedTask; }
                    };
                });

            #endregion

            #region add db context

            services.AddDbContext<ApplicationContext>(options =>
                {
                    options.UseMySql(Configuration.GetConnectionString("ConnectDatabase"),
                        new MySqlServerVersion(new Version(8, 0, 23)));
                    options.UseLoggerFactory(EfNlogFactory);
                });

            #endregion

            #region add cors

            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder =>
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader()

                        );
            });

            #endregion

            #region add swagger

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "WEB API",
                    Description = "A simple ASP.NET Core Web API",
                    Contact = new OpenApiContact
                    {
                        Name = "Kirill",
                        Email = string.Empty,
                        Url = new Uri("https://github.com/PKkDev"),
                    }
                });

                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
            });

            #endregion

            #region add spa

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "clientWebApp";
            });

            #endregion
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline
        /// </summary>
        /// <param name="app"></param>
        /// <param name="env"></param>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();
            else
                app.UseExceptionHandler("/error");

            #region use spa

            app.UseSpaStaticFiles();

            #endregion

            #region use static files

            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(
                        Directory.GetCurrentDirectory(), @"wwwroot")),
                RequestPath = new PathString("/wwwroot")
            });

            #endregion

            #region use swagger

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
                c.RoutePrefix = "swagger";
            });

            #endregion

            #region use cors

            app.UseCors("CorsPolicy");

            #endregion

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHealthChecks("/health", new HealthCheckOptions()
                {
                    ResponseWriter = Response.WriteResponse
                });
                endpoints.MapControllers();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "../client-app";

                //if (env.EnvironmentName == "Development" &&
                //Environment.GetEnvironmentVariable("TYPE_WEB") == "FullApp")
                //{
                //    spa.UseAngularCliServer(npmScript: "start");
                //}

            });
        }
    }
}
