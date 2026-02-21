import { useState, useContext, createContext, useEffect } from "react";

const AppContext = createContext(null);

const USERS = [
  { id: 1, name: "Sarah Johnson", role: "Employee", department: "Sales" },
  { id: 2, name: "Michael Chen", role: "Manager", department: "Sales" },
  { id: 3, name: "Emily Davis", role: "Employee", department: "Hr" },
  { id: 4, name: "James Wilson", role: "Employee", department: "Marketing" },
  { id: 5, name: "Lisa Anderson", role: "Employee", department: "Finance" },
  { id: 6, name: "David Brown", role: "Employee", department: "Support" },
  { id: 7, name: "Rachel Green", role: "Manager", department: "Marketing" },
  { id: 8, name: "Tom Harris", role: "Manager", department: "Hr" },
  { id: 9, name: "System Admin", role: "Admin", department: "Sales" },
];

const INITIAL_MESSAGES = [
  { id: 1, from: "William Taylor", subject: "Payment Failed", body: "Our payment just failed and our account is locked. We need immediate assistance as this is affecting our production environment.", channel: "chat", priority: "Urgent", confidence: "High Confidence", department: "Finance", status: "pending", assignedTo: 5, date: "1/22/2026", contactInfo: "william@company.com", priorityReason: "The message reports an account access issue and uses time-sensitive language ('locked', 'immediate assistance'), indicating a potential operational disruption affecting production.", confidenceReason: "The message contains clear financial terminology and an explicit account status issue, making classification straightforward.", internalNotes: [], changeLog: [], needsReview: false },
  { id: 2, from: "Karen White", subject: "Password Reset Issue", body: "I've tried resetting my password 3 times but I'm not receiving the reset email. Can someone help?", channel: "email", priority: "Medium", confidence: "Medium Confidence", department: "Support", status: "assigned", assignedTo: 6, date: "1/22/2026", contactInfo: "karen@email.com", priorityReason: "The message contains a clear request but does not indicate immediate impact or time sensitivity. The issue is frustrating but does not suggest operational disruption.", confidenceReason: "The message uses terminology common to both support and account management, requiring some judgment in routing.", internalNotes: [], changeLog: [], needsReview: false },
  { id: 3, from: "Sophie Turner", subject: "Benefits Inquiry", body: "CALL TRANSCRIPT - Duration: 4m 18s Agent: HR Department, this is Tom speaking. How may I assist you? Sophie Turner: Hi Tom, I just started last Monday and I had some questions about the health benefits.", channel: "phone", priority: "Low", confidence: "Medium Confidence", department: "Hr", status: "assigned", assignedTo: 8, date: "1/22/2026", contactInfo: "sophie@email.com", priorityReason: "The message is informational and does not suggest urgency, deadlines, or negative consequences if delayed. This is a routine onboarding inquiry.", confidenceReason: "Phone transcripts can sometimes lose nuance, and the HR/benefits topic could overlap with other departments.", internalNotes: [], changeLog: [], needsReview: false },
  { id: 4, from: "Maria Garcia", subject: "Critical System Outage", body: "CALL TRANSCRIPT - Duration: 8m 32s Agent: Thank you for calling support, this is David. How can I help you today? Maria Garcia: Hi yes, we're having a major emergency here. Our entire system just went down.", channel: "phone", priority: "Urgent", confidence: "High Confidence", department: "Support", status: "in-process", assignedTo: 6, date: "1/22/2026", contactInfo: "maria@company.com", priorityReason: "The message reports a service disruption and uses explicit urgency language ('major emergency', 'entire system'), indicating potential operational impact.", confidenceReason: "The message contains clear support terminology and an explicit system outage scenario, making classification highly confident.", internalNotes: [], changeLog: [], needsReview: false },
  { id: 5, from: "John Smith", subject: "Enterprise License Inquiry", body: "Hello, I'm interested in purchasing an enterprise license for our team of 150 employees. Could you provide pricing information and schedule a demo?", channel: "email", priority: "Urgent", confidence: "High Confidence", department: "Sales", status: "assigned", assignedTo: 1, date: "1/22/2026", contactInfo: "john@bigcorp.com", priorityReason: "The message represents a high-value sales opportunity with a specific team size mentioned (150 employees), suggesting urgency to respond before the prospect looks elsewhere.", confidenceReason: "This message uses terminology specific to sales and has clear and direct language, making classification highly confident.", internalNotes: [], changeLog: [], needsReview: false },
  { id: 6, from: "Daniel Martinez", subject: "Trial Extension Request", body: "Our trial is ending tomorrow but we need another week to complete our evaluation. Our CTO is out of town. Can we extend?", channel: "email", priority: "Medium", confidence: "High Confidence", department: "Sales", status: "in-process", assignedTo: 1, date: "1/22/2026", contactInfo: "daniel@startup.io", priorityReason: "The message has a time-sensitive element (trial ending tomorrow) but does not indicate immediate negative impact or service disruption.", confidenceReason: "Trial extension requests are common sales department tasks with clear, unambiguous language.", internalNotes: [], changeLog: [], needsReview: false },
  { id: 7, from: "@TechStartupXYZ", subject: "Partnership Opportunity", body: "We love your product! We're a tech startup with 50K followers and would love to explore a partnership or affiliate program.", channel: "social", priority: "Medium", confidence: "Low Confidence", department: "Marketing", status: "assigned", assignedTo: 4, date: "1/22/2026", contactInfo: "@TechStartupXYZ", priorityReason: "The message contains a clear request but does not indicate immediate impact or time sensitivity. Partnership discussions can be scheduled.", confidenceReason: "Social media partnership requests could fall under both marketing and sales, requiring judgment in routing.", internalNotes: [], changeLog: [], needsReview: true },
  { id: 8, from: "Patricia Moore", subject: "Feature Request - Dark Mode", body: "Would love to see a dark mode option in the dashboard. Many of us work late hours and it would be easier on the eyes.", channel: "email", priority: "Medium", confidence: "Low Confidence", department: "Support", status: "assigned", assignedTo: 6, date: "1/22/2026", contactInfo: "patricia@email.com", priorityReason: "The message contains a clear request but does not indicate immediate impact or time sensitivity. Feature requests are valuable but rarely urgent.", confidenceReason: "Feature requests can be directed to support, product, or engineering teams depending on organisational structure.", internalNotes: [], changeLog: [], needsReview: true },
  { id: 9, from: "Robert Kim", subject: "Invoice Discrepancy", body: "We received invoice #INV-2024-1234 but the amount doesn't match our contract terms. We were quoted $5,000/month but the invoice shows $6,500.", channel: "email", priority: "Urgent", confidence: "High Confidence", department: "Finance", status: "in-process", assignedTo: 5, date: "1/22/2026", contactInfo: "robert@company.com", priorityReason: "The message reports a financial discrepancy with specific figures, suggesting a potential billing error that could affect the business relationship.", confidenceReason: "Invoice and billing issues are clearly finance department matters with unambiguous financial terminology.", internalNotes: [], changeLog: [], needsReview: false },
  { id: 10, from: "Alex Thompson", subject: "Job Application - Senior Developer", body: "I am writing to express my interest in the Senior Developer position. I have 8 years of experience in React and Node.js.", channel: "email", priority: "Medium", confidence: "High Confidence", department: "Hr", status: "pending", assignedTo: 3, date: "1/21/2026", contactInfo: "alex@dev.com", priorityReason: "The message contains a clear request but does not indicate immediate impact. Job applications follow a standard review process.", confidenceReason: "Job applications are clearly HR department matters with standard professional language.", internalNotes: [], changeLog: [], needsReview: false },
  { id: 11, from: "Jennifer Lee", subject: "Pricing Question", body: "What's the difference between the Pro and Enterprise plans?", channel: "chat", priority: "Low", confidence: "High Confidence", department: "Sales", status: "resolved", assignedTo: 2, date: "1/21/2026", contactInfo: "jennifer@email.com", priorityReason: "The message is informational and does not suggest urgency, deadlines, or negative consequences if delayed.", confidenceReason: "Pricing inquiries are straightforward sales department questions.", internalNotes: [], changeLog: [], needsReview: false },
  { id: 12, from: "@HappyCustomer", subject: "Positive Feedback", body: "Just wanted to say your customer service team is amazing! They helped me resolve my issue in under 10 minutes. 5 stars!", channel: "social", priority: "Low", confidence: "Low Confidence", department: "Marketing", status: "resolved", assignedTo: 7, date: "1/21/2026", contactInfo: "@HappyCustomer", priorityReason: "The message is positive feedback with no action required beyond acknowledgment. No urgency or negative consequences if delayed.", confidenceReason: "Positive feedback on social media could be monitored by marketing, support, or customer success teams.", internalNotes: [], changeLog: [], needsReview: false },
];

const SYSTEM_NOTIFICATIONS = [
  { id: 1, icon: "🤖", title: "AI Classification Updated", body: "Confidence thresholds for social channel messages have been recalibrated. Low-confidence routing now defaults to human review.", time: "2 min ago", read: false },
  { id: 2, icon: "🔧", title: "New Capability: Telephony", body: "Phone call transcription is now active. Call transcripts will appear automatically in your message queue.", time: "1 hour ago", read: false },
  { id: 3, icon: "🚨", title: "Urgent Message Unassigned", body: "William Taylor's 'Payment Failed' message has been pending for over 30 minutes without assignment.", time: "2 hours ago", read: true },
  { id: 4, icon: "📊", title: "Routing Rules Updated", body: "Finance department routing now prioritises messages containing invoice or billing keywords.", time: "Yesterday", read: true },
];

