import React from 'react';
import AdminCrudTable from '../../components/admin/AdminCrudTable';

const fields = [
  { name: 'name', label: 'Skill name', type: 'text', required: true },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    options: ['Languages', 'Frontend', 'Backend', 'Databases', 'DevOps & Tools'],
    required: true,
  },
  { name: 'proficiency', label: 'Proficiency % (optional, leave blank to hide)', type: 'number' },
  { name: 'order', label: 'Display order', type: 'number' },
];

const Skills = () => (
  <AdminCrudTable
    title="Skills"
    endpoint="/skills"
    fields={fields}
    columns={['name', 'category', 'proficiency', 'order']}
  />
);

export default Skills;
