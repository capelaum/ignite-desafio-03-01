import Link from 'next/link';

import commonStyles from '../../styles/common.module.scss';

export function PreviewLink() {
  return (
    <aside className={commonStyles.previewPrismic}>
      <Link href="/api/exit-preview">
        <a>Sair do modo Preview</a>
      </Link>
    </aside>
  );
}
