using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using phase_2_back_end.Controllers;
using phase_2_back_end.Models;

namespace phase_2_back_end.Hubs
{
    public class SignalRHub : Hub
    {
        private CanvasController _canvasController;

        public SignalRHub(ApplicationDatabase context, IConfiguration config)
        {
            _canvasController = new CanvasController(context, config);
        }

        public override async Task OnConnectedAsync()
        {
            string clientIp = Context.GetHttpContext().Connection.RemoteIpAddress.ToString();
            await Clients.Others.SendAsync("NewUserConnected", clientIp);
            CurrentSession.ConnectedIds.Add(Context.ConnectionId);

            if (CurrentSession.ColourArray == null)
            {
                CurrentSession.ColourArray = JsonConvert.DeserializeObject<string[][]>(_canvasController.GetCanvas());
                await Clients.Caller.SendAsync("ColourArrayUpdated", CurrentSession.ColourArray);
            }
            else
            {
                await Clients.Caller.SendAsync("ColourArrayUpdated", CurrentSession.ColourArray);
            }

            await base.OnConnectedAsync();
        }

        public async Task UpdateColourArray(string cellUpdateJson)
        {
            CellUpdate cellUpdate = JsonConvert.DeserializeObject<CellUpdate>(cellUpdateJson);
            CurrentSession.ColourArray[cellUpdate.Position.Row][cellUpdate.Position.Col] = cellUpdate.Colour;
            await Clients.All.SendAsync("ColourArrayUpdated", CurrentSession.ColourArray);
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            CurrentSession.ConnectedIds.Remove(Context.ConnectionId);
            if (CurrentSession.ConnectedIds.Count == 0)
            {
                await _canvasController.UpdateCanvas(CurrentSession.ColourArray);
            }
            await base.OnDisconnectedAsync(ex);
        }

    }
    public static class CurrentSession
    {
        public static string[][] ColourArray;
        public static HashSet<string> ConnectedIds = new HashSet<string>();
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
