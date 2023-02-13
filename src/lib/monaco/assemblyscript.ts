import { Monaco } from '@monaco-editor/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ProjectLangT } from '../api/services/projects';

const typesUrl = '/assemblyscript_v0.27.0.d.tstmpl';

const getAssemblyScriptTypes = async () => {
  const { data, status } = await axios.get<string>(typesUrl);

  if (status === 200) {
    return data;
  }

  Promise.reject(
    'Unable to fetch AssemblyScript types. Please check your internet connection.'
  );
};

export const useMonacoSetup = (
  monaco?: Monaco,
  projectLanguage?: ProjectLangT
) => {
  useQuery(['assemblyscript-types'], getAssemblyScriptTypes, {
    enabled: projectLanguage === 'AssemblyScript' && !!monaco,

    onSuccess: data => {
      if (data) {
        monaco?.languages.typescript.typescriptDefaults.addExtraLib(
          data,
          'assemblyscript.d.ts'
        );
      }
    },
    onError: error => {
      console.warn('Unable to fetch AssemblyScript types', error);
    },
  });
};
