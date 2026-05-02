import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Loader2, X } from 'lucide-react';
import { createIssue } from '../store/reducers/issueSlice';

const ReportIssue = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Sanitation');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locating, setLocating] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.issues);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocating(false);
        },
        () => setLocating(false)
      );
    } else {
      setLocating(false);
    }
  };

  const handleGetLocation = () => {
    setLocating(true);
    requestLocation();
  };

  // Auto-fetch location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocating(false);
        },
        () => setLocating(false)
      );
    } else {
      queueMicrotask(() => setLocating(false));
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    if (image) {
      formData.append('image', image);
    }
    formData.append('lat', location.lat || '');
    formData.append('lng', location.lng || '');

    const result = await dispatch(createIssue(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8 bg-[#0f1419] min-h-screen text-white">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="hover:bg-slate-900 p-2 rounded-full transition-colors">
          <X size={24} />
        </button>
        <h1 className="text-xl font-bold">Report an Issue</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Area */}
        <div className="relative group">
          {preview ? (
            <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-slate-800">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => {setImage(null); setPreview(null);}}
                className="absolute top-2 right-2 bg-black/50 p-2 rounded-full hover:bg-black"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-64 w-full border-2 border-dashed border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-900/50 transition-all group">
              <Camera className="w-12 h-12 text-slate-500 mb-2 group-hover:text-cyan-400" />
              <span className="text-slate-500">Click to upload issue photo</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} required />
            </label>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Issue Title (e.g. Broken Pothole)"
            className="w-full bg-[#16181c] border border-slate-800 rounded-xl p-4 focus:border-cyan-500 outline-none transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <select 
            className="w-full bg-[#16181c] border border-slate-800 rounded-xl p-4 focus:border-cyan-500 outline-none appearance-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Sanitation">Sanitation / Waste</option>
            <option value="Roads">Roads & Infrastructure</option>
            <option value="Water">Water Leakage</option>
            <option value="Electricity">Electricity / Streetlights</option>
          </select>

          <textarea
            placeholder="Tell us more about the situation..."
            rows="4"
            className="w-full bg-[#16181c] border border-slate-800 rounded-xl p-4 focus:border-cyan-500 outline-none transition-all"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Location Indicator */}
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${location.lat ? 'border-green-500/30 bg-green-500/5' : 'border-slate-800 bg-slate-900/50'}`}>
          <MapPin size={20} className={location.lat ? 'text-green-500' : 'text-slate-500'} />
          <div className="flex-1">
            <p className="text-sm font-medium">
              {location.lat ? 'Location Tagged Successfully' : locating ? 'Locating...' : 'Location needed for validation'}
            </p>
          </div>
          <button type="button" onClick={handleGetLocation} className="text-xs text-cyan-400 hover:underline">
            Refresh
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !image || !location.lat}
          className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white font-bold py-4 rounded-full transition-all flex justify-center items-center gap-2 shadow-lg shadow-cyan-500/20"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Broadcast Issue'}
        </button>
        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl p-3">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default ReportIssue;
