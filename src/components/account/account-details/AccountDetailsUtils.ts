export const getInitialBirthdayState = (birthday?: Date | null) => {
  const birthdayDate = new Date();

  birthdayDate.setFullYear(
    birthday ? new Date(birthday).getFullYear() : new Date().getFullYear()
  );
  birthdayDate.setMonth(birthday ? new Date(birthday).getMonth() : 0);
  birthdayDate.setDate(birthday ? new Date(birthday).getDate() : 1);

  const day = birthdayDate.getDate();
  const month = birthdayDate.getMonth();
  const year = birthdayDate.getFullYear();

  return { day, month, year };
};

export const setPointerEventsOnBody = (val: boolean) => {
  // workaround for closing select and dialog at the same time
  // https://github.com/radix-ui/primitives/issues/1241
  if (!val) {
    setTimeout(() => {
      document.body.style.pointerEvents = 'auto';
    }, 1);
  }
};

export const getAccountDetailsQueryKey = (userId: string) => [
  'accountDetails',
  userId,
];
