using Microsoft.EntityFrameworkCore.ChangeTracking;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace phase_2_back_end.Models
{
	public class HistoricalDataEntry
	{
        public HistoricalDataEntry(EntityEntry entry)
        {
            Entry = entry;
        }

        public EntityEntry Entry { get; }
        public string TableName { get; set; }
        public Dictionary<string, object> KeyValues { get; } = new Dictionary<string, object>();
        public Dictionary<string, object> OldValues { get; } = new Dictionary<string, object>();
        public Dictionary<string, object> NewValues { get; } = new Dictionary<string, object>();
        public List<PropertyEntry> TemporaryProperties { get; } = new List<PropertyEntry>();

        public bool HasTemporaryProperties => TemporaryProperties.Any();

        public HistoricalData ToHistoricalData()
        {
            var historicalData = new HistoricalData();
            historicalData.TableName = TableName;
            historicalData.DateTime = DateTime.UtcNow;
            historicalData.KeyValues = JsonConvert.SerializeObject(KeyValues);
            historicalData.OldValues = OldValues.Count == 0 ? null : JsonConvert.SerializeObject(OldValues);
            historicalData.NewValues = NewValues.Count == 0 ? null : JsonConvert.SerializeObject(NewValues);
            return historicalData;
        }
    }
}
