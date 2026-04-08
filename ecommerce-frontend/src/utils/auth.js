export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return {
      username:
        payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ] || payload.unique_name || payload.name || "",
      role:
        payload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] || "",
    };
  } catch {
    return null;
  }
};