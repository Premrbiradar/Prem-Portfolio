import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../components/ui/Toast';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Badge from '../../components/ui/Badge';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    api
      .get('/messages')
      .then(({ data }) => setMessages(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/messages/${id}/read`);
      setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, isRead: true } : m)));
    } catch {
      showToast('Could not update message.', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/messages/${deleteTarget._id}`);
      showToast('Message deleted.');
      setDeleteTarget(null);
      load();
    } catch {
      showToast('Delete failed.', 'error');
    }
  };

  return (
    <div>
      <h2 className="font-display text-xl font-medium text-paper-50">Messages</h2>

      {loading && (
        <div className="mt-6 space-y-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      )}

      {!loading && messages.length === 0 && (
        <div className="mt-6">
          <EmptyState title="No messages yet" description="Contact form submissions will appear here." />
        </div>
      )}

      {!loading && messages.length > 0 && (
        <div className="mt-6 space-y-3">
          {messages.map((m) => (
            <Card key={m._id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm font-medium text-paper-50">{m.name}</p>
                    {!m.isRead && <Badge tone="teal">New</Badge>}
                    {!m.emailSent && <Badge tone="brass">Email not sent</Badge>}
                  </div>
                  <p className="text-xs text-paper-400">{m.email}</p>
                </div>
                <p className="text-xs text-paper-400">{new Date(m.createdAt).toLocaleString()}</p>
              </div>
              <p className="mt-3 text-sm font-medium text-paper-200">{m.subject}</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-paper-400">{m.message}</p>
              <div className="mt-4 flex gap-4">
                {!m.isRead && (
                  <button onClick={() => handleMarkRead(m._id)} className="text-sm text-signal-teal hover:opacity-80">
                    Mark as read
                  </button>
                )}
                <button onClick={() => setDeleteTarget(m)} className="text-sm text-red-400 hover:opacity-80">
                  Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this message?"
        description="This can't be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Messages;
