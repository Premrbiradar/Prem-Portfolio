import React from 'react';
import AdminCrudTable from '../../components/admin/AdminCrudTable';

const fields = [
  { name: 'position', label: 'Position', type: 'text', required: true },
  { name: 'company', label: 'Company', type: 'text', required: true },
  { name: 'location', label: 'Location', type: 'text' },
  { name: 'startDate', label: 'Start date (e.g. May 2025)', type: 'text', required: true },
  { name: 'endDate', label: 'End date (e.g. Present)', type: 'text', required: true },
  { name: 'responsibilities', label: 'Responsibilities', type: 'list' },
  { name: 'order', label: 'Display order', type: 'number' },
];

const Experience = () => (
  <AdminCrudTable
    title="Experience"
    endpoint="/experience"
    fields={fields}
    columns={['position', 'company', 'startDate', 'endDate']}
  />
);

export default Experience;
