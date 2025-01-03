import { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface AddNewFormProps {
  onClose: () => void;
}

const INTEGRATE_SHOP_MUTATION = gql`
  mutation IntegrateShop($shopName: String!) {
    integrateShop(shopName: $shopName)
  }
`;



export default function AddNewForm({ onClose }: AddNewFormProps) {
  const [shopName, setShopName] = useState('');
  const [code, setCode] = useState<string | null>(null);
  const [integrateShop, { loading, error }] = useMutation(INTEGRATE_SHOP_MUTATION);
  const searchParams = useSearchParams();

  // Extract "code" from the URL after component mounts
 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Form submitted with shopName: ${shopName}`);

    try {
      const { data } = await integrateShop({ variables: { shopName } });
      console.log('Response from integrateShop:', data);

      if (data?.integrateShop) {
        console.log(`Redirecting to: ${data.integrateShop}`);
        window.location.href = data.integrateShop; // Redirect to Shopify authorization URL
      } else {
        console.error('No URL returned from the server.');
      }
    } catch (err: any) {
      console.error('GraphQL Error during integrateShop:', err);
    }
  };



  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Add New Shop</h2>
        <button onClick={onClose} className="text-zinc-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="shopName" className="block text-sm font-medium text-zinc-400 mb-1">
            Shop Name
          </label>
          <input
            type="text"
            id="shopName"
            value={shopName}
            onChange={(e) => {
              console.log(`Shop name input changed to: ${e.target.value}`);
              setShopName(e.target.value);
            }}
            className="w-full bg-zinc-700/50 border border-zinc-600 rounded-lg py-2 px-4 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter shop name"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">Error: {error.message}</p>}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Shop'}
          </button>
        </div>
      </form>
    </div>
  );
}
