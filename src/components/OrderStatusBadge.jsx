import { getStatusColors, getStatusLabel } from '../utils/orderStatusConfig';

export default function OrderStatusBadge({ status }) {
  const colors = getStatusColors(status);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px 12px',
        borderRadius: '999px',
        fontSize: '0.85rem',
        fontWeight: 600,
        background: colors.background,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {getStatusLabel(status)}
    </span>
  );
}