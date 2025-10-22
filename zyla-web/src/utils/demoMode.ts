export const isDemoUser = (): boolean => {
  try {
    const demoFlag = localStorage.getItem('zyla_demo');
    if (demoFlag === 'true') return true;

    const userStr = localStorage.getItem('zyla_user');
    if (userStr) {
      const user = JSON.parse(userStr || '{}');
      const email = String(user?.email || '').toLowerCase();
      const name = String(user?.name || '').toLowerCase();
      if (email === 'demo@zyla.com' || name === 'demo user') return true;
    }
  } catch {
    // noop
  }
  return false;
};
