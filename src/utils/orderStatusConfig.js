export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_REVIEW: 'in_review',
  IN_PROGRESS: 'in_progress',
  READY_FOR_PICKUP: 'ready_for_pickup',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  in_review: 'In Review',
  in_progress: 'In Progress',
  ready_for_pickup: 'Ready for Pickup',
  out_for_delivery: 'Out for Delivery',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_COLORS = {
  pending: {
    background: '#FFF4E5',
    color: '#B26A00',
    border: '#FFD59E',
  },
  confirmed: {
    background: '#E8F3FF',
    color: '#1F5FAF',
    border: '#B9D8FF',
  },
  in_review: {
    background: '#F3E8FF',
    color: '#6B2FB3',
    border: '#D7B8FF',
  },
  in_progress: {
    background: '#FFF1F0',
    color: '#C44536',
    border: '#F3C5BE',
  },
  ready_for_pickup: {
    background: '#EAFBF0',
    color: '#1E7A3E',
    border: '#BDE6CA',
  },
  out_for_delivery: {
    background: '#EEF8FF',
    color: '#156A8A',
    border: '#B9E1F2',
  },
  completed: {
    background: '#EAF8EA',
    color: '#2E7D32',
    border: '#B9DCBC',
  },
  cancelled: {
    background: '#FDEDED',
    color: '#B3261E',
    border: '#F5C2C0',
  },
};

export const ORDER_STATUS_NEXT = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['in_review', 'cancelled'],
  in_review: ['in_progress', 'cancelled'],
  in_progress: ['ready_for_pickup', 'out_for_delivery', 'cancelled'],
  ready_for_pickup: ['completed', 'cancelled'],
  out_for_delivery: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

export function getStatusLabel(status) {
  return ORDER_STATUS_LABELS[status] ?? status ?? 'Unknown';
}

export function getStatusColors(status) {
  return (
    ORDER_STATUS_COLORS[status] ?? {
      background: '#F3F3F3',
      color: '#333333',
      border: '#DDDDDD',
    }
  );
}

export function getNextStatuses(status) {
  return ORDER_STATUS_NEXT[status] ?? [];
}

export function canTransition(fromStatus, toStatus) {
  return getNextStatuses(fromStatus).includes(toStatus);
}

export function formatStatusTransition(previousStatus, newStatus) {
  if (!previousStatus && newStatus) {
    return `Order created → ${getStatusLabel(newStatus)}`;
  }

  if (!newStatus) {
    return getStatusLabel(previousStatus);
  }

  return `${getStatusLabel(previousStatus)} → ${getStatusLabel(newStatus)}`;
}