import { Monaco } from '@monaco-editor/react';
import { useRef } from 'react';

function setupAssemblyScriptTypes(monaco: Monaco) {
  monaco.languages.typescript.typescriptDefaults.addExtraLib(`
    declare type i8 = number;
    declare type u8 = number;
    declare type i16 = number;
    declare type u16 = number;
    declare type i32 = number;
    declare type u32 = number;
    declare type i64 = number;
    declare type u64 = number;
    declare type f32 = number;
    declare type f64 = number;
    declare type usize = number;
    declare type isize = number;
    declare type bool = boolean;
    declare type v128 = any;
    declare type void = void;

  `);
}

export const useAssemblyScriptTypes = (monaco: Monaco) => {
  const hasSetup = useRef(false);

  if (monaco && !hasSetup.current) {
    setupAssemblyScriptTypes(monaco);
    hasSetup.current = true;
  }
};
