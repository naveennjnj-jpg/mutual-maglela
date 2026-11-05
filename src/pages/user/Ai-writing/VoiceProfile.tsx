
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  FileText,
  Trash2,
  Check,
  X,
  Loader2,
  AlertCircle,
  Save
} from 'lucide-react';
import axios from 'axios';

interface Profile {
  organisationName: string;
  description: string;
  audience: string;
  preferredTone: string;
  writingStyle: string;
  preferredTerms: string;
  avoidTerms: string;
  guidelines: string;
}

interface Sample {
  id: string;
  title: string;
  fileName: string;
  wordCount: number;
  createdAt: string;
}

const TONES = [
  { value: '', label: 'No preference' },
  { value: 'formal', label: 'Formal' },
  { value: 'authoritative', label: 'Clear & Authoritative' },
  { value: 'accessible', label: 'Accessible' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'neutral', label: 'Neutral' },
];

const MAX_SAMPLES = 10;

const emptyProfile: Profile = {
  organisationName: '',
  description: '',
  audience: '',
  preferredTone: '',
  writingStyle: '',
  preferredTerms: '',
  avoidTerms: '',
  guidelines: '',
};

const inputClass =
  'w-full text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#C85A32] bg-white dark:bg-gray-900 text-gray-800 dark:text-white placeholder-gray-400 transition-all';
const labelClass = 'block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5';
const cardClass = 'bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5';

