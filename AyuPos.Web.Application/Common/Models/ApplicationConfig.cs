using System.Text;
using Throw;

namespace AyuPos.Web.Application.Common.Models;

public class ApplicationConfig
{
    public string Secret { get; set; } = null!;
    public string[] AllowedHosts { get; set; }  = null!;
    public string Issuer { get; set; } = null!;
    public string Audience { get; set; } = null!;
    
    public byte[] Key => Encoding.UTF8.GetBytes(Secret);
}