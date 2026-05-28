import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from '@/components/ui/Modal';
import { Plus, Search, Briefcase } from 'lucide-react';

interface Faculty {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  faculty?: {
    employeeId: string;
    department?: string;
  };
  isActive: boolean;
}

export default function FacultyPage() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users', { params: { role: 'Faculty' } });
      setFacultyList(response.data.data.data || []);
    } catch (error) {
      console.error('Failed to fetch faculty', error);
      // Fallback dummy data
      setFacultyList([
        { id: '1', firstName: 'Dr. Robert', lastName: 'Oppenheimer', email: 'robert@gccschool.com', faculty: { employeeId: 'EMP-001', department: 'Physics' }, isActive: true },
        { id: '2', firstName: 'Marie', lastName: 'Curie', email: 'marie@gccschool.com', faculty: { employeeId: 'EMP-002', department: 'Chemistry' }, isActive: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const columns: Column<Faculty>[] = [
    {
      key: 'name',
      header: 'Faculty Name',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-(--color-primary-100) flex items-center justify-center text-(--color-primary-700)">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <div className="font-medium">{row.firstName} {row.lastName}</div>
            <div className="text-xs text-(--text-muted)">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'employeeId',
      header: 'Employee ID',
      render: (row) => row.faculty?.employeeId || 'N/A',
    },
    {
      key: 'department',
      header: 'Department',
      render: (row) => row.faculty?.department || 'Unassigned',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.isActive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>Manage</Button>
      ),
    }
  ];

  const filteredFaculty = facultyList.filter(f => 
    f.firstName.toLowerCase().includes(search.toLowerCase()) || 
    f.lastName.toLowerCase().includes(search.toLowerCase()) ||
    f.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-(--text-primary)">Faculty Management</h1>
          <p className="text-(--text-muted)">Manage teachers, professors, and staff members.</p>
        </div>
        
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalTrigger asChild>
            <Button leftIcon={<Plus className="w-4 h-4" />}>Add Faculty</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Add New Faculty Member</ModalTitle>
            </ModalHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" placeholder="Marie" />
                <Input label="Last Name" placeholder="Curie" />
              </div>
              <Input label="Email Address" type="email" placeholder="marie@gccschool.com" />
              <Input label="Employee ID" placeholder="EMP-003" />
              <Input label="Department" placeholder="e.g. Science" />
              <Button onClick={() => setIsModalOpen(false)} className="mt-2 w-full">Save Faculty</Button>
            </div>
          </ModalContent>
        </Modal>
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
    </div>
  );
}
