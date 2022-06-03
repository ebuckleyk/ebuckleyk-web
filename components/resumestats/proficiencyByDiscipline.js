import { useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import useResponsive from '../../utils/hooks/useResponsive';

const data = [
  {
    skill: 'Software Development',
    ebuckleyk: 4,
    fullMark: 5
  },
  {
    skill: 'Systems Design',
    ebuckleyk: 3.5,
    fullMark: 5
  },
  {
    skill: 'Security',
    ebuckleyk: 2.5,
    fullMark: 5
  },
  {
    skill: 'Project Management',
    ebuckleyk: 3.5,
    fullMark: 5
  },
  {
    skill: 'Data Analysis',
    ebuckleyk: 2,
    fullMark: 5
  },
  {
    skill: 'Tech Writing',
    ebuckleyk: 2,
    fullMark: 5
  }
];

export default function ProficiencyByDiscipline() {
  const responsive = useResponsive();

  const tickStyles = useMemo(() => {
    let s = {};
    if (responsive.isDesktop) {
      s = { ...s, fontSize: 12 };
    } else {
      s = { ...s, fontSize: 10 };
    }
    return s;
  }, [responsive.isDesktop]);
  return (
    <ResponsiveContainer height={300} width="100%">
      <RadarChart data={data} outerRadius={'70%'}>
        <PolarGrid stroke="grey" />
        <PolarAngleAxis tick={tickStyles} orientation="outer" dataKey="skill" />
        <PolarRadiusAxis tick={{ fill: 'black' }} />
        <Radar
          name="Emmanuel K. Buckley"
          dataKey="ebuckleyk"
          stroke="#fff"
          fill="#42A5F5"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
