import React from 'react';
import { Calendar, Check, AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Bill } from '../../types';
import { CalculationService } from '../../utils/calculations';

interface BillListProps {
  bills: Bill[];
  onMarkPaid: (id: string) => void;
  onDelete: (id: string) => void;
}

export const BillList: React.FC<BillListProps> = ({ bills, onMarkPaid, onDelete }) => {
  const upcomingBills = CalculationService.getUpcomingBills(bills);
  const overdueBills = CalculationService.getOverdueBills(bills);
  const paidBills = bills.filter(bill => bill.isPaid);

  const getBillStatus = (bill: Bill) => {
    const today = new Date();
    const dueDate = new Date(bill.dueDate);
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (bill.isPaid) return { status: 'paid', color: 'text-green-600 bg-green-50' };
    if (diffDays < 0) return { status: 'overdue', color: 'text-red-600 bg-red-50' };
    if (diffDays <= 7) return { status: 'upcoming', color: 'text-yellow-600 bg-yellow-50' };
    return { status: 'pending', color: 'text-gray-600 bg-gray-50' };
  };

  const BillItem = ({ bill }: { bill: Bill }) => {
    const { status, color } = getBillStatus(bill);

    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="flex items-center space-x-4">
          <div className={`p-2 rounded-full ${color}`}>
            {status === 'paid' ? (
              <Check className="w-4 h-4" />
            ) : status === 'overdue' ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <Calendar className="w-4 h-4" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{bill.name}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{bill.category}</span>
              <span>•</span>
              <span>Due: {CalculationService.formatDate(bill.dueDate)}</span>
              {bill.recurring && (
                <>
                  <span>•</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Recurring
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-lg font-semibold text-gray-900">
            {CalculationService.formatCurrency(bill.amount)}
          </span>
          <div className="flex items-center space-x-2">
            {!bill.isPaid && (
              <Button 
                variant="success" 
                size="sm"
                onClick={() => onMarkPaid(bill.id)}
              >
                Mark Paid
              </Button>
            )}
            <Button 
              variant="danger" 
              size="sm" 
              icon={Trash2}
              onClick={() => onDelete(bill.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {overdueBills.length > 0 && (
        <Card>
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-600">Overdue Bills</h3>
          </div>
          <div className="space-y-3">
            {overdueBills.map((bill) => (
              <BillItem key={bill.id} bill={bill} />
            ))}
          </div>
        </Card>
      )}

      {upcomingBills.length > 0 && (
        <Card>
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-600">Upcoming Bills</h3>
          </div>
          <div className="space-y-3">
            {upcomingBills.map((bill) => (
              <BillItem key={bill.id} bill={bill} />
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">All Bills</h3>
          <div className="text-sm text-gray-500">
            {bills.length} total bills
          </div>
        </div>
        <div className="space-y-3">
          {bills.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No bills added yet</p>
            </div>
          ) : (
            bills.map((bill) => (
              <BillItem key={bill.id} bill={bill} />
            ))
          )}
        </div>
      </Card>
    </div>
  );
};