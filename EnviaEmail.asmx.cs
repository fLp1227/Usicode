using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web;
using System.Web.Services;

namespace SiteUsicode
{
    /// <summary>
    /// Summary description for EnviaEmail
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class EnviaEmail : System.Web.Services.WebService
    {

        [WebMethod]
        public string Contato(string nome, string email, string assunto, string mensagem, string telefone)
        {
            //return "Hello World";
           
            System.Net.Mail.SmtpClient client = new System.Net.Mail.SmtpClient();
            client.Host = "smtp.usicode.com.br";
            client.Port = 587;
            //client.EnableSsl = true;
            client.Credentials = new System.Net.NetworkCredential("contato@usicode.com.br", "XXXXXX");
            MailMessage mail = new MailMessage();
            mail.Sender = new System.Net.Mail.MailAddress("contato@usicode.com.br", "Site Usicode");
            mail.From = new MailAddress("contato@usicode.com.br", "Site Usicode");
            mail.To.Add(new MailAddress("gabrieli@usicode.com.br", "Gabrieli"));
            mail.To.Add(new MailAddress("fabio@usicode.com.br", "Fabio"));
            mail.To.Add(new MailAddress("isadora@usicode.com.br", "Isadora"));
            mail.To.Add(new MailAddress("lucas@usicode.com.br", "Lucas"));
            mail.To.Add(new MailAddress("jussara@usicode.com.br", "Jussara"));
            mail.Subject = "Site Usicode";
            mail.Body = " Mensagem do site<br/> Nome:  " + nome + "<br/> Telefone : " + telefone + "<br/> Email : " + email + " <br/> Assunto: " + assunto + " <br/> Mensagem : " + mensagem;
            mail.IsBodyHtml = true;
            mail.Priority = MailPriority.High;

            mail.SubjectEncoding = System.Text.Encoding.GetEncoding("ISO-8859-1");
            mail.BodyEncoding = System.Text.Encoding.GetEncoding("ISO-8859-1");

            try
            {
                client.Send(mail);
            }
            catch (System.Exception erro)
            {
                return "Erro ao enviar mensagem, tente novamente mais tarde ou entre em contato por um de nosso telefones";
            }
            finally
            {
                mail = null;
            }

           
            return "";

        }
    }
}
