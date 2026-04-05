- import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
+ import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';

const TaskBoard = ({ tasks, onReorder, onComplete }) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(tasks);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    onReorder(reordered);
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-md dark:bg-slate-900">
      <h3 className="mb-3 text-lg font-semibold">Task Progress</h3>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="task-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
              {tasks.map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(dragProvided) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className={task.completed ? 'line-through opacity-60' : ''}>{task.title}</p>
                        <button onClick={() => onComplete(task)} className="rounded bg-emerald-600 px-2 py-1 text-xs text-white">
                          Done
                        </button>
                      </div>
                      <div className="mt-2 h-2 rounded bg-slate-200 dark:bg-slate-700">
                        <div
                          className="h-2 rounded bg-brand-500"
                          style={{ width: task.completed ? '100%' : `${task.importance * 20}%` }}
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;
