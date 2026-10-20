import { baseConfig, buildRestrictedImportsRule } from './base.js';
import { reactConfig } from './react.js';

export const adminConfig = [
  ...baseConfig,
  ...reactConfig,
  {
    rules: {
      // apps/admin không bao giờ được import từ apps/web (.agents/rules/architecture.md §3.3)
      'no-restricted-imports': buildRestrictedImportsRule({
        extraPaths: [
          {
            name: '@lms/web',
            message:
              'apps/admin tuyệt đối không được import từ apps/web (theo .agents/rules/architecture.md §3.3).',
          },
        ],
        extraPatterns: [
          {
            group: ['**/apps/web/**', '**/apps/web'],
            message:
              'Cấm phụ thuộc chéo: apps/admin không được tham chiếu trực tiếp đến apps/web (theo .agents/rules/architecture.md §3.3).',
          },
        ],
      }),
    },
  },
  {
    // Cấm dùng fetch() trực tiếp trong toàn bộ mã nguồn src của app (.agents/rules/state-and-api.md §3.3)
    files: ['src/**'],
    rules: {
      'no-restricted-globals': [
        'error',
        {
          name: 'fetch',
          message:
            'Cấm gọi fetch() trực tiếp. Bắt buộc dùng hook RTK Query sinh bởi @business.',
        },
      ],
    },
  },
];

export const webConfig = [
  ...baseConfig,
  ...reactConfig,
  {
    rules: {
      // apps/web không bao giờ được import từ apps/admin (.agents/rules/architecture.md §3.3)
      'no-restricted-imports': buildRestrictedImportsRule({
        extraPaths: [
          {
            name: '@lms/admin',
            message:
              'apps/web tuyệt đối không được import từ apps/admin (theo .agents/rules/architecture.md §3.3).',
          },
        ],
        extraPatterns: [
          {
            group: ['**/apps/admin/**', '**/apps/admin'],
            message:
              'Cấm phụ thuộc chéo: apps/web không được tham chiếu trực tiếp đến apps/admin (theo .agents/rules/architecture.md §3.3).',
          },
        ],
      }),
    },
  },
  {
    // Cấm dùng fetch() trực tiếp trong toàn bộ mã nguồn src của app (.agents/rules/state-and-api.md §3.3)
    files: ['src/**'],
    rules: {
      'no-restricted-globals': [
        'error',
        {
          name: 'fetch',
          message:
            'Cấm gọi fetch() trực tiếp. Bắt buộc dùng hook RTK Query sinh bởi @business.',
        },
      ],
    },
  },
];