const getPriorityColor = p => p === "Urgent" ? "text-red-600 bg-red-50 border-red-200" : p === "Medium" ? "text-amber-600 bg-amber-50 border-amber-200" : "text-green-600 bg-green-50 border-green-200";
const getPriorityIcon = p => p === "Urgent" ? "🔴" : p === "Medium" ? "🟡" : "🟢";
const getConfidenceColor = c => c === "High Confidence" ? "text-green-600 bg-green-50 border-green-200" : c === "Medium Confidence" ? "text-amber-600 bg-amber-50 border-amber-200" : "text-red-600 bg-red-50 border-red-200";
const getConfidenceIcon = c => c === "High Confidence" ? "✅" : c === "Medium Confidence" ? "⚠️" : "❌";
const getStatusColor = s => s === "pending" ? "text-gray-600 bg-gray-100" : s === "assigned" ? "text-blue-600 bg-blue-100" : s === "in-process" ? "text-purple-600 bg-purple-100" : "text-green-600 bg-green-100";
const getChannelIcon = ch => ch === "email" ? "✉" : ch === "phone" ? "📞" : ch === "chat" ? "💬" : ch === "social" ? "#" : "📱";
const getUserById = id => USERS.find(u => u.id === id);
const getInitials = name => name.split(" ").map(n => n[0]).join("").slice(0, 2);
const AVATAR_COLORS = ["bg-violet-500","bg-blue-500","bg-green-500","bg-orange-500","bg-pink-500","bg-teal-500","bg-red-500","bg-indigo-500","bg-amber-500"];

function Avatar({ name, size = "md" }) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  const sz = size === "sm" ? "w-7 h-7 text-xs" : size === "lg" ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs";
  return <span className={`${sz} ${AVATAR_COLORS[idx]} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>{getInitials(name)}</span>;
}

function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onClick={() => setShow(s => !s)}>
      {children}
      {show && <span className="absolute z-50 bottom-full left-0 mb-2 w-64 text-xs bg-gray-900 text-white rounded-lg p-2.5 shadow-xl leading-relaxed pointer-events-none">{text}<span className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-gray-900" /></span>}
    </span>
  );
}

function PriorityBadge({ message }) {
  return <Tooltip text={message.priorityReason}><span className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 cursor-help ${getPriorityColor(message.priority)}`}>{getPriorityIcon(message.priority)} {message.priority}</span></Tooltip>;
}

function ConfidenceBadge({ message }) {
  return <Tooltip text={message.confidenceReason}><span className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 cursor-help ${getConfidenceColor(message.confidence)}`}>{getConfidenceIcon(message.confidence)} {message.confidence}</span></Tooltip>;
}

// G2: Data quality warning
function DataWarningBanner({ message, darkMode }) {
  const missing = [];
  if (!message.contactInfo || message.contactInfo === "Unknown") missing.push("contact info");
  if (message.confidence === "Low Confidence") missing.push("confident classification");
  if (missing.length === 0) return null;
  return (
    <div className={`flex items-start gap-2 p-2.5 rounded-lg text-xs border ${darkMode ? "bg-amber-900/20 border-amber-700/40 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
      <span className="flex-shrink-0 mt-0.5">⚠️</span>
      <span><strong>AI confidence is limited</strong> — this message has {missing.join(" and ")}. Human review is recommended before routing.</span>
    </div>
  );
}

// G3: Urgent unassigned alert
function UrgentAlert({ messages, dismissed, onDismiss, darkMode }) {
  const items = messages.filter(m => m.priority === "Urgent" && m.status === "pending" && !dismissed.includes(m.id));
  if (!items.length) return null;
  return (
    <div className={`mx-3 mt-2 rounded-lg border p-2.5 ${darkMode ? "bg-red-900/20 border-red-700/40" : "bg-red-50 border-red-200"}`}>
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-semibold flex items-center gap-1 ${darkMode ? "text-red-300" : "text-red-700"}`}>🚨 {items.length} Urgent {items.length > 1 ? "messages need" : "message needs"} immediate attention</span>
        <button onClick={() => items.forEach(m => onDismiss(m.id))} className={`text-xs ${darkMode ? "text-red-400" : "text-red-500"} hover:underline`}>Dismiss all</button>
      </div>
      {items.map(m => <div key={m.id} className={`text-xs flex items-center justify-between py-0.5 ${darkMode ? "text-red-300" : "text-red-600"}`}><span>{m.from} — {m.subject}</span><button onClick={() => onDismiss(m.id)} className="ml-2 opacity-50 hover:opacity-100">✕</button></div>)}
    </div>
  );
}

// G16: Confirm dialog
function ConfirmDialog({ title, message, onConfirm, onCancel, darkMode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onCancel}>
      <div className={`rounded-xl shadow-2xl w-full max-w-sm mx-4 p-5 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`} onClick={e => e.stopPropagation()}>
        <div className="text-base font-semibold mb-2">{title}</div>
        <div className={`text-sm mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{message}</div>
        <div className="flex gap-3">
          <button onClick={onCancel} className={`flex-1 border rounded-lg py-2 text-sm ${darkMode ? "border-gray-600 text-gray-300" : "border-gray-200 text-gray-600"}`}>Cancel</button>
          <button onClick={onConfirm} className="flex-1 bg-amber-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-amber-600">Confirm</button>
        </div>
      </div>
    </div>
  );
}

