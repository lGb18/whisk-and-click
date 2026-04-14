import { useMemo, useState } from 'react';
import {
  getNextStatuses,
  getStatusLabel,
} from '../utils/orderStatusConfig';
import { updateOrderStatus } from '../utils/orderQueries';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function StatusUpdatePanel({ orderId, currentStatus, onUpdated }) {
  const nextStatuses = useMemo(() => getNextStatuses(currentStatus), [currentStatus]);
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState(nextStatuses[0] ?? '');
  const [note, setNote] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const mutation = useMutation({
    mutationFn: ({ newStatus, statusNote }) => updateOrderStatus({ orderId, newStatus, note: statusNote }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      setNote('');
    },
    onError: (err) => {
      setErrorMessage(err.message || 'Failed to update status.');
    }
  });

  async function handleSubmit(event) {
    event.preventDefault();
    if (!selectedStatus) {
      setErrorMessage('Please select the next status.');
      return;
    }
    setErrorMessage('');
    
    mutation.mutate({ newStatus: selectedStatus, statusNote: note });
  }

  if (!nextStatuses.length) {
    return (
      <div
        style={{
          padding: '16px',
          border: '1px solid #E8E8E8',
          borderRadius: '14px',
          background: '#FFFFFF',
        }}
      >
        <div
          style={{
            fontWeight: 600,
            color: '#333333',
            marginBottom: '6px',
          }}
        >
          Status Update
        </div>
        <div style={{ color: '#666666' }}>
          No further transitions are available for this order.
        </div>
      </div>
    );
  }

  return (
    <form className="card" onSubmit={handleSubmit} style={{ padding: "var(--space-lg)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      <h3 style={{ fontSize: "var(--font-h3-size)", margin: 0 }}>Update Order Status</h3>

      <div className="form-field">
        <span>Next Status</span>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          disabled={mutation.isPending}
          style={{ backgroundColor: "var(--surface-muted)", border: "none" }}
        >
          {nextStatuses.map((status) => (
            <option key={status} value={status}>
              {getStatusLabel(status)}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <span>Internal Note (Optional)</span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g., Cake is in the oven, waiting for courier..."
          rows={3}
          disabled={mutation.isPending}
          style={{ backgroundColor: "var(--surface-muted)", border: "none", resize: "vertical" }}
        />
      </div>

      {errorMessage && (
        <div className="alert alert-error">{errorMessage}</div>
      )}

      <button
        type="submit"
        className="primary-button"
        disabled={mutation.isPending}
        style={{ marginTop: "var(--space-sm)" }}
      >
        {mutation.isPending ? 'Updating...' : 'Confirm Status Update'}
      </button>
    </form>
  );
}