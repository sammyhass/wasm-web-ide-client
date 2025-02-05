import LanguageIcon from "@/components/icons/Icon";
import SEO from "@/components/seo";
import Container from "@/layouts/Container";
import ProtectedPage from "@/layouts/ProtectedPage";
import { ApiErrorResponse } from "@/lib/api/axios";
import {
  createProject,
  ProjectLangT,
  ProjectT,
} from "@/lib/api/services/projects";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiErrorResponse>();

  const [selectedLang, setSelectedLang] =
    useState<ProjectLangT>("AssemblyScript");
  const [name, setName] = useState("");

  const router = useRouter();

  const client = useQueryClient();

  const { mutate } = useMutation(["createProject"], createProject, {
    onSuccess: (d) => {
      client.refetchQueries(["projects"]);

      client.setQueryData<ProjectT>(["project", d.id], d);
      setLoading(false);

      router.push(`/projects/${d.id}`);
    },
    onError: (err) => {
      setError(err as ApiErrorResponse);
      setLoading(false);
    },
  });

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setLoading(true);

      if (!!!name || !selectedLang) {
        return;
      }

      mutate({
        name,
        language: selectedLang,
      });
    },
    [mutate, name, selectedLang]
  );

  return (
    <>
      <SEO title="New Project" />
      <ProtectedPage>
        <Container title={"New Project"}>
          <form
            className="mx-auto flex max-w-xl flex-col gap-4"
            onSubmit={onSubmit}
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Project Name"
                className="input input-bordered"
                id="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                name="name"
                data-testid="project-name-input"
              />
            </div>

            <LanguageSelect
              selected={selectedLang}
              onChange={setSelectedLang}
            />

            <button
              className={`btn btn-primary ${loading ? "loading" : ""}`}
              data-testid="create-project-button"
              type="submit"
            >
              Create Project
            </button>

            {error && (
              <div className="alert alert-error">
                <div className="alert-title">Error</div>
                <p>
                  {error.info?.map((e, i) => (
                    <span key={i}>{e}</span>
                  ))}
                </p>
              </div>
            )}
          </form>
        </Container>
      </ProtectedPage>
    </>
  );
}

function LanguageSelect({
  selected,
  onChange,
}: {
  selected: ProjectLangT;
  onChange: (lang: ProjectLangT) => void;
}) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Language</span>
      </label>
      <div className="flex flex-col gap-2">
        <LangItem
          lang="AssemblyScript"
          selected={selected === "AssemblyScript"}
          onClick={() => onChange("AssemblyScript")}
        />
        <LangItem
          lang="Go"
          selected={selected === "Go"}
          onClick={() => onChange("Go")}
        />
      </div>
    </div>
  );
}

function LangItem({
  lang,
  selected,
  onClick,
}: {
  lang: ProjectLangT;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      data-testid={`lang-item-${lang}`}
      className={`btn btn-ghost btn-lg ${
        selected ? "btn-active" : ""
      } items-center justify-start gap-4`}
      onClick={onClick}
      type="button"
    >
      <LanguageIcon language={lang === "AssemblyScript" ? "ts" : "go"} />
      <div className="flex flex-col items-start gap-1 text-left">
        <span className="font-bold normal-case">{lang}</span>
      </div>
    </button>
  );
}
