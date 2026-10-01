import React from 'react';
import AdminCrudTable from '../../components/admin/AdminCrudTable';

const fields = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
  { name: 'technologies', label: 'Technologies', type: 'list' },
  { name: 'features', label: 'Features', type: 'list' },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    options: ['MERN', 'React', 'Node.js', 'Full Stack', 'Other'],
    required: true,
  },
  { name: 'githubUrl', label: 'GitHub URL', type: 'text' },
  { name: 'liveUrl', label: 'Live Demo URL', type: 'text' },
  { name: 'featured', label: 'Mark as featured', type: 'checkbox' },
  { name: 'order', label: 'Display order', type: 'number' },
];

const Projects = () => (
  <AdminCrudTable
    title="Projects"
    endpoint="/projects"
    fields={fields}
    columns={['title', 'category', 'featured']}
    imageField={{
      name: 'imageUrl',
      uploadField: 'image',
      endpoint: (id) => `/projects/${id}/image`,
    }}
  />
);

export default Projects;
