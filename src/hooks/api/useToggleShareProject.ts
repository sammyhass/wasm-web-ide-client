import { ProjectT, toggleShareProject } from "@/lib/api/services/projects";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useProjectSharing = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["project", id, "share"],
    mutationFn: (share: boolean) => toggleShareProject({ id, share }),
    onSuccess: (data) => {
      qc.setQueryData<ProjectT>(["project", id], (old) =>
        old ? { ...old, share_code: data.shareCode } : old
      );
    },
  });
};
