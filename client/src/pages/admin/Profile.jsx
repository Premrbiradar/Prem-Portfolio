import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../components/ui/Toast';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';

const TEXT_FIELDS = [
  { name: 'name', label: 'Name' },
  { name: 'title', label: 'Title' },
  { name: 'secondaryTitle', label: 'Secondary title' },
  { name: 'headline', label: 'Headline' },
  { name: 'location', label: 'Location' },
  { name: 'email', label: 'Email' },
  { name: 'phone', label: 'Phone' },
  { name: 'linkedin', label: 'LinkedIn URL' },
  { name: 'github', label: 'GitHub URL' },
  { name: 'youtube', label: 'YouTube URL' },
  { name: 'youtubeChannelName', label: 'YouTube channel name' },
  { name: 'youtubeTagline', label: 'YouTube tagline' },
];

const TEXTAREA_FIELDS = [
  { name: 'heroIntro', label: 'Hero intro paragraph' },
  { name: 'about', label: 'About paragraph' },
  { name: 'currentRoleNote', label: 'Current role note' },
];

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    api
      .get('/profile')
      .then(({ data }) => setProfile(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (name, value) => setProfile((p) => ({ ...p, [name]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/profile', profile);
      setProfile(data.data);
      showToast('Profile saved.');
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (file) => {
    if (!file) return;
    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const { data } = await api.post('/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile(data.data);
      showToast('Profile photo updated.');
    } catch (err) {
      showToast(err.response?.data?.message || 'Upload failed.', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoDelete = async () => {
    try {
      const { data } = await api.delete('/profile/photo');
      setProfile(data.data);
      showToast('Profile photo removed.');
    } catch (err) {
      showToast('Could not remove photo.', 'error');
    }
  };

  if (loading || !profile) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-xl font-medium text-paper-50">Profile</h2>

      <Card className="mt-6 p-6">
        <p className="mb-3 text-sm font-medium text-paper-200">Profile photo</p>
        <div className="flex items-center gap-5">
          {profile.profilePhotoUrl ? (
            <img src={profile.profilePhotoUrl} alt="" className="h-20 w-20 rounded-lg object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-ink-700 text-xs text-paper-400">
              No photo
            </div>
          )}
          <div className="flex gap-3">
            <label>
              <span className="cursor-pointer rounded-md bg-signal-teal px-4 py-2 text-sm font-medium text-ink-950">
                {uploadingPhoto ? 'Uploading…' : profile.profilePhotoUrl ? 'Replace' : 'Upload'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoChange(e.target.files?.[0])}
              />
            </label>
            {profile.profilePhotoUrl && (
              <Button variant="danger" onClick={handlePhotoDelete}>
                Delete
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {TEXT_FIELDS.map((f) => (
              <Input
                key={f.name}
                label={f.label}
                value={profile[f.name] || ''}
                onChange={(e) => handleChange(f.name, e.target.value)}
              />
            ))}
          </div>
          {TEXTAREA_FIELDS.map((f) => (
            <Textarea
              key={f.name}
              label={f.label}
              rows={3}
              value={profile[f.name] || ''}
              onChange={(e) => handleChange(f.name, e.target.value)}
            />
          ))}
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