// G18: Notification panel
function NotificationPanel({ onClose, darkMode }) {
  const [notifs, setNotifs] = useState(SYSTEM_NOTIFICATIONS);
  const unread = notifs.filter(n => !n.read).length;
  const markRead = id => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  const markAll = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className={`w-full max-w-sm h-full shadow-2xl flex flex-col ${darkMode ? "bg-gray-800" : "bg-white"}`} onClick={e => e.stopPropagation()}>
        <div className={`flex items-center justify-between p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div>
            <span className={`font-semibold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Notifications</span>
            {unread > 0 && <span className="ml-2 text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded-full">{unread} new</span>}
          </div>
          <div className="flex items-center gap-3">
            {unread > 0 && <button onClick={markAll} className="text-xs text-amber-600 hover:underline">Mark all read</button>}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notifs.map(n => (
            <div key={n.id} onClick={() => markRead(n.id)} className={`p-4 border-b cursor-pointer transition-colors ${!n.read ? (darkMode ? "bg-amber-900/10 border-gray-700" : "bg-amber-50 border-amber-100") : (darkMode ? "border-gray-700 hover:bg-gray-700/50" : "border-gray-100 hover:bg-gray-50")}`}>
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{n.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{n.title}</span>
                    {!n.read && <span className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />}
                  </div>
                  <p className={`text-xs leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{n.body}</p>
                  <span className={`text-xs mt-1 block ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{n.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={`p-3 border-t text-xs text-center italic ${darkMode ? "border-gray-700 text-gray-500" : "border-gray-100 text-gray-400"}`}>
          AI behaviour changes are always communicated here before taking effect
        </div>
      </div>
    </div>
  );
}

// G1: Capability banner
function CapabilityBanner({ role, onDismiss, darkMode }) {
  const caps = role === "Manager" || role === "Admin"
    ? ["View, assign & reprioritise all inbound messages", "AI classifies priority, department & routing confidence", "Override any AI suggestion — you have final control", "Analytics dashboard shows team workload and trends"]
    : ["View messages assigned to you", "AI has pre-classified priority and department", "Add internal notes and update message status", "Hover any priority or confidence badge to see AI reasoning"];
  return (
    <div className={`mx-3 mt-2 rounded-lg border p-3 ${darkMode ? "bg-blue-900/20 border-blue-700/40" : "bg-blue-50 border-blue-200"}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className={`text-xs font-semibold mb-1.5 ${darkMode ? "text-blue-300" : "text-blue-800"}`}>🤖 What AI does in BeeHive ({role} view)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {caps.map((c, i) => <div key={i} className={`text-xs flex items-start gap-1 ${darkMode ? "text-blue-300" : "text-blue-700"}`}><span className="flex-shrink-0">•</span><span>{c}</span></div>)}
          </div>
        </div>
        <button onClick={onDismiss} className={`text-xs flex-shrink-0 mt-0.5 ${darkMode ? "text-blue-400" : "text-blue-600"} hover:underline`}>Got it ✕</button>
      </div>
    </div>
  );
}

function Header({ view, setView, currentUser, onSettingsOpen, onNotifOpen, unreadCount, darkMode }) {
  return (
    <header className={`flex items-center justify-between px-4 h-14 border-b flex-shrink-0 ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold">🐝</div>
        <div className="hidden sm:block">
          <div className={`text-sm font-bold leading-tight ${darkMode ? "text-white" : "text-gray-900"}`}>Beehive</div>
          <div className={`text-xs leading-tight ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Communications Hub</div>
        </div>
      </div>
      <nav className="flex items-center gap-1">
        {currentUser.role === "Admin" ? (
          <>
            <button onClick={() => setView("messages")} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${view === "messages" ? "bg-amber-100 text-amber-700 border border-amber-300" : darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}`}>Messages</button>
            <button onClick={() => setView("dashboard")} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${view === "dashboard" ? "bg-amber-100 text-amber-700 border border-amber-300" : darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}`}>📊 Dashboard</button>
            <button onClick={() => setView("integrations")} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${view === "integrations" ? "bg-amber-100 text-amber-700 border border-amber-300" : darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}`}>🔗 Integrations</button>
          </>
        ) : (
          <>
            <button onClick={() => setView("messages")} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${view === "messages" ? "bg-amber-100 text-amber-700 border border-amber-300" : darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}`}>Messages</button>
            <button onClick={() => setView("dashboard")} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${view === "dashboard" ? "bg-amber-100 text-amber-700 border border-amber-300" : darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}`}>📊 Dashboard</button>
            {currentUser.role === "Manager" && 
              <button onClick={() => setView("integrations")} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${view === "integrations" ? "bg-amber-100 text-amber-700 border border-amber-300" : darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}`}>🔗 Integrations</button>
            }
          </>
        )}
      </nav>
      <div className="flex items-center gap-2">
        <button onClick={onNotifOpen} className={`p-1.5 rounded-lg relative ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}>
          🔔
          {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold leading-none">{unreadCount}</span>}
        </button>
        <button onClick={onSettingsOpen} className={`p-1.5 rounded-lg ${darkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}>⚙️</button>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-right">
            <div className={`text-xs font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{currentUser.name}</div>
            <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{currentUser.role}</div>
          </div>
          <Avatar name={currentUser.name} />
        </div>
      </div>
    </header>
  );
}

function SettingsModal({ user, onClose, darkMode, toggleDarkMode, onLogout }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className={`w-full max-w-md mx-4 rounded-xl shadow-2xl ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`} onClick={e => e.stopPropagation()}>
        <div className={`flex items-center justify-between p-5 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <h2 className="font-semibold">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <div className="text-sm font-medium mb-3">👤 Profile Information</div>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div><label className="text-xs text-gray-500 mb-1 block">Name</label><input readOnly value={user.name} className={`w-full border rounded-lg px-3 py-2 text-sm ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`} /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">Role</label><input readOnly value={user.role} className={`w-full border rounded-lg px-3 py-2 text-sm ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`} /></div>
            </div>
            <p className="text-xs text-gray-400">Profile information is managed by your organisation administrator.</p>
          </div>
          <div>
            <div className="text-sm font-medium mb-3">🔔 Notification Preferences</div>
            {[["Email Notifications","Receive updates via email"],["In-App Notifications","Show notifications within the app"]].map(([l,d]) => (
              <div key={l} className="flex items-center justify-between mb-3">
                <div><div className="text-sm">{l}</div><div className="text-xs text-gray-400">{d}</div></div>
                <button className="w-10 h-5 bg-amber-500 rounded-full relative"><span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" /></button>
              </div>
            ))}
          </div>
          <div>
            <div className="text-sm font-medium mb-3">🎨 Interface Preferences</div>
            <div className="flex items-center justify-between">
              <div><div className="text-sm">Dark Mode</div><div className="text-xs text-gray-400">Use dark theme throughout the app</div></div>
              <button onClick={toggleDarkMode} className={`w-10 h-5 rounded-full relative transition-colors ${darkMode ? "bg-amber-500" : "bg-gray-300"}`}><span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${darkMode ? "right-0.5" : "left-0.5"}`} /></button>
            </div>
          </div>
        </div>
        <div className="p-5 pt-0"><button onClick={onLogout} className="w-full bg-red-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-600">🚪 Log Out</button></div>
      </div>
    </div>
  );
}

function MessageListItem({ message, selected, onClick, darkMode }) {
  const assignee = getUserById(message.assignedTo);
  return (
    <div onClick={onClick} className={`p-3 border-b cursor-pointer transition-colors relative ${selected ? (darkMode ? "bg-amber-900/30 border-l-2 border-l-amber-500" : "bg-amber-50 border-l-2 border-l-amber-500") : (darkMode ? "hover:bg-gray-800 border-gray-700" : "hover:bg-gray-50 border-gray-100")}`}>
      {/* G10: needs review flag */}
      {message.needsReview && <span className={`absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded-full font-medium ${darkMode ? "bg-amber-900/50 text-amber-300 border border-amber-700" : "bg-amber-100 text-amber-700"}`}>👁 Review</span>}
      <div className="flex items-start gap-2">
        <span className="text-base mt-0.5">{getChannelIcon(message.channel)}</span>
        <div className="flex-1 min-w-0 pr-16">
          <div className="flex items-center justify-between mb-0.5">
            <span className={`text-sm font-medium truncate ${darkMode ? "text-white" : "text-gray-900"}`}>{message.from}</span>
            <span className={`text-xs flex-shrink-0 ml-2 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>{message.date}</span>
          </div>
          <div className={`text-xs font-medium mb-1 truncate ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{message.subject}</div>
          <div className={`text-xs mb-2 line-clamp-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{message.body}</div>
          <div className="flex flex-wrap items-center gap-1">
            <PriorityBadge message={message} />
            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(message.status)}`}>{message.status}</span>
            <ConfidenceBadge message={message} />
            <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>{message.department.toLowerCase()}</span>
            {assignee && <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-400"}`}>→ {assignee.name}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageDetail({ message, onClose, isManager, onUpdate, currentUser, darkMode }) {
  const [note, setNote] = useState("");
  const [localMsg, setLocalMsg] = useState(message);
  const [confirm, setConfirm] = useState(null);
  const [showLog, setShowLog] = useState(false);

  useEffect(() => { setLocalMsg(message); }, [message]);

  const inputCls = `w-full border rounded-lg px-3 py-2 text-sm ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`;

  // G9 + G6: apply change with audit log
  const applyChange = (field, val) => {
    const entry = { field, from: String(field === "assignedTo" ? getUserById(localMsg[field])?.name : localMsg[field]), to: String(field === "assignedTo" ? getUserById(+val)?.name : val), user: currentUser.name, time: new Date().toLocaleTimeString() };
    const updated = { ...localMsg, [field]: field === "assignedTo" ? +val : val, changeLog: [...(localMsg.changeLog || []), entry], needsReview: false };
    setLocalMsg(updated);
    onUpdate(updated);
    setConfirm(null);
  };

  // G16: high-impact changes need confirmation
  const stageChange = (field, val) => {
    const highImpact = field === "assignedTo" || (field === "status" && val === "resolved") || (field === "priority" && val === "Urgent");
    if (highImpact) {
      const label = field === "assignedTo" ? `reassign to ${getUserById(+val)?.name}` : field === "status" ? `mark as ${val}` : `change priority to ${val}`;
      setConfirm({ field, val, label });
    } else {
      applyChange(field, val);
    }
  };

  const addNote = () => {
    if (!note.trim()) return;
    const updated = { ...localMsg, internalNotes: [...localMsg.internalNotes, { text: note, author: currentUser.name, time: new Date().toLocaleTimeString() }] };
    setLocalMsg(updated); onUpdate(updated); setNote("");
  };

  return (
    <div className={`flex flex-col h-full border-l ${darkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-200"}`}>
      {confirm && <ConfirmDialog title="Confirm Change" message={`You are about to ${confirm.label}. This will be recorded in the change history. Continue?`} onConfirm={() => applyChange(confirm.field, confirm.val)} onCancel={() => setConfirm(null)} darkMode={darkMode} />}
      {onClose && (
        <div className={`flex items-center justify-between p-3 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <span className={`font-medium text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Message Details</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <h2 className={`text-base font-semibold mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>{localMsg.subject}</h2>
          <div className={`flex items-center gap-2 text-xs flex-wrap ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            <span>From: <strong>{localMsg.from}</strong></span><span>·</span><span>{localMsg.date}</span><span>·</span><span>{getChannelIcon(localMsg.channel)} {localMsg.channel}</span>
          </div>
        </div>

        {/* G2: data quality warning */}
        <DataWarningBanner message={localMsg} darkMode={darkMode} />

        <div className="flex flex-wrap gap-2">
          <PriorityBadge message={localMsg} />
          <ConfidenceBadge message={localMsg} />
          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(localMsg.status)}`}>{localMsg.status}</span>
          {/* G10: review flag in detail */}
          {localMsg.needsReview && <span className={`text-xs px-2 py-0.5 rounded-full border ${darkMode ? "bg-amber-900/30 border-amber-700 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-700"}`}>👁 Needs Human Review</span>}
        </div>

        <div className={`rounded-lg p-3 text-sm leading-relaxed ${darkMode ? "bg-gray-700/50 text-gray-200" : "bg-gray-50 text-gray-700"}`}>{localMsg.body}</div>

        {isManager && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className={`text-xs mb-1 block ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Status</label><select value={localMsg.status} onChange={e => stageChange("status", e.target.value)} className={inputCls}>{["pending","assigned","in-process","resolved"].map(s => <option key={s}>{s}</option>)}</select></div>
              <div><label className={`text-xs mb-1 block ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Priority</label><select value={localMsg.priority} onChange={e => stageChange("priority", e.target.value)} className={inputCls}>{["Urgent","Medium","Low"].map(p => <option key={p}>{p}</option>)}</select></div>
            </div>
            <div><label className={`text-xs mb-1 block ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Assign To</label><select value={localMsg.assignedTo} onChange={e => stageChange("assignedTo", e.target.value)} className={inputCls}>{USERS.filter(u => u.role === "Employee").map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
            <div><label className={`text-xs mb-1 block ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Department</label><select value={localMsg.department} onChange={e => stageChange("department", e.target.value)} className={inputCls}>{["Sales","Support","Marketing","Hr","Finance"].map(d => <option key={d}>{d}</option>)}</select></div>
          </div>
        )}

        <div><label className={`text-xs mb-1 block ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Contact Info</label><input readOnly value={localMsg.contactInfo} className={inputCls} /></div>

        <div>
          <div className={`text-xs font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Internal Notes</div>
          {localMsg.internalNotes.length === 0 && <p className={`text-xs italic ${darkMode ? "text-gray-500" : "text-gray-400"}`}>No notes yet.</p>}
          {localMsg.internalNotes.map((n, i) => (
            <div key={i} className={`rounded-lg p-2.5 mb-2 text-xs ${darkMode ? "bg-gray-700/50" : "bg-yellow-50 border border-yellow-100"}`}>
              <div className={`font-medium mb-0.5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{n.author} · {n.time}</div>
              <div className={darkMode ? "text-gray-400" : "text-gray-600"}>{n.text}</div>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Add internal note..." className={`flex-1 ${inputCls} resize-none`} />
            <button onClick={addNote} className="bg-amber-500 text-white px-3 rounded-lg text-xs font-medium hover:bg-amber-600 flex-shrink-0">Add</button>
          </div>
        </div>

        {/* G6: Audit log */}
        <div>
          <button onClick={() => setShowLog(s => !s)} className={`text-xs font-medium flex items-center gap-1 mb-2 ${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}>
            📋 Change History {localMsg.changeLog?.length > 0 && `(${localMsg.changeLog.length})`} {showLog ? "▲" : "▼"}
          </button>
          {showLog && (
            <div className="space-y-1">
              {(!localMsg.changeLog || localMsg.changeLog.length === 0) && <p className={`text-xs italic ${darkMode ? "text-gray-500" : "text-gray-400"}`}>No changes recorded yet.</p>}
              {localMsg.changeLog?.map((e, i) => (
                <div key={i} className={`text-xs flex items-start gap-2 py-1 border-b ${darkMode ? "border-gray-700/50 text-gray-400" : "border-gray-50 text-gray-500"}`}>
                  <span className="flex-shrink-0">📝</span>
                  <span><strong className={darkMode ? "text-gray-300" : "text-gray-600"}>{e.user}</strong> changed <em>{e.field}</em>: <strong>{e.from}</strong> → <strong>{e.to}</strong> · {e.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MessagesView({ isManager, currentUser, darkMode }) {
  const { messages, updateMessage } = useContext(AppContext);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Most Recent");
  const [showDetail, setShowDetail] = useState(false);
  const [dismissed, setDismissed] = useState([]);
  const [showCapability, setShowCapability] = useState(true);

  const filtered = messages.filter(m =>
    m.from.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase()) ||
    m.body.toLowerCase().includes(search.toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "Priority") { const o = { Urgent: 0, Medium: 1, Low: 2 }; return o[a.priority] - o[b.priority]; }
    if (sort === "Needs Review") return (b.needsReview ? 1 : 0) - (a.needsReview ? 1 : 0);
    return b.id - a.id;
  });
  const selectedMsg = selected ? messages.find(m => m.id === selected) : null;

  return (
    <div className={`flex flex-col flex-1 overflow-hidden ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {showCapability && <CapabilityBanner role={currentUser.role} onDismiss={() => setShowCapability(false)} darkMode={darkMode} />}
      {isManager && <UrgentAlert messages={messages} dismissed={dismissed} onDismiss={id => setDismissed(d => [...d, id])} darkMode={darkMode} />}
      <div className={`p-3 border-b flex items-center gap-2 mt-2 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-200 text-gray-900"}`} />
        </div>
        <button className={`text-xs px-3 py-2 border rounded-lg ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-200 text-gray-600 hover:bg-gray-100"}`}>⚙ Filters</button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className={`flex flex-col ${showDetail ? "hidden sm:flex sm:w-80 lg:w-96" : "flex-1 sm:w-80 lg:w-96"} border-r overflow-hidden ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className={`flex items-center justify-between px-3 py-2 border-b ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
            <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>Messages <span className={`text-xs font-normal ${darkMode ? "text-gray-400" : "text-gray-400"}`}>{filtered.length} total</span></span>
            <select value={sort} onChange={e => setSort(e.target.value)} className={`text-xs border rounded-lg px-2 py-1 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-700"}`}>
              <option>Most Recent</option><option>Priority</option><option>Needs Review</option>
            </select>
          </div>
          <div className="flex-1 overflow-y-auto">
            {sorted.map(m => <MessageListItem key={m.id} message={m} selected={selected === m.id} darkMode={darkMode} onClick={() => { setSelected(m.id); setShowDetail(true); }} />)}
          </div>
        </div>
        <div className={`flex-1 overflow-hidden ${!showDetail ? "hidden sm:flex sm:flex-col" : "flex flex-col"}`}>
          {selectedMsg ? (
            <MessageDetail key={selectedMsg.id} message={selectedMsg} isManager={isManager} currentUser={currentUser} darkMode={darkMode} onClose={() => setShowDetail(false)} onUpdate={updateMessage} />
          ) : (
            <div className={`flex-1 flex items-center justify-center flex-col gap-3 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
              <span className="text-5xl">💬</span><span className="text-sm">Select a message to view details</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, sub, subColor, darkMode }) {
  return (
    <div className={`rounded-xl border p-4 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
      <div className="flex items-center justify-between mb-2"><span className="text-xl">{icon}</span>{sub && <span className={`text-xs font-medium ${subColor || "text-gray-500"}`}>{sub}</span>}</div>
      <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{value}</div>
      <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</div>
    </div>
  );
}

function MiniBar({ label, count, total, color, icon, darkMode }) {
  const pct = total ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 mb-2">
      {icon && <span className="text-xs w-4">{icon}</span>}
      <span className={`text-xs w-20 flex-shrink-0 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{label}</span>
      <div className={`flex-1 rounded-full h-1.5 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}><div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} /></div>
      <span className={`text-xs w-4 text-right ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{count}</span>
    </div>
  );
}

const AI_INSIGHTS_DATA = [
  { id: 1, type: "suggestion", badge: "AI Suggestion", badgeColor: "bg-amber-100 text-amber-700 border-amber-200", time: "Just now", title: "Potential Service Outage", body: 'Detected 5 similar inquiries regarding "login issues" in the last 30 minutes. Suggesting high priority for task T-1021.', actionable: true, applied: false },
  { id: 2, type: "digest", badge: "AI Digest", badgeColor: "bg-gray-100 text-gray-600 border-gray-200", time: "1h ago", title: "Daily Communication Summary", body: "Total 42 incoming communications. Top concerns: Billing (45%), Technical (30%), General (25%).", actionable: false, applied: false },
  { id: 3, type: "suggestion", badge: "AI Suggestion", badgeColor: "bg-amber-100 text-amber-700 border-amber-200", time: "2h ago", title: "Recurring Billing Complaint", body: 'Invoice discrepancy pattern detected — 3 contacts reported mismatched amounts in the past 24 hours. Consider escalating to Finance lead.', actionable: true, applied: false },
  { id: 4, type: "trend", badge: "AI Trend", badgeColor: "bg-blue-100 text-blue-600 border-blue-200", time: "3h ago", title: "Support Volume Spike", body: "Support channel volume is 40% above the 7-day average. Password reset requests account for most of the increase.", actionable: false, applied: false },
  { id: 5, type: "suggestion", badge: "AI Suggestion", badgeColor: "bg-amber-100 text-amber-700 border-amber-200", time: "Yesterday", title: "Auto-Route Partnership Inquiries", body: "3 recent social media partnership messages were manually rerouted from Support to Marketing. Suggesting a new routing rule for messages containing 'partnership' or 'affiliate'.", actionable: true, applied: false },
];

// Trend chart using SVG
function TrendChart({ data, darkMode, color = "#16a34a" }) {
  const w = 600, h = 160, pad = 20;
  const max = Math.max(...data.map(d => d.value), 1);
  const min = Math.min(...data.map(d => d.value), 0);
  const range = max - min || 1;
  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d.value - min) / range) * (h - pad * 2);
    return { x, y, label: d.label };
  });
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaD = pathD + ` L${points[points.length - 1].x},${h - pad} L${points[0].x},${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h + 20}`} className="w-full" style={{ maxHeight: 220 }}>
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#trendFill)" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill={color} />
          <circle cx={p.x} cy={p.y} r="2" fill="white" />
          <text x={p.x} y={h + 12} textAnchor="middle" className={`text-xs ${darkMode ? "fill-gray-400" : "fill-gray-500"}`} style={{ fontSize: 11 }}>{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

function AIPerformanceInsights({ darkMode, scopeMessages, allMessages, currentUser }) {
  const [expanded, setExpanded] = useState(true);
  const [trendMetric, setTrendMetric] = useState("Volume");
  const [chartType, setChartType] = useState("line");

  const msgs = scopeMessages;
  const total = msgs.length;
  const resolved = msgs.filter(m => m.status === "resolved").length;
  const urgent = msgs.filter(m => m.priority === "Urgent").length;
  const lowConf = msgs.filter(m => m.confidence === "Low Confidence").length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const urgentRatio = total > 0 ? Math.round((urgent / total) * 100) : 0;
  const confOverrides = total > 0 ? Math.round((lowConf / total) * 100) : 0;
  const escalationRate = total > 0 ? Math.round((urgent / total) * 100 * 0.55) : 0;

  // Pattern detection
  const patterns = [];
  if (escalationRate > 15) patterns.push({ icon: "⚡", label: "Escalation Frequency Above Average", color: "text-red-600 bg-red-50 border-red-200" });
  if (lowConf > 0) patterns.push({ icon: "⚠️", label: "Low Confidence Classifications Detected", color: "text-amber-600 bg-amber-50 border-amber-200" });
  if (urgentRatio > 25) patterns.push({ icon: "🔥", label: "High Urgent Message Ratio", color: "text-orange-600 bg-orange-50 border-orange-200" });
  const pendingCount = msgs.filter(m => m.status === "pending").length;
  if (pendingCount > 2) patterns.push({ icon: "📥", label: "Pending Queue Growing", color: "text-blue-600 bg-blue-50 border-blue-200" });

  // Trend data (simulated weekly)
  const trendData = {
    Volume: [
      { label: "Mon", value: 8 }, { label: "Tue", value: 12 }, { label: "Wed", value: 6 },
      { label: "Thu", value: 15 }, { label: "Fri", value: 11 }, { label: "Sat", value: 4 }, { label: "Sun", value: 3 }
    ],
    Response: [
      { label: "Mon", value: 120 }, { label: "Tue", value: 148 }, { label: "Wed", value: 95 },
      { label: "Thu", value: 160 }, { label: "Fri", value: 135 }, { label: "Sat", value: 80 }, { label: "Sun", value: 70 }
    ],
    Priority: [
      { label: "Mon", value: 3 }, { label: "Tue", value: 5 }, { label: "Wed", value: 2 },
      { label: "Thu", value: 6 }, { label: "Fri", value: 4 }, { label: "Sat", value: 1 }, { label: "Sun", value: 2 }
    ]
  };
  const trendColors = { Volume: "#16a34a", Response: "#2563eb", Priority: "#dc2626" };

  const card = `rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`;
  const metricCard = `rounded-lg border p-3 ${darkMode ? "bg-gray-700/50 border-gray-600" : "bg-white border-gray-200"}`;

  // AI Analysis sentence
  const analysisText = currentUser.role === "Employee"
    ? `You've handled ${total} message${total !== 1 ? "s" : ""} in the past 30 days, with a ${resolutionRate}% resolution rate. ${resolutionRate >= 70 ? "Your response time is on par with team average." : resolutionRate >= 50 ? "There's room to improve your resolution rate." : "Consider prioritising pending items to improve throughput."}`
    : `Your team has processed ${allMessages.length} messages in the past 30 days, with a ${resolutionRate}% resolution rate and ${urgentRatio}% urgent ratio. ${resolutionRate >= 70 ? "Team performance is strong." : "Resolution rate could be improved with better routing."}`;

  return (
    <div className={`${card} p-4 mb-4`}>
      <div className="flex items-center justify-between mb-1 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <span className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>AI Performance Insights</span>
        <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{expanded ? "▲" : "▼"}</span>
      </div>
      {expanded && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">✨</span>
            <span className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>AI Performance Insights</span>
          </div>
          <p className={`text-xs mb-4 italic ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Insights are generated based on historical activity and trends.</p>

          {/* Metric cards - row 1 */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className={metricCard}>
              <div className={`text-xs mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Avg Response Time</div>
              <div className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>148m</div>
              <div className="text-xs text-red-500 flex items-center gap-0.5">↘ 12%</div>
            </div>
            <div className={metricCard}>
              <div className={`text-xs mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Resolution Rate</div>
              <div className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{resolutionRate}%</div>
              <div className="text-xs text-red-500 flex items-center gap-0.5">↘ 8%</div>
            </div>
            <div className={metricCard}>
              <div className={`text-xs mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Escalation Rate</div>
              <div className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{escalationRate}%</div>
              <div className="text-xs text-red-500 flex items-center gap-0.5">↘ 3%</div>
            </div>
          </div>

          {/* Metric cards - row 2 */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className={metricCard}>
              <div className={`text-xs mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Messages (30d)</div>
              <div className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{total}</div>
              <div className="text-xs text-green-500 flex items-center gap-0.5">↗ 15%</div>
            </div>
            <div className={metricCard}>
              <div className={`text-xs mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Urgent Ratio</div>
              <div className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{urgentRatio}%</div>
              <div className="text-xs text-red-500 flex items-center gap-0.5">↘ 5%</div>
            </div>
            <div className={metricCard}>
              <div className={`text-xs mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Confidence Overrides</div>
              <div className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{confOverrides}%</div>
              <div className="text-xs text-red-500 flex items-center gap-0.5">↘ 2%</div>
            </div>
          </div>

          {/* AI Analysis banner */}
          <div className={`rounded-lg p-3 mb-4 flex items-start gap-3 ${darkMode ? "bg-blue-900/20 border border-blue-800/40" : "bg-blue-50 border border-blue-200"}`}>
            <span className="text-lg flex-shrink-0 mt-0.5">✨</span>
            <div>
              <div className={`text-xs font-semibold mb-0.5 ${darkMode ? "text-blue-300" : "text-blue-800"}`}>AI Analysis</div>
              <p className={`text-xs leading-relaxed ${darkMode ? "text-blue-200" : "text-blue-700"}`}>{analysisText}</p>
            </div>
          </div>

          {/* Pattern Detection */}
          <div className="mb-3">
            <div className={`text-sm font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>Pattern Detection</div>
            <div className="flex flex-wrap gap-2">
              {patterns.length > 0 ? patterns.map((p, i) => (
                <span key={i} className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium ${darkMode ? "bg-gray-700 border-gray-600 text-gray-300" : p.color}`}>
                  {p.icon} {p.label}
                </span>
              )) : (
                <span className={`text-xs italic ${darkMode ? "text-gray-500" : "text-gray-400"}`}>No unusual patterns detected.</span>
              )}
            </div>
          </div>

          {/* Human-in-the-Loop disclaimer */}
          <div className={`rounded-lg px-3 py-2 mb-4 text-xs ${darkMode ? "bg-amber-900/20 border border-amber-800/40 text-amber-300" : "bg-amber-50 border border-amber-200 text-amber-800"}`}>
            <strong>Human-in-the-Loop:</strong> AI insights are advisory and based on historical patterns. Final decisions remain with the user.
          </div>

          {/* Trend Analysis */}
          <div className={`rounded-lg border p-4 ${darkMode ? "bg-gray-700/30 border-gray-600" : "bg-white border-gray-200"}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Trend Analysis</span>
              <div className="flex items-center gap-1">
                {["Volume", "Response", "Priority"].map(m => (
                  <button key={m} onClick={() => setTrendMetric(m)} className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${trendMetric === m ? (darkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-800") : (darkMode ? "text-gray-400 hover:bg-gray-600" : "text-gray-500 hover:bg-gray-100")}`}>{m}</button>
                ))}
                <div className={`flex items-center gap-0.5 ml-1 border rounded-lg overflow-hidden ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
                  <button onClick={() => setChartType("bar")} className={`p-1.5 text-xs ${chartType === "bar" ? (darkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-700") : (darkMode ? "text-gray-400" : "text-gray-500")}`}>▥</button>
                  <button onClick={() => setChartType("line")} className={`p-1.5 text-xs ${chartType === "line" ? (darkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-700") : (darkMode ? "text-gray-400" : "text-gray-500")}`}>↗</button>
                </div>
              </div>
            </div>
            {chartType === "line" ? (
              <TrendChart data={trendData[trendMetric]} darkMode={darkMode} color={trendColors[trendMetric]} />
            ) : (
              <div className="flex items-end gap-2 h-40 px-2">
                {trendData[trendMetric].map((d, i) => {
                  const maxVal = Math.max(...trendData[trendMetric].map(x => x.value), 1);
                  const pct = (d.value / maxVal) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex items-end justify-center" style={{ height: 120 }}>
                        <div className="w-full max-w-8 rounded-t-md transition-all" style={{ height: `${pct}%`, backgroundColor: trendColors[trendMetric], opacity: 0.7 }} />
                      </div>
                      <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`} style={{ fontSize: 10 }}>{d.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function RecentTasksTable({ taskMessages, darkMode, onViewAll }) {
  const recent = [...taskMessages].sort((a, b) => b.id - a.id).slice(0, 5);
  const thCls = `text-left pb-2 font-medium text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`;
  const tdCls = `py-2.5 text-xs ${darkMode ? "text-gray-300" : "text-gray-600"}`;
  return (
    <div className={`rounded-xl border p-4 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Recent Tasks</span>
        {onViewAll && <button onClick={onViewAll} className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">View All ↗</button>}
      </div>
      {recent.length === 0 ? (
        <div className={`text-center py-8 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
          <span className="text-sm">No recent tasks found.</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                <th className={thCls}>ID</th>
                <th className={thCls}>Title</th>
                <th className={`${thCls} hidden sm:table-cell`}>Channel</th>
                <th className={thCls}>Priority</th>
                <th className={thCls}>Status</th>
                <th className={`${thCls} hidden sm:table-cell`}>Owner</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(m => {
                const owner = getUserById(m.assignedTo);
                return (
                  <tr key={m.id} className={`border-b ${darkMode ? "border-gray-700/50" : "border-gray-50"}`}>
                    <td className={`${tdCls} font-mono`}>T-{String(1000 + m.id)}</td>
                    <td className={tdCls}>
                      <div className={`font-medium truncate max-w-48 ${darkMode ? "text-white" : "text-gray-900"}`}>{m.subject}</div>
                    </td>
                    <td className={`${tdCls} hidden sm:table-cell`}>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                        {getChannelIcon(m.channel)} {m.channel}
                      </span>
                    </td>
                    <td className={tdCls}>
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(m.priority)}`}>
                        {getPriorityIcon(m.priority)} {m.priority}
                      </span>
                    </td>
                    <td className={tdCls}>
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getStatusColor(m.status)}`}>{m.status}</span>
                    </td>
                    <td className={`${tdCls} hidden sm:table-cell`}>
                      {owner ? (
                        <div className="flex items-center gap-1.5">
                          <Avatar name={owner.name} size="sm" />
                          <span className={`truncate max-w-20 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{owner.name.split(" ")[0]}</span>
                        </div>
                      ) : <span className={darkMode ? "text-gray-500" : "text-gray-400"}>Unassigned</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AIInsightsPanel({ darkMode, messages }) {
  const [insights, setInsights] = useState(AI_INSIGHTS_DATA);
  const [dismissed, setDismissed] = useState([]);

  const handleApply = (id) => {
    setInsights(prev => prev.map(i => i.id === id ? { ...i, applied: true } : i));
  };
  const handleDismiss = (id) => {
    setDismissed(prev => [...prev, id]);
  };

  const visible = insights.filter(i => !dismissed.includes(i.id));

  // Derive a live pattern detection from actual messages
  const urgentPending = messages.filter(m => m.priority === "Urgent" && m.status === "pending").length;
  const lowConfCount = messages.filter(m => m.confidence === "Low Confidence").length;

  return (
    <div className={`rounded-xl border p-4 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-amber-50/50 border-amber-100"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧠</span>
          <span className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>AI Insights</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? "bg-amber-900/40 text-amber-300" : "bg-amber-100 text-amber-700"}`}>{visible.length} active</span>
        </div>
      </div>

      {/* Live alerts derived from data */}
      {urgentPending > 0 && (
        <div className={`rounded-lg border p-3 mb-3 ${darkMode ? "bg-red-900/20 border-red-800/40" : "bg-red-50 border-red-200"}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${darkMode ? "bg-red-900/40 text-red-300 border-red-700" : "bg-red-100 text-red-700 border-red-200"}`}>🚨 Live Alert</span>
            <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Now</span>
          </div>
          <div className={`text-sm font-medium mb-0.5 ${darkMode ? "text-white" : "text-gray-900"}`}>Urgent Messages Unassigned</div>
          <div className={`text-xs leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{urgentPending} urgent message{urgentPending > 1 ? "s are" : " is"} still pending without action. Immediate attention recommended.</div>
        </div>
      )}

      {lowConfCount > 0 && (
        <div className={`rounded-lg border p-3 mb-3 ${darkMode ? "bg-amber-900/20 border-amber-800/40" : "bg-amber-50 border-amber-200"}`}>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${darkMode ? "bg-amber-900/40 text-amber-300 border-amber-700" : "bg-amber-100 text-amber-700 border-amber-200"}`}>⚠️ Review Needed</span>
            <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Ongoing</span>
          </div>
          <div className={`text-sm font-medium mb-0.5 ${darkMode ? "text-white" : "text-gray-900"}`}>Low Confidence Classifications</div>
          <div className={`text-xs leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{lowConfCount} message{lowConfCount > 1 ? "s have" : " has"} low AI confidence. Human review is recommended to ensure correct routing.</div>
        </div>
      )}

      {/* Static insight cards */}
      <div className="space-y-3">
        {visible.map(insight => (
          <div key={insight.id} className={`rounded-lg border p-3 transition-all ${insight.applied ? (darkMode ? "bg-green-900/10 border-green-800/30" : "bg-green-50/50 border-green-200") : (darkMode ? "bg-gray-700/50 border-gray-600" : "bg-white border-gray-200")}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${insight.applied ? (darkMode ? "bg-green-900/40 text-green-300 border-green-700" : "bg-green-100 text-green-700 border-green-200") : insight.badgeColor}`}>{insight.badge}</span>
              <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{insight.time}</span>
              {insight.applied && <span className={`text-xs font-medium ${darkMode ? "text-green-400" : "text-green-600"}`}>✓ Applied</span>}
            </div>
            <div className={`text-sm font-medium mb-0.5 ${darkMode ? "text-white" : "text-gray-900"}`}>{insight.title}</div>
            <div className={`text-xs leading-relaxed mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{insight.body}</div>
            {!insight.applied && (
              <div className="flex items-center gap-2">
                {insight.actionable && (
                  <button onClick={() => handleApply(insight.id)} className="bg-amber-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-amber-600 transition-colors">Apply</button>
                )}
                <button onClick={() => handleDismiss(insight.id)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${darkMode ? "text-gray-400 hover:bg-gray-600" : "text-gray-500 hover:bg-gray-100"}`}>Dismiss</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {visible.length === 0 && (
        <div className={`text-center py-6 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
          <span className="text-2xl block mb-2">✨</span>
          <span className="text-xs">All caught up! No pending AI insights.</span>
        </div>
      )}
    </div>
  );
}

function ManagerDashboard({ currentUser, onUpload, darkMode }) {
  const { messages } = useContext(AppContext);
  const total = messages.length;
  const urgent = messages.filter(m => m.priority === "Urgent").length;
  const resolved = messages.filter(m => m.status === "resolved").length;
  const needsReview = messages.filter(m => m.needsReview).length;
  const byPriority = { Urgent: urgent, Medium: messages.filter(m => m.priority === "Medium").length, Low: messages.filter(m => m.priority === "Low").length };
  const byDept = {}; messages.forEach(m => { byDept[m.department] = (byDept[m.department] || 0) + 1; });
  const byChannel = {}; messages.forEach(m => { byChannel[m.channel] = (byChannel[m.channel] || 0) + 1; });
  const byConf = { "High Confidence": 0, "Medium Confidence": 0, "Low Confidence": 0 }; messages.forEach(m => { byConf[m.confidence]++; });
  const statusCounts = { pending: 0, assigned: 0, "in-process": 0, resolved: 0 }; messages.forEach(m => { statusCounts[m.status]++; });
  const workload = {}; messages.forEach(m => { if (m.assignedTo) workload[m.assignedTo] = (workload[m.assignedTo] || 0) + 1; });
  const card = `rounded-xl border p-4 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`;
  const sT = `text-sm font-semibold mb-3 ${darkMode ? "text-white" : "text-gray-800"}`;
  return (
    <div className={`flex-1 overflow-y-auto p-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div><h1 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{currentUser.role === "Admin" ? "Admin" : currentUser.role === "Manager" ? "Manager" : "Team"} Dashboard</h1><p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Overview of team performance and message analytics</p></div>
          <button onClick={onUpload} className="bg-amber-500 text-white text-xs px-4 py-2 rounded-lg hover:bg-amber-600 font-medium">+ Upload Message</button>
        </div>

        {/* Row 1: Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <StatCard icon="📊" value={total} label="Total Messages" sub="+12%" subColor="text-green-500" darkMode={darkMode} />
          <StatCard icon="⚠️" value={messages.filter(m => m.status === "pending" || m.status === "assigned").length} label="Needs Attention" sub={`${urgent} urgent`} subColor="text-red-500" darkMode={darkMode} />
          <StatCard icon="✅" value={resolved} label="Resolved Today" sub="16.7%" subColor="text-green-500" darkMode={darkMode} />
          <StatCard icon="👁" value={needsReview} label="Needs Review" sub="Low confidence" subColor="text-amber-500" darkMode={darkMode} />
        </div>

        {/* Row 2: Recent Tasks + AI Insights side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <RecentTasksTable taskMessages={messages} darkMode={darkMode} />
          <AIInsightsPanel darkMode={darkMode} messages={messages} />
        </div>

        {/* Row 3: AI Performance Insights (full width) */}
        <AIPerformanceInsights darkMode={darkMode} scopeMessages={messages} allMessages={messages} currentUser={currentUser} />

        {/* Row 4: Priority + Department side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
          <div className={card}><div className={sT}>⚠️ Messages by Priority</div><MiniBar label="Urgent" count={byPriority.Urgent} total={total} color="bg-red-500" icon="🔴" darkMode={darkMode} /><MiniBar label="Medium" count={byPriority.Medium} total={total} color="bg-amber-500" icon="🟡" darkMode={darkMode} /><MiniBar label="Low" count={byPriority.Low} total={total} color="bg-green-500" icon="🟢" darkMode={darkMode} /></div>
          <div className={card}><div className={sT}>📈 Messages by Department</div>{Object.entries(byDept).map(([d,c],i) => <MiniBar key={d} label={d} count={c} total={total} color={["bg-blue-500","bg-orange-500","bg-pink-500","bg-purple-500","bg-green-500"][i%5]} darkMode={darkMode} />)}</div>
        </div>

        {/* Row 5: Confidence + Channel side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
          <div className={card}><div className={sT}>ℹ️ Messages by Confidence</div><MiniBar label="High" count={byConf["High Confidence"]} total={total} color="bg-green-500" darkMode={darkMode} /><MiniBar label="Medium" count={byConf["Medium Confidence"]} total={total} color="bg-amber-500" darkMode={darkMode} /><MiniBar label="Low" count={byConf["Low Confidence"]} total={total} color="bg-red-500" darkMode={darkMode} /></div>
          <div className={card}><div className={sT}>📡 Messages by Channel</div>{Object.entries(byChannel).map(([c,n],i) => <MiniBar key={c} label={c} count={n} total={total} color={["bg-blue-500","bg-green-500","bg-purple-500","bg-amber-500","bg-red-500"][i%5]} darkMode={darkMode} />)}</div>
        </div>

        {/* Row 6: Status + Team Workload side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
          <div className={card}><div className={sT}>Status Breakdown</div><div className="grid grid-cols-2 gap-3">{Object.entries(statusCounts).map(([s,c]) => <div key={s} className={`rounded-lg p-3 ${getStatusColor(s)} bg-opacity-20`}><div className="text-xl font-bold">{c}</div><div className="text-xs capitalize">{s}</div></div>)}</div></div>
          <div className={card}><div className={sT}>👥 Team Workload</div><div className="grid grid-cols-2 gap-3">{USERS.filter(u => u.role !== "Admin").map(u => <div key={u.id} className="flex items-center gap-2"><Avatar name={u.name} size="sm" /><div><div className={`text-xs font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{u.name}</div><div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{u.department}</div></div><span className={`ml-auto text-xs font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{workload[u.id] || 0}</span></div>)}</div></div>
        </div>

        {/* Row 7: Team Directory (full width) */}
        <div className={card}><div className={sT}>Team Directory</div><div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className={`border-b ${darkMode ? "border-gray-700 text-gray-400" : "border-gray-100 text-gray-500"}`}><th className="text-left pb-2 font-medium">Employee</th><th className="text-left pb-2 font-medium">Department</th><th className="text-left pb-2 font-medium">Role</th><th className="text-left pb-2 font-medium">Messages</th><th className="text-left pb-2 font-medium">Status</th></tr></thead><tbody>{USERS.map(u => <tr key={u.id} className={`border-b ${darkMode ? "border-gray-700/50" : "border-gray-50"}`}><td className="py-2 flex items-center gap-2"><Avatar name={u.name} size="sm" /><span className={darkMode ? "text-white" : "text-gray-800"}>{u.name}</span></td><td className={`py-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{u.department}</td><td className="py-2">{u.role === "Manager" ? <span className="text-xs px-2 py-0.5 rounded border border-purple-300 text-purple-600">Manager</span> : u.role === "Admin" ? <span className="text-xs px-2 py-0.5 rounded border border-red-300 text-red-600">Admin</span> : <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Employee</span>}</td><td className={`py-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{workload[u.id] || 0}</td><td className="py-2"><span className="flex items-center gap-1 text-green-600 text-xs"><span className="w-1.5 h-1.5 bg-green-500 rounded-full" />Active</span></td></tr>)}</tbody></table></div></div>
      </div>
    </div>
  );
}

function EmployeeDashboard({ currentUser, darkMode }) {
  const { messages } = useContext(AppContext);
  const myMsgs = messages.filter(m => m.assignedTo === currentUser.id);
  const stats = [{ icon: "📬", value: myMsgs.length, label: "My Messages" }, { icon: "⏳", value: myMsgs.filter(m => m.status === "pending").length, label: "Pending" }, { icon: "🔄", value: myMsgs.filter(m => m.status === "in-process").length, label: "In Process" }, { icon: "✅", value: myMsgs.filter(m => m.status === "resolved").length, label: "Resolved" }];
  return (
    <div className={`flex-1 overflow-y-auto p-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-lg font-bold mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>My Work Queue</h1>
        <p className={`text-xs mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Messages assigned to {currentUser.name}</p>

        {/* Row 1: Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">{stats.map(s => <StatCard key={s.label} icon={s.icon} value={s.value} label={s.label} darkMode={darkMode} />)}</div>

        {/* Row 2: Recent Tasks + AI Insights side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <RecentTasksTable taskMessages={myMsgs} darkMode={darkMode} />
          <AIInsightsPanel darkMode={darkMode} messages={myMsgs} />
        </div>

        {/* Row 3: AI Performance Insights (full width) */}
        <AIPerformanceInsights darkMode={darkMode} scopeMessages={myMsgs} allMessages={messages} currentUser={currentUser} />

        {/* Row 4: Message list (full width) */}
        <div className={`rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
          {myMsgs.length === 0 ? <div className="p-8 text-center text-gray-400">No messages assigned to you.</div>
            : myMsgs.map((m, i) => <div key={m.id} className={`p-3 ${i < myMsgs.length - 1 ? `border-b ${darkMode ? "border-gray-700" : "border-gray-50"}` : ""}`}><div className="flex items-start gap-2"><span className="text-base mt-0.5">{getChannelIcon(m.channel)}</span><div className="flex-1 min-w-0"><div className="flex items-center justify-between"><span className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{m.from}</span><span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-400"}`}>{m.date}</span></div><div className={`text-xs font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{m.subject}</div><div className={`text-xs mb-2 line-clamp-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{m.body}</div><div className="flex flex-wrap gap-1"><PriorityBadge message={m} /><span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(m.status)}`}>{m.status}</span><ConfidenceBadge message={m} /></div></div></div></div>)}
        </div>
      </div>
    </div>
  );
}

function UploadModal({ onClose, onSubmit, currentUser, darkMode }) {
  const [form, setForm] = useState({ channel: "Email", priority: "Medium", department: "Sales", assignedTo: 1, contactName: "", contactInfo: "", confidence: "High Confidence", subject: "", body: "" });
  const h = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inputCls = `w-full border rounded-lg px-3 py-2 text-sm ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-900"}`;
  const modal = `rounded-xl shadow-2xl w-full max-w-lg mx-4 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`;
  const assignee = getUserById(form.assignedTo);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className={modal} onClick={e => e.stopPropagation()}>
        <div className={`flex items-center justify-between p-5 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}><h2 className="font-semibold">Upload Message</h2><button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button></div>
        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500 mb-1 block">Channel</label><select value={form.channel} onChange={e => h("channel",e.target.value)} className={inputCls}>{["Email","Phone","Chat","Social","SMS"].map(c => <option key={c}>{c}</option>)}</select></div>
            <div><label className="text-xs text-gray-500 mb-1 block">Priority</label><select value={form.priority} onChange={e => h("priority",e.target.value)} className={inputCls}>{["Urgent","Medium","Low"].map(p => <option key={p}>{p}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500 mb-1 block">Department</label><select value={form.department} onChange={e => h("department",e.target.value)} className={inputCls}>{["Sales","Support","Marketing","Hr","Finance"].map(d => <option key={d}>{d}</option>)}</select></div>
            <div><label className="text-xs text-gray-500 mb-1 block">Assign To</label><select value={form.assignedTo} onChange={e => h("assignedTo",+e.target.value)} className={inputCls}>{USERS.filter(u => u.role === "Employee").map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
          </div>
          {/* G16: assignment preview */}
          {assignee && <div className={`text-xs p-2.5 rounded-lg flex items-start gap-2 ${darkMode ? "bg-blue-900/20 border border-blue-700/40 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"}`}>ℹ️ This message will be sent to <strong>{assignee.name}</strong> ({assignee.department}) with <strong>{form.priority}</strong> priority.</div>}
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs text-gray-500 mb-1 block">Contact Name</label><input value={form.contactName} onChange={e => h("contactName",e.target.value)} className={inputCls} /></div>
            <div><label className="text-xs text-gray-500 mb-1 block">Contact Info</label><input value={form.contactInfo} onChange={e => h("contactInfo",e.target.value)} placeholder="Email, phone, or handle" className={inputCls} /></div>
          </div>
          <div><label className="text-xs text-gray-500 mb-1 block">Confidence Level</label><select value={form.confidence} onChange={e => h("confidence",e.target.value)} className={inputCls}>{["High Confidence","Medium Confidence","Low Confidence"].map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label className="text-xs text-gray-500 mb-1 block">Subject</label><input value={form.subject} onChange={e => h("subject",e.target.value)} className={inputCls} /></div>
          <div><label className="text-xs text-gray-500 mb-1 block">Message Content</label><textarea value={form.body} onChange={e => h("body",e.target.value)} rows={3} className={`${inputCls} resize-none`} /></div>
        </div>
        <div className="flex gap-3 p-5 pt-0">
          <button onClick={onClose} className={`flex-1 border rounded-lg py-2 text-sm ${darkMode ? "border-gray-600 text-gray-300" : "border-gray-200 text-gray-600"}`}>Cancel</button>
          <button onClick={() => { onSubmit(form); onClose(); }} className="flex-1 bg-amber-500 text-white text-sm py-2 rounded-lg font-medium hover:bg-amber-600">Upload Message</button>
        </div>
      </div>
    </div>
  );
}

const INITIAL_INTEGRATIONS = {
  email: { connected: false, inboxes: [{ id: 1, address: "support@company.com", department: "Support", owner: "Lisa", priority: "Medium", status: "Active" }] },
  instagram: { connected: false, handle: "" }, shopify: { connected: false, store: "" }, telephony: { connected: false, number: "" },
};

function IntegrationsScreen({ darkMode }) {
  const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS);
  const [connectModal, setConnectModal] = useState(null);
  const [showAddInbox, setShowAddInbox] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState({});
  const connectedCount = Object.values(integrations).filter(v => v.connected).length;
  const handleConnect = (type, val) => setIntegrations(p => ({ ...p, [type]: { ...p[type], connected: true, handle: val, store: val, number: val } }));
  const handleDisconnect = (type) => setIntegrations(p => ({ ...p, [type]: { ...p[type], connected: false } }));
  const handleAddInbox = (form) => setIntegrations(p => ({ ...p, email: { ...p.email, inboxes: [...p.email.inboxes, { id: Date.now(), ...form, status: "Active" }] } }));
  const handleDeleteInbox = (id) => setIntegrations(p => ({ ...p, email: { ...p.email, inboxes: p.email.inboxes.filter(i => i.id !== id) } }));
  const card = `rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`;
  const CONFIGS = [
    { type: "email", icon: "✉️", name: "Email", badge: "Gmail / Outlook", desc: "Inbound email forwarding via Google Workspace", details: { webhook: "POST /api/ingest/email", auth: "OAuth 2.0 / SMTP", events: ["New email received","Reply detected","Bounce notification"] } },
    { type: "instagram", icon: "📸", name: "Instagram (Meta)", badge: "Meta Business API", desc: "Direct messages and sales notifications", details: { webhook: "POST /api/ingest/instagram", auth: "Meta App Token", events: ["New DM received","Story mention","Comment on post"] } },
    { type: "shopify", icon: "🛍️", name: "Shopify", badge: "Shopify Webhooks", desc: "Order and event notifications", details: { webhook: "POST /api/ingest/shopify", auth: "Shopify API Key", events: ["Order created","Order fulfilled","Refund requested"] } },
    { type: "telephony", icon: "📞", name: "Telephony", badge: "Twilio / Flute", desc: "Call transcription and routing", details: { webhook: "POST /api/ingest/telephony", auth: "Twilio Auth Token", events: ["Call received","Voicemail left","Transcript ready"] } },
  ];
  return (
    <div className={`flex-1 overflow-y-auto p-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-3xl mx-auto">
        <h1 className={`text-lg font-bold mb-0.5 ${darkMode ? "text-white" : "text-gray-900"}`}>Integrations</h1>
        <p className={`text-xs mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>One integration surface powering all communication channels</p>
        <div className="rounded-xl bg-amber-500 p-4 mb-4 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="font-bold text-sm mb-1">Universal Ingestion Architecture</h2>
              <p className="text-xs text-amber-100 mb-3">All channels send normalised events to: <code className="bg-amber-700/50 text-amber-100 text-xs px-2 py-0.5 rounded font-mono">POST /api/ingest</code></p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                <div><p className="text-xs font-semibold text-amber-200 mb-1">What happens:</p>{["Store raw payload","Create Draft task","Run AI extraction","Generate suggestions"].map(s => <p key={s} className="text-xs text-amber-100">• {s}</p>)}</div>
                <div><p className="text-xs font-semibold text-amber-200 mb-1">Human governance:</p>{["Review AI suggestions","Edit or confirm routing","Apply changes manually","Full audit trail"].map(s => <p key={s} className="text-xs text-amber-100">• {s}</p>)}</div>
              </div>
            </div>
            <div className={`ml-4 flex-shrink-0 rounded-lg px-4 py-3 text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              <div className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{connectedCount} <span className={`text-sm font-normal ${darkMode ? "text-gray-400" : "text-gray-400"}`}>/ 4</span></div>
              <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Connected Channels</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {CONFIGS.map(({ type, icon, name, badge, desc, details }) => {
            const isConnected = integrations[type]?.connected;
            return (
              <div key={type} className={card}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${darkMode ? "bg-gray-700" : "bg-gray-50 border border-gray-100"}`}>{icon}</div>
                      <div><div className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{name}</div><span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"}`}>{badge}</span></div>
                    </div>
                    <div className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-gray-300"}`} /><span className={`text-xs ${isConnected ? "text-green-600" : (darkMode ? "text-gray-400" : "text-gray-400")}`}>{isConnected ? "Connected" : "Not Connected"}</span></div>
                  </div>
                  <p className={`text-xs mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{desc}</p>
                  {isConnected
                    ? <button onClick={() => handleDisconnect(type)} className={`w-full text-xs py-2 rounded-lg border font-medium ${darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>Disconnect</button>
                    : <button onClick={() => type === "email" ? setIntegrations(p => ({ ...p, email: { ...p.email, connected: true } })) : setConnectModal(type)} className="w-full bg-amber-500 text-white text-xs py-2 rounded-lg font-medium hover:bg-amber-600">🔗 Connect</button>}
                </div>
                {type === "email" && isConnected && (
                  <div className={`border-t px-4 pb-4 ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                    <div className="flex items-center justify-between mt-3 mb-2">
                      <span className={`text-xs font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Managed Inboxes ({integrations.email.inboxes.length}/20)</span>
                      <button onClick={() => setShowAddInbox(true)} className="text-xs text-amber-600 hover:text-amber-700 font-medium">+ Add Inbox</button>
                    </div>
                    <div className={`rounded-lg overflow-hidden border text-xs ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                      <table className="w-full">
                        <thead><tr className={darkMode ? "bg-gray-700/50 text-gray-400" : "bg-gray-50 text-gray-500"}><th className="text-left px-2 py-1.5 font-medium">Inbox</th><th className="text-left px-2 py-1.5 font-medium">Status</th><th className="px-2 py-1.5" /></tr></thead>
                        <tbody>{integrations.email.inboxes.map(inbox => <tr key={inbox.id} className={`border-t ${darkMode ? "border-gray-700 text-gray-300" : "border-gray-50 text-gray-700"}`}><td className="px-2 py-1.5 font-mono text-xs truncate max-w-[140px]">{inbox.address}</td><td className="px-2 py-1.5"><span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-xs">Active</span></td><td className="px-2 py-1.5 flex gap-1 justify-end"><button onClick={() => handleDeleteInbox(inbox.id)} className="p-1 rounded text-gray-400 hover:text-red-500">🗑️</button></td></tr>)}</tbody>
                      </table>
                    </div>
                  </div>
                )}
                <div className={`border-t ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                  <button onClick={() => setExpandedDetails(p => ({ ...p, [type]: !p[type] }))} className={`w-full flex items-center justify-between px-4 py-2.5 text-xs ${darkMode ? "text-gray-400 hover:bg-gray-700/50" : "text-gray-500 hover:bg-gray-50"}`}>
                    <span>Integration Details</span><span>{expandedDetails[type] ? "▲" : "▼"}</span>
                  </button>
                  {expandedDetails[type] && (
                    <div className={`px-4 pb-4 space-y-2 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <div><span className="font-medium">Webhook:</span> <code className={`font-mono text-xs px-1 rounded ${darkMode ? "bg-gray-700 text-amber-400" : "bg-gray-100 text-amber-600"}`}>{details.webhook}</code></div>
                      <div><span className="font-medium">Auth:</span> {details.auth}</div>
                      <div><span className="font-medium">Events:</span><div className="mt-1">{details.events.map(e => <div key={e} className="flex items-center gap-1"><span className="text-green-500">•</span> {e}</div>)}</div></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {connectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConnectModal(null)}>
            <div className={`rounded-xl shadow-2xl w-full max-w-md mx-4 p-5 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`} onClick={e => e.stopPropagation()}>
              <h2 className="font-semibold mb-4 capitalize">Connect {connectModal}</h2>
              <input placeholder="Enter value..." className={`w-full border rounded-lg px-3 py-2 text-sm mb-4 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`} />
              <div className="flex gap-3"><button onClick={() => setConnectModal(null)} className={`flex-1 border rounded-lg py-2 text-sm ${darkMode ? "border-gray-600 text-gray-300" : "border-gray-200 text-gray-600"}`}>Cancel</button><button onClick={() => { handleConnect(connectModal, "connected"); setConnectModal(null); }} className="flex-1 bg-amber-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-amber-600">Connect</button></div>
            </div>
          </div>
        )}
        {showAddInbox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAddInbox(false)}>
            <div className={`rounded-xl shadow-2xl w-full max-w-md mx-4 p-5 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`} onClick={e => e.stopPropagation()}>
              <h2 className="font-semibold mb-4">Add Inbox</h2>
              <input placeholder="support@yourcompany.com" className={`w-full border rounded-lg px-3 py-2 text-sm mb-4 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"}`} />
              <div className="flex gap-3"><button onClick={() => setShowAddInbox(false)} className={`flex-1 border rounded-lg py-2 text-sm ${darkMode ? "border-gray-600 text-gray-300" : "border-gray-200 text-gray-600"}`}>Cancel</button><button onClick={() => { handleAddInbox({ address: "new@company.com", department: "Support", owner: "", priority: "Medium" }); setShowAddInbox(false); }} className="flex-1 bg-amber-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-amber-600">Add Inbox</button></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [selected, setSelected] = useState("");
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-amber-500 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg">🐝</div>
          <h1 className="text-3xl font-bold text-gray-900">Beehive</h1>
          <p className="text-gray-500 text-sm mt-1">All of your messages stored, classified,<br />categorized and routed in one place!</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Sign in to your account</h2>
          <label className="text-xs text-gray-500 mb-1 block">Select User</label>
          <select value={selected} onChange={e => setSelected(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 mb-4 bg-white">
            <option value="">Choose an account...</option>
            {USERS.map(u => <option key={u.id} value={u.id}>{u.name} - {u.role} ({u.department.toLowerCase()})</option>)}
          </select>
          <button onClick={() => selected && onLogin(+selected)} disabled={!selected} className="w-full bg-amber-500 disabled:bg-amber-300 text-white py-3 rounded-xl font-semibold text-sm hover:bg-amber-600 transition-colors">Sign In</button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">Beehive Communications Hub © 2026</p>
      </div>
    </div>
  );
}

export default function App() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [view, setView] = useState("messages");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const currentUser = USERS.find(u => u.id === currentUserId);
  const updateMessage = updated => setMessages(msgs => msgs.map(m => m.id === updated.id ? updated : m));
  const addMessage = form => {
    const newMsg = { id: messages.length + 1, from: form.contactName || "Unknown", subject: form.subject || "(No Subject)", body: form.body, channel: form.channel.toLowerCase(), priority: form.priority, confidence: form.confidence, department: form.department, status: "pending", assignedTo: form.assignedTo, date: new Date().toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" }), contactInfo: form.contactInfo, priorityReason: `Manually uploaded with ${form.priority.toLowerCase()} priority.`, confidenceReason: `Manually classified with ${form.confidence}.`, internalNotes: [], changeLog: [], needsReview: form.confidence === "Low Confidence" };
    setMessages(msgs => [newMsg, ...msgs]);
  };

  const ctx = { messages, updateMessage };

  if (!currentUser) return (
    <AppContext.Provider value={ctx}>
      <LoginScreen onLogin={id => { setCurrentUserId(id); setView("messages"); }} />
    </AppContext.Provider>
  );

  const isManager = currentUser.role === "Manager";
  const isAdmin = currentUser.role === "Admin";
  const unreadCount = 2;

  return (
    <AppContext.Provider value={ctx}>
      <div className={`h-screen flex flex-col overflow-hidden ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <Header view={view} setView={setView} currentUser={currentUser} darkMode={darkMode} onSettingsOpen={() => setShowSettings(true)} onNotifOpen={() => setShowNotifs(true)} unreadCount={unreadCount} />
        <div className="flex-1 overflow-hidden flex flex-col">
          {view === "integrations" ? <IntegrationsScreen darkMode={darkMode} />
            : view === "messages" ? <MessagesView isManager={isManager || isAdmin} currentUser={currentUser} darkMode={darkMode} />
              : view === "dashboard" && (isManager || isAdmin) ? <ManagerDashboard currentUser={currentUser} onUpload={() => setShowUpload(true)} darkMode={darkMode} />
                : view === "dashboard" ? <EmployeeDashboard currentUser={currentUser} darkMode={darkMode} />
                  : <EmployeeDashboard currentUser={currentUser} darkMode={darkMode} />}
        </div>
        {showSettings && <SettingsModal user={currentUser} darkMode={darkMode} toggleDarkMode={() => setDarkMode(d => !d)} onLogout={() => { setCurrentUserId(null); setShowSettings(false); }} onClose={() => setShowSettings(false)} />}
        {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSubmit={addMessage} currentUser={currentUser} darkMode={darkMode} />}
        {showNotifs && <NotificationPanel onClose={() => setShowNotifs(false)} darkMode={darkMode} />}
      </div>
    </AppContext.Provider>
  );
}
