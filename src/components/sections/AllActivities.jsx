import ActivitySection from './ActivitySection';
import { ACTIVITY_CATEGORIES } from '../../data/sampleData';

const sectionSubtitles = {
  'Resource Person Activities': 'Invited roles, chief guest appearances, talks, and professional engagements',
  'Expert Lectures': 'Expert lectures and invited technical talks delivered at academic institutions',
  'Workshops & FDPs': 'Faculty development programs, workshops, seminars, webinars, and training sessions',
  'Conferences': 'International conference papers and conference contributions',
  'Research Publications': 'Journal publications and technical research papers',
  'National Publications': 'National publications, national conference papers, and proceedings',
  'Books & Book Chapters': 'Published books and contributed book chapters',
  'Patents': 'Filed, granted, and under-examination patents and inventions',
  'Consultancy Projects': 'Consultancy projects delivered for external agencies and industry partners',
  'Funded Projects': 'Research and development projects supported by external funding agencies',
  'Grants Received': 'Grants received for projects, conferences, equipment, workshops, and startup funding',
  'Lab Development': 'In-house lab, trainer-kit, and product development work',
  'Awards & Recognitions': 'Awards, honors, recognitions, appreciations, and certificates',
  'Professional Memberships': 'Professional body memberships and affiliations',
  'Research Links': 'Research profiles, identifiers, and academic index links',
  'Citation Statistics': 'Google Scholar, Scopus, and Web of Science citation metrics',
  'Professional Career': 'Academic, administrative, research, and industry career details',
  'IEEE Activities': 'IEEE student branch, section, conference, reviewer, and professional activities',
  'Innovation & Startup Activities': 'Startup mentoring, incubation, ideation, innovation, and entrepreneurship work',
  'Reviewer Activities': 'Journal, conference, paper, startup, and research review roles',
  'Session Chair Activities': 'Session chair roles at conferences and technical events',
  'Jury Member Activities': 'Jury, judge, examiner, and evaluator roles',
  'Academic Committees': 'Board of Studies, selection committees, PhD evaluations, CDC, and curriculum work',
  'Women Empowerment Activities': 'Women empowerment, girl-child education, and entrepreneurship programs',
  'Student Development Programs': 'Student induction, learning, PBL, and development programs',
};

export default function AllActivities() {
  return (
    <>
      {ACTIVITY_CATEGORIES.map((cat, i) => (
        <ActivitySection
          key={cat.key}
          categoryKey={cat.key}
          title={cat.label}
          subtitle={sectionSubtitles[cat.key] || `Activities related to ${cat.label}`}
          icon={cat.icon}
          isAlt={i % 2 !== 0}
        />
      ))}
    </>
  );
}
