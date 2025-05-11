import { User, UserRole } from '../types/auth';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'customer@example.com',
    role: UserRole.CUSTOMER,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'restaurant@example.com',
    role: UserRole.RESTAURANT_MANAGER,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 'user-3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    avatar: 'https://randomuser.me/api/portraits/men/68.jpg',
  },
];