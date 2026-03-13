import { useState } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import type { User, UserRole } from '@/types';
import { authService } from '@/services/authService';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

interface RoleAssignmentProps {
  user: User;
  onUpdate: () => void;
  onClose: () => void;
}

const ROLE_OPTIONS: { value: UserRole; label: string; description: string }[] = [
  {
    value: 'reader',
    label: 'Reader',
    description: 'Can read and comment on articles',
  },
  {
    value: 'journalist',
    label: 'Journalist',
    description: 'Can write and submit articles',
  },
  {
    value: 'editor',
    label: 'Editor',
    description: 'Can review and publish articles',
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'Full platform administration',
  },
];

export function RoleAssignment({ user, onUpdate, onClose }: RoleAssignmentProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);
  const [updating, setUpdating] = useState(false);

  const hasChanged = selectedRole !== user.role;
  const isAdminPromotion = selectedRole === 'admin' && user.role !== 'admin';

  const handleSubmit = async () => {
    if (!hasChanged) return;
    setUpdating(true);
    try {
      await authService.updateUserRole(user.id, selectedRole);
      toast.success(`${user.full_name}'s role updated to ${selectedRole}`);
      onUpdate();
    } catch (err) {
      console.error('Failed to update role:', err);
      toast.error('Failed to update role');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title="Edit User Role">
      <div className="space-y-6">
        {/* User info */}
        <div className="flex items-center gap-3 p-3 bg-navy-50 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-navy-200 flex items-center justify-center text-navy-700 font-bold text-sm">
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-navy-900">{user.full_name}</p>
            <p className="text-xs text-navy-500">{user.email}</p>
          </div>
          <Badge variant="default" className="ml-auto">
            Current: {user.role}
          </Badge>
        </div>

        {/* Role selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-navy-700">
            Select New Role
          </label>
          <div className="space-y-2">
            {ROLE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedRole === option.value
                    ? 'border-gold bg-gold/5'
                    : 'border-navy-200 hover:border-navy-300'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={selectedRole === option.value}
                  onChange={() => setSelectedRole(option.value)}
                  className="mt-0.5 text-gold focus:ring-gold"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-navy-500" />
                    <span className="text-sm font-medium text-navy-800">
                      {option.label}
                    </span>
                  </div>
                  <p className="text-xs text-navy-500 mt-0.5">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Admin warning */}
        {isAdminPromotion && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Admin Role Warning</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Admin users have full access to all platform features, including user management, content deletion, and system configuration.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-navy-100">
          <Button variant="ghost" onClick={onClose} disabled={updating}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!hasChanged || updating}
          >
            {updating ? <Spinner size="sm" /> : 'Update Role'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
