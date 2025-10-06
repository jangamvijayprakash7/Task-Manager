import React, { useEffect, useRef, useState } from "react";
import "./TeamTimeline.css";
import InviteMembersModal from "../modals/InviteMembersModal";
import DateFilterDropdown from "../modals/DateFilterDropdown";
import { CreateTimelineModal } from "../modals/CreateTimelineModal";
import { useToast } from "../../contexts/ToastContext";
import { useNavigate } from "react-router-dom";

type TaskDef = {
  id: number;
  title: string;
  start: string;
  end: string;
  avatar: string;
  row: number; // row index 
  leftPx: number; // absolute left position in px for precise placement
  width?: number; // optional width in px
  next?: number;
};

const rows = [
  "Henry Lucas",
  "Johnson Williamson",
  "Charlotte Amelia",
  "Olivia Thomas",
];

// Helper to construct profile navigation path and state
function createProfileNavigation(name: string, image: string) {
  const firstName = (name || "").trim().split(" ")[0]?.toLowerCase() || "";
  const initials = (name || "")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("");
  return {
    path: `/profile/${firstName}`,
    // The navigate API expects the second argument to be an options object
    // where the "state" key holds the actual history state payload
    state: { state: { user: { id: firstName, name, image, avatar: initials } } },
  };
}


const tasks: TaskDef[] = [
  // Row 1 with smaller width
  { id: 1, title: "Design UX research for landing page", start: "21 Oct", end: "24 Oct", avatar: "https://i.pravatar.cc/40?img=1", row: 0, leftPx: 90, width: 270, next: 5 },
  { id: 2, title: "Start UI design once UX is done", start: "21 Oct", end: "24 Oct", avatar: "https://i.pravatar.cc/40?img=1", row: 0, leftPx: 520, width: 270 },

  // Row 2 starts slightly differently
  { id: 3, title: "Workon Instagram marketing", start: "21 Oct", end: "24 Oct", avatar: "https://i.pravatar.cc/40?img=5", row: 1, leftPx: 120, width: 270, next: 7 },
  { id: 5, title: "Facebook and instagram ads for new mobile app", start: "21 Oct", end: "24 Oct", avatar: "https://i.pravatar.cc/40?img=5", row: 1, leftPx: 600, width: 270 },

  // Row 3 starts from another offset
  { id: 4, title: "Develop Mobile app V1", start: "21 Oct", end: "24 Oct", avatar: "https://i.pravatar.cc/40?img=11", row: 2, leftPx: 80, width: 270 },
  { id: 6, title: "Test mobile app with our customers", start: "21 Oct", end: "24 Oct", avatar: "https://i.pravatar.cc/40?img=11", row: 2, leftPx: 580, width: 270 },

  // Row 4 with a different offset
  { id: 7, title: "Design Marketing Graphics", start: "21 Oct", end: "24 Oct", avatar: "https://i.pravatar.cc/40?img=8", row: 3, leftPx: 610, width: 270 },
];

const TeamTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const taskRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [paths, setPaths] = useState<
    { d: string; cx: number; cy: number; rx: number; ry: number }[]
  >([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("November");
  const [selectedYear, setSelectedYear] = useState("2022");
  const { success } = useToast();
  const navigate = useNavigate();

  const handleTimelineCreated = (timeline: any) => {
    console.log('Timeline created:', timeline);
    success(
      'Timeline Created',
      `${timeline.name} has been added to your timelines.`
    );
  };

  const setRef = (id: number, el: HTMLDivElement | null) => {
    taskRefs.current[id] = el;
  };

  useEffect(() => {
    const compute = () => {
      const cont = containerRef.current;
      if (!cont) return;
      const contRect = cont.getBoundingClientRect();
      const lineOffset = 10; // push connector lines down uniformly
      const newPaths: {
        d: string;
        cx: number;
        cy: number;
        rx: number;
        ry: number;
      }[] = [];

      tasks.forEach((t) => {
        if (!t.next) return;
        const fromEl = taskRefs.current[t.id];
        const toEl = taskRefs.current[t.next];
        if (!fromEl || !toEl) return;

        const a = fromEl.getBoundingClientRect();
        const b = toEl.getBoundingClientRect();


        const ax = a.right - contRect.left;
        const ay = a.top + a.height / 2 - contRect.top + lineOffset;


        const bx = b.left - contRect.left;
        const by = b.top + b.height / 2 - contRect.top + lineOffset;


        // If same row, draw straight; otherwise use a smooth cubic curve like the reference
        const sameRow = Math.abs(ay - by) < 2;
        let d: string;
        if (sameRow) {
          d = `M ${ax} ${ay} L ${bx} ${by}`;
        } else {
          const mx = (ax + bx) / 2;
          d = `M ${ax} ${ay} C ${mx} ${ay}, ${mx} ${by}, ${bx} ${by}`;
        }
        newPaths.push({ d, cx: ax, cy: ay, rx: 4, ry: 4 });
        newPaths.push({ d: "", cx: bx, cy: by, rx: 4, ry: 4 });
      });

      setPaths(newPaths);
    };

    compute();
    const ro = new ResizeObserver(() => compute());
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", compute);
    const t = setTimeout(compute, 120);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
      clearTimeout(t);
    };
  }, []);

  return (
    <div className="team-timeline-root">
      <div className="timeline-inner">
      <header className="timeline-header">
        <div>
          <h2>Team Timeline</h2>
          <p className="subtitle">Create and complete tasks using boards</p>
        </div>

        <div className="timeline-actions">
          <button className="date-btn" onClick={() => setIsDateFilterOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="16" rx="2" stroke="#6b7280" strokeWidth="1.2"/>
              <path d="M16 3v4M8 3v4" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {selectedMonth.slice(0, 3)}, {selectedYear}
          </button>
          <button className="invite-btn" onClick={() => setIsInviteModalOpen(true)}>+ Invite</button>
          <CreateTimelineModal onTimelineCreated={handleTimelineCreated}>
            <button className="add-btn">+ Add Timeline</button>
          </CreateTimelineModal>
        </div>
      </header>

      <div className="timeline-canvas" ref={containerRef}>
        {/* top dates bar */}
        <div className="dates-bar">
          <div className="dates-inner">
            <div className="date">21</div>
            <div className="date">22</div>
            <div className="date">23</div>
            <div className="date">24</div>
            <div className="date">25</div>
            <div className="date">26</div>
          </div>
        </div>

        <svg className="connectors-svg" ref={svgRef}>
          {paths.map((p, i) =>
            p.d ? (
              <path key={i} d={p.d} stroke="#7c3aed" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            ) : null
          )}
          {/* draw dots for markers (use same array to draw dots) */}
          {paths.map((p, i) =>
            (p.cx || p.cx === 0) ? (
              <circle key={`dot-${i}`} cx={p.cx} cy={p.cy} r={p.rx} fill="#7c3aed" stroke="#fff" strokeWidth="2" />
            ) : null
          )}
        </svg>

        {/* rows */}
        <div className="rows">
          {rows.map((name, rowIdx) => (
            <div className="row" key={name}>
              <div className="member-col">
                <button
                  onClick={() => {
                    const imageUrl = `https://i.pravatar.cc/40?img=${rowIdx + 1}`;
                    const nav = createProfileNavigation(name, imageUrl);
                    navigate(nav.path, nav.state);
                  }}
                  className="member-btn"
                  aria-label={`Open ${name} profile`}
                >
                  <img src={`https://i.pravatar.cc/40?img=${rowIdx + 1}`} alt={name} />
                  <div className="member-name">{name}</div>
                </button>
              </div>

              <div className="row-canvas">
                {/* absolute positioned tasks for this row */}
                {tasks
                  .filter((t) => t.row === rowIdx)
                  .map((t) => (
                    <div
                      key={t.id}
                      ref={(el) => setRef(t.id, el)}
                      className="task-card"
                      style={{
                        left: `${t.leftPx}px`,
                        width: t.width ? `${t.width}px` : "420px",
                      }}
                    >
                      <div className="task-inner" style={{ display:'flex', alignItems:'flex-start', gap:'12px', width:'100%' }}>
                        <input type="checkbox" className="task-checkbox" />
                        <div className="task-body">
                          <div className="task-title">{t.title}</div>
                          <div className="task-sub">
                            <button
                              onClick={() => {
                                const memberName = rows[t.row];
                                const imageUrl = t.avatar;
                                const nav = createProfileNavigation(memberName, imageUrl);
                                navigate(nav.path, nav.state);
                              }}
                              className="avatar-btn"
                              aria-label="Open profile"
                            >
                              <img src={t.avatar} alt="" />
                            </button>
                            <span>{t.start} to {t.end}, 2022</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="timeline-footer">Add more members by <a href="#">+Inviting</a> and assign tasks to anyone</div>
      </div>

      {/* Invite Members Modal */}
      <InviteMembersModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
      />

      {/* Date Filter Dropdown */}
      <DateFilterDropdown
        isOpen={isDateFilterOpen}
        onClose={() => setIsDateFilterOpen(false)}
        currentMonth={selectedMonth}
        currentYear={selectedYear}
        onDateChange={(month, year) => {
          setSelectedMonth(month);
          setSelectedYear(year);
        }}
      />
      </div>
    </div>
  );
};

export default TeamTimeline;
