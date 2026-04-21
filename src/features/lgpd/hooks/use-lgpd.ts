import { useMutation } from "@tanstack/react-query";
import { http, apiEndpoints } from "@/lib/api/client";

export function useExportLgpd() {
  return useMutation({
    mutationFn: async () => {
      const response = await http.get(apiEndpoints.lgpd.export, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "meus-dados.json");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
}

export function useDeleteLgpd() {
  return useMutation({
    mutationFn: () => http.delete(apiEndpoints.lgpd.delete),
  });
}
