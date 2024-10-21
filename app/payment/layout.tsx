import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Dashboard | Code School of Guam',
  description: 'Manage your tuition payments for Code School of Guam',
};

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
