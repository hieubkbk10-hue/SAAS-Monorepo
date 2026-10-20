import { baseConfig, buildRestrictedImportsRule } from './base.js';
import { reactConfig } from './react.js';

export const sharedConfig = [
  ...baseConfig,
  ...reactConfig,
  {
    rules: {
      // @shared chỉ chứa UI primitives kỹ thuật, không dính nghiệp vụ
      'no-restricted-imports': buildRestrictedImportsRule({
        extraPaths: [
          {
            name: '@business',
            message:
              '@shared là thư viện UI Primitives kỹ thuật (0% nghiệp vụ), tuyệt đối không được import @business.',
          },
          {
            name: '@tanstack/react-router',
            message:
              '@shared không được phụ thuộc vào @tanstack/react-router.',
          },
          {
            name: '@lms/admin',
            message: '@shared không được import từ apps/admin.',
          },
          {
            name: '@lms/web',
            message: '@shared không được import từ apps/web.',
          },
        ],
        extraPatterns: [
          {
            group: ['**/apps/**', '**/business/**', '@business/**'],
            message:
              '@shared không được import từ các app hoặc @business.',
          },
        ],
      }),
    },
  },
];

export const businessConfig = [
  ...baseConfig,
  ...reactConfig,
  {
    rules: {
      // @business không được phụ thuộc ngược vào apps
      'no-restricted-imports': buildRestrictedImportsRule({
        extraPaths: [
          {
            name: '@lms/admin',
            message: '@business không được import từ apps/admin.',
          },
          {
            name: '@lms/web',
            message: '@business không được import từ apps/web.',
          },
        ],
        extraPatterns: [
          {
            group: ['**/apps/**'],
            message: '@business là lõi nghiệp vụ dùng chung, không được phụ thuộc vào apps.',
          },
        ],
      }),
    },
  },
];
