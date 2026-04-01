import { useMemo, useState } from 'react';
import {
  getNextStatuses,
  getStatusLabel,
} from '../utils/orderStatusConfig';
import { updateOrderStatus } from '../utils/orderQueries';

export default function StatusUpdatePanel({
  orderId,
  currentStatus,
  onUpdated,
}) {
  const nextStatuses = useMemo(
    () => getNextStatuses(currentStatus),
    [currentStatus]
  );

  const [selectedStatus, setSelectedStatus] = useState(nextStatuses[0] ?? '');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedStatus) {
      setErrorMessage('Please select the next status.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await updateOrderStatus({
        orderId,
        newStatus: selectedStatus,
        note,
      });

      setNote('');

      const nextOptions = getNextStatuses(selectedStatus);
      setSelectedStatus(nextOptions[0] ?? '');

      if (onUpdated) {
        await onUpdated();
      }
    } catch (error) {
      setErrorMessage(error?.message ?? 'Failed to update order status.');
    } finally {
      setIsSubmitting(false);
    }
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
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'grid',
        gap: '12px',
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
        }}
      >
        Update Order Status
      </div>

      <div style={{ display: 'grid', gap: '6px' }}>
        <label style={{ fontWeight: 500, color: '#444444' }}>
          Next Status
        </label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          disabled={isSubmitting}
          style={{
            padding: '10px 12px',
            borderRadius: '10px',
            border: '1px solid #D8D8D8',
            background: '#FFFFFF',
          }}
        >
          {nextStatuses.map((status) => (
            <option key={status} value={status}>
              {getStatusLabel(status)}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gap: '6px' }}>
        <label style={{ fontWeight: 500, color: '#444444' }}>
          Note
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note for this status change"
          rows={4}
          disabled={isSubmitting}
          style={{
            padding: '10px 12px',
            borderRadius: '10px',
            border: '1px solid #D8D8D8',
            background: '#FFFFFF',
            resize: 'vertical',
          }}
        />
      </div>

      {errorMessage ? (
        <div
          style={{
            padding: '10px 12px',
            borderRadius: '10px',
            background: '#FDEDED',
            color: '#B3261E',
            border: '1px solid #F5C2C0',
          }}
        >
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: '12px 16px',
          borderRadius: '10px',
          border: 'none',
          background: '#E25D4D',
          color: '#FFFFFF',
          fontWeight: 600,
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.7 : 1,
        }}
      >
        {isSubmitting ? 'Updating...' : 'Update Status'}
      </button>
    </form>
  );
}