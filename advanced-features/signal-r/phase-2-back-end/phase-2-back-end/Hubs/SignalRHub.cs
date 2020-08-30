using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace phase_2_back_end.Hubs
{
    public class SignalRHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            await Clients.All.SendAsync("NewUserConnection");
            await base.OnConnectedAsync();
        }
    }
}
