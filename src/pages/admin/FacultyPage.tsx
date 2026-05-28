import { useState, useEffect } from 'react';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/Modal';
import { Plus, Search, Briefcase, Edit2, Trash2 } from 'lucide-react';
import apiClient from '@/services/api.client';

interface Faculty {
  id: string; // The Faculty ID
  employeeId: string;
  department?: { name: string };
  isActive: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

export default function FacultyPage() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
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
    employeeId: '',
  });

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/faculty');
      console.log(response,'------his is the reponseo')
      setFacultyList(response?.data || []);
    } catch (error) {
      console.error('Failed to fetch faculty', error);
      // Fallback dummy data removed in favor of real API errors.
      setFacultyList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleOpenModal = (faculty?: Faculty) => {
    if (faculty) {
      setEditingId(faculty.id);
      setFormData({
        firstName: faculty.user?.firstName || '',
        lastName: faculty.user?.lastName || '',
        email: faculty.user?.email || '',
        employeeId: faculty.employeeId || '',
      });
    } else {
      setEditingId(null);
      setFormData({ firstName: '', lastName: '', email: '', employeeId: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);
      if (editingId) {
        await apiClient.patch(`/faculty/${editingId}`, formData);
      } else {
        await apiClient.post('/faculty', formData);
      }
      setIsModalOpen(false);
      fetchFaculty();
    } catch (error) {
      console.error('Failed to save faculty', error);
      alert('Error saving faculty member. Please check the data and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      setSubmitting(true);
      await apiClient.delete(`/faculty/${deletingId}`);
      setIsDeleteModalOpen(false);
      fetchFaculty();
    } catch (error) {
      console.error('Failed to delete faculty', error);
      alert('Error deleting faculty member.');
    } finally {
      setSubmitting(false);
      setDeletingId(null);
    }
  };

  const columns: Column<Faculty>[] = [
    {
      key: 'name',
      header: 'Faculty Name',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-(--color-accent-100) flex items-center justify-center text-(--color-accent-700)">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <div className="font-medium">{row.user?.firstName} {row.user?.lastName}</div>
            <div className="text-xs text-(--text-muted)">{row.user?.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'employeeId',
      header: 'Employee ID',
      render: (row) => row.employeeId || 'N/A',
    },
    {
      key: 'department',
      header: 'Department',
      render: (row) => row.department?.name || 'Unassigned',
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

  const filteredFaculty = facultyList.filter(f => 
    f.user?.firstName?.toLowerCase().includes(search.toLowerCase()) || 
    f.user?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    f.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    f.employeeId?.toLowerCase().includes(search.toLowerCase()) ||
    f.department?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-(--text-primary)">Faculty Directory</h1>
          <p className="text-(--text-muted)">Manage teaching and non-teaching staff members.</p>
        </div>
        
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => handleOpenModal()}>
          Add Faculty
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="w-full md:w-1/3">
            <Input 
              placeholder="Search faculty..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={filteredFaculty} 
            isLoading={loading}
            emptyMessage="No faculty members found."
          />
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{editingId ? 'Edit Faculty' : 'Add New Faculty'}</ModalTitle>
          </ModalHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="First Name" 
                placeholder="Marie" 
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <Input 
                label="Last Name" 
                placeholder="Curie" 
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="marie@gccschool.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!!editingId}
            />
            <Input 
              label="Employee ID" 
              placeholder="EMP-001" 
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            />
            <Button onClick={handleSave} isLoading={submitting} className="mt-2 w-full">
              {editingId ? 'Save Changes' : 'Create Faculty'}
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
            <p className="text-(--text-muted)">Are you sure you want to delete this faculty member? This action cannot be undone.</p>
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
