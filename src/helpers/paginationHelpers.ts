export type TPagination = {
  page?: number;
  limit?: number;
  skip?: number;
  sortBy?: string;
  sortOrder?: string;
};

type TOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};

export const calculatePagination = (options: TPagination): TOptionsResult => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 5;
  const skip: number = (page - 1) * limit;

  // todo: sorting
  const sortBy: string = options.sortBy || "createdAt";

  const sortOrder: string = options.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const calculateDoctorSchedulePagination = (
  options: TPagination
): TOptionsResult => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 5;
  const skip: number = (page - 1) * limit;

  // todo: sorting
  const sortBy: any = options.sortBy;

  const sortOrder: any = options.sortOrder;

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};
