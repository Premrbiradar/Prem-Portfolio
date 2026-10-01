import React from 'react';
import AdminCrudTable from '../../components/admin/AdminCrudTable';

const fields = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'youtubeUrl', label: 'YouTube URL', type: 'text', required: true },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    options: ['History', 'Geography', 'Documentary', 'Informative', 'Other'],
    required: true,
  },
  { name: 'featured', label: 'Mark as featured', type: 'checkbox' },
  { name: 'order', label: 'Display order', type: 'number' },
];

const Youtube = () => (
  <AdminCrudTable
    title="Youtube Videos"
    endpoint="/youtube"
    fields={fields}
    columns={['title', 'category', 'featured']}
    imageField={{
      name: 'thumbnailUrl',
      uploadField: 'thumbnail',
      endpoint: (id) => `/youtube/${id}/thumbnail`,
    }}
  />
);

export default Youtube;
