import { useState, useEffect, useRef } from "react";

/*
  OrinHealthPanel
  ---------------
  Slide-out panel from the left edge showing Jetson Orin health stats.

  Props:
    orinData  (object | null) — live data from your ROS topic subscriber.
                                If null, falls back to mock data so the UI
                                still renders during dev.

  Expected orinData shape (match this in your roslibjs subscriber):
  {
    cpus:  [42, 38, 55, 30, 48, 22],          // per-core %, 6 values
    gpu:   61,                                  // GPU util %
    emc:   44,                                  // EMC (memory controller) %
    ram:   { used: 5.8, total: 8 },            // GB
    swap:  { used: 1.2, total: 4 },            // GB
    temps: { CPU: 52, GPU: 48, SOC: 50, CVE: 44 }, // °C
    power: { total: 12, cpu: 4, gpu: 5 },      // Watts
    fan:   55,                                  // %
    procs: [
      { name: "ros2",      cpu: 18, mem: 320 },
      { name: "rviz2",     cpu: 12, mem: 410 },
      { name: "slam_node", cpu:  9, mem: 280 },
      { name: "zed_wrap",  cpu:  7, mem: 550 },
    ]
  }

  Usage in App.jsx (or wherever your layout lives):
    import OrinHealthPanel from "./OrinHealthPanel";
    ...
    <OrinHealthPanel orinData={orinData} />

  The component is position:fixed to the left edge so it overlays
  whatever is already on screen without shifting layout.
*/

// ── helpers ──────────────────────────────────────────────────────────────────

function jitter(base, range) {
  return Math.round(base + (Math.random() - 0.5) * range * 2);
}

function mockData() {
  return {
    cpus:  [jitter(42,15), jitter(38,12), jitter(55,20), jitter(30,10), jitter(48,18), jitter(22,8)],
    gpu:   jitter(61, 20),
    emc:   jitter(44, 15),
    ram:   { used: +(jitter(58, 8) / 10).toFixed(1), total: 8 },
    swap:  { used: +(jitter(12, 4) / 10).toFixed(1), total: 4 },
    temps: { CPU: jitter(52,8), GPU: jitter(48,6), SOC: jitter(50,7), CVE: jitter(44,5) },
    power: { total: jitter(12,3), cpu: jitter(4,1), gpu: jitter(5,2) },
    fan:   jitter(55, 10),
    procs: [
      { name: "ros2",      cpu: jitter(18,5), mem: jitter(320,40) },
      { name: "rviz2",     cpu: jitter(12,4), mem: jitter(410,60) },
      { name: "slam_node", cpu: jitter(9,3),  mem: jitter(280,30) },
      { name: "zed_wrap",  cpu: jitter(7,2),  mem: jitter(550,50) },
    ],
  };
}

function valColor(v, warnAt, critAt) {
  if (v >= critAt) return "#ff3333";
  if (v >= warnAt) return "#ffaa00";
  return "#00cc66";
}

// ── sub-components ────────────────────────────────────────────────────────────

function Bar({ label, pct, value, color, warnAt, critAt }) {
  const vc = valColor(pct, warnAt, critAt);
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
      <span style={{ color:"#777", fontSize:11, minWidth:52, flexShrink:0 }}>{label}</span>
      <div style={{ flex:1, height:5, background:"#1f1f1f", borderRadius:3, overflow:"hidden" }}>
        <div style={{
          width: `${Math.min(pct,100)}%`,
          height:"100%",
          background: color,
          borderRadius:3,
          transition:"width 0.6s ease",
        }}/>
      </div>
      <span style={{ color:vc, fontSize:11, minWidth:38, textAlign:"right", flexShrink:0 }}>
        {value}
      </span>
    </div>
  );
}

function StatBox({ label, value, warnAt, critAt, rawVal }) {
  const vc = valColor(rawVal ?? 0, warnAt ?? 999, critAt ?? 9999);
  return (
    <div style={{
      background:"#1a0000",
      border:"1px solid #330000",
      borderRadius:4,
      padding:"6px 8px",
    }}>
      <div style={{ color:"#555", fontSize:9, letterSpacing:"1px", textTransform:"uppercase" }}>{label}</div>
      <div style={{ color: vc, fontSize:13, marginTop:2, fontFamily:"'Courier New', monospace" }}>{value}</div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      color:"#cc0000",
      fontSize:10,
      letterSpacing:"1.5px",
      textTransform:"uppercase",
      margin:"12px 0 6px",
    }}>
      {children}
    </div>
  );
}

function Divider() {
  return <hr style={{ border:"none", borderTop:"1px solid #1a1a1a", margin:"10px 0" }} />;
}

// ── main component ────────────────────────────────────────────────────────────

