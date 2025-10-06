import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter, ModalClose } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Task, TeamMember } from '../../types';
import { getTeamMembers, getProjects, setTasks, getTasks } from '../../utils/localStorage';

interface EditTaskModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdated?: (task: Task) => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, open, onOpenChange, onTaskUpdated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'To Do' as Task['status'],
    priority: 'Medium' as Task['priority'],
    assignees: [] as string[],
    projectId: '',
  });

  const teamMembers = getTeamMembers();
  const projects = getProjects();

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate.split('T')[0], // Convert to YYYY-MM-DD format
        status: task.status,
        priority: task.priority,
        assignees: task.assignees,
        projectId: task.projectId || '',
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task || !formData.title.trim()) return;

    const updatedTask: Task = {
      ...task,
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate || new Date().toISOString(),
      status: formData.status,
      priority: formData.priority,
      assignees: formData.assignees,
      projectId: formData.projectId || undefined,
      updatedAt: new Date().toISOString(),
    };

    const tasks = getTasks();
    const updatedTasks = tasks.map(t => t.id === task.id ? updatedTask : t);
    setTasks(updatedTasks);

    onOpenChange(false);
    onTaskUpdated?.(updatedTask);
  };

  const handleAssigneeChange = (memberId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        assignees: [...prev.assignees, memberId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        assignees: prev.assignees.filter(id => id !== memberId)
      }));
    }
  };

  if (!task) return null;

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="sm:max-w-lg">
        <ModalHeader>
          <ModalTitle>Edit Task</ModalTitle>
          <ModalDescription>
            Update the task details below.
          </ModalDescription>
        </ModalHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="Enter task title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />

          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter task description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            />

            <div>
              <label className="text-sm font-medium text-gray-700">Priority</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              className="mt-1 w-full  border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Task['status'] }))}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Project</label>
            <select
              className="mt-1 w-full  border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={formData.projectId}
              onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
            >
              <option value="">No Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Assignees</label>
            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border border-gray-200  p-2">
              {teamMembers.map(member => (
                <label key={member.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.assignees.includes(member.id)}
                    onChange={(e) => handleAssigneeChange(member.id, e.target.checked)}
                    className="w-4 h-4 rounded-sm border-gray-300 focus:ring-2"
                    style={{ accentColor: '#6B40ED' }}
                  />
                  <span className="text-sm text-gray-700">{member.name}</span>
                </label>
              ))}
            </div>
          </div>

          <ModalFooter>
            <ModalClose asChild>
              <Button variant="outline">Cancel</Button>
            </ModalClose>
            <Button type="submit">Update Task</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

