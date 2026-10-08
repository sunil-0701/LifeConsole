import { Heart } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import PageHeader from '../components/ui/PageHeader';

function Wishlist() {
  return (
    <div>
      <PageHeader title="Wishlist" hint="Things worth saving up for." />
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty."
        hint="Things you want to save for will appear here."
      />
    </div>
  );
}

export default Wishlist;
