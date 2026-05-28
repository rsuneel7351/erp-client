import { useState, useEffect } from 'react';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from '@/components/ui/Modal';
import { Plus, Search, UserCircle, Edit2, Trash2 } from 'lucide-react';
import apiClient from '@/services/api.client';

interface Student {
  id: string; // The Student ID (not the User ID)
  enrollmentNumber: string;
  isActive: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    enrollmentNumber: '',
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/students');
      setStudents(response.data.data.data || []);
    } catch (error) {
      console.error('Failed to fetch students', error);
      // Fallback dummy data removed in favor of real API errors.
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleOpenModal = (student?: Student) => {
    if (student) {
      setEditingId(student.id);
      setFormData({
        firstName: student.user?.firstName || '',
        lastName: student.user?.lastName || '',
        email: student.user?.email || '',
        enrollmentNumber: student.enrollmentNumber || '',
      });
    } else {
      setEditingId(null);
      setFormData({ firstName: '', lastName: '', email: '', enrollmentNumber: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);
      if (editingId) {
        await apiClient.patch(`/students/${editingId}`, formData);
      } else {
        await apiClient.post('/students', formData);
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (error) {
      console.error('Failed to save student', error);
      alert('Error saving student. Please check the data and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      setSubmitting(true);
      await apiClient.delete(`/students/${deletingId}`);
      setIsDeleteModalOpen(false);
      fetchStudents();
    } catch (error) {
      console.error('Failed to delete student', error);
      alert('Error deleting student.');
    } finally {
      setSubmitting(false);
      setDeletingId(null);
    }
  };

  const columns: Column<Student>[] = [
    {
      key: 'name',
      header: 'Student Name',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-(--color-primary-100) flex items-center justify-center text-(--color-primary-700)">
            <UserCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium">{row.user?.firstName} {row.user?.lastName}</div>
            <div className="text-xs text-(--text-muted)">{row.user?.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'enrollmentNumber',
      header: 'Enrollment No.',
      render: (row) => row.enrollmentNumber || 'N/A',
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(row)}>
            <Edit2 className="w-4 h-4 text-blue-400" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setDeletingId(row.id); setIsDeleteModalOpen(true); }}>
            <Trash2 className="w-4 h-4 text-red-400" />
          </Button>
        </div>
      ),
    }
  ];

  const filteredStudents = students.filter(s => 
    s.user?.firstName?.toLowerCase().includes(search.toLowerCase()) || 
    s.user?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    s.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.enrollmentNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-(--text-primary)">Students Directory</h1>
          <p className="text-(--text-muted)">Manage all student profiles and enrollment data.</p>
        </div>
        
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => handleOpenModal()}>
          Add Student
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="w-full md:w-1/3">
            <Input 
              placeholder="Search students..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={filteredStudents} 
            isLoading={loading}
            emptyMessage="No students found."
          />
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{editingId ? 'Edit Student' : 'Add New Student'}</ModalTitle>
          </ModalHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="First Name" 
                placeholder="John" 
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <Input 
                label="Last Name" 
                placeholder="Doe" 
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="john@gccschool.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!!editingId}
            />
            <Input 
              label="Enrollment Number" 
              placeholder="EN1004" 
              value={formData.enrollmentNumber}
              onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
            />
            <Button onClick={handleSave} isLoading={submitting} className="mt-2 w-full">
              {editingId ? 'Save Changes' : 'Create Student'}
            </Button>
          </div>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Confirm Deletion</ModalTitle>
          </ModalHeader>
          <div className="py-4">
            <p className="text-(--text-muted)">Are you sure you want to delete this student? This action cannot be undone.</p>
            <div className="flex space-x-4 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
              <Button variant="default" className="flex-1 bg-red-500 hover:bg-red-600 text-white" isLoading={submitting} onClick={confirmDelete}>Delete</Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
