import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export const baseRestrictedPaths = [
  {
    name: 'react',
    importNames: ['default'],
    message:
      "Không import default 'React'. Với React 19, chỉ import named các hàm/type cần thiết (FC, useState, ReactNode, ...) theo .agents/rules/coding-standards.md §2.1.",
  },
  {
    name: 'axios',
    message:
      'Cấm sử dụng thư viện axios trực tiếp. Mọi truy vấn mạng phải qua RTK Query tại @business.',
  },
  {
    name: '@lms/shared',
    message: "Thống nhất sử dụng path alias '@shared' thay vì '@lms/shared'.",
  },
  {
    name: '@lms/business',
    message: "Thống nhất sử dụng path alias '@business' thay vì '@lms/business'.",
  },
];

export const baseRestrictedPatterns = [
  {
    group: ['../../*', '../../**', '../*/*/*'],
    message:
      "Nghiêm cấm dùng import tương đối từ 2 cấp trở lên ('../../'). Hãy sử dụng path alias (@/*, @business/*, @shared/*) theo .agents/rules/coding-standards.md §1.2.",
  },
];

export function buildRestrictedImportsRule({ extraPaths = [], extraPatterns = [] } = {}) {
  return [
    'error',
    {
      paths: [...baseRestrictedPaths, ...extraPaths],
      patterns: [...baseRestrictedPatterns, ...extraPatterns],
    },
  ];
}

export const baseConfig = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // 1. Strict Typing - Cấm sử dụng any (.agents/rules/coding-standards.md §1.1)
      '@typescript-eslint/no-explicit-any': 'error',

      // Cho phép biến chưa dùng có tiền tố _
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // 2. Tiêu chuẩn đường dẫn tương đối (.agents/rules/coding-standards.md §1.2)
      'no-restricted-imports': buildRestrictedImportsRule(),

      // Giới hạn độ dài file để tránh component / page nguyên khối (.agents/rules/architecture.md §1.2 & §2.3)
      'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    // Cấu hình môi trường Node cho các file config build / tooling
    files: ['**/*.cjs', '**/*.config.*', 'vite.config.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
    },
  },
];
