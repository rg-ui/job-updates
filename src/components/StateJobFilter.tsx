"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LinkItem {
  text: string;
  href: string;
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

  // Filtering Logic
  const filteredBlocks = initialBlocks.map(block => {
    if (activeState === "All India") return block;
    
    const keywords = STATE_MAPPINGS[activeState];
    const filteredLinks = block.links.filter(link => {
      const lowerText = link.text.toLowerCase();
      // Check if any keyword exists in the link text
      return keywords.some(kw => lowerText.includes(kw));
    });

    return {
      ...block,
      links: filteredLinks
    };
  }).filter(block => block.links.length > 0); // Only keep blocks that have at least 1 matching link

  return (
    <div className="state-filter-section" style={{ marginBottom: '30px' }}>
      
      {/* State Selector Bar (Apple Style Pill Menu) */}
      <div 
        className="state-pill-container"
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '12px',
          padding: '10px 5px 20px 5px',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none',  // IE/Edge
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

      {/* Results Grid with Framer Motion layout animations */}
      <motion.div 
        layout
        className="sections-grid"
      >
        <AnimatePresence mode="popLayout">
          {filteredBlocks.length > 0 ? (
            filteredBlocks.map((block, index) => (
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
                  border: '1px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}
              >
                <h2 className="category-title" style={{textTransform: 'capitalize', borderRadius: '16px 16px 0 0'}}>{block.title}</h2>
                <ul className="category-list" style={{ borderRadius: '0 0 16px 16px', background: 'transparent' }}>
                  {block.links.map((item, i) => (
                    <li key={i}><a href={item.href} style={{ fontWeight: '600' }}>{item.text}</a></li>
                  ))}
                </ul>
              </motion.div>
            ))
          ) : (
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
              <p>Try selecting "All India" to see all current updates.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
