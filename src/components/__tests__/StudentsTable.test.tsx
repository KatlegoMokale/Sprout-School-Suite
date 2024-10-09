import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudentsTable from '../StudentsTable';

describe('StudentsTable', () => {
  it('renders empty table when no classes are provided', () => {
    render(<StudentsTable classes={[]} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.queryByRole('row')).not.toBeInTheDocument();
  });

  it('renders table with correct number of rows for given classes', () => {
    const mockClasses = [
      { id: 1, name: 'Class A' },
      { id: 2, name: 'Class B' },
    ];