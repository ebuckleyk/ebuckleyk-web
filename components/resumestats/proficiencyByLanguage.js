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
    language: 'C#',
    ebuckleyk: 4,
    fullMark: 5
  },
  {
    language: 'Java',
    ebuckleyk: 1.5,
    fullMark: 5
  },
  {
    language: 'Javascript',
    ebuckleyk: 2.5,
    fullMark: 5
  },
  {
    language: 'ReactJS',
    ebuckleyk: 3.5,
    fullMark: 5
  },
  {
    language: 'pHp',
    ebuckleyk: 3,
    fullMark: 5
  },
  {
    language: 'SQL',
    ebuckleyk: 2.5,
    fullMark: 5
  }
];

export default function ProficiencyByLanguage() {
  const responsive = useResponsive();

  const tickStyles = useMemo(() => {
    let s = {};
    if (responsive.isDesktop) {
      s = { ...s, fontSize: 12 };
    } else {
      s = { ...s, fontSize: 10 };
    }
    return s;
  }, [responsive.isMobile, responsive.isTablet, responsive.isDesktop]);

  return (
    <ResponsiveContainer height={300} width="100%">
      <RadarChart data={data} outerRadius={'70%'}>
        <PolarGrid stroke="grey" />
        <PolarAngleAxis
          tick={tickStyles}
          orientation="outer"
          dataKey="language"
        />
        <PolarRadiusAxis tick={{ fill: 'black' }} />
        <Radar
          name="Emmanuel K. Buckley"
          dataKey="ebuckleyk"
          stroke="#8884d8"
          fill="#42A5F5"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
