import { useVehicleStore } from '../store/useVehicleStore';
import { useTripStore } from '../store/useTripStore';
import { useDriverStore } from '../store/useDriverStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Filter } from 'lucide-react';

export default function Dashboard() {
  const { vehicles } = useVehicleStore();
  const { trips } = useTripStore();
  const { drivers } = useDriverStore();

  const activeVehicles = vehicles.filter(v => v.status === 'On Trip').length;
  const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
  const inMaintenance = vehicles.filter(v => v.status === 'In Shop').length;
  
  const activeTrips = trips.filter(t => t.status === 'Dispatched').length;
  const pendingTrips = trips.filter(t => t.status === 'Draft').length;
  
  const driversOnDuty = drivers.filter(d => d.status === 'On Trip').length;
  const fleetUtilization = vehicles.length ? Math.round((activeVehicles / vehicles.length) * 100) : 0;

  const kpis = [
    { label: 'ACTIVE VEHICLES', value: activeVehicles, id: 1 },
    { label: 'AVAILABLE VEHICLES', value: availableVehicles, id: 2 },
    { label: 'VEHICLES IN MAINTENANCE', value: inMaintenance, id: 3 },
    { label: 'ACTIVE TRIPS', value: activeTrips, id: 4 },
    { label: 'PENDING TRIPS', value: pendingTrips, id: 5 },
    { label: 'DRIVERS ON DUTY', value: driversOnDuty, id: 6 },
    { label: 'FLEET UTILIZATION', value: `${fleetUtilization}%`, id: 7, color: 'text-[#111111]' },
  ];

  const vehicleStatusData = [
    { name: 'Available', count: availableVehicles, color: '#111111' },
    { name: 'On Trip', count: activeVehicles, color: '#6B7280' },
    { name: 'In Shop', count: inMaintenance, color: '#9CA3AF' },
    { name: 'Retired', count: vehicles.filter(v => v.status === 'Retired').length, color: '#ECECEC' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 mb-4 items-center">
        <span className="text-sm font-semibold text-[#6B7280] uppercase flex items-center">
          <Filter className="w-4 h-4 mr-1" /> Filters
        </span>
        <select className="border-[#ECECEC] bg-[#FAFAFA] border text-sm rounded-xl px-3 py-2 focus:ring-1 focus:ring-[#0C0D0D] transition-all">
          <option>Vehicle Type: All</option>
        </select>
        <select className="border-[#ECECEC] bg-[#FAFAFA] border text-sm rounded-xl px-3 py-2 focus:ring-1 focus:ring-[#0C0D0D] transition-all">
          <option>Status: All</option>
        </select>
        <select className="border-[#ECECEC] bg-[#FAFAFA] border text-sm rounded-xl px-3 py-2 focus:ring-1 focus:ring-[#0C0D0D] transition-all">
          <option>Region: All</option>
        </select>
      </div>

      {/* KPI Section */}
      <div className="bg-white rounded-[24px] p-6 flex items-center overflow-x-auto space-x-6 hide-scrollbar border border-[#ECECEC] card-shadow">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="min-w-[140px] flex-shrink-0 flex flex-col justify-center border-r border-[#ECECEC] last:border-0 pr-6">
            <span className="text-[10px] font-bold text-[#6B7280] tracking-wider mb-2">{kpi.label}</span>
            <span className={`text-4xl font-extrabold ${kpi.color ? kpi.color : 'text-[#111111]'}`}>{kpi.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Trips Table */}
        <div className="lg:col-span-2 bg-white rounded-[24px] p-6 border border-[#ECECEC] card-shadow">
          <h3 className="text-sm font-bold text-[#111111] tracking-tight mb-4">Recent Trips</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[#6B7280] border-b border-[#ECECEC]">
                  <th className="pb-3 font-medium">TRIP</th>
                  <th className="pb-3 font-medium">VEHICLE</th>
                  <th className="pb-3 font-medium">DRIVER</th>
                  <th className="pb-3 font-medium">STATUS</th>
                  <th className="pb-3 font-medium">ETA</th>
                </tr>
              </thead>
              <tbody className="text-[#111111]">
                {trips.slice(0, 5).map((trip, idx) => {
                  const v = vehicles.find(v => v.id === trip.vehicleId);
                  const d = drivers.find(d => d.id === trip.driverId);
                  return (
                    <tr key={trip.id} className="border-b border-gray-50 last:border-0 hover:bg-neutral-50 transition-colors">
                      <td className="py-4 font-semibold text-[#111111]">TR00{idx+1}</td>
                      <td className="py-4 text-[#6B7280]">{v?.registrationNumber || '-'}</td>
                      <td className="py-4 text-[#6B7280]">{d?.name || '-'}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                          ${trip.status === 'Dispatched' ? 'bg-[#FAFAFA] border border-[#ECECEC] text-[#111111]' : 
                            trip.status === 'Completed' ? 'bg-[#16A34A] text-white' : 
                            trip.status === 'Draft' ? 'bg-[#FAFAFA] border border-[#ECECEC] text-[#6B7280]' : 'bg-[#DC2626] text-white'}
                        `}>
                          {trip.status}
                        </span>
                      </td>
                      <td className="py-4 text-[#9CA3AF]">{trip.status === 'Dispatched' ? '45 min' : '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vehicle Status Chart */}
        <div className="bg-white rounded-[24px] p-6 border border-[#ECECEC] card-shadow">
          <h3 className="text-sm font-bold text-[#111111] tracking-tight mb-4">Vehicle Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehicleStatusData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12, fontWeight: 500}} width={80} />
                <Tooltip cursor={{fill: '#FAFAFA'}} contentStyle={{borderRadius: '16px', border: '1px solid #ECECEC', boxShadow: '0 8px 24px rgba(0,0,0,.05)'}} />
                <Bar dataKey="count" barSize={12} radius={[0, 4, 4, 0]}>
                  {vehicleStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