export default function OrinHealthPanel({ orinData = null }) {
  const [open, setOpen]   = useState(false);
  const [data, setData]   = useState(mockData);
  const intervalRef       = useRef(null);

  // If no live data prop, keep refreshing mock data every 2s
  useEffect(() => {
    if (orinData) {
      setData(orinData);
    } else {
      intervalRef.current = setInterval(() => setData(mockData()), 2000);
      return () => clearInterval(intervalRef.current);
    }
  }, [orinData]);

  // When live data prop changes, update
  useEffect(() => {
    if (orinData) setData(orinData);
  }, [orinData]);

  const ramPct  = Math.round((data.ram.used  / data.ram.total)  * 100);
  const swapPct = Math.round((data.swap.used / data.swap.total) * 100);

  return (
    <>
      {/* ── slide panel ── */}
      <div style={{
        position:   "fixed",
        top:        0,
        left:       0,
        width:      282,
        height:     "100vh",
        background: "#0d0d0d",
        borderRight:"1px solid #cc0000",
        transform:  open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        zIndex:     1000,
        overflowY:  "auto",
        overflowX:  "hidden",
        padding:    "14px 12px",
        fontFamily: "'Courier New', monospace",
      }}>

        {/* title */}
        <div style={{
          color:"#cc0000", fontSize:13, fontWeight:"bold",
          letterSpacing:"2px", textTransform:"uppercase",
          borderBottom:"1px solid #330000", paddingBottom:8, marginBottom:12,
          display:"flex", alignItems:"center", gap:8,
        }}>
          <span style={{
            display:"inline-block", width:7, height:7, borderRadius:"50%",
            background:"#00ff88",
            animation:"aura-pulse 1.4s infinite",
          }}/>
          Orin Health
        </div>

        {/* CPU */}
        <SectionLabel>CPU — 6 cores (ARM A78AE)</SectionLabel>
        {data.cpus.map((v, i) => (
          <Bar
            key={i}
            label={`CPU${i}`}
            pct={v}
            value={`${v}%`}
            color="#cc0000"
            warnAt={70} critAt={90}
          />
        ))}

        <Divider/>

        {/* GPU */}
        <SectionLabel>GPU — 1024-core Ampere</SectionLabel>
        <Bar label="GPU" pct={data.gpu} value={`${data.gpu}%`} color="#e05500" warnAt={75} critAt={90}/>
        <Bar label="EMC" pct={data.emc} value={`${data.emc}%`} color="#e05500" warnAt={75} critAt={90}/>

        <Divider/>

        {/* Memory */}
        <SectionLabel>Memory</SectionLabel>
        <Bar
          label="RAM"
          pct={ramPct}
          value={`${data.ram.used}/${data.ram.total}G`}
          color="#c09000"
          warnAt={70} critAt={88}
        />
        <Bar
          label="Swap"
          pct={swapPct}
          value={`${data.swap.used}/${data.swap.total}G`}
          color="#c09000"
          warnAt={60} critAt={80}
        />

        <Divider/>

        {/* Thermals */}
        <SectionLabel>Thermals</SectionLabel>
        {Object.entries(data.temps).map(([name, v]) => (
          <Bar
            key={name}
            label={name}
            pct={Math.round(v / 100 * 100)}
            value={`${v}°C`}
            color="#009988"
            warnAt={70} critAt={85}
          />
        ))}

        <Divider/>

        {/* Power & Fan */}
        <SectionLabel>Power &amp; Fan</SectionLabel>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginTop:4 }}>
          <StatBox label="Total Power" value={`${data.power.total}W`} rawVal={data.power.total} warnAt={15} critAt={20}/>
          <StatBox label="Fan Speed"   value={`${data.fan}%`}         rawVal={data.fan}         warnAt={80} critAt={95}/>
          <StatBox label="CPU Power"   value={`${data.power.cpu}W`}   rawVal={data.power.cpu}   warnAt={8}  critAt={12}/>
          <StatBox label="GPU Power"   value={`${data.power.gpu}W`}   rawVal={data.power.gpu}   warnAt={8}  critAt={12}/>
        </div>

        <Divider/>

        {/* Top processes */}
        <SectionLabel>Top Processes</SectionLabel>
        {data.procs.map((p, i) => (
          <div key={i} style={{
            display:"flex", justifyContent:"space-between",
            fontSize:10, marginBottom:4,
          }}>
            <span style={{ color:"#ccc", minWidth:80 }}>{p.name}</span>
            <span style={{ color:"#777" }}>{p.cpu}% cpu</span>
            <span style={{ color:"#777" }}>{p.mem} MB</span>
          </div>
        ))}

      </div>

      {/* ── arrow tab ── */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          position:       "fixed",
          top:            "50%",
          left:           open ? 282 : 0,
          transform:      "translateY(-50%)",
          width:          20,
          height:         60,
          background:     "#1a0000",
          border:         "1px solid #cc0000",
          borderLeft:     "none",
          borderRadius:   "0 6px 6px 0",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          cursor:         "pointer",
          zIndex:         1001,
          transition:     "left 0.35s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <svg
          width="10" height="14" viewBox="0 0 10 14" fill="none"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition:"transform 0.35s" }}
        >
          <polyline
            points="3,2 8,7 3,12"
            stroke="#cc0000" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* pulse keyframe injected once */}
      <style>{`
        @keyframes aura-pulse {
          0%,100% { opacity:1; }
          50%      { opacity:0.25; }
        }
      `}</style>
    </>
  );
}