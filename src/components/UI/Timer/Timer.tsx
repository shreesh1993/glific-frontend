import React, { useState, useEffect } from 'react';
import moment from 'moment';

import { ReactComponent as ContactOptOutIcon } from '../../../assets/images/icons/ContactOptOut.svg';
import styles from './Timer.module.css';

export interface TimerProps {
  time: any;
  contactStatus?: string;
  contactProviderStatus?: string;
}

export const Timer: React.FC<TimerProps> = (props: TimerProps) => {
  const [currentTime, setCurrentTime] = useState(moment(new Date()));

  useEffect(() => {
    setInterval(() => {
      setCurrentTime(moment(new Date()));
    }, 60000);
  }, []);

  var lastMessageTime = moment(props.time);
  var duration = moment.duration(currentTime.diff(lastMessageTime));
  var hours: string | number = Math.floor(duration.asHours());
  if (hours < 0 || isNaN(hours)) {
    hours = 0;
  }
  hours = hours > 24 ? 0 : 24 - hours;
  let timerStyle = styles.TimerNormal;
  if (hours === 0) {
    timerStyle = styles.TimerEnd;
  } else if (hours < 5) {
    timerStyle = styles.TimerApproachEnd;
  }

  if (hours < 10 && hours > 0) {
    hours = '0' + hours.toString();
  }

  if (
    (props.contactStatus && props.contactStatus === 'INVALID') ||
    props.contactProviderStatus === 'NONE'
  ) {
    return <ContactOptOutIcon />;
  }

  return (
    <div className={timerStyle} data-testid="timerCount">
      {hours}
    </div>
  );
};
