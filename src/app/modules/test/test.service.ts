const testCreateAdmin = async (data: any) => {
  console.log({ data });
  return {
    message: "test create admin is on",
  };
};

export const testService = {
  testCreateAdmin,
};
