import { useEffect, useState } from "react";

export default function UserSupport() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ message: "" });

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    const res = await fetch("/api/support");
    const data = await res.json();
    setMessages(data);
    setLoading(false);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ message: "" });
    fetchMessages();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Support</h1>
      <form className="mb-6" onSubmit={handleSubmit}>
        <textarea className="block mb-2 border p-2 w-full" placeholder="Type your message..." value={form.message} onChange={e => setForm({ message: e.target.value })} required />
        <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">Send</button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {messages.map(msg => (
            <li key={msg.id} className="mb-2 border-b pb-2">
              <div>{msg.message}</div>
              <div className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
