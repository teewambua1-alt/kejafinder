import React from 'react';
import { motion } from 'motion/react';
import { PlusCircle, Wrench, Trash2 } from 'lucide-react';

export default function TestIssueBoard() {
  const sections = [
    {
      id: 'add',
      title: 'Add next',
      icon: PlusCircle,
      color: 'blue',
      items: [
        "Post Vacancy Firestore writes",
        "Saved Listings persistence",
        "Support reports backend",
        "Landlord dashboard listings management",
        "Admin dashboard mockup",
        "App-wide data consistency"
      ]
    },
    {
      id: 'fix',
      title: 'Fix or improve',
      icon: Wrench,
      color: 'orange',
      items: [
        "Check all nested buttons",
        "Verify all back buttons",
        "Monitor bundle size after lazy loading",
        "Consider deeper route-level/code-splitting before MVP",
        "Avoid adding more heavy pages before backend planning",
        "Review repeated imports from Framer Motion and Lucide if bundle grows",
        "Review mobile spacing on 320px",
        "Review unused dependencies before MVP: @google/genai, express, dotenv, @types/express."
      ]
    },
    {
      id: 'remove',
      title: 'Remove or simplify',
      icon: Trash2,
      color: 'red',
      items: [
        "Remove duplicated placeholder sections after real sections exist",
        "Merge repeated support/safety notes if they feel noisy",
        "Keep dashboard mock simple until backend exists",
        "Avoid building real auth too early",
        "Avoid adding M-Pesa before trust and backend are ready"
      ]
    }
  ];

  return (
    <div className="space-y-4 pt-4">
      {sections.map((sec, i) => {
        const Icon = sec.icon;
        return (
          <motion.div
            key={sec.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className={`rounded-2.5xl p-5 border shadow-sm space-y-4 ${
              sec.color === 'blue' ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30' :
              sec.color === 'orange' ? 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/30' :
              'bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <div className={`p-2 rounded-xl flex items-center justify-center ${
                sec.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' :
                sec.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400' :
                'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400'
              }`}>
                <Icon className="w-4 h-4 stroke-[2.2]" />
              </div>
              <h3 className={`text-[13px] font-black uppercase tracking-wider ${
                sec.color === 'blue' ? 'text-blue-800 dark:text-blue-300' :
                sec.color === 'orange' ? 'text-orange-800 dark:text-orange-300' :
                'text-red-800 dark:text-red-300'
              }`}>
                {sec.title}
              </h3>
            </div>
            
            <ul className="space-y-2">
              {sec.items.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    sec.color === 'blue' ? 'bg-blue-400 dark:bg-blue-500' :
                    sec.color === 'orange' ? 'bg-orange-400 dark:bg-orange-500' :
                    'bg-red-400 dark:bg-red-500'
                  }`} />
                  <span className={`text-[11px] font-bold leading-tight ${
                    sec.color === 'blue' ? 'text-blue-900 dark:text-blue-100' :
                    sec.color === 'orange' ? 'text-orange-900 dark:text-orange-100' :
                    'text-red-900 dark:text-red-100'
                  }`}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )
      })}
    </div>
  );
}
