import { useMemo, useState } from 'react';
import { Text } from '@chakra-ui/react';
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Sector,
  Legend,
  Cell
} from 'recharts';
import useResponsive from '../../utils/hooks/useResponsive';

const RADIAN = Math.PI / 180;
const LOOKUP = {
  'Office Depot': {
    shortName: 'Office Depot',
    color: '#CC0000'
  },
  'The SSI Group, Inc.': {
    shortName: 'SSI',
    color: '#518bb2'
  },
  'Rural Sourcing, Inc.': {
    shortName: 'RSI',
    color: '#d6261a'
  },
  'ELEAD CRM': {
    shortName: 'Elead',
    color: '#000000'
  },
  'CDK Global': {
    shortName: 'CDK',
    color: '#83C331'
  },
  'Amazon Web Services (AWS)': {
    shortName: 'AWS',
    color: '#FF9900'
  },
  null: {
    color: 'gray'
  },
  undefined: {
    color: 'gray'
  }
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <Text
      fontSize={{ sm: 10, lg: 12 }}
      as="text"
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </Text>
  );
};

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <Text
        fontSize={{ sm: 10, lg: 12 }}
        as="text"
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
      >
        {LOOKUP[payload.name].shortName}
      </Text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <Text
        fontSize={{ sm: 10, lg: 12 }}
        as="text"
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </Text>
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div>
      <p>{`${payload[0].name} : ${payload[0].value}`}</p>
    </div>
  );
};

const getData = (companyStats = {}) => {
  return Object.keys(companyStats).map((k) => {
    return {
      name: k,
      value: companyStats[k].timeInRole
    };
  });
};

export default function PercentOfTimeSpentAtCompany({ companyStats }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const responsive = useResponsive();
  const data = useMemo(() => getData(companyStats), [companyStats]);

  const onPieEnter = (_, idx) => {
    setActiveIndex(idx);
  };

  const pieProps = useMemo(() => {
    let props;

    if (responsive.isDesktop) {
      props = {
        activeIndex,
        activeShape: renderActiveShape,
        onMouseEnter: onPieEnter,
        innerRadius: 60
      };
    } else {
      props = {
        label: renderCustomizedLabel,
        innerRadius: 0
      };
    }

    return props;
  }, [responsive.isDesktop, activeIndex]);

  return (
    <ResponsiveContainer height={300}>
      <PieChart>
        <Pie {...pieProps} fill="#8884d8" data={data} dataKey="value">
          {data.map((entry, index) => {
            return (
              <Cell key={`cell-${index}`} fill={LOOKUP[entry.name].color} />
            );
          })}
        </Pie>
        {!responsive.isMobile ? <Tooltip content={<CustomTooltip />} /> : null}
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
