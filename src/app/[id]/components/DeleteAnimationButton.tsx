import React from 'react';

interface DeleteAnimationButtonProps {
  animationId: string;
}

const DeleteAnimationButton: React.FC<DeleteAnimationButtonProps> = ({ animationId }) => {
  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this animation and all its images? This cannot be undone.')) return;
    await fetch(`/api/delete-animation?session_id=${animationId}`, { method: 'POST' });
    // Remove cookies associated with the animation (if any)
    document.cookie = `animation_${animationId}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    window.location.href = '/';
  }
  return (
    <button
      onClick={handleDelete}
      style={{
        marginTop: 32,
        width: '100%',
        padding: '12px 0',
        borderRadius: 8,
        border: 'none',
        background: '#ff4d4f',
        color: '#fff',
        fontWeight: 700,
        fontSize: 16,
        cursor: 'pointer',
        transition: 'background 0.2s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      }}
    >
      Delete Animation
    </button>
  );
};

export default DeleteAnimationButton; 