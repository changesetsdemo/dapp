import React from 'react';

export const Button = (props: {
  className: string;
  children?: React.ReactNode;
}) => {
  return (
    <div>
      <button className={props.className}>{props.children}</button>
    </div>
  );
};
