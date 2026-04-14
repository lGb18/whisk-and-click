import React from 'react';

export default function PageLoader() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh', 
      gap: 'var(--space-md)' 
    }}>
      <div 
        className="skeleton-pulse" 
        style={{
          width: '48px',
          height: '48px',
          border: '4px solid var(--surface-muted)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      <p style={{ color: 'var(--text-secondary)', fontWeight: 500, margin: 0 }}>
        Loading...
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}