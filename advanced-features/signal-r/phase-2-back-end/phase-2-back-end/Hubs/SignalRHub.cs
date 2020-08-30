using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace phase_2_back_end.Hubs
{
    public class SignalRHub : Hub
    {
        public static class CurrentSession
        {
            public static string[][] ColourArray;
        }

        public override async Task OnConnectedAsync()
        {
            string clientIp = Context.GetHttpContext().Request.Host.Host;
            await Clients.Others.SendAsync("NewUserConnection", clientIp);

            if (CurrentSession.ColourArray == null)
            {
                await Clients.Caller.SendAsync("InitializeSession");
            }

            await base.OnConnectedAsync();
        }

        public void SetColourArray(string[][] colourArray)
        {
            CurrentSession.ColourArray = colourArray;
        }


    }
}
