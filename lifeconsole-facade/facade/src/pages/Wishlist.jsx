import { Heart } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';

function Wishlist() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-white">Wishlist</h1>
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty."
        hint="Things you want to save for will appear here."
      />
    </div>
  );
}

export default Wishlist;
