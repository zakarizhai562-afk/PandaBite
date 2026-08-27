// Draggable food card — uses @dnd-kit/core useDraggable
// TODO: Implement drag-and-drop via @dnd-kit
export default function FoodEntryCard({ foodId, onRemove }) {
  return (
    <div className="food-entry-card" onClick={onRemove}>
      {foodId}
    </div>
  );
}
