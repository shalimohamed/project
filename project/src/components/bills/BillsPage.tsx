import React, { useState } from 'react';
import { Plus, AlertTriangle, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { BillForm } from './BillForm';
import { BillList } from './BillList';
import { Bill } from '../../types';
import { CalculationService } from '../../utils/calculations';

interface BillsPageProps {
  bills: Bill[];
  onAddBill: (bill: Omit<Bill, 'id'>) => void;
  onMarkPaid: (id: string) => void;
  onDeleteBill: (id: string) => void;
}

export const BillsPage: React.FC<BillsPageProps> = ({
  bills,
  onAddBill,
  onMarkPaid,
  onDeleteBill
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const upcomingBills = CalculationService.getUpcomingBills(bills);
  const overdueBills = CalculationService.getOverdueBills(bills);
  const paidBills = bills.filter(bill => bill.isPaid);
  const totalBillAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Bills</h2>
        <Button icon={Plus} onClick={() => setIsFormOpen(true)}>
          Add Bill
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bills</p>
              <p className="text-2xl font-bold text-gray-900">{bills.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{overdueBills.length}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-yellow-600">{upcomingBills.length}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-green-600">{paidBills.length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      <BillList bills={bills} onMarkPaid={onMarkPaid} onDelete={onDeleteBill} />

      <BillForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={onAddBill}
      />
    </div>
  );
};