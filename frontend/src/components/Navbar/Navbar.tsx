import SearchBar from './SearchBar';
import NotificationButton from './NotificationButton';
import CreateTripButton from './CreateTripButton';
import LogoutButton from './LogoutButton';

export default function Navbar() {
  return (
    <header className="h-20 bg-transparent flex items-center justify-between px-8 pt-4">
      <div className="flex-1 max-w-2xl flex items-center">
        <SearchBar />
      </div>
      
      <div className="flex items-center space-x-6">
        <NotificationButton />
        <CreateTripButton />
        <LogoutButton />
      </div>
    </header>
  );
}
