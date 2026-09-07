import { useDroppable } from '@dnd-kit/core';

// Plate drop target — uses @dnd-kit/core useDroppable
export default function PlateDropTarget({ children, hasItems }) {
  const { isOver, setNodeRef } = useDroppable({ id: 'plate-drop-target' });

  return (
    <div
      ref={setNodeRef}
      className={`plate-area ${isOver ? 'drag-over' : ''} ${!hasItems ? 'empty' : ''}`}
    >
      {children}
      {!hasItems && (
        <div className="plate-empty-state">
          <div className="plate-panda-outline" />
          <span className="plate-question">?</span>
        </div>
      )}
    </div>
  );
}
