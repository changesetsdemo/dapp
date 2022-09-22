import AnCard from '@components/Card';
import { Trans } from '@lingui/react';
import classNames from 'classnames';
import { ReactNode } from 'react';

export type AnColProps<T> = {
  key: string;
  label: string | ReactNode;
  prop?: string;
  width?: string;
  position?: 'left' | 'center' | 'right';
  headerNode?: () => ReactNode;
  colNode?: (value: T) => ReactNode;
  onRow?: () => void;
};

export type AnTableProps<T> = {
  data: T[];
  columns: AnColProps<T>[];
  gridTemplateColumns?: string;
};

export function AnTable<T>(props: AnTableProps<T>) {
  const { data, columns, gridTemplateColumns } = props;

  const cols: { [key: number]: string } = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
  };

  return (
    <div className="grid">
      <AnCard
        className={classNames('grid mb-[1rem] bg-theme-50', cols[columns.length])}
        style={{
          gridTemplateColumns: gridTemplateColumns || '',
        }}
      >
        {columns.map((item, index) => (
          <div
            className={classNames('flex items-center', {
              'px-[1rem]': index === 0,
            })}
            key={item.key + index}
          >
            {item.headerNode ? <>{item.headerNode}</> : <>{item.label}</>}
          </div>
        ))}
      </AnCard>
      {data.length > 0 ? (
        <>
          {data.map((row: T, index) => (
            <AnCard
              className={classNames('grid mb-[1rem] bg-theme-50', `grid-cols-${columns.length}`)}
              key={'row' + index}
              style={{
                gridTemplateColumns: gridTemplateColumns || '',
              }}
            >
              {columns.map((col, colInx) => (
                <div
                  className={classNames('flex items-center', {
                    'px-[1rem]': colInx === 0,
                  })}
                  style={{ width: col.width }}
                  key={'col' + col.key + colInx}
                >
                  {col.colNode ? <>{col.colNode(row)}</> : <>{(row as any)[col.prop as any]}</>}
                </div>
              ))}
            </AnCard>
          ))}
        </>
      ) : (
        <div className="w-full text-center p-[4rem] text-theme-400">
          <Trans id="No Data"></Trans>
        </div>
      )}
    </div>
  );
}
