import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Image, MapPin, X } from "lucide-react";
import { addIssue } from "../../store/reducers/issueSlice";

const CreateIssueBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please fill in all fields");
      return;
    }

    const newIssue = {
      _id: Date.now().toString(),
      title,
      description,
      location,
      reportedBy: {
        _id: user?._id || user?.email || "current-user",
        name: user?.name || "Anonymous",
      },
      createdAt: new Date().toISOString(),
      upvotes: 0,
      comments: 0,
      status: "pending",
      image: null,
    };

    dispatch(addIssue(newIssue));

    // Reset form
    setTitle("");
    setDescription("");
    setLocation("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <div
        onClick={() => setIsOpen(true)}
        className="p-4 border-b border-slate-800 cursor-pointer hover:bg-slate-900/30 transition-colors"
      >
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-cyan-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <input
            type="text"
            placeholder="Report a civic issue here!"
            className="flex-1 bg-transparent text-slate-500 placeholder-slate-500 focus:outline-none text-lg"
            readOnly
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-slate-800">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-cyan-600 flex items-center justify-center shrink-0">
          <span className="text-white font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-3">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-slate-500 hover:text-white ml-auto block"
          >
            <X size={20} />
          </button>

          <input
            type="text"
            placeholder="Issue title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-white text-xl placeholder-slate-500 focus:outline-none"
            required
          />

          <textarea
            placeholder="Describe the issue in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none resize-none h-24"
            required
          />

          <div className="flex items-center gap-2 text-slate-500">
            <MapPin size={16} />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent text-white placeholder-slate-500 focus:outline-none flex-1"
            />
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-800">
            <div className="flex gap-2">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-cyan-500/10 text-cyan-400 transition-colors"
              >
                <Image size={18} />
              </button>
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-cyan-500 text-white font-bold rounded-full hover:bg-cyan-600 transition-colors"
            >
              Report Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIssueBox;
