import React from 'react';

import { DateValues } from '@/components/account/components/account-details/AccountDetails';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { getMonthName } from '@/lib/dateFormatters';

type SelectDateProps = {
  daysInMonth: number;
  setDate: React.Dispatch<React.SetStateAction<DateValues>>;
  date: DateValues;
};

export default function SelectDate({
  daysInMonth,
  setDate,
  date,
}: SelectDateProps) {
  return (
    <div className="flex items-center gap-4">
      <Select
        onValueChange={(month) => {
          setDate((prevDate) => ({
            ...prevDate,
            month: Number(month),
          }));
        }}
        value={String(date.month)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent className="max-h-40 overflow-y-auto">
          {[...Array(12)].map((_, index) => (
            <SelectItem key={index} value={String(index)}>
              {getMonthName(index)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={(day) => {
          setDate((prevDate) => ({
            ...prevDate,
            day: Number(day),
          }));
        }}
        value={String(date.day)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent className="max-h-40 overflow-y-auto">
          {[...Array(daysInMonth)].map((_, index) => (
            <SelectItem key={index} value={String(index + 1)}>
              {index + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={(year) => {
          setDate((prevDate) => ({
            ...prevDate,
            year: Number(year),
          }));
        }}
        value={String(date.year)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent className="max-h-40 overflow-y-auto">
          {[...Array(110)].map((_, index) => (
            <SelectItem
              key={index}
              value={String(new Date().getFullYear() - index)}
            >
              {String(new Date().getFullYear() - index)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
