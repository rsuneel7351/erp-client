import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { twMerge } from 'tailwind-merge';

export interface KanbanColumn {
  id: string;
  title: string;
  taskIds: string[];
}

export interface KanbanTask {
  id: string;
  content: React.ReactNode;
}

export interface KanbanBoardProps {
  initialData: {
    tasks: Record<string, KanbanTask>;
    columns: Record<string, KanbanColumn>;
    columnOrder: string[];
  };
  onDragEnd?: (result: DropResult) => void;
}

export function KanbanBoard({ initialData, onDragEnd }: KanbanBoardProps) {
  const [data, setData] = useState(initialData);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...start, taskIds: newTaskIds };
      setData((prev) => ({
        ...prev,
        columns: { ...prev.columns, [newColumn.id]: newColumn },
      }));
    } else {
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = { ...start, taskIds: startTaskIds };

      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = { ...finish, taskIds: finishTaskIds };

      setData((prev) => ({
        ...prev,
        columns: {
          ...prev.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      }));
    }
    
    if (onDragEnd) onDragEnd(result);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {data.columnOrder.map((columnId) => {
          const column = data.columns[columnId];
          const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

          return (
            <Card key={column.id} className="min-w-[300px] bg-(--bg-surface-2) flex flex-col max-h-[80vh]">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-md flex justify-between items-center">
                  {column.title}
                  <span className="text-xs bg-(--bg-border) text-(--text-muted) px-2 py-1 rounded-full">
                    {tasks.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <CardContent
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={twMerge(
                      "p-4 flex-1 overflow-y-auto transition-colors",
                      snapshot.isDraggingOver ? "bg-(--color-primary-50) dark:bg-(--color-primary-900)/30" : ""
                    )}
                  >
                    {tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={twMerge(
                              "mb-3 bg-(--bg-surface) border border-(--bg-border) p-3 rounded-lg shadow-sm transition-shadow",
                              snapshot.isDragging ? "shadow-lg ring-2 ring-(--color-primary)" : "hover:shadow-md"
                            )}
                            style={{...provided.draggableProps.style}}
                          >
                            {task.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </CardContent>
                )}
              </Droppable>
            </Card>
          );
        })}
      </div>
    </DragDropContext>
  );
}
