import { AxiosResponse } from "axios";
import { z } from "zod";
import { axiosClient } from "../axios";

const languageSchema = z.union([
  z.literal("html"),
  z.literal("css"),
  z.literal("go"),
  z.literal("js"),
  z.literal("wasm"),
  z.literal("ts"),
  z.literal("json"),
  z.literal("wat"),
  z.literal("jsx"),
  z.literal("tsx"),
]);
export const projectLanguage = z.union([
  z.literal("Go"),
  z.literal("AssemblyScript"),
]);

export type ProjectLangT = z.output<typeof projectLanguage>;

const fileSchema = z.object({
  name: z.string(),
  language: languageSchema,
  content: z.string(),
});

const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.string(),
  files: z.nullable(z.array(fileSchema)),
  user_id: z.string(),
  wasm_path: z.optional(z.string()),
  language: projectLanguage,
  share_code: z.optional(z.string()),
});

const projectsArraySchema = z.array(projectSchema);

export type ProjectT = z.output<typeof projectSchema>;
export type FileT = z.output<typeof fileSchema>;

const parseId = (id: string) => z.string().uuid().parse(id);

const createProjectDto = z.object({
  name: z.string(),
  language: projectLanguage,
});
type createProjectDto = z.input<typeof createProjectDto>;

export const createProject = async ({
  name,
  language,
}: createProjectDto): Promise<ProjectT> => {
  const { data, status } = await axiosClient.post("/projects", {
    name,
    language,
  });

  if (status !== 200) {
    return Promise.reject(data);
  }

  return projectSchema.parse(data);
};

export const getProjects = async (): Promise<ProjectT[]> => {
  const { data, status } = await axiosClient.get<
    unknown,
    AxiosResponse<ProjectT[]>
  >("/projects");

  if (status !== 200) {
    return Promise.reject(data);
  }

  return projectsArraySchema.parse(data);
};

export const getProject = async (id: string): Promise<ProjectT> => {
  parseId(id);

  const { data, status } = await axiosClient.get(`/projects/${id}`);

  if (status !== 200) {
    return Promise.reject(data);
  }

  return projectSchema.parse(data);
};

export const saveProjectFiles = async ({
  id,
  files,
}: {
  id: string;
  files: FileT[];
}): Promise<FileT[]> => {
  parseId(id);

  const filesAcc = files?.reduce((acc, curr) => {
    acc[curr.name] = curr.content;
    return acc;
  }, {} as { [key: string]: string });

  const { data, status } = await axiosClient.patch(`/projects/${id}`, {
    files: filesAcc,
  });

  if (status !== 200) {
    return Promise.reject(data);
  }

  return z.array(fileSchema).parse(data);
};

export const deleteProject = async (id: string): Promise<void> => {
  const { status } = await axiosClient.delete(`/projects/${id}`);

  if (status !== 200) {
    return Promise.reject();
  }

  return;
};

export const compileProject = async (id: string): Promise<string> => {
  parseId(id);

  const { status, data } = await axiosClient.post<string>(
    `/projects/${id}/compile`
  );

  if (status !== 200) {
    return Promise.reject(data);
  }

  return z.string().parse(data);
};

export const getProjectWatUrl = async (id: string): Promise<string> => {
  parseId(id);

  const { status, data } = await axiosClient.get<string>(`/projects/${id}/wat`);

  if (status !== 200) {
    return Promise.reject(data);
  }

  return z.string().parse(data);
};

export const renameProject = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}): Promise<ProjectT> => {
  parseId(id);
  const { status, data } = await axiosClient.patch(`/projects/${id}/rename`, {
    name,
  });

  if (status !== 200) {
    return Promise.reject(data);
  }

  return projectSchema.parse(data);
};

const toggleShareSchema = z.object({
  shared: z.boolean(),
  shareCode: z.string().optional(),
});

export const toggleShareProject = async (params: {
  id: string;
  share: boolean;
}) => {
  const { status, data } = await axiosClient.patch(
    `/projects/${params.id}/share`,
    {
      shared: params.share,
    }
  );

  if (status !== 200) {
    return Promise.reject(data);
  }

  return toggleShareSchema.parse(data);
};

export const getSharedProject = async (shareCode: string) => {
  const { status, data } = await axiosClient.get(`/projects/fork/${shareCode}`);

  if (status !== 200) {
    return Promise.reject(data);
  }

  return projectSchema.parse(data);
};

export const forkProject = async (shareCode: string) => {
  const { status, data } = await axiosClient.post(
    `/projects/fork/${shareCode}`
  );

  if (status !== 200) {
    return Promise.reject(data);
  }

  return projectSchema.parse(data);
};
