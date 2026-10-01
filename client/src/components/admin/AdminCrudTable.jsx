import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../ui/Toast';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import Skeleton from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';
import { FiPlus, FiEdit2, FiTrash2, FiImage } from 'react-icons/fi';

/**
 * A config-driven CRUD table for the admin panel. Given an API endpoint and a
 * field schema, it renders the list, an add/edit modal, delete confirmation,
 * and (optionally) an image-upload action per row — covering Skills,
 * Experience, Education, Certifications, Projects and YouTube videos without
 * duplicating the same table/modal/form code six times.
 *
 * fields: [{ name, label, type: 'text'|'textarea'|'number'|'select'|'list'|'checkbox', options?, required? }]
 * columns: which field names to show as table columns (defaults to all)
 * imageField: { name: 'imageUrl', uploadField: 'image', endpoint: (id) => `/projects/${id}/image` }
 */
const emptyValueFor = (field) => {
  if (field.type === 'checkbox') return false;
  if (field.type === 'number') return '';
  return '';
};

const AdminCrudTable = ({ title, endpoint, fields, columns, imageField }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const { showToast } = useToast();

  const shownColumns = columns || fields.map((f) => f.name);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(endpoint);
      setItems(data.data);
    } catch (err) {
      showToast('Failed to load data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const openCreate = () => {
    const base = {};
    fields.forEach((f) => {
      base[f.name] = f.type === 'list' ? '' : emptyValueFor(f);
    });
    setForm(base);
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    const base = {};
    fields.forEach((f) => {
      const value = item[f.name];
      base[f.name] = f.type === 'list' ? (Array.isArray(value) ? value.join('\n') : '') : value ?? emptyValueFor(f);
    });
    setForm(base);
    setEditing(item);
    setModalOpen(true);
  };

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const buildPayload = () => {
    const payload = {};
    fields.forEach((f) => {
      if (f.type === 'list') {
        payload[f.name] = form[f.name]
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);
      } else if (f.type === 'number') {
        payload[f.name] = form[f.name] === '' ? null : Number(form[f.name]);
      } else {
        payload[f.name] = form[f.name];
      }
    });
    return payload;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = buildPayload();
      if (editing) {
        await api.put(`${endpoint}/${editing._id}`, payload);
        showToast('Saved changes.');
      } else {
        await api.post(endpoint, payload);
        showToast('Created.');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`${endpoint}/${deleteTarget._id}`);
      showToast('Deleted.');
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast('Delete failed.', 'error');
    }
  };

  const handleImageUpload = async (item, file) => {
    if (!file || !imageField) return;
    setUploadingId(item._id);
    const formData = new FormData();
    formData.append(imageField.uploadField, file);
    try {
      await api.post(imageField.endpoint(item._id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showToast('Image updated.');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Image upload failed.', 'error');
    } finally {
      setUploadingId(null);
    }
  };

  const renderCell = (item, colName) => {
    const value = item[colName];
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value ?? '—';
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-medium text-paper-50">{title}</h2>
        <Button onClick={openCreate}>
          <FiPlus className="h-4 w-4" /> Add {title.replace(/s$/, '')}
        </Button>
      </div>

      <Card className="mt-6 overflow-x-auto">
        {loading && (
          <div className="space-y-3 p-5">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="p-5">
            <EmptyState title={`No ${title.toLowerCase()} yet`} description={`Add your first entry with "Add ${title.replace(/s$/, '')}" above.`} />
          </div>
        )}

        {!loading && items.length > 0 && (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-700 text-paper-400">
                {imageField && <th className="px-4 py-3 font-medium">Image</th>}
                {shownColumns.map((col) => (
                  <th key={col} className="px-4 py-3 font-medium capitalize">
                    {col}
                  </th>
                ))}
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b border-ink-800 last:border-0">
                  {imageField && (
                    <td className="px-4 py-3">
                      <label className="cursor-pointer">
                        {item[imageField.name] ? (
                          <img src={item[imageField.name]} alt="" className="h-10 w-10 rounded object-cover" />
                        ) : (
                          <span className="flex h-10 w-10 items-center justify-center rounded bg-ink-700 text-[10px] text-paper-400">
                            {uploadingId === item._id ? '…' : 'Add'}
                          </span>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(item, e.target.files?.[0])}
                        />
                      </label>
                    </td>
                  )}
                  {shownColumns.map((col) => (
                    <td key={col} className="max-w-xs truncate px-4 py-3 text-paper-200">
                      {renderCell(item, col)}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-4 py-3">
                    <button onClick={() => openEdit(item)} className="mr-3 inline-flex items-center gap-1 text-signal-teal hover:opacity-80">
                      <FiEdit2 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button onClick={() => setDeleteTarget(item)} className="inline-flex items-center gap-1 text-red-400 hover:opacity-80">
                      <FiTrash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit ${title.replace(/s$/, '')}` : `Add ${title.replace(/s$/, '')}`} wide>
        <form onSubmit={handleSave} className="space-y-4">
          {fields.map((f) => {
            if (f.type === 'select') {
              return (
                <label key={f.name} className="block">
                  <span className="mb-1.5 block text-sm text-paper-200">{f.label}</span>
                  <select
                    value={form[f.name] ?? ''}
                    onChange={(e) => handleChange(f.name, e.target.value)}
                    required={f.required}
                    className="w-full rounded-md border border-ink-700 bg-ink-900/60 px-3.5 py-2.5 text-sm text-paper-100 focus:border-signal-teal focus:outline-none"
                  >
                    {f.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }
            if (f.type === 'checkbox') {
              return (
                <label key={f.name} className="flex items-center gap-2 text-sm text-paper-200">
                  <input
                    type="checkbox"
                    checked={!!form[f.name]}
                    onChange={(e) => handleChange(f.name, e.target.checked)}
                    className="h-4 w-4 rounded border-ink-700 accent-signal-teal"
                  />
                  {f.label}
                </label>
              );
            }
            if (f.type === 'textarea' || f.type === 'list') {
              return (
                <Textarea
                  key={f.name}
                  label={f.type === 'list' ? `${f.label} (one per line)` : f.label}
                  rows={f.type === 'list' ? 4 : 3}
                  value={form[f.name] ?? ''}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  required={f.required}
                />
              );
            }
            return (
              <Input
                key={f.name}
                label={f.label}
                type={f.type === 'number' ? 'number' : 'text'}
                value={form[f.name] ?? ''}
                onChange={(e) => handleChange(f.name, e.target.value)}
                required={f.required}
              />
            );
          })}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete this ${title.replace(/s$/, '').toLowerCase()}?`}
        description="This can't be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminCrudTable;
