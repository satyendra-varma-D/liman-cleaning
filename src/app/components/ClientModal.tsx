import React, { useState, useEffect } from 'react';
import { Client } from '../types';
import { X } from 'lucide-react';

interface ClientModalProps {
  client?: Client; // undefined for create
  onSave: (data: Omit<Client, 'id'>) => void;
  onClose: () => void;
}

const ClientModal: React.FC<ClientModalProps> = ({ client, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (client) {
      setName(client.name);
      setLocation(client.location);
      setMobile(client.mobile);
    }
  }, [client]);

  const validate = () => {
    if (!name.trim() || !location.trim() || !mobile.trim()) {
      setError('All fields are required.');
      return false;
    }
    const mobileRegex = /^\+?[0-9]{7,15}$/;
    if (!mobileRegex.test(mobile.trim())) {
      setError('Invalid mobile number format.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ name: name.trim(), location: location.trim(), mobile: mobile.trim() });
  };

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">
          {client ? 'Edit Client' : 'Add Client'}
        </h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mobile</label>
            <input
              type="text"
              placeholder="e.g. +1234567890"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;
