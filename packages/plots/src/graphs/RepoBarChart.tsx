import { Box, Paper, Typography } from '@mui/material';
import { compactNumber, fullNumber } from '@repo-radar/format';
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export interface RepoBarDatum {
  id: string;
  name: string;
  fullName: string;
  stars: number;
}

export interface RepoBarChartProps {
  data: RepoBarDatum[];
  maxBars?: number;
}

const BAR = '#2a78d6';
const INK = '#52514e';
const HOVER = 'rgba(0, 0, 0, 0.04)';

const ROW_HEIGHT = 34;
const MIN_HEIGHT = 140;

export function RepoBarChart({ data, maxBars = 12 }: RepoBarChartProps) {

  const rows = [...data].sort((a, b) => b.stars - a.stars).slice(0, maxBars);
  const hidden = data.length - rows.length;

  if (rows.length === 0) {
    return (
      <Box sx={{ py: 5, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Track a repository to see it here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box component="table" sx={visuallyHidden}>
        <caption>Stars per tracked repository</caption>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row">{row.fullName}</th>
              <td>{fullNumber(row.stars)}</td>
            </tr>
          ))}
        </tbody>
      </Box>

      <Box aria-hidden sx={{ height: Math.max(MIN_HEIGHT, rows.length * ROW_HEIGHT) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rows}
            layout="vertical"
            margin={{ top: 4, right: 56, bottom: 4, left: 4 }}
            barCategoryGap={6}
          >
            {/* Hidden, but required: without a numeric x-axis Recharts scales a
                vertical-layout bar chart as if the values were categories. */}
            <XAxis type="number" hide domain={[0, 'dataMax']} />
            <YAxis
              type="category"
              dataKey="name"
              width={130}
              tickLine={false}
              axisLine={false}
              tick={{ fill: INK, fontSize: 12 }}
              tickFormatter={truncate}
            />
            <Tooltip
              cursor={{ fill: HOVER }}
              content={({ active, payload }) => {
                const row = active ? (payload?.[0]?.payload as RepoBarDatum | undefined) : undefined;
                if (!row) return null;
                return (
                  <Paper sx={{ px: 1.5, py: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {row.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stars: {fullNumber(row.stars)}
                    </Typography>
                  </Paper>
                );
              }}
            />
            {/* minPointSize keeps a small value visible next to a large one
                without distorting the scale — the label carries the number. */}
            <Bar
              dataKey="stars"
              fill={BAR}
              radius={[0, 4, 4, 0]}
              minPointSize={2}
              isAnimationActive={false}
            >
              <LabelList
                dataKey="stars"
                position="right"
                formatter={(value) => (typeof value === 'number' ? compactNumber(value) : '')}
                style={{ fill: INK, fontSize: 12 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {hidden > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
          Showing the top {rows.length} of {data.length} tracked repositories.
        </Typography>
      )}
    </Box>
  );
}

/** Long repo names would otherwise run into the plot area. */
function truncate(name: string): string {
  return name.length > 18 ? `${name.slice(0, 17)}…` : name;
}

/** Units are explicit: MUI's `sx` reads a unitless 0–1 width/height as a
 *  percentage, so `width: 1` would mean 100% and push the page sideways. */
const visuallyHidden = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  margin: '-1px',
  padding: 0,
  border: 0,
} as const;
