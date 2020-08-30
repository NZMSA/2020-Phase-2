using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

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
            string clientIp = Context.GetHttpContext().Connection.RemoteIpAddress.ToString();
            await Clients.Others.SendAsync("NewUserConnection", clientIp);

            if (CurrentSession.ColourArray == null)
            {
                await Clients.Caller.SendAsync("InitializeColorArray");
            } else
            {
                await Clients.Caller.SendAsync("UpdateColorArray", CurrentSession.ColourArray);
            }

            await base.OnConnectedAsync();
        }

        public void SetColourArray(string[][] colourArray)
        {
            CurrentSession.ColourArray = colourArray;
        }

        public async Task UpdateColourArray(string cellUpdateJson)
        {
            CellUpdate cellUpdate = JsonConvert.DeserializeObject<CellUpdate>(cellUpdateJson);
            CurrentSession.ColourArray[cellUpdate.Position.Row][cellUpdate.Position.Col] = cellUpdate.Colour;
            await Clients.All.SendAsync("UpdateColorArray", CurrentSession.ColourArray);
        }

    }

    public class CellUpdate
    {
        public Position Position { get; set; }
        public string Colour { get; set; }
    }

    public class Position
    {
        public int Row { get; set; }
        public int Col { get; set; }
    }
}
