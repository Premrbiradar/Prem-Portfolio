import React from 'react';
import AdminCrudTable from '../../components/admin/AdminCrudTable';

const fields = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'issuer', label: 'Issuer', type: 'text', required: true },
  { name: 'date', label: 'Date', type: 'text', required: true },
  { name: 'credentialUrl', label: 'Credential URL', type: 'text' },
  { name: 'order', label: 'Display order', type: 'number' },
];

const Certifications = () => (
  <AdminCrudTable
    title="Certifications"
    endpoint="/certifications"
    fields={fields}
    columns={['title', 'issuer', 'date']}
  />
);

export default Certifications;
