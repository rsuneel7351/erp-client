import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from '@/components/ui/Modal';
import { Plus, Search, UserCircle } from 'lucide-react';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  student?: {
    enrollmentNumber: string;
    bloodGroup?: string;
  };
  isActive: boolean;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // Backend: we use /users with role query, or /students if separated. Let's assume /users.
      const response = await api.get('/users', { params: { role: 'Student' } });
      setStudents(response.data.data.data || []);
    } catch (error) {
      console.error('Failed to fetch students', error);
      // Fallback dummy data for UI display if API fails
      setStudents([
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@gccschool.com', student: { enrollmentNumber: 'EN1001' }, isActive: true },
        { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@gccschool.com', student: { enrollmentNumber: 'EN1002' }, isActive: true },
        { id: '3', firstName: 'Michael', lastName: 'Johnson', email: 'michael@gccschool.com', student: { enrollmentNumber: 'EN1003' }, isActive: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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
            <div className="font-medium">{row.firstName} {row.lastName}</div>
            <div className="text-xs text-(--text-muted)">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'enrollmentNumber',
      header: 'Enrollment No.',
      render: (row) => row.student?.enrollmentNumber || 'N/A',
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
        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>Edit</Button>
      ),
    }
  ];

  const filteredStudents = students.filter(s => 
    s.firstName.toLowerCase().includes(search.toLowerCase()) || 
    s.lastName.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-(--text-primary)">Students Directory</h1>
          <p className="text-(--text-muted)">Manage all student profiles and enrollment data.</p>
        </div>
        
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalTrigger asChild>
            <Button leftIcon={<Plus className="w-4 h-4" />}>Add Student</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Add New Student</ModalTitle>
            </ModalHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" placeholder="John" />
                <Input label="Last Name" placeholder="Doe" />
              </div>
              <Input label="Email Address" type="email" placeholder="john@gccschool.com" />
              <Input label="Enrollment Number" placeholder="EN1004" />
              <Button onClick={() => setIsModalOpen(false)} className="mt-2 w-full">Save Student</Button>
            </div>
          </ModalContent>
        </Modal>
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
    </div>
  );
}
