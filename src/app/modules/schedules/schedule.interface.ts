export interface ISchedule {
  startTimeDate: string;
  endTimeDate: string;
  startTime: string;
  endTime: string;
}

export interface IFilterableSchedule {
  startTime?: string | undefined;
  endTime?: string | undefined;
}
