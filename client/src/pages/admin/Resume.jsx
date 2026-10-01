import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const Resume = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    api
      .get('/resume/all')
      .then(({ data }) => setResumes(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      await api.post('/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      showToast('Resume uploaded and set as active.');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleActivate = async (id) => {
    try {
      await api.patch(`/resume/${id}/activate`);
      showToast('Resume set as active.');
      load();
    } catch {
      showToast('Could not activate resume.', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/resume/${deleteTarget._id}`);
      showToast('Resume deleted.');
      setDeleteTarget(null);
      load();
    } catch {
      showToast('Delete failed.', 'error');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-medium text-paper-50">Resume</h2>
        <label>
          <span className="cursor-pointer rounded-md bg-signal-teal px-4 py-2 text-sm font-medium text-ink-950">
            {uploading ? 'Uploading…' : 'Upload New Resume (PDF)'}
          </span>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files?.[0])}
          />
        </label>
      </div>

      <Card className="mt-6 overflow-x-auto">
        {loading && (
          <div className="space-y-3 p-5">
            <Skeleton className="h-10" />
          </div>
        )}
        {!loading && resumes.length === 0 && (
          <div className="p-5">
            <EmptyState title="No resume uploaded yet" description="Upload a PDF to make it available on the public site." />
          </div>
        )}
        {!loading && resumes.length > 0 && (
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-700 text-paper-400">
                <th className="px-4 py-3 font-medium">File name</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Uploaded</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((r) => (
                <tr key={r._id} className="border-b border-ink-800 last:border-0">
                  <td className="px-4 py-3 text-paper-200">
                    <a href={r.fileUrl} target="_blank" rel="noreferrer" className="text-signal-teal hover:opacity-80">
                      {r.fileName}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    {r.isActive ? (
                      <span className="rounded-full bg-signal-teal/10 px-2.5 py-1 text-xs text-signal-teal">Active</span>
                    ) : (
                      <span className="text-xs text-paper-400">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-paper-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {!r.isActive && (
                      <button onClick={() => handleActivate(r._id)} className="mr-3 text-signal-teal hover:opacity-80">
                        Set Active
                      </button>
                    )}
                    <button onClick={() => setDeleteTarget(r)} className="text-red-400 hover:opacity-80">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this resume?"
        description="This can't be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Resume;