const VoiceProfile = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

  const loadProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/voice-profile`, { headers: authHeaders() });
      const data = res.data?.data;
      if (data) {
        setProfile({
          organisationName: data.profile.organisationName || '',
          description: data.profile.description || '',
          audience: data.profile.audience || '',
          preferredTone: data.profile.preferredTone || '',
          writingStyle: data.profile.writingStyle || '',
          preferredTerms: (data.profile.preferredTerms || []).join(', '),
          avoidTerms: (data.profile.avoidTerms || []).join(', '),
          guidelines: data.profile.guidelines || '',
        });
        setSamples(data.samples || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load your voice profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const update = (field: keyof Profile, value: string) => setProfile((p) => ({ ...p, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.put(
        `${API_URL}/api/voice-profile`,
        {
          ...profile,
          preferredTerms: profile.preferredTerms.split(/[,\n]/).map((s) => s.trim()).filter(Boolean),
          avoidTerms: profile.avoidTerms.split(/[,\n]/).map((s) => s.trim()).filter(Boolean),
        },
        { headers: authHeaders() }
      );
      setSuccess('Voice profile saved. It will be used when you switch on "Use my voice profile" in AI Writing.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save voice profile');
    } finally {
      setSaving(false);
    }
  };

  const uploadSamples = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;

    setError(null);
    setSuccess(null);
    setUploading(true);

    let added = 0;
    const errors: string[] = [];

    for (const file of list) {
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!['.pdf', '.docx', '.doc', '.txt'].includes(ext)) {
        errors.push(`${file.name}: only PDF, DOCX, DOC or TXT files are allowed`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name}: file must be smaller than 10MB`);
        continue;
      }
      try {
        const formData = new FormData();
        formData.append('file', file);
        await axios.post(`${API_URL}/api/voice-profile/samples`, formData, { headers: authHeaders(), timeout: 120000 });
        added++;
      } catch (err: any) {
        errors.push(`${file.name}: ${err.response?.data?.message || 'upload failed'}`);
      }
    }

    if (added > 0) setSuccess(`${added} writing sample${added > 1 ? 's' : ''} added.`);
    if (errors.length > 0) setError(errors.join(' • '));
    if (fileInputRef.current) fileInputRef.current.value = '';

    setUploading(false);
    loadProfile();
  };

  const removeSample = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      await axios.delete(`${API_URL}/api/voice-profile/samples/${id}`, { headers: authHeaders() });
      setSamples((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove sample');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4] dark:bg-gray-900 p-6">
      <div className="max-w-[760px] mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/user/narrative-engine')}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#0F2D63] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <div>
            <p className="text-[#C85A32] text-xs font-semibold uppercase tracking-widest">AI Tools</p>
            <h1 className="text-xl font-['Roboto'] font-bold text-[#0F2D63] dark:text-white">Voice Profile</h1>
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Define your organisation's writing identity and add examples of your past writing. The AI uses them as references
          so new content sounds like you. Your documents are used as reference material in the prompt; the AI model itself is not trained or changed.
        </p>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)}><X className="w-4 h-4 opacity-60 hover:opacity-100" /></button>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl text-sm mb-4">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{success}</span>
            <button onClick={() => setSuccess(null)}><X className="w-4 h-4 opacity-60 hover:opacity-100" /></button>
          </div>
        )}

        <div className="flex flex-col gap-4">

          {/* Organisation */}
          <div className={cardClass}>
            <label className={labelClass}>Organisation name</label>
            <input
              type="text"
              value={profile.organisationName}
              onChange={(e) => update('organisationName', e.target.value)}
              placeholder="e.g. Magalela Media Services"
              maxLength={150}
              className={inputClass}
            />

            <label className={`${labelClass} mt-4`}>About the organisation</label>
            <textarea
              value={profile.description}
              onChange={(e) => update('description', e.target.value)}
              rows={3}
              maxLength={1500}
              placeholder="What the organisation does, its mission and what it stands for."
              className={`${inputClass} resize-none leading-relaxed`}
            />

            <label className={`${labelClass} mt-4`}>Target audience</label>
            <textarea
              value={profile.audience}
              onChange={(e) => update('audience', e.target.value)}
              rows={2}
              maxLength={600}
              placeholder="e.g. University leaders, policy makers and research funders across Africa."
              className={`${inputClass} resize-none leading-relaxed`}
            />
          </div>

          {/* Tone + style */}
          <div className={cardClass}>
            <p className={labelClass}>Usual tone</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {TONES.map((t) => (
                <button
                  key={t.value || 'none'}
                  onClick={() => update('preferredTone', t.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    profile.preferredTone === t.value
                      ? 'bg-[#0F2D63] text-white border-[#0F2D63]'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <label className={labelClass}>Writing style</label>
            <textarea
              value={profile.writingStyle}
              onChange={(e) => update('writingStyle', e.target.value)}
              rows={3}
              maxLength={1500}
              placeholder="e.g. Short sentences, active voice, evidence first, African examples, no jargon."
              className={`${inputClass} resize-none leading-relaxed`}
            />
          </div>

          {/* Terminology + guidelines */}
          <div className={cardClass}>
            <label className={labelClass}>Preferred terminology</label>
            <input
              type="text"
              value={profile.preferredTerms}
              onChange={(e) => update('preferredTerms', e.target.value)}
              placeholder="Separate with commas, e.g. partners, communities, evidence-based"
              className={inputClass}
            />

            <label className={`${labelClass} mt-4`}>Terms to avoid</label>
            <input
              type="text"
              value={profile.avoidTerms}
              onChange={(e) => update('avoidTerms', e.target.value)}
              placeholder="Separate with commas, e.g. beneficiaries, third world, synergy"
              className={inputClass}
            />

            <label className={`${labelClass} mt-4`}>Communication guidelines</label>
            <textarea
              value={profile.guidelines}
              onChange={(e) => update('guidelines', e.target.value)}
              rows={4}
              maxLength={2500}
              placeholder="Any other rules: how to refer to the organisation, how to name people, formatting rules, topics to handle carefully…"
              className={`${inputClass} resize-none leading-relaxed`}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-[#C85A32] hover:bg-[#a8472a] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl py-3.5 text-sm font-semibold transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Voice Profile'}
          </button>

          {/* Writing samples */}
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-1">
              <p className={`${labelClass} mb-0`}>Writing samples</p>
              <span className="text-xs text-gray-400 dark:text-gray-500">{samples.length}/{MAX_SAMPLES}</span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
              Upload previous press releases, articles or reports. The AI studies their style (not their facts). Up to 5 of the newest samples are used per generation.
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.length) uploadSamples(e.dataTransfer.files);
              }}
              disabled={uploading || samples.length >= MAX_SAMPLES}
              className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#C85A32] hover:bg-[#FFF8F5] dark:hover:bg-[#C85A32]/5 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 text-[#C85A32] animate-spin" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Uploading and reading…</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#C85A32] transition-colors" />
                  <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-[#C85A32] transition-colors">
                    Click to upload or drag and drop (PDF, DOCX, DOC, TXT)
                  </span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
              onChange={(e) => e.target.files && uploadSamples(e.target.files)}
            />

            {samples.length > 0 && (
              <div className="mt-4 space-y-2">
                {samples.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 p-3 bg-[#FFF8F5] dark:bg-[#C85A32]/10 border border-[#C85A32]/20 rounded-xl"
                  >
                    <div className="w-9 h-9 bg-[#C85A32]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-[#C85A32]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0F2D63] dark:text-white truncate">{s.title}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{s.wordCount.toLocaleString()} words</p>
                    </div>
                    <button
                      onClick={() => removeSample(s.id)}
                      disabled={deletingId === s.id}
                      title="Remove sample"
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                    >
                      {deletingId === s.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-amber-500 text-base flex-shrink-0 mt-0.5">⚠️</span>
            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
              Generated content may still contain inaccuracies and must be reviewed by an editor before publication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceProfile;
