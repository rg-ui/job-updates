"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LinkItem {
  text: string;
  href: string;
  timestamp?: number;
  isViewMore?: boolean;
}

interface Block {
  title: string;
  links: LinkItem[];
}

interface StateJobFilterProps {
  initialBlocks: Block[];
}

const STATE_MAPPINGS: Record<string, string[]> = {
  "All India": [], // Empty array means show all
  "UP (Uttar Pradesh)": ["up ", " up", "uppsc", "upsssc", "uttar pradesh", "allahabad", "ro/aro", "awadh", "lucknow"],
  "Bihar": ["bihar", "bpsc", "bssc", "patna", "csbc", "btsc"],
  "Rajasthan": ["rajasthan", "rpsc", "rsmssb", "jaipur", "reet", "ptet"],
  "MP (Madhya Pradesh)": ["mp ", " mp", "mppsc", "madhya pradesh", "mpesb", "vyapam", "bhopal"],
  "Delhi / Haryana": ["delhi", "dsssb", "haryana", "hssc"],
  "Central & Defence": ["upsc", "ssc", "ibps", "sbi", "railway", "rrb", "ntpc", "navy", "army", "airforce", "coast guard", "crpf", "bsf", "cisf", "itbp"]
};

export default function StateJobFilter({ initialBlocks }: StateJobFilterProps) {
  const [activeState, setActiveState] = useState("All India");
  const [showNewlyUpdated, setShowNewlyUpdated] = useState(false);

  // State for live "Today's Updates" from API
  const [todayBlocks, setTodayBlocks] = useState<Block[] | null>(null);
  const [isFetchingToday, setIsFetchingToday] = useState(false);
  const [todayFetchError, setTodayFetchError] = useState<string | null>(null);
  const [totalNewLinks, setTotalNewLinks] = useState(0);

  // Fetch today's updates from API
  const fetchTodayUpdates = useCallback(async () => {
    setIsFetchingToday(true);
    setTodayFetchError(null);
    setTodayBlocks(null);
    try {
      const res = await fetch('/api/today-updates', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setTodayBlocks(json.blocks || []);
        setTotalNewLinks(json.totalTodayLinks || 0);
      } else {
        setTodayFetchError(json.error || 'Failed to fetch today\'s updates');
      }
    } catch (e: any) {
      setTodayFetchError('Network error. Please try again.');
    } finally {
      setIsFetchingToday(false);
    }
  }, []);

  // Handle button toggle
  const handleTodayToggle = () => {
    if (!showNewlyUpdated) {
      setShowNewlyUpdated(true);
      setActiveState("All India");
      fetchTodayUpdates();
    } else {
      setShowNewlyUpdated(false);
      setTodayBlocks(null);
      setTodayFetchError(null);
    }
  };

  // Decide which blocks to show
  let filteredBlocks: Block[] = [];

  if (showNewlyUpdated) {
    filteredBlocks = todayBlocks || [];
  } else {
    filteredBlocks = initialBlocks.map(block => {
      if (activeState === "All India") return block;

      const keywords = STATE_MAPPINGS[activeState];
      const filteredLinks = block.links.filter(link => {
        const lowerText = link.text.toLowerCase();
        return keywords.some(kw => lowerText.includes(kw));
      });

      return { ...block, links: filteredLinks };
    }).filter(block => block.links.length > 0);
  }

  // Today IST date string
  const todayIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10); // e.g. "2026-07-01"

  return (
    <div className="state-filter-section" style={{ marginBottom: '30px' }}>

      {/* Today's New Updates Button */}
      <div style={{ padding: '0 5px 15px 5px' }}>
        <button
          id="today-updates-btn"
          onClick={handleTodayToggle}
          disabled={isFetchingToday}
          style={{
            width: '100%',
            padding: '14px 20px',
            borderRadius: '16px',
            background: showNewlyUpdated
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            border: 'none',
            boxShadow: showNewlyUpdated
              ? '0 4px 20px rgba(239,68,68,0.35)'
              : '0 4px 20px rgba(16,185,129,0.35)',
            cursor: isFetchingToday ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.3s ease',
            opacity: isFetchingToday ? 0.8 : 1,
          }}
        >
          {isFetchingToday ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: '18px' }}>⏳</span>
              Fetching Today&apos;s Updates...
            </>
          ) : showNewlyUpdated ? (
            <>❌ Show All Updates</>
          ) : (
            <>🔥 Show Today&apos;s New Updates</>
          )}
        </button>

        {/* Spinner keyframe */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}} />

        {/* Result count badge - shown when today's updates are displayed */}
        {showNewlyUpdated && !isFetchingToday && todayBlocks !== null && (
          <div style={{
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: '700',
            color: totalNewLinks > 0 ? '#059669' : '#6b7280',
            background: totalNewLinks > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)',
            padding: '6px 16px',
            borderRadius: '20px',
            border: `1px solid ${totalNewLinks > 0 ? 'rgba(16,185,129,0.3)' : 'rgba(107,114,128,0.2)'}`,
          }}>
            {totalNewLinks > 0 ? (
              <><span>✅</span> {totalNewLinks} new posts found for <strong>{todayIST}</strong> (IST)</>
            ) : (
              <><span>ℹ️</span> Koi naya post nahi aaj ({todayIST} IST). Baad mein check karein!</>
            )}
          </div>
        )}

        {/* Error state */}
        {todayFetchError && (
          <div style={{
            marginTop: '10px',
            padding: '10px 16px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px',
            color: '#dc2626',
            fontSize: '13px',
            fontWeight: '600',
            textAlign: 'center',
          }}>
            ⚠️ {todayFetchError}
            <button
              onClick={fetchTodayUpdates}
              style={{
                marginLeft: '10px',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '3px 10px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '700'
              }}
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* State Selector Bar (Apple Style Pill Menu) — hidden when showing today's updates */}
      {!showNewlyUpdated && (
        <div
          className="state-pill-container"
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '12px',
            padding: '10px 5px 20px 5px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            .state-pill-container::-webkit-scrollbar { display: none; }
            .state-pill {
              padding: 10px 20px;
              border-radius: 30px;
              font-weight: 600;
              font-size: 15px;
              cursor: pointer;
              white-space: nowrap;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              background: rgba(255, 255, 255, 0.7);
              border: 1px solid rgba(0, 0, 0, 0.05);
              box-shadow: 0 2px 8px rgba(0,0,0,0.04);
              color: #4b5563;
              backdrop-filter: blur(10px);
              -webkit-backdrop-filter: blur(10px);
            }
            .state-pill:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            }
            .state-pill.active {
              background: linear-gradient(135deg, #1f2937, #111827);
              color: white;
              box-shadow: 0 6px 15px rgba(31, 41, 55, 0.3);
              border-color: transparent;
              transform: scale(1.05);
            }
          `}} />

          {Object.keys(STATE_MAPPINGS).map((stateName) => (
            <button
              key={stateName}
              onClick={() => setActiveState(stateName)}
              className={`state-pill ${activeState === stateName ? 'active' : ''}`}
            >
              {stateName === "All India" ? "🇮🇳 " : "📍 "}
              {stateName}
            </button>
          ))}
        </div>
      )}

      {/* Loading skeleton when fetching today's updates */}
      {isFetchingToday && (
        <div style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255,255,255,0.8)',
            padding: '30px 40px',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <span style={{ fontSize: '36px', animation: 'spin 1.5s linear infinite', display: 'inline-block' }}>🔄</span>
            <span style={{ fontWeight: '700', color: '#059669', fontSize: '15px' }}>
              Checking for today&apos;s new updates...
            </span>
            <span style={{ color: '#6b7280', fontSize: '12px' }}>
              Fetching live data from source
            </span>
          </div>
        </div>
      )}

      {/* Results Grid with Framer Motion layout animations */}
      {!isFetchingToday && (
        <motion.div
          layout
          className="sections-grid"
        >
          <AnimatePresence mode="popLayout">
            {filteredBlocks.length > 0 ? (
              filteredBlocks.map((block) => (
                <motion.div
                  key={block.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="category-box"
                  style={{
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: showNewlyUpdated ? '2px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.5)',
                    boxShadow: showNewlyUpdated
                      ? '0 4px 20px rgba(16,185,129,0.08)'
                      : '0 4px 20px rgba(0,0,0,0.03)'
                  }}
                >
                  <h2
                    className="category-title"
                    style={{
                      textTransform: 'capitalize',
                      borderRadius: '16px 16px 0 0',
                      ...(showNewlyUpdated && {
                        background: 'linear-gradient(135deg, #059669, #10b981)',
                      })
                    }}
                  >
                    {showNewlyUpdated && <span style={{ marginRight: '6px' }}>🆕</span>}
                    {block.title}
                  </h2>
                  <ul className="category-list" style={{ borderRadius: '0 0 16px 16px', background: 'transparent' }}>
                    {block.links.map((item, i) => (
                      <li key={i} style={{ position: 'relative' }}>
                        {item.isViewMore ? (
                          <a
                            href={item.href}
                            className="view-more-btn"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '7px',
                              marginTop: '6px',
                              padding: '9px 22px',
                              background: showNewlyUpdated
                                ? 'linear-gradient(135deg, #059669, #10b981)'
                                : 'linear-gradient(135deg, #059669, #10b981)',
                              color: '#fff',
                              borderRadius: '30px',
                              fontSize: '13px',
                              fontWeight: '700',
                              letterSpacing: '0.3px',
                              textDecoration: 'none',
                              boxShadow: '0 4px 14px rgba(16,185,129,0.4)',
                              transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                              cursor: 'pointer',
                            }}
                            onMouseEnter={e => {
                              const el = e.currentTarget as HTMLAnchorElement;
                              el.style.background = 'linear-gradient(135deg, #047857, #059669)';
                              el.style.boxShadow = '0 6px 20px rgba(16,185,129,0.55)';
                              el.style.transform = 'translateY(-2px) scale(1.04)';
                            }}
                            onMouseLeave={e => {
                              const el = e.currentTarget as HTMLAnchorElement;
                              el.style.background = 'linear-gradient(135deg, #059669, #10b981)';
                              el.style.boxShadow = '0 4px 14px rgba(16,185,129,0.4)';
                              el.style.transform = 'translateY(0) scale(1)';
                            }}
                          >
                            {item.text}
                            <span style={{ fontSize: '16px', transition: 'transform 0.2s ease' }}>→</span>
                          </a>
                        ) : (
                          <a href={item.href} style={{ fontWeight: '600' }}>
                            {showNewlyUpdated && (
                              <span style={{
                                display: 'inline-block',
                                width: '7px',
                                height: '7px',
                                background: '#10b981',
                                borderRadius: '50%',
                                marginRight: '6px',
                                verticalAlign: 'middle',
                                animation: 'pulse-new 2s ease-in-out infinite'
                              }} />
                            )}
                            {item.text}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))
            ) : showNewlyUpdated && todayBlocks !== null ? (
              // No new updates today
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  gridColumn: '1 / -1',
                  padding: '50px 40px',
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.7)',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)',
                  border: '2px dashed rgba(16,185,129,0.3)',
                }}
              >
                <span style={{ fontSize: '48px' }}>🌙</span>
                <h3 style={{ marginTop: '14px', color: '#374151', fontWeight: '700' }}>
                  No new updates yet for today
                </h3>
                <p style={{ color: '#6b7280', marginTop: '6px', fontSize: '14px' }}>
                  New jobs and results are updated throughout the day.<br />
                  Check back soon or view All Updates below.
                </p>
                <button
                  onClick={() => { setShowNewlyUpdated(false); setTodayBlocks(null); }}
                  style={{
                    marginTop: '20px',
                    padding: '10px 28px',
                    background: 'linear-gradient(135deg, #1f2937, #111827)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '14px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  View All Updates
                </button>
              </motion.div>
            ) : !showNewlyUpdated && filteredBlocks.length === 0 ? (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  gridColumn: '1 / -1',
                  padding: '40px',
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.6)',
                  borderRadius: '16px',
                  color: '#6b7280'
                }}
              >
                <span style={{ fontSize: '40px' }}>🕵️‍♂️</span>
                <h3 style={{ marginTop: '10px', color: '#374151' }}>No jobs found for {activeState} at the moment.</h3>
                <p>Try selecting &quot;All India&quot; to see all current updates.</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pulse animation for new links */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-new {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}} />
    </div>
  );
}
