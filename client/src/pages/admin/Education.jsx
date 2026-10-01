import React from 'react';
import AdminCrudTable from '../../components/admin/AdminCrudTable';

const fields = [
  { name: 'degree', label: 'Degree', type: 'text', required: true },
  { name: 'institution', label: 'Institution', type: 'text', required: true },
  { name: 'startYear', label: 'Start year', type: 'text', required: true },
  { name: 'endYear', label: 'End year', type: 'text', required: true },
  { name: 'grade', label: 'Grade / CGPA', type: 'text' },
  { name: 'order', label: 'Display order', type: 'number' },
];

const Education = () => (
  <AdminCrudTable
    title="Education"
    endpoint="/education"
    fields={fields}
    columns={['degree', 'institution', 'startYear', 'endYear']}
  />
);

export default Education;
