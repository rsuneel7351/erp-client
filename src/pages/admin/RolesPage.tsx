import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from '@/components/ui/Modal';
import { ShieldCheck, Plus, Search } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/roles');
      setRoles(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch roles', error);
      // Fallback dummy data
      setRoles([
        { id: '1', name: 'Super Admin', description: 'System owner with full access', permissions: ['*'] },
        { id: '2', name: 'Admin', description: 'School administrator', permissions: ['view_students', 'manage_faculty'] },
        { id: '3', name: 'Faculty', description: 'Teacher/Professor access', permissions: ['view_students', 'mark_attendance', 'manage_results'] },
        { id: '4', name: 'Student', description: 'Student access', permissions: ['view_attendance', 'view_results'] },
        { id: '5', name: 'Parent', description: 'Parent access to student records', permissions: ['view_attendance', 'view_results'] },
        { id: '6', name: 'Accounts Team', description: 'Fee and billing management', permissions: ['manage_fees', 'view_reports'] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const columns: Column<Role>[] = [
    {
      key: 'name',
      header: 'Role Name',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="font-medium">{row.name}</div>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
    },
    {
      key: 'permissions',
      header: 'Permissions Scope',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.permissions.slice(0, 3).map((perm, idx) => (
            <span key={idx} className="px-2 py-0.5 text-xs bg-(--bg-surface-2) rounded border border-(--bg-border)">
              {perm}
            </span>
          ))}
          {row.permissions.length > 3 && (
            <span className="px-2 py-0.5 text-xs bg-(--bg-surface-2) rounded border border-(--bg-border)">
              +{row.permissions.length - 3} more
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>Edit Permissions</Button>
      ),
    }
  ];

  const filteredRoles = roles.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-(--text-primary)">Role & Permissions</h1>
          <p className="text-(--text-muted)">Define custom roles (e.g. Accounts Team) and assign specific permissions.</p>
        </div>
        
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ModalTrigger asChild>
            <Button leftIcon={<Plus className="w-4 h-4" />}>Create Role</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Create Custom Role</ModalTitle>
            </ModalHeader>
            <div className="grid gap-4 py-4">
              <Input label="Role Name" placeholder="e.g. Librarian" />
              <Input label="Description" placeholder="Manages the library system" />
              
              <div className="space-y-2 mt-2">
                <label className="block text-sm font-medium text-(--text-primary)">Select Permissions</label>
                <div className="grid grid-cols-2 gap-2 p-4 border border-(--bg-border) rounded-lg bg-(--bg-surface-2) max-h-48 overflow-y-auto">
                  {['view_students', 'manage_library', 'manage_inventory', 'view_reports'].map((perm) => (
                    <label key={perm} className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-(--bg-surface) p-1 rounded">
                      <input type="checkbox" className="rounded border-(--bg-border) text-(--color-primary) focus:ring-(--color-primary)" />
                      <span>{perm.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button onClick={() => setIsModalOpen(false)} className="mt-4 w-full">Save Role</Button>
            </div>
          </ModalContent>
        </Modal>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="w-full md:w-1/3">
            <Input 
              placeholder="Search roles..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={filteredRoles} 
            isLoading={loading}
            emptyMessage="No roles found."
          />
        </CardContent>
      </Card>
    </div>
  );
}
