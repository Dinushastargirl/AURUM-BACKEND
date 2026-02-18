
import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const ValidationSimulator: React.FC = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [result, setResult] = useState<{ isValid: boolean; msg: string } | null>(null);

  const testValidation = () => {
    if (!date || !time) {
      setResult({ isValid: false, msg: 'Please select both date and time.' });
      return;
    }

    const selectedDate = new Date(`${date}T${time}`);
    const day = selectedDate.getDay(); // 0 is Sunday, 1 is Monday
    const hours = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // Rule: No Mondays (1)
    if (day === 1) {
      setResult({ isValid: false, msg: 'Validation Failed: Bookings are not available on Mondays.' });
      return;
    }

    // Rule: 08:30 (510 min) to 19:30 (1170 min)
    const minStart = 8 * 60 + 30;
    const maxEnd = 19 * 60 + 30;

    if (totalMinutes < minStart || totalMinutes > maxEnd) {
      setResult({ isValid: false, msg: 'Validation Failed: Outside business hours (08:30 - 19:30).' });
      return;
    }

    setResult({ isValid: true, msg: 'Validation Passed: This booking slot is available!' });
  };

  return (
    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Clock className="text-amber-500" size={24} />
        Business Logic Simulator
      </h3>
      <p className="text-slate-400 text-sm mb-6">
        Test the custom validation logic implemented in <code className="text-amber-200">BookingService.java</code>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Select Date</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Select Time</label>
          <input 
            type="time" 
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>
      </div>

      <button 
        onClick={testValidation}
        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2"
      >
        Run Java Logic Simulation
      </button>

      {result && (
        <div className={`mt-6 p-4 rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
          result.isValid ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-rose-500/10 border-rose-500/50 text-rose-400'
        }`}>
          {result.isValid ? <CheckCircle2 size={20} className="shrink-0 mt-0.5" /> : <AlertCircle size={20} className="shrink-0 mt-0.5" />}
          <div>
            <p className="font-semibold">{result.isValid ? 'Request Approved' : '400 Bad Request'}</p>
            <p className="text-sm opacity-90">{result.msg}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationSimulator;
