import { Shield, Users, GraduationCap } from 'lucide-react';

const roleConfig = {
    admin: { label: 'Admin', color: 'bg-purple-100 text-purple-700', icon: Shield },
    staff: { label: 'Staff', color: 'bg-orange-100 text-orange-700', icon: Users },
    student: { label: 'Student', color: 'bg-green-100 text-green-700', icon: GraduationCap }
};

export default function RoleBadge({ role }) {
    const config = roleConfig[role] || roleConfig.student;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.color}`}>
            <Icon size={12} />
            {config.label}
        </span>
    );
}
