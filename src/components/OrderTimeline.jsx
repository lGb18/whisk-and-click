import {
  formatStatusTransition,
  getStatusLabel,
} from '../utils/orderStatusConfig';

function formatDateTime(value) {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleString();
}

export default function OrderTimeline({ history = [] }) {
  if (!history.length) {
    return (
      <div
        style={{
          padding: '16px',
          border: '1px solid #E5E5E5',
          borderRadius: '12px',
          background: '#FFFFFF',
        }}
      >
        No status history available yet.
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: '12px',
      }}
    >
      {history.map((item, index) => {
        const isLast = index === history.length - 1;

        return (
          <div
            key={item.id ?? `${item.changed_at}-${index}`}
            style={{
              display: 'grid',
              gridTemplateColumns: '20px 1fr',
              gap: '12px',
              alignItems: 'start',
            }}
          >
            <div
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '999px',
                  background: '#E25D4D',
                  marginTop: '6px',
                  zIndex: 1,
                }}
              />
              {!isLast && (
                <div
                  style={{
                    position: 'absolute',
                    top: '18px',
                    width: '2px',
                    height: 'calc(100% + 12px)',
                    background: '#E6E6E6',
                  }}
                />
              )}
            </div>

            <div
              style={{
                padding: '12px 14px',
                border: '1px solid #EFEFEF',
                borderRadius: '12px',
                background: '#FFFFFF',
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  color: '#333333',
                  marginBottom: '4px',
                }}
              >
                {formatStatusTransition(item.previous_status, item.new_status)}
              </div>

              <div
                style={{
                  fontSize: '0.9rem',
                  color: '#666666',
                  marginBottom: item.note ? '8px' : '4px',
                }}
              >
                {formatDateTime(item.changed_at)}
                {item.actor_role ? ` • ${String(item.actor_role).replace(/_/g, ' ')}` : ''}
              </div>

              {item.note ? (
                <div
                  style={{
                    fontSize: '0.95rem',
                    color: '#444444',
                    lineHeight: 1.5,
                  }}
                >
                  {item.note}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}