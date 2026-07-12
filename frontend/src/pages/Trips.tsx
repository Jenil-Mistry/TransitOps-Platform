import TripForm from '../components/Cards/TripForm';
import TripList from '../components/Cards/TripList';

export default function Trips() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Create Trip Form */}
      <div className="w-full lg:w-1/3 flex flex-col">
        <TripForm />
      </div>

      {/* Trip Timeline View */}
      <div className="w-full lg:w-2/3 flex flex-col">
        <TripList />
      </div>
    </div>
  );
}
