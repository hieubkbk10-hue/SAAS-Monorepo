import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export const reactConfig = [
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // React Hooks rules (.agents/rules/coding-standards.md §2.2)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Cấm tuyệt đối namespace React.* cả ở runtime (MemberExpression) và TypeScript types (TSQualifiedName)
      // (.agents/rules/coding-standards.md §2.1)
      'no-restricted-syntax': [
        'error',
        {
          selector: ":matches(MemberExpression[object.name='React'], TSQualifiedName[left.name='React'])",
          message:
            "Cấm sử dụng tiền tố namespace 'React.*' (ví dụ: React.FC, React.useState, React.ReactNode). Bắt buộc import named trực tiếp từ 'react' theo .agents/rules/coding-standards.md §2.1.",
        },
      ],
    },
  },
];
