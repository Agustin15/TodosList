const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

export const fetchAddVerificationTwoStep = async (confirmPassword) => {
  let data;
  try {
    const response = await fetch("/api/verificationTwoStep/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        confirmPassword: confirmPassword
      })
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status == 401) {
        location.href = urlFront + "login";
      }
      throw result.messageError;
    }

    if (result) data = { state: "ok" };
  } catch (error) {
    console.log(error);
    data = { state: "error", error: error };
  } finally {
    return data;
  }
};
