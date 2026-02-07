'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserCircle,
  Shield,
  Mail,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Mock users data
const mockUsers = [
  {
    id: 'user-1',
    name: 'Ahmad Kasir',
    email: 'ahmad@smartpos.com',
    role: 'CASHIER' as const,
    isActive: true,
    createdAt: new Date('2026-01-15'),
    lastLogin: new Date('2026-02-08T09:30:00'),
  },
  {
    id: 'user-2',
    name: 'Budi Admin',
    email: 'budi@smartpos.com',
    role: 'ADMIN' as const,
    isActive: true,
    createdAt: new Date('2025-12-01'),
    lastLogin: new Date('2026-02-08T08:00:00'),
  },
  {
    id: 'user-3',
    name: 'Citra Manager',
    email: 'citra@smartpos.com',
    role: 'MANAGER' as const,
    isActive: true,
    createdAt: new Date('2026-01-20'),
    lastLogin: new Date('2026-02-07T17:45:00'),
  },
  {
    id: 'user-4',
    name: 'Dewi Kitchen',
    email: 'dewi@smartpos.com',
    role: 'KITCHEN' as const,
    isActive: false,
    createdAt: new Date('2026-02-01'),
    lastLogin: new Date('2026-02-05T14:20:00'),
  },
];

type UserRole = 'ADMIN' | 'MANAGER' | 'CASHIER' | 'KITCHEN';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  lastLogin: Date;
}

interface UserFormData {
  name: string;
  email: string;
  role: UserRole | '';
  password: string;
}

const defaultFormData: UserFormData = {
  name: '',
  email: '',
  role: '',
  password: '',
};

const roleLabels: Record<UserRole, { label: string; color: string }> = {
  ADMIN: { label: 'Admin', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  MANAGER: { label: 'Manager', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  CASHIER: { label: 'Kasir', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  KITCHEN: { label: 'Dapur', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>(defaultFormData);
  const [isEditing, setIsEditing] = useState(false);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormData(defaultFormData);
    setIsEditing(false);
    setFormDialogOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
    });
    setSelectedUser(user);
    setIsEditing(true);
    setFormDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.role) {
      return;
    }

    if (isEditing && selectedUser) {
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? {
        ...u,
        name: formData.name,
        email: formData.email,
        role: formData.role as UserRole,
      } : u));
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role as UserRole,
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date(),
      };
      setUsers(prev => [...prev, newUser]);
    }

    setFormDialogOpen(false);
    setFormData(defaultFormData);
    setSelectedUser(null);
  };

  const handleDelete = () => {
    if (selectedUser) {
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Pengguna</h2>
          <p className="text-muted-foreground">
            Kelola akun kasir, dapur, dan admin
          </p>
        </div>
        <Button className="gap-2" onClick={handleOpenAdd}>
          <Plus className="h-4 w-4" />
          Tambah Pengguna
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <UserCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Pengguna</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aktif</p>
              <p className="text-2xl font-bold text-green-600">{users.filter(u => u.isActive).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
              <UserCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Kasir</p>
              <p className="text-2xl font-bold">{users.filter(u => u.role === 'CASHIER').length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900">
              <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Admin</p>
              <p className="text-2xl font-bold">{users.filter(u => u.role === 'ADMIN').length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari pengguna..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pengguna</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Terakhir Login</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Bergabung {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(roleLabels[user.role].color)}>
                      {roleLabels[user.role].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.isActive ? 'default' : 'secondary'}
                      className={cn(
                        user.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : ''
                      )}
                    >
                      {user.isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateTime(user.lastLogin)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenEdit(user)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                          <Shield className="h-4 w-4 mr-2" />
                          {user.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => { setSelectedUser(user); setDeleteDialogOpen(true); }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Tidak ada pengguna ditemukan
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Ubah informasi pengguna' : 'Isi informasi pengguna baru'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                placeholder="Nama pengguna"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="CASHIER">Kasir</SelectItem>
                  <SelectItem value="KITCHEN">Dapur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!isEditing && (
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password baru"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFormDialogOpen(false)}>Batal</Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.name.trim() || !formData.email.trim() || !formData.role}
            >
              {isEditing ? 'Simpan' : 'Tambah'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Pengguna</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Apakah Anda yakin ingin menghapus <span className="font-medium text-foreground">{selectedUser?.name}</span>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
