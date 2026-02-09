import { getToken } from "@/hooks/token";

export async function getFile(url: string) {
  try {
    const token = getToken();

    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return null;

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    return imageUrl;
  } catch (error) {
    console.error(error);
    return null;
  }
}
